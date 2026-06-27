import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractionEquationParams } from '@shared/models/unit-definition';
import { EditorStateService } from '../../services/editor-state.service';

@Component({
  selector: 'stars-interaction-equation-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="interaction-editor">
      <div class="field">
        <label>Variablen-ID</label>
        <input type="text" [value]="params.variableId || ''" (input)="updateField('variableId', $any($event.target).value)">
      </div>
      <div class="field">
        <label>Operatoren (kommagetrennt)</label>
        <input type="text" [value]="operatorsString" (input)="updateOperators($any($event.target).value)">
      </div>
      <div class="field-row-group">
        <div class="field">
          <label>Fester Operand 1</label>
          <input type="number" [value]="params.fixOperand1 ?? ''" (input)="updateOptionalNumber('fixOperand1', $any($event.target).value)" placeholder="(leer = Eingabe)">
        </div>
        <div class="field">
          <label>Fester Operand 2</label>
          <input type="number" [value]="params.fixOperand2 ?? ''" (input)="updateOptionalNumber('fixOperand2', $any($event.target).value)" placeholder="(leer = Eingabe)">
        </div>
        <div class="field">
          <label>Festes Ergebnis</label>
          <input type="number" [value]="params.fixResult ?? ''" (input)="updateOptionalNumber('fixResult', $any($event.target).value)" placeholder="(leer = Eingabe)">
        </div>
      </div>
      <div class="field">
        <label>Bild</label>
        <div class="upload-row">
          @if (params.imageSource) {
            <img [src]="params.imageSource" class="preview-thumb" alt="Eq">
            <button class="btn-icon" (click)="updateField('imageSource', '')">✕</button>
          }
          <label class="btn-upload">
            <span>{{ params.imageSource ? 'Ersetzen' : 'Bild wählen' }}</span>
            <input type="file" accept="image/*" (change)="onImageSelected($event)" hidden>
          </label>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .field-row-group { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .preview-thumb { max-width: 60px; max-height: 40px; border-radius: 4px; }
    .upload-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  `]
})
export class InteractionEquationEditorComponent {
  state = inject(EditorStateService);

  get params(): InteractionEquationParams {
    return this.state.interactionParams() as InteractionEquationParams;
  }

  get operatorsString(): string {
    return (this.params.operators || []).join(', ');
  }

  updateField(field: string, value: any): void {
    const current = { ...this.params };
    (current as any)[field] = value;
    this.state.interactionParams.set(current);
    this.state.notifyChange();
  }

  updateOperators(value: string): void {
    const ops = value.split(',').map(o => o.trim()).filter(o => o.length > 0);
    this.updateField('operators', ops);
  }

  updateOptionalNumber(field: string, value: any): void {
    const num = value === '' || value === null || value === undefined ? undefined : Number(value);
    this.updateField(field, num);
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.updateField('imageSource', reader.result as string);
    reader.readAsDataURL(file);
  }
}
