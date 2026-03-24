import { Component, effect, signal } from '@angular/core';
import { Response } from '@iqbspecs/response/response.interface';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { InteractionEquationParams } from '../../models/unit-definition';
import { StarsResponse } from '../../services/responses.service';

@Component({
  selector: 'stars-interaction-equation',
  templateUrl: './interaction-equation.component.html',
  styleUrls: ['./interaction-equation.component.scss'],
  standalone: true
})
export class InteractionEquationComponent extends InteractionComponentDirective {
  /** Local copy of the component parameters with defaults applied. */
  localParameters!: InteractionEquationParams;

  constructor() {
    super();

    // effect(() => {
    //   const parameters = this.parameters() as InteractionEquationParams;
    //   this.localParameters = this.createDefaultParameters();
    //   if (parameters) {
    //     console.log(parameters);
    //   }
    // });
  }

  // eslint-disable-next-line class-methods-use-this
  private createDefaultParameters(): InteractionEquationParams {
    return {
      variableId: 'EQUATION',
      imageSource: '',
      fixOperand1: 0,
      operators: ['+', '-'],
      fixOperand2: 0,
      fixResult: 0
    };
  }
}
