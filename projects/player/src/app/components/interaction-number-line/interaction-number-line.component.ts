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
        this.localParameters.firstNumber = parameters.firstNumber ?? 0;
        this.localParameters.lastNumber = parameters.lastNumber ?? 20;
        this.localParameters.numberInput = parameters.numberInput;
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
          value: ''
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
   * Generates the positions (x, y coordinates) for each number in the number line.
   *
   * This method uses the SVG path defined in the template to calculate equidistant points
   * along the curve. It adds 10% padding at both the beginning and the end of the path
   * to ensure that the numbers are centered and not cramped at the edges.
   *
   * For each number from `firstNumber` to `lastNumber`:
   * 1. Calculates its relative distance along the path's length (considering padding).
   * 2. Uses `getPointAtLength` on the SVG path to get the exact (x, y) coordinates.
   * 3. Marks the item as `isEmpty` if its value matches `emptyNumber`.
   */
  calculateNumberPositions() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }

    const pathElement = this.localParameters?.style === 'WAVE' ?
      this.numberLinePathWave : this.numberLinePathRuler;

    if (!pathElement?.nativeElement) {
      // If the path is not yet available, wait for next cycle
      this.scheduleCalculation();
      return;
    }

    const firstNumber = this.localParameters.firstNumber ?? 0;
    const lastNumber = this.localParameters.lastNumber ?? 20;
    const numberInput = this.localParameters.numberInput;
    const style = this.localParameters.style;
    const count = lastNumber - firstNumber + 1;
    const items = [];

    const path = pathElement.nativeElement;
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
      const value = firstNumber + i;
      const distance = startPadding + (i / (count - 1)) * availableLength;
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
    this.isDisabled = currentVal.length >= 2;
  }

  private emitResponse() {
    this.responses.emit([{
      id: this.localParameters.variableId || 'NUMBER_LINE',
      status: this.numberInputValue.length >= 1 ? 'VALUE_CHANGED' : 'DISPLAYED',
      value: this.numberInputValue
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
      firstNumber: 0,
      lastNumber: 20,
      numberInput: 9,
      style: 'WAVE'
    };
  }
}
