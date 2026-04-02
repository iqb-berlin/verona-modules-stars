import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorStateService } from '../../services/editor-state.service';

@Component({
  selector: 'stars-variable-info-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="editor-section">
      <h3 class="section-title" (click)="collapsed = !collapsed">
        <span class="collapse-icon">{{ collapsed ? '▶' : '▼' }}</span>
        Coding-Definitionen ({{ state.variableInfo().length }})
      </h3>
      @if (!collapsed) {
        <div class="section-body">
          <p class="hint">Hier können Sie das Scoring für die Variablen festlegen.</p>
          @for (v of state.variableInfo(); track v.variableId) {
            <div class="variable-card">
              <div class="var-header">
                <span class="var-id">{{ v.variableId }}</span>
              </div>
              <div class="field">
                <label>Coding-Quelle</label>
                <select [value]="v.codingSource" (change)="updateVar(v.variableId, 'codingSource', $any($event.target).value)">
                  <option value="VALUE">Unmittelbarer Wert</option>
                  <option value="VALUE_TO_UPPER">Wert (Großbuchstaben)</option>
                  <option value="SUM">Summe (Punkte)</option>
                </select>
              </div>
              <div class="field">
                <label>Vollständigkeit</label>
                <select [value]="v.responseComplete" (change)="updateVar(v.variableId, 'responseComplete', $any($event.target).value)">
                  <option value="ALWAYS">Immer</option>
                  <option value="ON_ANY_RESPONSE">Bei jeder Antwort</option>
                  <option value="ON_FULL_CREDIT">Bei voller Punktzahl</option>
                </select>
              </div>
            </div>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .hint { font-size: 11px; color: #94a3b8; margin-bottom: 12px; font-style: italic; }
    .variable-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 10px; margin-bottom: 8px; }
    .var-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .var-id { font-weight: 600; color: #38bdf8; font-size: 13px; }
  `]
})
export class VariableInfoEditorComponent {
  state = inject(EditorStateService);
  collapsed = true;

  updateVar(id: string, field: string, value: any): void {
    const vars = [...this.state.variableInfo()];
    const idx = vars.findIndex(v => v.variableId === id);
    if (idx >= 0) {
      vars[idx] = { ...vars[idx], [field]: value };
      this.state.variableInfo.set(vars);
      this.state.notifyChange();
    }
  }
}
