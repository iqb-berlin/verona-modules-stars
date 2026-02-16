import {
  Component, signal, effect, inject, ViewChild, ElementRef
} from '@angular/core';

import { Response } from '@iqbspecs/response/response.interface';
import { StarsResponse } from '../../services/responses.service';
import { VeronaPostService } from '../../services/verona-post.service';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import {
  AudioOptions,
  InteractionButtonParams,
  SelectionOption
} from '../../models/unit-definition';
import { StandardButtonComponent } from '../../shared/standard-button/standard-button.component';
import { AudioButtonComponent } from '../../shared/audio-button/audio-button.component';

@Component({
  selector: 'stars-interaction-buttons',
  templateUrl: './interaction-buttons.component.html',
  imports: [
    StandardButtonComponent,
    AudioButtonComponent
  ],
  styleUrls: ['./interaction-buttons.component.scss']
})

export class InteractionButtonsComponent extends InteractionComponentDirective {
  /** Local copy of the component parameters with defaults applied. */
  localParameters!: InteractionButtonParams;
  /** Array of booleans for each option. */
  selectedValues = signal<boolean[]>([]);
  /** Options sorted by rows. */
  optionRows: Array<Array<RowOption>> = [];
  /** Boolean to track if the former the state has been restored from response. */
  // TODO no need for this, if parameters change state has to be set
  private hasRestoredFromFormerState = false;
  /** Flag to mark images useFullArea: true. */
  useFullArea = false;

  veronaPostService = inject(VeronaPostService);

  /** Reference to the image element for aspect ratio detection. */
  @ViewChild('imageElement', { static: false }) imageRef!: ElementRef<HTMLImageElement>;

  constructor() {
    super();

    effect(() => {
      const parameters = this.parameters() as InteractionButtonParams;
      this.localParameters = this.createDefaultParameters();
      this.hasRestoredFromFormerState = false;

      if (parameters) {
        this.localParameters.options = parameters.options || {};
        this.localParameters.variableId = parameters.variableId || 'BUTTONS';
        this.localParameters.imageSource = parameters.imageSource || '';
        this.localParameters.numberOfRows = parameters.numberOfRows || 1;
        this.localParameters.multiSelect = parameters.multiSelect || false;
        this.localParameters.triggerNavigationOnSelect = parameters.triggerNavigationOnSelect || false;
        this.localParameters.buttonType = parameters.buttonType || 'MEDIUM_SQUARE';
        this.localParameters.text = parameters.text || '';
        this.localParameters.imageUseFullArea = parameters.imageUseFullArea || false;
        this.useFullArea = this.localParameters.imageUseFullArea;

        // Determine imagePosition first
        if (this.localParameters.imageSource) {
          this.localParameters.imagePosition = parameters.imagePosition || 'LEFT';
        } else {
          this.localParameters.imagePosition = 'TOP';
        }

        // If layout is not provided, create it from imagePosition
        if (parameters.layout) {
          this.localParameters.layout = parameters.layout;
        } else {
          const pos = this.localParameters.imagePosition;
          if (pos === 'TOP') {
            this.localParameters.layout = 'TOP_CENTER';
          } else if (pos === 'LEFT') {
            this.localParameters.layout = 'LEFT_CENTER';
          } else {
            this.localParameters.layout = 'LEFT_BOTTOM';
          }
        }
        this.optionRows = this.getRowsOptions();

        // Only restore from former state once, on initial load
        if (!this.hasRestoredFromFormerState) {
          const formerStateResponse: Response[] = parameters.formerState || [];

          if (Array.isArray(formerStateResponse) && formerStateResponse.length > 0) {
            const foundResponse = formerStateResponse.find(
              response => response.id === this.localParameters.variableId
            );

            if (foundResponse && foundResponse.value) {
              this.restoreFromFormerState(foundResponse);
              this.hasRestoredFromFormerState = true;
              return;
            }
          }

          // No former state found - initialize as new
          this.resetSelection();
          this.responses.emit([{
            id: this.localParameters.variableId,
            status: 'DISPLAYED',
            value: 0,
            relevantForResponsesProgress: false
          }]);
          this.hasRestoredFromFormerState = true;
        }
      }
    });
  }

