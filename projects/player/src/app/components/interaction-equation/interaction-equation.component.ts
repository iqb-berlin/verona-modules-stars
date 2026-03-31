import { Component, computed, effect, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Response } from '@iqbspecs/response/response.interface';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { InteractionEquationParams } from '../../models/unit-definition';
import { StarsResponse } from '../../services/responses.service';

@Component({
  selector: 'stars-interaction-equation',
  templateUrl: './interaction-equation.component.html',
  styleUrls: ['./interaction-equation.component.scss'],
  imports: [CommonModule]
})
export class InteractionEquationComponent extends InteractionComponentDirective {
  /** Local copy of the component parameters with defaults applied. */
  localParameters!: InteractionEquationParams;

  /** Numbers to be shown in the keyboard */
  numbersList: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  /** Value of the fixOperand1 parameter or empty string if not exists */
  currentOperand1 = signal<string>('');

  /** Value of the operator parameter */
  currentOperator = signal<string>('');

  /** Value of the fixOperand2 parameter or empty string if not exists */
  currentOperand2 = signal<string>('');

  /** Value of the fixResult parameter or empty string if not exists */
  currentResult = signal<string>('');

  /** If there is a hint to be shown */
  hasHint = signal(false);

  /** Tracks which fields are currently displaying a hint (used for coloring) */
  hintedFields = signal<Set<'operand1' | 'operator' | 'operand2' | 'result'>>(new Set());

  /** Tracks the currently selected field to manage input and keyboard state */
  selectedField = signal<'operand1' | 'operator' | 'operand2' | 'result' | null>(null);

  /** Tracks the number of empty editable fields in the equation */
  emptyFieldsCount = signal<number>(0);

  /** Derives whether the keyboard should be disabled based on the focused field's length */
  keyboardDisabled = computed<boolean>(() => {
    const field = this.selectedField
    ();
    if (!field || field === 'operator') {
      return false;
    }
    const targetSignal = this.getFieldSignal(field);
    const currentValue = targetSignal ? targetSignal() : '';
    return currentValue.length >= 2;
  });

  private lastParametersRef: unknown | null = null;

  constructor() {
    super();

    effect(() => {
      const parameters = this.parameters() as InteractionEquationParams;
      if (!parameters) return;

      const isNewParametersObject = this.lastParametersRef !== parameters;

      if (isNewParametersObject) {
        this.lastParametersRef = parameters;

        this.localParameters = {
          ...this.createDefaultParameters(),
          ...parameters
        };

        // Reset selection before restore or initialize to avoid state leakage
        this.resetSelection();

        // Initialize values first to ensure fixed fields from parameters are populated
        this.initializeValues();

        const formerStateResponses: Response[] = this.localParameters.formerState || [];
        const found = formerStateResponses.find(r => r.id === this.localParameters.variableId);

        if (found && typeof found.value === 'string' && found.value !== '') {
          this.restoreFromFormerState(found.value);
        } else {
          // No valid former state - already initialized with defaults by initializeValues()
          this.emitResponse('DISPLAYED');
        }
      } else {
        // Same unit, just keep localParameters' formerState in sync if needed
        this.localParameters.formerState = parameters.formerState;
      }
    });

    effect(() => {
      const hint = this.showHint();
      if (hint) {
        this.applyHint(hint);
      } else {
        this.clearHint();
      }
    });
  }

  /**
   * Processes and displays hints for editable fields.
   * @param hint The hint string to apply, separated by underscores.
   */
  private applyHint(hint: string) {
    const parts = hint.split('_');
    const editableFields = this.getEditableFields();

    if (parts.length === editableFields.length) {
      const newHintedFields = new Set<'operand1' | 'operator' | 'operand2' | 'result'>();
      editableFields.forEach((field, index) => {
        const value = parts[index] || '';
        const targetSignal = this.getFieldSignal(field);
        if (targetSignal) {
          targetSignal.set(value);
        }

        if (value !== '' && this.isFieldEditable(field)) {
          newHintedFields.add(field);
        }
      });

      this.hintedFields.set(newHintedFields);
      this.hasHint.set(newHintedFields.size > 0);
    }
  }

