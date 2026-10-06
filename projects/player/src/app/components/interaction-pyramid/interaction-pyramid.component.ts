import {
  Component,
  effect,
  signal,
  untracked,
  WritableSignal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Response } from '@iqbspecs/response/response.interface';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { InteractionPyramidParams } from '../../models/unit-definition';
import { StarsResponse } from '../../services/responses.service';

@Component({
  selector: 'stars-interaction-pyramid',
  templateUrl: './interaction-pyramid.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./interaction-pyramid.component.scss'],
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

  /** Whether a hint is currently being shown for each input field */
  hasLeftHint = signal<boolean>(false);
  hasRightHint = signal<boolean>(false);

  /** Whether the keyboard buttons should be disabled (max 2 digits per field) */
  keyboardDisabled = signal<boolean>(false);

  /** Reference to the last processed parameters object to detect object-identity changes. */
  private lastParametersRef: unknown | null = null;

  constructor() {
    super();

    effect(() => {
      const parameters = this.parameters() as InteractionPyramidParams;

      if (!parameters) return;

      // Only parameters() must be tracked: the setup below reads and writes the
      // value signals, so tracking them would re-trigger this effect.
      untracked(() => {
        const isNewParametersObject = this.lastParametersRef !== parameters;

        if (isNewParametersObject) {
          this.localParameters = {
            ...this.createDefaultParameters(),
            ...parameters,
          };

          const formerStateResponses: Response[] =
            this.localParameters.formerState || [];
          const found = formerStateResponses.find(
            (r) => r.id === this.localParameters.variableId,
          );

          if (found && typeof found.value === 'string') {
            this.restoreFromFormerState(found.value);
          } else {
            this.resetSelection();
            this.emitResponses('DISPLAYED');
          }
          this.updateButtonStates();
          this.lastParametersRef = parameters;
        }
      });
    });

    effect(() => {
      const hint = this.showHint();
      // Only showHint() must be tracked: applyHint() both reads and writes the
      // value signals, so tracking them would re-trigger this effect and the
      // second pass would clear the freshly set hint state.
      untracked(() => {
        if (hint) {
          this.applyHint(hint);
        } else {
          this.clearHint();
        }
      });
    });
  }

  /**
   * Shows the correct values and marks only the fields whose entered value was wrong.
   * @param hint The hint string to apply, in the format "left_right".
   */
  private applyHint(hint: string) {
    const parts = hint.split('_');
    if (parts.length !== 2) return;

    const applyToField = (
      valueSignal: WritableSignal<string>,
      hintSignal: WritableSignal<boolean>,
      value: string,
    ) => {
      // only show hint when value is different
      const isHinted = value !== '' && valueSignal() !== value;
      valueSignal.set(value);
      hintSignal.set(isHinted);
    };

    applyToField(this.bottomLeftValue, this.hasLeftHint, parts[0]);
    applyToField(this.bottomRightValue, this.hasRightHint, parts[1]);
    this.updateButtonStates();
  }

  /**
   * Clears currently displayed hints.
   */
  private clearHint() {
    this.hasLeftHint.set(false);
    this.hasRightHint.set(false);
  }

  private resetSelection(): void {
    this.bottomLeftValue.set('');
    this.bottomRightValue.set('');
    this.selectedInput.set('LEFT');
    this.hasLeftHint.set(false);
    this.hasRightHint.set(false);
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
    const currentVal =
      this.selectedInput() === 'LEFT'
        ? this.bottomLeftValue()
        : this.bottomRightValue();
    this.keyboardDisabled.set(currentVal.length >= 2);
  }

  private emitResponses(status: 'DISPLAYED' | 'VALUE_CHANGED') {
    const value = `${this.bottomLeftValue()}_${this.bottomRightValue()}`;
    const response: StarsResponse = {
      id: this.localParameters?.variableId || 'PYRAMID',
      status: status,
      value: value,
      relevantForResponsesProgress: status === 'VALUE_CHANGED',
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
      topNumber: 13,
    };
  }
}
