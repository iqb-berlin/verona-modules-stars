import {
  Component, effect, inject, signal
} from '@angular/core';

import type { Response } from '@iqbspecs/response/response.interface';

import { VeronaPostService } from '../../services/verona-post.service';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { InteractionPolygonButtonsParams } from '../../models/unit-definition';

@Component({
  selector: 'stars-interaction-polygon-buttons',
  templateUrl: './interaction-polygon-buttons.component.html',
  standalone: true,
  styleUrls: ['./interaction-polygon-buttons.component.scss']
})

export class InteractionPolygonButtonsComponent extends InteractionComponentDirective {
  /** Local copy of the component parameters with defaults applied. */
  localParameters!: InteractionPolygonButtonsParams;
  /** Array of booleans for each option. */
  selectedValues = signal<boolean[]>([]);


  veronaPostService = inject(VeronaPostService);

  constructor() {
    super();
    effect(() => {
      this.resetSelection();

      const parameters = this.parameters() as InteractionPolygonButtonsParams;
      this.localParameters = this.createDefaultParameters();

      if (parameters) {
        this.localParameters.options = parameters.options || [];
        this.localParameters.variableId = parameters.variableId || 'POLYGON_BUTTONS';
        this.localParameters.multiSelect = parameters.multiSelect || false;

        // Attempt to restore former state
        const formerStateResponses: Response[] = parameters.formerState || [];

        if (Array.isArray(formerStateResponses) && formerStateResponses.length > 0) {
          const foundResponse = formerStateResponses
            .find(r => r.id === this.localParameters.variableId);

          if (foundResponse && foundResponse.value != null && foundResponse.value !== 0 && foundResponse.value !== '0') {
            this.restoreFromFormerState(foundResponse);
            return;
          }
        }

        // No valid former state - initialize as new
        this.responses.emit([{
          id: this.localParameters.variableId,
          status: 'DISPLAYED',
          value: 0
        }]);
      }
    });
  }

  private resetSelection(): void {
    if (!this.localParameters.options) return;

    const numberOfOptions = this.localParameters.options?.length || 0;
    this.selectedValues.set(Array.from(
      { length: numberOfOptions },
      () => false
    ));
  }

  click(index: number) {
    this.updateSelection(index);
    this.emitResponse('VALUE_CHANGED', true);
  }

  private restoreFromFormerState(response: Response): void {
    if (!response.value || typeof response.value !== 'string') {
      return;
    }
    if (this.localParameters.multiSelect) {
      // Restore multiselect: "010" => [false, true, false]
      const selectedStates = response.value
        .split('')
        .map((char: string) => char === '1');
      this.selectedValues.set(selectedStates);
    } else {
      // Restore single select: "2" => [false, true, false]
      const selectedIndex = parseInt(response.value, 10) - 1;
      this.resetSelection();
      const selectedValues = this.selectedValues();
      selectedValues[selectedIndex] = true;
      this.selectedValues.set(selectedValues);
    }
  }

  private updateSelection(index: number): void {
    if (this.localParameters.multiSelect) {
      // Toggle the clicked item
      const selectedValues = this.selectedValues();
      selectedValues[index] = !selectedValues[index];
      this.selectedValues.set(selectedValues);
    } else {
      // Single select: reset all and select clicked item
      this.resetSelection();
      const selectedValues = this.selectedValues();
      selectedValues[index] = true;
      this.selectedValues.set(selectedValues);
    }
  }

  private emitResponse(status: 'DISPLAYED' | 'VALUE_CHANGED', relevant: boolean): void {
    const value = this.localParameters.multiSelect ?
      this.selectedValues().map(item => (item ? 1 : 0)).join('') :
      (this.selectedValues().findIndex(item => item) + 1).toString();

    const response: Response = {
      id: this.localParameters.variableId || '',
      status: status,
      value: value
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