  /**
   * Clears currently displayed hints.
   */
  private clearHint() {
    this.hasHint.set(false);
    this.hintedFields.set(new Set());
  }

  /**
   * Resets all signal-based state to initial empty values.
   */
  private resetSelection() {
    this.currentOperand1.set('');
    this.currentOperator.set('');
    this.currentOperand2.set('');
    this.currentResult.set('');
    this.selectedField.set(null);
    this.hasHint.set(false);
    this.hintedFields.set(new Set());
  }

  /**
   * Concatenates the current values of editable fields into a single response string.
   * @returns A string of values separated by underscores.
   */
  private constructResponseValue(): string {
    const editableFields = this.getEditableFields();
    return editableFields.map(field => {
      if (field === 'operand1') return this.currentOperand1();
      if (field === 'operator') return this.currentOperator();
      if (field === 'operand2') return this.currentOperand2();
      if (field === 'result') return this.currentResult();
      return '';
    }).join('_');
  }

  /**
   * Filters all possible equation fields to return only those that are editable.
   * @returns An array of editable field names.
   */
  private getEditableFields(): ('operand1' | 'operator' | 'operand2' | 'result')[] {
    const fields: ('operand1' | 'operator' | 'operand2' | 'result')[] = ['operand1', 'operator', 'operand2', 'result'];
    return fields.filter(field => this.isFieldEditable(field));
  }

  /**
   * Restores the component state from a previously saved response value.
   * @param value The saved response string.
   */
  private restoreFromFormerState(value: string) {
    if (!value || typeof value !== 'string') return;

    const parts = value.split('_');
    const editableFields = this.getEditableFields();

    if (parts.length === editableFields.length) {
      editableFields.forEach((field, index) => {
        const val = parts[index] || '';
        const targetSignal = this.getFieldSignal(field);
        if (targetSignal) {
          targetSignal.set(val);
        }
      });
    }

    // Set focus if there's exactly one empty editable field.
    const emptyFields = editableFields.filter(field => {
      const targetSignal = this.getFieldSignal(field);
      return targetSignal ? targetSignal() === '' : true;
    });

    this.emptyFieldsCount.set(emptyFields.length);
    if (emptyFields.length === 1 && emptyFields[0]) {
      this.selectedField.set(emptyFields[0]);
    } else {
      this.selectedField.set(null);
    }
  }

  /**
   * Initializes field values based on parameters.
   * @param onlyFixed If true, only initializes fields with fixed values from parameters.
   */
  private initializeValues(onlyFixed: boolean = false) {
    const fields: ('operand1' | 'operator' | 'operand2' | 'result')[] = ['operand1', 'operator', 'operand2', 'result'];
    const paramKeys = {
      operand1: 'fixOperand1',
      operand2: 'fixOperand2',
      result: 'fixResult'
    } as const;

    fields.forEach(field => {
      const targetSignal = this.getFieldSignal(field);
      if (field === 'operator') {
        if (this.localParameters.operators.length === 1) {
          this.currentOperator.set(this.localParameters.operators[0] || '');
        } else if (!onlyFixed) {
          this.currentOperator.set('');
        }
        return;
      }

      const key = paramKeys[field as keyof typeof paramKeys];
      const fixValue = (this.localParameters as any)[key];
      if (fixValue !== undefined) {
        if (targetSignal) targetSignal.set(fixValue.toString());
      } else if (!onlyFixed) {
        if (targetSignal) targetSignal.set('');
      }
    });

    if (!onlyFixed) {
      // Set initial focus if there's exactly one empty editable field.
      const editableFields = this.getEditableFields();
      const emptyFields = editableFields.filter(field => {
        const targetSignal = this.getFieldSignal(field);
        return targetSignal ? targetSignal() === '' : true;
      });

      this.emptyFieldsCount.set(emptyFields.length);
      if (emptyFields.length === 1 && emptyFields[0]) {
        this.selectedField.set(emptyFields[0]);
      } else {
        this.selectedField.set(null);
      }
    }
  }

  /**
   * Sets the selected field if it is editable.
   * @param field The field to select.
   */
  setSelectedField(field: 'operand1' | 'operator' | 'operand2' | 'result') {
    const editable = this.isFieldEditable(field);
    if (editable) {
      if (this.hasHint() !== false) this.hasHint.set(false);
      if (this.hintedFields().size !== 0) this.hintedFields.set(new Set());
      if (this.selectedField() !== field) this.selectedField.set(field);
    }
  }