  /** Returns the layout class name for the container based on the current layout parameter. */
  getLayoutClass(): string {
    const layout = this.localParameters?.layout;
    switch (layout) {
      case 'TOP_CENTER':
        return 'layout--top-center';
      case 'LEFT_CENTER':
        return 'layout--left-center';
      case 'LEFT_CENTER_50':
        return 'layout--left-center-50';
      case 'LEFT_BOTTOM':
        return 'layout--left-bottom';
      default:
        return '';
    }
  }

  private resetSelection(): void {
    if (!this.localParameters.options) return;

    const numberOfOptions = this.localParameters.options?.buttons?.length ||
      this.localParameters.options?.repeatButton?.numberOfOptions || 0;
    this.selectedValues.set(Array.from(
      { length: numberOfOptions },
      () => false
    ));
  }

  // function to create options array for items with repeat buttons
  private createOptions() {
    if (!this.localParameters.options) return [];

    // eslint-disable-next-line
    let options: SelectionOption[];

    if (this.localParameters.options?.repeatButton) {
      const repeatButton = this.localParameters.options.repeatButton;
      options = Array.from(
        { length: repeatButton.numberOfOptions },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _ => {
          const opt: SelectionOption = {
            text: repeatButton.option?.text || '',
            imageSource: repeatButton.option?.imageSource || ''
          };
          if (repeatButton.option?.icon !== undefined) {
            opt.icon = repeatButton.option.icon;
          }
          return opt;
        }
      );
    } else {
      options = this.localParameters.options?.buttons || [];
    }
    return options;
  }

  // eslint-disable-next-line class-methods-use-this
  createAudioOptions(button: RowOption): AudioOptions {
    return {
      audioSource: button.option.audioSource || '',
      audioId: `${button.id + button.index}_audio`
    };
  }

  getRowsOptions():Array<Array<RowOption>> {
    if (!this.localParameters.options) return [];

    const numberOfRows = this.localParameters.numberOfRows || 1;
    const rows: Array<Array<RowOption>> = [];

    const options = this.createOptions();
    const baseId = this.localParameters.variableId;
    const totalOptions = options.length;

    const optionsPerRow = this.getCustomDistribution(totalOptions, numberOfRows);

    let currentIndex = 0;

    optionsPerRow.forEach(optionsInThisRow => {
      // Skip if no options for this row
      if (optionsInThisRow <= 0) {
        return; // continue to next iteration
      }

      // Make sure we don't exceed available options
      const availableOptions = options.length - currentIndex;
      const actualOptionsForRow = Math.min(optionsInThisRow, availableOptions);

      if (actualOptionsForRow <= 0) {
        return; // continue to next iteration
      }

      const singleRowOptionsIndexed = options
        .slice(currentIndex, currentIndex + actualOptionsForRow)
        .map((option, i) => (<RowOption>{
          option: option,
          index: currentIndex + i,
          id: this.localParameters.multiSelect ? `${baseId}_${currentIndex + i}` : baseId
        }));

      rows.push(singleRowOptionsIndexed);
      currentIndex += actualOptionsForRow;
    });

    return rows;
  }

