import { Component, effect, signal } from '@angular/core';
import { Response } from '@iqbspecs/response/response.interface';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { InteractionPyramidParams } from '../../models/unit-definition';
import { StarsResponse } from '../../services/responses.service';

@Component({
  selector: 'stars-interaction-pyramid',
  templateUrl: './interaction-pyramid.component.html',
  styleUrls: ['./interaction-pyramid.component.scss'],
  standalone: true
})
export class InteractionPyramidComponent extends InteractionComponentDirective {
  /** Local copy of the component parameters with defaults applied. */
  localParameters!: InteractionPyramidParams;

  /** Numbers to be shown in the keyboard */
  numbersList: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  /** The current numbers entered by the user. Initialized as empty strings. */
  bottomLeftValue = signal<string>('');
  bottomRightValue = signal<string>('');

  /** Currently selected input field ('LEFT' or 'RIGHT') */
  selectedInput = signal<'LEFT' | 'RIGHT'>('LEFT');

  /** Whether the keyboard buttons should be disabled (max 2 digits per field) */
  keyboardDisabled = signal<boolean>(false);

  constructor() {
    super();

    effect(() => {
      const parameters = this.parameters() as InteractionPyramidParams;
      if (parameters) {
        // Build object without inserting optional properties as undefined
        this.localParameters = {
          variableId: parameters.variableId || 'PYRAMID',
          topNumber: parameters.topNumber,
          ...(parameters.example ? { example: parameters.example } : {}),
          ...(parameters.formerState ? { formerState: parameters.formerState } : {})
        } as InteractionPyramidParams;

        const formerStateResponses: Response[] = this.localParameters.formerState || [];
        const found = formerStateResponses.find(r => r.id === this.localParameters.variableId);

        if (found && typeof found.value === 'string' && !this.bottomLeftValue() && !this.bottomRightValue()) {
          this.restoreFromFormerState(found.value);
        } else if (this.bottomLeftValue() === '' && this.bottomRightValue() === '') {
          this.emitResponses('DISPLAYED');
        }
        this.updateButtonStates();
      }
    });
  }

  selectInput(input: 'LEFT' | 'RIGHT') {
    this.selectedInput.set(input);
    this.updateButtonStates();
  }

  handleKeyboardClick(button: string) {
    if (this.keyboardDisabled()) return;
    if (this.selectedInput() === 'LEFT') {
      const newValue = this.bottomLeftValue() + button;
      this.bottomLeftValue.set(newValue);
    } else {
      const newValue = this.bottomRightValue() + button;
      this.bottomRightValue.set(newValue);
    }
    this.updateButtonStates();
    this.emitResponses('VALUE_CHANGED');
  }

  handleBackButtonClick() {
    if (this.selectedInput() === 'LEFT') {
      const current = this.bottomLeftValue();
      if (current.length > 0) {
        this.bottomLeftValue.set(current.slice(0, -1));
      }
    } else {
      const current = this.bottomRightValue();
      if (current.length > 0) {
        this.bottomRightValue.set(current.slice(0, -1));
      }
    }
    this.updateButtonStates();
    this.emitResponses('VALUE_CHANGED');
  }

  private updateButtonStates() {
    const currentVal = this.selectedInput() === 'LEFT' ? this.bottomLeftValue() : this.bottomRightValue();
    this.keyboardDisabled.set(currentVal.length >= 2);
  }

  private emitResponses(status: 'DISPLAYED' | 'VALUE_CHANGED') {
    const value = `${this.bottomLeftValue()}_${this.bottomRightValue()}`;
    const response: StarsResponse = {
      id: this.localParameters?.variableId || 'PYRAMID',
      status: status,
      value: value,
      relevantForResponsesProgress: status === 'VALUE_CHANGED'
    };

    this.responses.emit([response]);
  }

  private restoreFromFormerState(value: string): void {
    if (!value || typeof value !== 'string') return;
    const parts = value.split('_');
    if (parts.length === 2) {
      if (parts[0] !== this.bottomLeftValue()) {
        this.bottomLeftValue.set(parts[0] || '');
      }
      if (parts[1] !== this.bottomRightValue()) {
        this.bottomRightValue.set(parts[1] || '');
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private createDefaultParameters(): InteractionPyramidParams {
    return {
      variableId: 'PYRAMID',
      example: {
        topNumber: 11,
        bottomLeftNumber: 10,
        bottomRightNumber: 1
      },
      topNumber: 13
    };
  }
}
