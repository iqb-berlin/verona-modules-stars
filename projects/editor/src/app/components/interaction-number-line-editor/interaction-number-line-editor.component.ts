import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractionNumberLineParams } from '@shared/models/unit-definition';
import { EditorStateService } from '../../services/editor-state.service';

@Component({
  selector: 'stars-interaction-number-line-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="interaction-editor">
      <div class="field">
        <label>Variablen-ID</label>
        <input type="text" [value]="params.variableId" (input)="updateField('variableId', $any($event.target).value)">
      </div>
      <div class="field-row-group">
        <div class="field">
          <label>Erste Zahl</label>
          <input type="number" [value]="params.firstNumber" (input)="updateField('firstNumber', +$any($event.target).value)">
        </div>
        <div class="field">
          <label>Letzte Zahl</label>
          <input type="number" [value]="params.lastNumber" (input)="updateField('lastNumber', +$any($event.target).value)">
        </div>
      </div>
      <div class="field">
        <label>Eingabe-Zahl (Zielwert)</label>
        <input type="number" [value]="params.numberInput" (input)="updateField('numberInput', +$any($event.target).value)">
      </div>
      <div class="field">
        <label>Stil</label>
        <select [value]="params.style || ''" (change)="updateField('style', $any($event.target).value)">
          <option value="">Standard</option>
          <option value="WAVE">Welle</option>
        </select>
      </div>
    </div>
  `,
  styles: [`
    .field-row-group { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  `]
})
export class InteractionNumberLineEditorComponent {
  state = inject(EditorStateService);

  get params(): InteractionNumberLineParams {
    return this.state.interactionParams() as InteractionNumberLineParams;
  }

  updateField(field: string, value: any): void {
    const current = { ...this.params };
    (current as any)[field] = value;
    this.state.interactionParams.set(current);
    this.state.notifyChange();
  }
}