  /**
   * Determines if a specific field is editable based on the current parameters.
   * @param field The field to check.
   * @returns True if the field is editable.
   */
  isFieldEditable(field: 'operand1' | 'operator' | 'operand2' | 'result' | null | undefined): boolean {
    if (!field) return false;
    const editabilityMap = {
      operand1: this.localParameters.fixOperand1 === undefined,
      operator: this.localParameters.operators.length > 1,
      operand2: this.localParameters.fixOperand2 === undefined,
      result: this.localParameters.fixResult === undefined
    };
    return editabilityMap[field];
  }

  /**
   * Returns the signal associated with a specific field.
   * @param field The field name.
   * @returns The Signal for the field, or undefined if not found.
   */
  getFieldSignal(field: 'operand1' | 'operator' | 'operand2' | 'result' | null | undefined): WritableSignal<string> | undefined {
    if (!field) return undefined;
    const signalMap: Record<string, WritableSignal<string>> = {
      operand1: this.currentOperand1,
      operator: this.currentOperator,
      operand2: this.currentOperand2,
      result: this.currentResult
    };
    return signalMap[field];
  }

  /**
   * Handles keyboard button clicks by updating the currently focused field.
   * @param button The value of the clicked keyboard button.
   */
  handleKeyboardClick(button: string) {
    const field = this.selectedField();
    if (!field || this.keyboardDisabled()) return;

    if (this.hasHint() !== false) this.hasHint.set(false);
    if (this.hintedFields().size !== 0) this.hintedFields.set(new Set());

    const targetSignal = this.getFieldSignal(field);
    if (targetSignal) {
      if (field === 'operator') {
        targetSignal.set(button);
        this.emitResponse('VALUE_CHANGED');
        this.moveToNextField();
      } else {
        const newValue = targetSignal() + button;
        targetSignal.set(newValue);
        this.emitResponse('VALUE_CHANGED');
        if (newValue.length >= 2) {
          this.moveToNextField();
        }
      }
    }
  }

  /**
   * Removes the last character from the currently focused field.
   */
  handleBackButtonClick() {
    const field = this.selectedField();
    if (!field) return;

    if (this.hasHint() !== false) this.hasHint.set(false);
    if (this.hintedFields().size !== 0) this.hintedFields.set(new Set());

    const targetSignal = this.getFieldSignal(field);
    if (targetSignal && targetSignal().length > 0) {
      targetSignal.set(targetSignal().slice(0, -1));
      this.emitResponse('VALUE_CHANGED');
    }
  }


  /**
   * Automatically moves focus to the next editable field in sequence.
   */
  private moveToNextField() {
    const fields: ('operand1' | 'operator' | 'operand2' | 'result')[] = ['operand1', 'operator', 'operand2', 'result'];
    const currentField = this.selectedField();
    if (!currentField) return;

    const currentIndex = fields.indexOf(currentField);
    for (let i = currentIndex + 1; i < fields.length; i++) {
      const field = fields[i];
      if (this.isFieldEditable(field)) {
        if (this.selectedField() !== field) this.selectedField.set(field);
        break;
      }
    }
  }

  /**
   * Emits the current component state as a response to the parent module.
   * @param status The status of the response (e.g., 'DISPLAYED' or 'VALUE_CHANGED').
   */
  private emitResponse(status: 'DISPLAYED' | 'VALUE_CHANGED') {
    const responseValue = this.constructResponseValue();
    const response: StarsResponse = {
      id: this.localParameters.variableId || 'EQUATION',
      status: status,
      value: responseValue,
      relevantForResponsesProgress: status === 'VALUE_CHANGED'
    };
    this.responses.emit([response]);
  }

  // eslint-disable-next-line class-methods-use-this
  private createDefaultParameters(): InteractionEquationParams {
    return {
      variableId: 'EQUATION',
      fixOperand1: undefined,
      fixOperand2: undefined,
      fixResult: undefined,
      imageSource: '',
      operators: ['+']
    };
  }
}
