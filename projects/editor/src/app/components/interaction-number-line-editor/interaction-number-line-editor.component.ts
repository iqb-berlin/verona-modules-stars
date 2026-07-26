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
        <input type="text" [value]="params.variableId || ''" (input)="updateField('variableId', $any($event.target).value)">
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
          <option value="WAVE">Welle</option>
          <option value="RULER">Lineal</option>
          <option value="BLOCK">Block</option>
        </select>
      </div>

      <div class="field-row-group">
        <div class="field">
          <label>Vorlauf-Zahlen</label>
          <input
            type="text"
            [value]="numberListToString(params.leadingNumbers)"
            (input)="updateNumberList('leadingNumbers', $any($event.target).value)"
            placeholder="z.B. -2,-1"
          >
        </div>
        <div class="field">
          <label>Nachlauf-Zahlen</label>
          <input
            type="text"
            [value]="numberListToString(params.trailingNumbers)"
            (input)="updateNumberList('trailingNumbers', $any($event.target).value)"
            placeholder="z.B. 21,22"
          >
        </div>
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

  updateField<K extends keyof InteractionNumberLineParams>(field: K, value: InteractionNumberLineParams[K]): void {
    const current = { ...this.params };
    current[field] = value;
    this.state.setInteractionParams(current);
  }

  updateNumberList(field: 'leadingNumbers' | 'trailingNumbers', value: string): void {
    const numbers = value
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map(item => Number(item))
      .filter(item => !Number.isNaN(item));
    this.updateField(field, numbers.length > 0 ? numbers : undefined);
  }

  // Used directly from the template; it intentionally depends only on its argument.
  // eslint-disable-next-line class-methods-use-this
  numberListToString(values?: number[]): string {
    return values?.join(', ') || '';
  }
}
