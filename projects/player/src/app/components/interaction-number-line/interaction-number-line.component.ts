import {
  Component, effect, ElementRef, ViewChild, AfterViewInit
} from '@angular/core';

import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { InteractionNumberLineParams } from '../../models/unit-definition';

@Component({
  selector: 'stars-interaction-number-line',
  templateUrl: './interaction-number-line.component.html',
  styleUrls: ['./interaction-number-line.component.scss']
})

export class InteractionNumberLineComponent extends InteractionComponentDirective implements AfterViewInit {
  @ViewChild('numberLinePath') numberLinePath!: ElementRef<SVGPathElement>;
  localParameters!: InteractionNumberLineParams;
  /** Boolean flag indicating whether the write interaction input is currently disabled. */
  isDisabled: boolean = false;
  /** Numbers to be shown in the keyboard */
  numbersList: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  numberLineItems: { value: number, x: number, y: number, isEmpty: boolean }[] = [];
  emptyNumberValue: string = '';

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
        this.responses.emit([{
          id: this.localParameters.variableId,
          status: 'DISPLAYED',
          value: '',
          relevantForResponsesProgress: false
        }]);
      }
    });
  }

  ngAfterViewInit() {
    this.calculateNumberPositions();
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
    if (!this.numberLinePath) {
      return;
    }
    const { firstNumber, lastNumber, emptyNumber } = this.localParameters;
    const count = lastNumber - firstNumber + 1;
    const items = [];

    const path = this.numberLinePath.nativeElement;
    const totalLength = path.getTotalLength();

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
    this.numberLineItems = items;
  }

  handleKeyboardClick(button: string) {
    this.emptyNumberValue += button;
    this.emitResponse();
  }

  handleBackButtonClick() {
    this.emptyNumberValue = this.emptyNumberValue.slice(0, -1);
    this.emitResponse();
  }

  private emitResponse() {
    this.responses.emit([{
      id: this.localParameters.variableId || 'NUMBER_LINE',
      status: 'VALUE_CHANGED',
      value: this.emptyNumberValue,
      relevantForResponsesProgress: true
    }]);
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