  // TODO simplify, actually no need for it
  // eslint-disable-next-line class-methods-use-this
  private getCustomDistribution(totalOptions: number, numberOfRows: number): number[] {
    if (numberOfRows === 1) {
      return [totalOptions];
    }

    if (numberOfRows === 2) {
      const firstRow = Math.ceil(totalOptions / 2);
      return [firstRow, totalOptions - firstRow];
    }

    if (numberOfRows === 3) {
      // For 3 rows: check if we can distribute evenly first
      if (totalOptions % numberOfRows === 0) {
        const evenAmount = totalOptions / numberOfRows;
        return [evenAmount, evenAmount, evenAmount];
      }

      if (totalOptions <= 3) {
        const result: number[] = [];
        for (let i = 0; i < numberOfRows; i++) {
          result.push(i < totalOptions ? 1 : 0);
        }
        return result;
      }

      // 5-5-1 layout
      if (totalOptions >= 10) {
        const forLastRow = 1;
        const remaining = totalOptions - forLastRow;
        const forFirstRow = Math.ceil(remaining / 2);
        const forSecondRow = remaining - forFirstRow;
        return [forFirstRow, forSecondRow, forLastRow];
      }
      const baseAmount = Math.floor(totalOptions / numberOfRows);
      const remainder = totalOptions % numberOfRows;

      const result: number[] = [];
      for (let i = 0; i < numberOfRows; i++) {
        result.push(baseAmount + (i < remainder ? 1 : 0));
      }
      return result;
    }

    // For more than 3 rows
    const distribution: number[] = [];
    let remainingOptions = totalOptions;

    for (let i = 0; i < numberOfRows; i++) {
      const remainingRows = numberOfRows - i;

      if (remainingRows === 1) {
        distribution.push(remainingOptions);
      } else {
        const mustLeaveForOthers = remainingRows - 1;
        const canTakeNow = Math.max(1, remainingOptions - mustLeaveForOthers);
        distribution.push(canTakeNow);
        remainingOptions -= canTakeNow;
      }
    }

    return distribution;
  }

  onButtonClick(index: number): void {
    // Update UI state
    this.updateSelection(index);

    // Emit the stored state
    this.emitResponse('VALUE_CHANGED', true);

    // Check if triggerNavigationOnSelect is enabled
    if (this.localParameters.triggerNavigationOnSelect === true) {
      setTimeout(() => {
        this.veronaPostService.sendVopUnitNavigationRequestedNotification('next');
      }, 500);
    }
  }

  /**
   * Updates the selection state based on user interaction
   */
  private updateSelection(index: number): void {
    if (this.localParameters.multiSelect) {
      // Toggle the clicked item
      const selectedValues = this.selectedValues();
      selectedValues[index] = !selectedValues[index];
      this.selectedValues.set(selectedValues);
    } else {
      // Single select: reset all and select clicked item
      this.setSelectionAtIndex(index);
    }
  }

  /**
   * Sets selection to a specific index (single select mode)
   */
  private setSelectionAtIndex(index: number): void {
    const numberOfOptions = this.localParameters.options?.buttons?.length ||
      this.localParameters.options?.repeatButton?.numberOfOptions || 0;

    const selectedValues = Array.from(
      { length: numberOfOptions },
      (_, i) => i === index
    );
    this.selectedValues.set(selectedValues);
  }

  /**
   * Restores the selection state based on user interaction.
   * @param {Response} response - The response object containing a string `value`.
   */
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
      this.setSelectionAtIndex(selectedIndex);
    }
  }

  /**
   * Emits the current selection state as a response
   */
  private emitResponse(status: 'DISPLAYED' | 'VALUE_CHANGED', relevant: boolean): void {
    const value = this.localParameters.multiSelect ?
      this.selectedValues().map(item => (item ? 1 : 0)).join('') :
      (this.selectedValues().findIndex(item => item) + 1).toString();

    const response = <StarsResponse>{
      id: this.localParameters.variableId,
      status: status,
      value: value,
      relevantForResponsesProgress: relevant
    };

    this.responses.emit([response]);
  }

  // eslint-disable-next-line class-methods-use-this
  private createDefaultParameters(): InteractionButtonParams {
    return {
      variableId: 'BUTTONS',
      options: {},
      imageSource: '',
      imagePosition: 'TOP',
      layout: 'LEFT_CENTER',
      imageUseFullArea: false,
      text: '',
      multiSelect: false,
      triggerNavigationOnSelect: false,
      numberOfRows: 1,
      buttonType: 'MEDIUM_SQUARE'
    };
  }
}

// helper interface for options in row array - need to track index from allOptions Array
interface RowOption {
  option: SelectionOption;
  index: number;
  id: string;
}
