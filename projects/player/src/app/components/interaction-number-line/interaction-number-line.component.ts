import {
  Component, effect, ElementRef, ViewChild, AfterViewInit, signal, OnDestroy
} from '@angular/core';

import { Response } from '@iqbspecs/response/response.interface';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { InteractionNumberLineParams } from '../../models/unit-definition';

@Component({
  selector: 'stars-interaction-number-line',
  templateUrl: './interaction-number-line.component.html',
  styleUrls: ['./interaction-number-line.component.scss']
})

export class InteractionNumberLineComponent extends InteractionComponentDirective implements AfterViewInit, OnDestroy {
  @ViewChild('numberLinePathWave') numberLinePathWave!: ElementRef<SVGPathElement>;
  @ViewChild('numberLinePathRuler') numberLinePathRuler!: ElementRef<SVGPathElement>;
  localParameters!: InteractionNumberLineParams;

  /** Boolean flag indicating whether the write interaction input is currently disabled. */
  isDisabled: boolean = false;
  /** Numbers to be shown in the keyboard */
  numbersList: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  /** List of number line items with their values and calculated SVG coordinates. */
  numberLineItems = signal<{
    value: number,
    index: number,
    x: number,
    y: number,
    isEmpty: boolean
  }[]>([]);
  /** Current value of the numberInput field on the number line. */
  numberInputValue: string = '';
  hasHint = signal(false);

  /** List of items to display in the BLOCK style view. */
  blockDisplayItems = signal<{
    value: number,
    index: number,
    x: number,
    y: number,
    isEmpty: boolean
  }[]>([]);

  /** Observer to detect when the number line SVG path's dimensions change. */
  private resizeObserver: ResizeObserver | undefined;
  /** Identifier for the scheduled animation frame used for coordinate retries. */
  private animationFrameId: number | undefined;

  constructor() {
    super();

    effect(() => {
      const parameters = this.parameters() as InteractionNumberLineParams;
      this.localParameters = this.createDefaultParameters();

      if (parameters) {
        this.localParameters.firstNumber = parameters.firstNumber;
        this.localParameters.lastNumber = parameters.lastNumber;
        this.localParameters.numberInput = parameters.numberInput;
        this.localParameters.leadingNumbers = parameters.leadingNumbers;
        this.localParameters.trailingNumbers = parameters.trailingNumbers;
        this.localParameters.style = parameters.style || 'WAVE';
        this.localParameters.variableId = parameters.variableId || 'NUMBER_LINE';

        // Reset the input state whenever parameters change
        this.numberInputValue = '';
        this.hasHint.set(false);
        this.updateButtonStates();

        // Schedule calculation for after the DOM has updated
        this.scheduleCalculation();

        const formerStateResponses: Response[] = parameters.formerState || [];

        if (Array.isArray(formerStateResponses) && formerStateResponses.length > 0) {
          const found = formerStateResponses.find(r => r.id === this.localParameters.variableId);

          if (found && typeof found.value === 'string') {
            this.restoreFromFormerState(found);
            return;
          }
        }

        // Only emit DISPLAYED if there's no formerState for the current task
        this.responses.emit([{
          id: this.localParameters.variableId,
          status: 'DISPLAYED',
          value: '',
          relevantForResponsesProgress: false
        }]);
        if (!this.numberInputValue) this.numberInputValue = '';
      }
    });

    effect(() => {
      const hints = this.showHint();
      if (!hints || hints.length === 0) {
        this.hasHint.set(false);
        return;
      }
      this.numberInputValue = hints;
      this.hasHint.set(true);
      this.updateButtonStates();
    });
  }

