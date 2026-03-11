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
  @ViewChild('numberLinePath') numberLinePath!: ElementRef<SVGPathElement>;
  localParameters!: InteractionNumberLineParams;

  /** Boolean flag indicating whether the write interaction input is currently disabled. */
  isDisabled: boolean = false;
  /** Numbers to be shown in the keyboard */
  numbersList: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  /** List of number line items with their values and calculated SVG coordinates. */
  numberLineItems = signal<{ value: number, x: number, y: number, isEmpty: boolean }[]>([]);
  /** Current value of the empty number field on the number line. */
  emptyNumberValue: string = '';

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
        this.localParameters.emptyNumber = parameters.emptyNumber ?? 9;
        this.localParameters.style = parameters.style || 'number_line';
        this.localParameters.variableId = parameters.variableId || 'NUMBER_LINE';

        // Reset the input state whenever parameters change
        this.emptyNumberValue = '';
        this.updateButtonStates();

        this.calculateNumberPositions();

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
        if (!this.emptyNumberValue) this.emptyNumberValue = '';
      }
    });
  }

  ngAfterViewInit() {
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        this.calculateNumberPositions();
      });
      if (this.numberLinePath?.nativeElement) {
        this.resizeObserver.observe(this.numberLinePath.nativeElement);
      }
    }
    setTimeout(() => this.calculateNumberPositions(), 0);
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

    if (!this.numberLinePath?.nativeElement) {
      this.animationFrameId = requestAnimationFrame(() => this.calculateNumberPositions());
      return;
    }

    const { firstNumber, lastNumber, emptyNumber } = this.localParameters;
    const count = lastNumber - firstNumber + 1;
    const items = [];

    const path = this.numberLinePath.nativeElement;
    const totalLength = path.getTotalLength();

    if (totalLength === 0) {
      // If the path is not yet measured, retry shortly
      this.animationFrameId = requestAnimationFrame(() => this.calculateNumberPositions());
      return;
    }

    // Leave 10% padding at the start and end of the spline
    const startPadding = 0.1 * totalLength;
    const endPadding = 0.1 * totalLength;
    const availableLength = totalLength - startPadding - endPadding;

    for (let i = 0; i < count; i++) {
      const value = firstNumber + i;
      const distance = startPadding + (i / (count - 1)) * availableLength;
      const point = path.getPointAtLength(distance);
      items.push({
        value,
        x: point.x,
        y: point.y,
        isEmpty: value === emptyNumber
      });
    }
    this.numberLineItems.set(items);
  }

  handleKeyboardClick(button: string) {
    if (this.isDisabled) return;
    this.emptyNumberValue += button;
    this.updateButtonStates(this.emptyNumberValue);
    this.emitResponse();
  }

  handleBackButtonClick() {
    if (this.emptyNumberValue.length === 0) return;
    this.emptyNumberValue = this.emptyNumberValue.slice(0, -1);
    this.updateButtonStates(this.emptyNumberValue);
    this.emitResponse();
  }

  private updateButtonStates(value?: string) {
    const currentVal = value ?? this.emptyNumberValue;
    this.isDisabled = currentVal.length >= 2;
  }

  private emitResponse() {
    this.responses.emit([{
      id: this.localParameters.variableId || 'NUMBER_LINE',
      status: 'VALUE_CHANGED',
      value: this.emptyNumberValue,
      relevantForResponsesProgress: true
    }]);
  }

  /**
   * Restores the selection state based on user interaction.
   * @param {Response} response - The response object containing a string `value`
   */
  private restoreFromFormerState(response: Response): void {
    if (!response.value || typeof response.value !== 'string') return;

    this.emptyNumberValue = response.value;
    this.updateButtonStates();
  }

  // eslint-disable-next-line class-methods-use-this
  private createDefaultParameters(): InteractionNumberLineParams {
    return {
      variableId: 'NUMBER_LINE',
      firstNumber: 0,
      lastNumber: 20,
      emptyNumber: 9,
      style: 'number_line'
    };
  }
}
