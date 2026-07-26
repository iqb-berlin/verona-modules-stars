import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Code, VariableInfo } from '@shared/models/responses';
import { EditorStateService } from '../../services/editor-state.service';

@Component({
  selector: 'stars-variable-info-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './variable-info-editor.component.html',
  styleUrl: './variable-info-editor.component.scss'
})
export class VariableInfoEditorComponent {
  state = inject(EditorStateService);
  collapsed = true;

  get variables(): VariableInfo[] {
    return this.state.variableInfo();
  }

  get canAddVariable(): boolean {
    return this.availableVariableIds().length > 0;
  }

  addVariable(): void {
    const variables = [...this.variables];
    const nextVariableId = this.availableVariableIds()[0];
    if (!nextVariableId) return;
    variables.push({
      variableId: nextVariableId,
      responseComplete: 'ALWAYS',
      codingSource: 'VALUE',
      codes: []
    });
    this.state.setVariableInfo(variables);
  }

  removeVariable(index: number): void {
    const variables = [...this.variables];
    variables.splice(index, 1);
    this.state.setVariableInfo(variables);
  }

  updateVariable(
    index: number,
    field: keyof VariableInfo,
    value: VariableInfo[keyof VariableInfo]
  ): void {
    const variables = [...this.variables];
    const variable = { ...variables[index], [field]: value };
    if (!this.requiresCodingSourceParameter(variable)) variable.codingSourceParameter = undefined;
    variables[index] = variable;
    this.state.setVariableInfo(variables);
  }

  addCode(variableIndex: number): void {
    const variables = [...this.variables];
    const codes = [...variables[variableIndex].codes];
    codes.push({
      method: 'EQUALS', parameter: '', code: codes.length + 1, score: 0
    });
    variables[variableIndex] = { ...variables[variableIndex], codes };
    this.state.setVariableInfo(variables);
  }

  removeCode(variableIndex: number, codeIndex: number): void {
    const variables = [...this.variables];
    const codes = [...variables[variableIndex].codes];
    codes.splice(codeIndex, 1);
    variables[variableIndex] = { ...variables[variableIndex], codes };
    this.state.setVariableInfo(variables);
  }

  updateCode(
    variableIndex: number,
    codeIndex: number,
    field: keyof Code,
    value: Code[keyof Code]
  ): void {
    const variables = [...this.variables];
    const codes = [...variables[variableIndex].codes];
    codes[codeIndex] = { ...codes[codeIndex], [field]: value };
    variables[variableIndex] = { ...variables[variableIndex], codes };
    this.state.setVariableInfo(variables);
  }

  // eslint-disable-next-line class-methods-use-this
  requiresCodingSourceParameter(variable: VariableInfo): boolean {
    return variable.codingSource === 'SUM_CHAR_MATCHES';
  }

  private availableVariableIds(): string[] {
    const configuredIds = new Set(this.variables.map(variable => variable.variableId));
    return this.state.availableResponseVariableIds().filter(variableId => !configuredIds.has(variableId));
  }
}
