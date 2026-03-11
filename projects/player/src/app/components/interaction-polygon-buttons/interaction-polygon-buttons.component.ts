import {
  Component, effect, signal
} from '@angular/core';
import { Response } from '@iqbspecs/response/response.interface';

import { StarsResponse } from '../../services/responses.service';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { InteractionPolygonButtonsParams } from '../../models/unit-definition';

@Component({
  selector: 'stars-interaction-polygon-buttons',
  templateUrl: './interaction-polygon-buttons.component.html',
  styleUrls: ['./interaction-polygon-buttons.component.scss']
})

export class InteractionPolygonButtonsComponent extends InteractionComponentDirective {
  /** Local copy of the component parameters with defaults applied. */
  localParameters!: InteractionPolygonButtonsParams;
  /** Array of booleans for each option. */
  selectedValues = signal<boolean[]>([]);
  /** Array of booleans for each option for hint values. */
  hintValues = signal<boolean[]>([]);

  constructor() {
    super();

    effect(() => {
      const parameters = this.parameters() as InteractionPolygonButtonsParams;
      this.localParameters = this.createDefaultParameters();
      if (parameters) {
        this.localParameters.options = parameters.options || [];
        this.localParameters.variableId = parameters.variableId || 'POLYGON_BUTTONS';
        this.localParameters.multiSelect = parameters.multiSelect || false;
      }

      const formerStateResponse: Response[] = parameters.formerState || [];

      if (Array.isArray(formerStateResponse) && formerStateResponse.length > 0) {
        const foundResponse = formerStateResponse.find(
          response => response.id === this.localParameters.variableId
        );

        if (foundResponse && foundResponse.value) {
          this.restoreFromFormerState(foundResponse);
          return;
        }
      }

      // No former state found - initialize as new
      this.resetSelection();
      this.responses.emit([{
        id: this.localParameters.variableId || '',
        status: 'DISPLAYED',
        value: 0,
        relevantForResponsesProgress: false
      }]);
    });

    effect(() => {
      const hints = this.showHint();
      if (!hints || hints.length === 0) {
        return;
      }

      if (this.localParameters.multiSelect) {
        // set multiselect: "010" => [false, true, false]
        const selectedStates = hints
          .split('')
          .map((char: string) => char === '1');
        this.hintValues.set(selectedStates);
      } else {
        // set single select: "2" => [false, true, false]
        const selectedIndex = parseInt(hints, 10) - 1;
        const selectedStates = Array.from(
          { length: this.selectedValues().length },
          (_, i) => i === selectedIndex
        );
        this.hintValues.set(selectedStates);
        console.log('hints', this.hintValues());
      }
    });
  }

  private resetSelection(): void {
    const numberOfOptions = this.localParameters?.options?.length || 0;
    // Always set a NEW array reference
    this.selectedValues.set(Array(numberOfOptions).fill(false));
  }

  click(index: number) {
    this.updateSelection(index);
    this.emitResponse('VALUE_CHANGED', true);
  }

  private restoreFromFormerState(response: Response): void {
    // Normalize the incoming value to a string for consistent parsing
    const valueString = (typeof response.value === 'string') ? response.value : `${response.value}`;
    if (!valueString) return;

    if (this.localParameters.multiSelect) {
      // Restore multiselect: e.g., "010" string restored to [false, true, false]
      const selectedStates = valueString.split('').map((char: string) => char === '1');
      // Create a cloned array to ensure a new reference is stored in the signal
      this.selectedValues.set([...selectedStates]);
    } else {
      // Restore single select: e.g., "2" string restored to [false, true, false]
      const selectedIndex = Number.parseInt(valueString, 10) - 1;
      const numberOfOptions = this.localParameters?.options?.length || 0;
      const next = Array(numberOfOptions).fill(false);
      if (selectedIndex >= 0 && selectedIndex < numberOfOptions) {
        next[selectedIndex] = true;
      }
      // Pass the new array reference to trigger signal change detection
      this.selectedValues.set(next);
    }
  }

  private updateSelection(index: number): void {
    if (this.localParameters.multiSelect) {
      // Toggle the clicked item using an immutable update to the signal
      this.selectedValues.update(values => {
        const next = [...values];
        next[index] = !next[index];
        return next;
      });
    } else {
      // Single select: create a NEW array with only the clicked item selected
      // This immutable approach ensures the UI updates immediately when selecting another option
      const numberOfOptions = this.localParameters?.options?.length || 0;
      const next = Array(numberOfOptions).fill(false);
      if (index >= 0 && index < numberOfOptions) {
        next[index] = true;
      }
      this.selectedValues.set(next);
    }
  }

  private emitResponse(status: 'DISPLAYED' | 'VALUE_CHANGED', relevant: boolean): void {
    const value = this.localParameters.multiSelect ?
      this.selectedValues().map(item => (item ? 1 : 0)).join('') :
      (this.selectedValues().findIndex(item => item) + 1).toString();

    const response: StarsResponse = {
      id: this.localParameters.variableId || '',
      status: status,
      value: value,
      relevantForResponsesProgress: relevant
    };

    this.responses.emit([response]);
  }

  // eslint-disable-next-line class-methods-use-this
  private createDefaultParameters(): InteractionPolygonButtonsParams {
    return {
      variableId: 'POLYGON_BUTTONS',
      options: [],
      multiSelect: false
    };
  }
}
