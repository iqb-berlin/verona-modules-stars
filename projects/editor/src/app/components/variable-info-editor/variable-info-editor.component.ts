import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Code, VariableInfo } from '@shared/models/responses';
import { EditorStateService } from '../../services/editor-state.service';

@Component({
  selector: 'stars-variable-info-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="editor-section">
      <h3 class="section-title" (click)="collapsed = !collapsed">
        <span class="collapse-icon">{{ collapsed ? '▶' : '▼' }}</span>
        Coding-Definitionen ({{ variables.length }})
      </h3>
      @if (!collapsed) {
        <div class="section-body">
          <p class="hint">
            Hier definierst du Variablen, Coding-Schemata und Scores.
          </p>

          <div class="toolbar">
            <button class="btn-add" (click)="addVariable()">
              + Variable hinzufügen
            </button>
          </div>

          @if (variables.length === 0) {
            <div class="empty-state">
              Noch keine Coding-Definition vorhanden.
            </div>
          }

          @for (variable of variables; track variable.variableId; let variableIndex = $index) {
            <div class="variable-card">
              <div class="var-header">
                <span class="var-id">{{ variable.variableId || 'Neue Variable' }}</span>
                <button class="btn-icon btn-remove-sm" (click)="removeVariable(variableIndex)">
                  ✕
                </button>
              </div>

              <div class="field">
                <label>Variablen-ID</label>
                <input
                  type="text"
                  [value]="variable.variableId"
                  (input)="updateVariable(variableIndex, 'variableId', $any($event.target).value)"
                />
              </div>

              <div class="field-row-group">
                <div class="field">
                  <label>Vollständigkeit</label>
                  <select
                    [value]="variable.responseComplete"
                    (change)="updateVariable(variableIndex, 'responseComplete', $any($event.target).value)"
                  >
                    <option value="ALWAYS">Immer</option>
                    <option value="ON_ANY_RESPONSE">Bei jeder Antwort</option>
                    <option value="ON_FULL_CREDIT">Bei voller Punktzahl</option>
                    <option value="ON_ALL_SUB_VALUES">Alle Teilwerte vorhanden</option>
                  </select>
                </div>

                <div class="field">
                  <label>Coding-Quelle</label>
                  <select
                    [value]="variable.codingSource"
                    (change)="updateVariable(variableIndex, 'codingSource', $any($event.target).value)"
                  >
                    <option value="VALUE">Wert</option>
                    <option value="VALUE_TO_UPPER">Wert in Großbuchstaben</option>
                    <option value="SUM">Summe</option>
                    <option value="SUM_CHAR_MATCHES">Zeichen-Matches summieren</option>
                  </select>
                </div>
              </div>

              @if (requiresCodingSourceParameter(variable)) {
                <div class="field">
                  <label>Coding-Parameter</label>
                  <input
                    type="text"
                    [value]="variable.codingSourceParameter || ''"
                    (input)="updateVariable(variableIndex, 'codingSourceParameter', $any($event.target).value)"
                  />
                </div>
              }

              <div class="sub-section">
                <div class="sub-header">
                  <span>Codes ({{ variable.codes.length }})</span>
                  <button class="btn-add" (click)="addCode(variableIndex)">
                    + Code
                  </button>
                </div>

                @if (variable.codes.length === 0) {
                  <div class="empty-sub-state">
                    Noch keine Code-Regel vorhanden.
                  </div>
                }

                @for (code of variable.codes; track $index; let codeIndex = $index) {
                  <div class="code-card">
                    <div class="option-header">
                      <span class="option-index">Code #{{ codeIndex + 1 }}</span>
                      <button class="btn-icon btn-remove-sm" (click)="removeCode(variableIndex, codeIndex)">
                        ✕
                      </button>
                    </div>

                    <div class="field-row-group">
                      <div class="field">
                        <label>Methode</label>
                        <select
                          [value]="code.method"
                          (change)="updateCode(variableIndex, codeIndex, 'method', $any($event.target).value)"
                        >
                          <option value="EQUALS">Gleich</option>
                          <option value="GREATER_THAN">Größer als</option>
                          <option value="LESS_THAN">Kleiner als</option>
                          <option value="IN_POSITION_RANGE">Im Positionsbereich</option>
                        </select>
                      </div>
                      <div class="field">
                        <label>Parameter</label>
                        <input
                          type="text"
                          [value]="code.parameter"
                          (input)="updateCode(variableIndex, codeIndex, 'parameter', $any($event.target).value)"
                        />
                      </div>
                    </div>

                    <div class="field-row-group">
                      <div class="field">
                        <label>Code</label>
                        <input
                          type="number"
                          [value]="code.code"
                          (input)="updateCode(variableIndex, codeIndex, 'code', +$any($event.target).value)"
                        />
                      </div>
                      <div class="field">
                        <label>Score</label>
                        <input
                          type="number"
                          [value]="code.score"
                          (input)="updateCode(variableIndex, codeIndex, 'score', +$any($event.target).value)"
                        />
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .hint {
      font-size: 11px;
      color: #94a3b8;
      margin-bottom: 12px;
      font-style: italic;
    }
    .toolbar {
      margin-bottom: 12px;
    }
    .empty-state,
    .empty-sub-state {
      font-size: 12px;
      color: #64748b;
      padding: 8px 0;
    }
    .variable-card,
    .code-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 8px;
    }
    .var-header,
    .option-header,
    .sub-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .var-id {
      font-weight: 600;
      color: #38bdf8;
      font-size: 13px;
    }
    .option-index,
    .sub-header {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }
    .field-row-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .sub-section {
      margin-top: 12px;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 8px;
    }
    .btn-add {
      background: rgba(139, 92, 246, 0.2);
      color: #a78bfa;
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 4px;
      padding: 3px 10px;
      font-size: 11px;
      cursor: pointer;
    }
    .btn-remove-sm {
      width: 18px;
      height: 18px;
      font-size: 10px;
    }
  `]
})
export class VariableInfoEditorComponent {
  state = inject(EditorStateService);
  collapsed = true;

  get variables(): VariableInfo[] {
    return this.state.variableInfo();
  }

  addVariable(): void {
    const variables = [...this.variables];
    const suggestedVariableId = (this.state.interactionParams() as any)?.variableId || 'VARIABLE_1';
    const nextVariableId = this.getNextVariableId(suggestedVariableId, variables);
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

  updateVariable(index: number, field: keyof VariableInfo, value: any): void {
    const variables = [...this.variables];
    const variable = { ...variables[index], [field]: value };

    if (!this.requiresCodingSourceParameter(variable)) {
      variable.codingSourceParameter = undefined;
    }

    variables[index] = variable;
    this.state.setVariableInfo(variables);
  }

  addCode(variableIndex: number): void {
    const variables = [...this.variables];
    const codes = [...variables[variableIndex].codes];
    codes.push({
      method: 'EQUALS',
      parameter: '',
      code: codes.length + 1,
      score: 0
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

  updateCode(variableIndex: number, codeIndex: number, field: keyof Code, value: any): void {
    const variables = [...this.variables];
    const codes = [...variables[variableIndex].codes];
    codes[codeIndex] = { ...codes[codeIndex], [field]: value };
    variables[variableIndex] = { ...variables[variableIndex], codes };
    this.state.setVariableInfo(variables);
  }

  requiresCodingSourceParameter(variable: VariableInfo): boolean {
    return variable.codingSource === 'SUM_CHAR_MATCHES';
  }

  private getNextVariableId(suggestedVariableId: string, variables: VariableInfo[]): string {
    if (!variables.some(variable => variable.variableId === suggestedVariableId)) {
      return suggestedVariableId;
    }

    let suffix = 2;
    let candidate = `${suggestedVariableId}_${suffix}`;
    while (variables.some(variable => variable.variableId === candidate)) {
      suffix += 1;
      candidate = `${suggestedVariableId}_${suffix}`;
    }
    return candidate;
  }
}
