import {
  Component, effect
} from '@angular/core';

import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { InteractionNumberLineParams } from '../../models/unit-definition';

@Component({
  selector: 'stars-interaction-number-line',
  templateUrl: './interaction-number-line.component.html',
  styleUrls: ['./interaction-number-line.component.scss']
})

export class InteractionNumberLineComponent extends InteractionComponentDirective {
  localParameters!: InteractionNumberLineParams;
  /** Boolean flag indicating whether the write interaction input is currently disabled. */
  isDisabled: boolean = false;
  /** Numbers to be shown in the keyboard */
  numbersList: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  constructor() {
    super();

    effect(() => {
      const parameters = this.parameters() as InteractionNumberLineParams;
      this.localParameters = this.createDefaultParameters();

      if (parameters) {
        // Reset internal playback state for new unit

        this.localParameters.firstNumber = parameters.firstNumber || 0;
        this.localParameters.lastNumber = parameters.lastNumber || 20;
        this.localParameters.emptyNumber = parameters.emptyNumber || 9;
        this.localParameters.style = parameters.style || 'number_line';
        this.localParameters.variableId = parameters.variableId || 'videoPlayer';
        this.responses.emit([{
          id: this.localParameters.variableId,
          status: 'DISPLAYED',
          value: '',
          relevantForResponsesProgress: false
        }]);
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  handleKeyboardClick(button: string) {
    console.log('keyboard click', button);
  }

  // eslint-disable-next-line class-methods-use-this
  handleBackButtonClick() {
    console.log('back click');
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
