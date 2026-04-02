import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractionWriteParams } from '@shared/models/unit-definition';
import { EditorStateService } from '../../services/editor-state.service';

@Component({
  selector: 'stars-interaction-write-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="interaction-editor">
      <div class="field">
        <label>Variablen-ID</label>
        <input type="text" [value]="params.variableId" (input)="updateField('variableId', $any($event.target).value)">
      </div>
      <div class="field">
        <label>Text / Aufgabenstellung</label>
        <input type="text" [value]="params.text" (input)="updateField('text', $any($event.target).value)">
      </div>
      <div class="field">
        <label>Tastatur-Modus</label>
        <select [value]="params.keyboardMode" (change)="updateField('keyboardMode', $any($event.target).value)">
          <option value="CHARACTERS">Buchstaben</option>
          <option value="NUMBERS_LINE">Zahlen (Zeile)</option>
        </select>
      </div>
      <div class="field">
        <label>Max. Eingabelänge</label>
        <input type="number" [value]="params.maxInputLength" (input)="updateField('maxInputLength', +$any($event.target).value)" min="1" max="100">
      </div>
      <div class="field field-row">
        <label><input type="checkbox" [checked]="params.addBackspaceKey" (change)="updateField('addBackspaceKey', $any($event.target).checked)"> Rücktaste</label>
      </div>
      <div class="field field-row">
        <label><input type="checkbox" [checked]="params.addUmlautKeys" (change)="updateField('addUmlautKeys', $any($event.target).checked)"> Umlauttasten</label>
      </div>
      <div class="field">
        <label>Zusätzliche Tasten (kommagetrennt)</label>
        <input type="text" [value]="keysString" (input)="updateKeys($any($event.target).value)">
      </div>
      <div class="field">
        <label>Bild</label>
        <div class="upload-row">
          @if (params.imageSource) {
            <img [src]="params.imageSource" class="preview-thumb" alt="Write Img">
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
    .preview-thumb { max-width: 60px; max-height: 40px; border-radius: 4px; }
    .upload-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  `]
})
export class InteractionWriteEditorComponent {
  state = inject(EditorStateService);

  get params(): InteractionWriteParams {
    return this.state.interactionParams() as InteractionWriteParams;
  }

  get keysString(): string {
    return (this.params.keysToAdd || []).join(', ');
  }

  updateField(field: string, value: any): void {
    const current = { ...this.params };
    (current as any)[field] = value;
    this.state.interactionParams.set(current);
    this.state.notifyChange();
  }

  updateKeys(value: string): void {
    const keys = value.split(',').map(k => k.trim()).filter(k => k.length > 0);
    this.updateField('keysToAdd', keys);
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.updateField('imageSource', reader.result as string);
    reader.readAsDataURL(file);
  }
}
