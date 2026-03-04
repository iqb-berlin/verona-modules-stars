import { Component, effect } from '@angular/core';

import { Response } from '@iqbspecs/response/response.interface';
import { StarsResponse } from '../../services/responses.service';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { InteractionWriteParams } from '../../models/unit-definition';

@Component({
  selector: 'stars-interaction-write',
  templateUrl: 'interaction-write.component.html',
  styleUrls: ['interaction-write.component.scss']
})

export class InteractionWriteComponent extends InteractionComponentDirective {
  /** Local copy of the component parameters with defaults applied. */
  localParameters!: InteractionWriteParams;
  /** Boolean flag indicating whether the write interaction input is currently disabled. */
  isDisabled: boolean = false;
  /** The current text entered by the user. Initialized as an empty string. */
  currentText: string = '';
  /** An array of lowercase alphabet characters. */
  characterList = [...'abcdefghijklmnopqrstuvwxyz'];
  numbersList: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  numbersListBlock = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['0']
  ];

  /** Small array of additional characters (German umlauts). */
  umlautListChars = [...'äöü'];
  /** Boolean to track if the former state has been restored from response. */
  private hasRestoredFromFormerState = false;

  constructor() {
    super();

    effect(() => {
      const parameters = this.parameters() as InteractionWriteParams;
      this.localParameters = this.createDefaultParameters();
      this.hasRestoredFromFormerState = false;

      if (parameters) {
        this.localParameters.addBackspaceKey = parameters.addBackspaceKey || true;
        this.localParameters.addUmlautKeys = parameters.addUmlautKeys || true;
        this.localParameters.keysToAdd = parameters.keysToAdd || [];
        this.localParameters.variableId = parameters.variableId || 'WRITE';
        this.localParameters.keyboardMode = parameters.keyboardMode || 'CHARACTERS';
        this.localParameters.maxInputLength = parameters.maxInputLength || 10;
        this.localParameters.imageSource = parameters.imageSource || '';
        this.localParameters.text = parameters.text || '';
        // Only restore from former state once, on initial load
        if (!this.hasRestoredFromFormerState) {
          const formerStateResponses: Response[] = (parameters as any).formerState || [];

          if (Array.isArray(formerStateResponses) && formerStateResponses.length > 0) {
            const found = formerStateResponses.find(r => r.id === this.localParameters.variableId);

            if (found && typeof found.value === 'string') {
              this.restoreFromFormerState(found);
              this.hasRestoredFromFormerState = true;
              return;
            }
          }

          // No former state - initialize as new
          this.currentText = '';
          this.isDisabled = this.localParameters.maxInputLength !== null &&
            this.currentText.length >= this.localParameters.maxInputLength;

          this.responses.emit([{
            id: this.localParameters.variableId,
            status: 'DISPLAYED',
            value: '',
            relevantForResponsesProgress: false
          }]);
          this.hasRestoredFromFormerState = true;
        }
      }

      if (!this.currentText) this.currentText = '';
    });
  }

  // eslint-disable-next-line class-methods-use-this
  capitalize(s: string): string {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  addChar(button: string) {
    if (this.localParameters.maxInputLength !== null &&
      this.currentText.length >= this.localParameters.maxInputLength) {
      return;
    }

    const charToAdd = this.currentText.length === 0 ? this.capitalize(button) : button;
    this.currentText += charToAdd;

    this.isDisabled = this.localParameters.maxInputLength !== null &&
      this.currentText.length >= this.localParameters.maxInputLength;

    this.valueChanged();
  }

  deleteChar() {
    if (this.currentText.length > 0) {
      this.currentText = this.currentText.slice(0, -1);
      this.isDisabled = this.localParameters.maxInputLength !== null &&
        this.currentText.length >= this.localParameters.maxInputLength;
      this.valueChanged();
    }
  }

  private valueChanged() {
    const response: StarsResponse = {
      id: this.localParameters.variableId,
      status: 'VALUE_CHANGED',
      value: this.currentText,
      relevantForResponsesProgress: true
    };

    this.responses.emit([response]);
  }

  /**
   * Restores the selection state based on user interaction.
   * @param {Response} response - The response object containing a string `value`
   */
  private restoreFromFormerState(response: Response): void {
    if (!response.value || typeof response.value !== 'string') return;

    this.currentText = response.value;
    this.isDisabled = this.localParameters.maxInputLength !== null &&
      this.currentText.length >= this.localParameters.maxInputLength;
  }

  // eslint-disable-next-line class-methods-use-this
  private createDefaultParameters(): InteractionWriteParams {
    return {
      variableId: 'WRITE',
      imageSource: '',
      text: '',
      addBackspaceKey: true,
      addUmlautKeys: true,
      keyboardMode: 'CHARACTERS',
      keysToAdd: [],
      maxInputLength: 10
    };
  }
}