  ngAfterViewInit() {
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        this.calculateNumberPositions();
      });
      if (this.numberLinePathWave?.nativeElement) {
        this.resizeObserver.observe(this.numberLinePathWave.nativeElement);
      }
      if (this.numberLinePathRuler?.nativeElement) {
        this.resizeObserver.observe(this.numberLinePathRuler.nativeElement);
      }
    }
    this.scheduleCalculation();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  /**
   * Calculates the SVG coordinates for number line items based on the selected style.
   * Supports range-based (first to last) or list-based (leading/trailing) layouts.
   */
  calculateNumberPositions() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }

    const firstNumber = this.localParameters.firstNumber;
    const lastNumber = this.localParameters.lastNumber;
    const leadingNumbers = this.localParameters.leadingNumbers;
    const trailingNumbers = this.localParameters.trailingNumbers;
    const numberInput = this.localParameters.numberInput;
    const style = this.localParameters.style;

    const pathElement = style === 'WAVE' ? this.numberLinePathWave : this.numberLinePathRuler;

    if (style !== 'BLOCK' && !pathElement?.nativeElement) {
      this.scheduleCalculation();
      return;
    }

    // Store and manage the data for each number or input box that needs to be rendered on the number line
    const items = [] as {
      value: number,
      index: number,
      x: number,
      y: number,
      isEmpty: boolean
    }[];

    // It is possible to use BLOCK and WAVE with leading/trailing numbers
    if (style === 'BLOCK' || (style === 'WAVE' && (leadingNumbers || trailingNumbers))) {
      const tempItems: { value: number, index: number, isEmpty: boolean }[] = [];
      let idx = 0;
      for (const val of (leadingNumbers || [])) {
        tempItems.push({ value: val, index: idx++, isEmpty: false });
      }
      tempItems.push({ value: 0, index: idx++, isEmpty: true });
      for (const val of (trailingNumbers || [])) {
        tempItems.push({ value: val, index: idx++, isEmpty: false });
      }

      if (style === 'BLOCK') {
        const blockWidth = 60;
        const gap = 10;
        const count = tempItems.length;
        const totalWidth = count * blockWidth + (count - 1) * gap;
        const svgViewBoxWidth = 600;
        const svgViewBoxHeight = 240;
        const startX = (svgViewBoxWidth - totalWidth) / 2;
        const centerY = svgViewBoxHeight / 2;

        const itemsWithCoords = tempItems.map((item, idx) => ({
          ...item,
          x: startX + idx * (blockWidth + gap) + blockWidth / 2,
          y: centerY
        }));

        this.blockDisplayItems.set(itemsWithCoords);
        return;
      }

      const path = pathElement!.nativeElement;
      const totalLength = path.getTotalLength();
      if (totalLength === 0) {
        this.animationFrameId = requestAnimationFrame(() => this.calculateNumberPositions());
        return;
      }

      const startPadding = 0.07 * totalLength;
      const endPadding = 0.07 * totalLength;
      const availableLength = totalLength - startPadding - endPadding;
      const count = tempItems.length;

      for (let i = 0; i < count; i++) {
        const item = tempItems[i]!;
        // The fraction determines the item's position (0 to 1) along the path, with a 0.5 default for single items to prevent division by zero
        const fraction = count === 1 ? 0.5 : (i / (count - 1));
        const distance = startPadding + fraction * availableLength;
        const point = path.getPointAtLength(distance);
        items.push({
          value: item.value,
          index: item.index,
          isEmpty: item.isEmpty,
          x: point.x,
          y: point.y
        });
      }
    } else {
      if (firstNumber === undefined || lastNumber === undefined) {
        return;
      }

      // Support both ascending and descending ranges
      // If step is 1, count goes up, if it is -1 it goes down
      const step = (lastNumber! >= firstNumber!) ? 1 : -1;
      const count = Math.abs(lastNumber! - firstNumber!) + 1;

      const path = pathElement!.nativeElement;
      const totalLength = path.getTotalLength();

      if (totalLength === 0) {
        // If the path is not yet measured, retry shortly
        this.animationFrameId = requestAnimationFrame(() => this.calculateNumberPositions());
        return;
      }

      // Leave 7% padding at the start and end of the spline
      const startPadding = style === 'RULER' ? 0 : 0.07 * totalLength;
      const endPadding = 0.07 * totalLength;
      const availableLength = totalLength - startPadding - endPadding;

      for (let i = 0; i < count; i++) {
        const value = firstNumber! + i * step;
        const fraction = count === 1 ? 0.5 : (i / (count - 1));
        const distance = startPadding + fraction * availableLength;
        const point = path.getPointAtLength(distance);
        const isEmpty = value === numberInput;

        items.push({
          value,
          index: i,
          x: point.x,
          y: point.y,
          isEmpty
        });
      }
    }
    this.numberLineItems.set(items);
  }

  /**
   * Schedules a recalculation of number positions.
   * Uses setTimeout(0) to ensure it runs after Angular's change detection and DOM updates.
   */
  private scheduleCalculation() {
    setTimeout(() => {
      this.calculateNumberPositions();
    }, 0);
  }

  handleKeyboardClick(button: string) {
    if (this.isDisabled) return;
    this.numberInputValue += button;
    this.hasHint.set(false);
    this.updateButtonStates(this.numberInputValue);
    this.emitResponse();
  }

  handleBackButtonClick() {
    if (this.numberInputValue.length === 0) return;
    this.numberInputValue = this.numberInputValue.slice(0, -1);
    this.hasHint.set(false);
    this.updateButtonStates(this.numberInputValue);
    this.emitResponse();
  }

  private updateButtonStates(value?: string) {
    const currentVal = value ?? this.numberInputValue;
    const maxInputLength = 2;

    const numberInput = this.localParameters?.numberInput;
    const style = this.localParameters?.style;
    const leadingNumbers = this.localParameters?.leadingNumbers;
    const trailingNumbers = this.localParameters?.trailingNumbers;

    // If no numberInput is defined for WAVE and RULER styles and if there are no leading/trailing numbers, disable the keyboard buttons
    const noNumberInput = ((style === 'WAVE' || style === 'RULER') && numberInput === undefined && !leadingNumbers && !trailingNumbers) ||
      (style === 'RULER' && (leadingNumbers !== undefined || trailingNumbers !== undefined) && numberInput === undefined);

    this.isDisabled = currentVal.length >= maxInputLength || noNumberInput;
  }

  private emitResponse() {
    this.responses.emit([{
      id: this.localParameters.variableId || 'NUMBER_LINE',
      status: this.numberInputValue.length >= 1 ? 'VALUE_CHANGED' : 'DISPLAYED',
      value: this.numberInputValue,
      relevantForResponsesProgress: true
    }]);
  }

  /**
   * Restores the selection state based on user interaction.
   * @param {Response} response - The response object containing a string `value`
   */
  private restoreFromFormerState(response: Response): void {
    if (!response.value || typeof response.value !== 'string') return;

    this.numberInputValue = response.value;
    this.updateButtonStates();
  }

  // eslint-disable-next-line class-methods-use-this
  private createDefaultParameters(): InteractionNumberLineParams {
    return {
      variableId: 'NUMBER_LINE',
      style: 'WAVE'
    };
  }
}
