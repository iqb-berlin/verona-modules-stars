import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Response } from '@iqbspecs/response/response.interface';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { InteractionEquationParams, InteractionPyramidParams } from '../../models/unit-definition';
import { StarsResponse } from '../../services/responses.service';

@Component({
  selector: 'stars-interaction-equation',
  templateUrl: './interaction-equation.component.html',
  styleUrls: ['./interaction-equation.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class InteractionEquationComponent extends InteractionComponentDirective {
  /** Local copy of the component parameters with defaults applied. */
  localParameters!: InteractionEquationParams;

  /** Numbers to be shown in the keyboard */
  numbersList: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  currentOperand1 = signal<string>('');
  currentOperator = signal<string>('');
  currentOperand2 = signal<string>('');
  currentResult = signal<string>('');

  focusedField = signal<'operand1' | 'operator' | 'operand2' | 'result' | null>(null);
  keyboardDisabled = signal<boolean>(false);

  constructor() {
    super();

    effect(() => {
      const parameters = this.parameters() as InteractionEquationParams;
      this.localParameters = this.createDefaultParameters();
      if (parameters) {
        this.localParameters = {
          variableId: parameters.variableId || this.localParameters.variableId,
          imageSource: parameters.imageSource || this.localParameters.imageSource,
          fixOperand1: parameters.fixOperand1,
          operators: parameters.operators || this.localParameters.operators || [],
          fixOperand2: parameters.fixOperand2,
          fixResult: parameters.fixResult,
          formerState: parameters.formerState
        } as InteractionEquationParams;

        const formerStateResponses: Response[] = this.localParameters.formerState || [];
        const found = formerStateResponses.find(r => r.id === this.localParameters.variableId);

        if (found && typeof found.value === 'string') {
          const responseValue = `${this.currentOperand1()}_${this.currentOperator()}_${this.currentOperand2()}_${this.currentResult()}`;
          if (found.value !== responseValue) {
            this.restoreFromFormerState(found.value);
          }
        } else if (!this.currentOperand1() && !this.currentOperator() && !this.currentOperand2() && !this.currentResult()) {
          this.initializeValues();
          this.emitResponse('DISPLAYED');
        }
      }
    });
  }

  private restoreFromFormerState(value: string) {
    if (!value || typeof value !== 'string') return;
    const parts = value.split('_');
    if (parts.length === 4) {
      this.currentOperand1.set(parts[0]);
      this.currentOperator.set(parts[1]);
      this.currentOperand2.set(parts[2]);
      this.currentResult.set(parts[3]);
      this.updateKeyboardStatus();
    }
  }

  private initializeValues() {
    this.currentOperand1.set(this.localParameters.fixOperand1 !== undefined ? this.localParameters.fixOperand1.toString() : '');
    this.currentOperand2.set(this.localParameters.fixOperand2 !== undefined ? this.localParameters.fixOperand2.toString() : '');
    this.currentResult.set(this.localParameters.fixResult !== undefined ? this.localParameters.fixResult.toString() : '');

    if (this.localParameters.operators.length === 1) {
      this.currentOperator.set(this.localParameters.operators[0]);
    } else {
      this.currentOperator.set('');
    }

    // Set initial focus to the first empty field
    const fields: ('operand1' | 'operator' | 'operand2' | 'result')[] = ['operand1', 'operator', 'operand2', 'result'];
    const firstEditableField = fields.find(field => this.isFieldEditable(field));
    if (firstEditableField) {
      this.focusedField.set(firstEditableField);
      this.updateKeyboardStatus();
    }
  }

  setFocus(field: 'operand1' | 'operator' | 'operand2' | 'result') {
    if (this.isFieldEditable(field)) {
      this.focusedField.set(field);
      this.updateKeyboardStatus();
    }
  }

  isFieldEditable(field: 'operand1' | 'operator' | 'operand2' | 'result'): boolean {
    const editabilityMap = {
      operand1: this.localParameters.fixOperand1 === undefined,
      operator: this.localParameters.operators.length > 1,
      operand2: this.localParameters.fixOperand2 === undefined,
      result: this.localParameters.fixResult === undefined
    };
    return editabilityMap[field];
  }

  getFieldSignal(field: 'operand1' | 'operand2' | 'result'): any {
    const signalMap: Record<string, any> = {
      operand1: this.currentOperand1,
      operand2: this.currentOperand2,
      result: this.currentResult
    };
    return signalMap[field];
  }

  handleKeyboardClick(button: string) {
    const field = this.focusedField();
    if (!field) return;

    if (field === 'operator') {
      if (this.localParameters.operators.includes(button)) {
        this.currentOperator.set(button);
        this.moveToNextField();
        this.updateKeyboardStatus();
      }
      return;
    }

    if (this.keyboardDisabled()) return;

    if (field === 'operand1') {
      const newValue = this.currentOperand1() + button;
      this.currentOperand1.set(newValue);
    } else if (field === 'operand2') {
      const newValue = this.currentOperand2() + button;
      this.currentOperand2.set(newValue);
    } else if (field === 'result') {
      const newValue = this.currentResult() + button;
      this.currentResult.set(newValue);
    }
    this.updateKeyboardStatus();
    this.emitResponse('VALUE_CHANGED');
  }

  handleBackButtonClick() {
    const field = this.focusedField();
    if (!field) return;

    if (field === 'operator') {
      this.currentOperator.set('');
      this.updateKeyboardStatus();
      return;
    }

    const targetSignal = this.getFieldSignal(field);
    if (targetSignal && targetSignal().length > 0) {
      targetSignal.set(targetSignal().slice(0, -1));
      this.updateKeyboardStatus();
      this.emitResponse('VALUE_CHANGED');
    }
  }

  private updateKeyboardStatus() {
    const field = this.focusedField();
    if (!field || field === 'operator') {
      this.keyboardDisabled.set(false);
      return;
    }
    const targetSignal = this.getFieldSignal(field);
    console.log('update keyboard status, field is', field, 'target signal is', targetSignal());
    if (targetSignal) {
      this.keyboardDisabled.set(targetSignal().length >= 2);
    }
  }

  private moveToNextField() {
    const fields: ('operand1' | 'operator' | 'operand2' | 'result')[] = ['operand1', 'operator', 'operand2', 'result'];
    const currentIndex = fields.indexOf(this.focusedField()!);
    for (let i = currentIndex + 1; i < fields.length; i++) {
      if (this.isFieldEditable(fields[i])) {
        this.focusedField.set(fields[i]);
        break;
      }
    }
  }

  private emitResponse(status: 'DISPLAYED' | 'VALUE_CHANGED') {
    const responseValue = `${this.currentOperand1()}_${this.currentOperator()}_${this.currentOperand2()}_${this.currentResult()}`;
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
      imageSource: '',
      operators: ['+']
    };
  }
}
