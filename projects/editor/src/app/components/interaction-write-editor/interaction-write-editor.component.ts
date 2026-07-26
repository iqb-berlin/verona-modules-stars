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
        <input type="text" [value]="params.variableId || ''" (input)="updateField('variableId', $any($event.target).value)">
      </div>
      <div class="field">
        <label>Text / Aufgabenstellung</label>
        <input type="text" [value]="params.text || ''" (input)="updateField('text', $any($event.target).value)">
      </div>
      <div class="field">
        <label>Tastatur-Modus</label>
        <select [value]="params.keyboardMode || 'CHARACTERS'" (change)="updateField('keyboardMode', $any($event.target).value)">
          <option value="CHARACTERS">Buchstaben</option>
          <option value="NUMBERS_LINE">Zahlen (Zeile)</option>
        </select>
      </div>
      <div class="field">
        <label>Max. Eingabelänge</label>
        <input type="number" [value]="params.maxInputLength ?? 20" (input)="updateField('maxInputLength', +$any($event.target).value)" min="1" max="100">
      </div>
      <div class="field field-row">
        <label><input type="checkbox" [checked]="params.addBackspaceKey" (change)="updateField('addBackspaceKey', $any($event.target).checked)"> Rücktaste</label>
      </div>
      <div class="field field-row">
        <label><input type="checkbox" [checked]="addUmlautKeysEnabled" (change)="toggleUmlautKeys($any($event.target).checked)"> Umlauttasten</label>
      </div>
      <div class="field">
        <label>Tastenreihe 1 (kommagetrennt)</label>
        <input type="text" [value]="line1String" (input)="updateKeysLine('keysLine1', $any($event.target).value)">
      </div>
      <div class="field">
        <label>Tastenreihe 2 (kommagetrennt)</label>
        <input type="text" [value]="line2String" (input)="updateKeysLine('keysLine2', $any($event.target).value)">
      </div>
      <div class="field">
        <label>Tastenreihe 3 (kommagetrennt)</label>
        <input type="text" [value]="line3String" (input)="updateKeysLine('keysLine3', $any($event.target).value)">
      </div>
      <div class="field">
        <label>Tastenreihe 4 (kommagetrennt)</label>
        <input type="text" [value]="line4String" (input)="updateKeysLine('keysLine4', $any($event.target).value)">
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
  private static readonly UMLAUT_KEYS = ['ä', 'ö', 'ü'];
  state = inject(EditorStateService);

  get params(): InteractionWriteParams {
    return this.state.interactionParams() as InteractionWriteParams;
  }

  get line1String(): string {
    return (this.params.keysLine1 || []).join(', ');
  }

  get line2String(): string {
    return (this.params.keysLine2 || []).join(', ');
  }

  get line3String(): string {
    return (this.params.keysLine3 || []).join(', ');
  }

  get line4String(): string {
    return (this.params.keysLine4 || []).join(', ');
  }

  get addUmlautKeysEnabled(): boolean {
    return this.hasAllUmlautKeys(this.params.keysLine4 || []);
  }

  updateField<K extends keyof InteractionWriteParams>(field: K, value: InteractionWriteParams[K]): void {
    const current = { ...this.params };
    current[field] = value;
    this.state.setInteractionParams(current);
  }

  updateKeysLine(field: 'keysLine1' | 'keysLine2' | 'keysLine3' | 'keysLine4', value: string): void {
    const keys = value.split(',').map(k => k.trim()).filter(k => k.length > 0);
    const current = { ...this.params };
    current[field] = keys;
    if (field === 'keysLine4') {
      current.addUmlautKeys = this.hasAllUmlautKeys(keys);
    }
    this.state.setInteractionParams(current);
  }

  toggleUmlautKeys(enabled: boolean): void {
    const current = { ...this.params };
    const line4WithoutUmlauts = (current.keysLine4 || [])
      .filter(key => !InteractionWriteEditorComponent.UMLAUT_KEYS.includes(key));

    current.addUmlautKeys = enabled;
    current.keysLine4 = enabled ?
      [...InteractionWriteEditorComponent.UMLAUT_KEYS, ...line4WithoutUmlauts] :
      line4WithoutUmlauts;

    this.state.setInteractionParams(current);
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.updateField('imageSource', reader.result as string);
    reader.readAsDataURL(file);
  }

  // Kept as an instance method because the template-facing getter and update path share it.
  // eslint-disable-next-line class-methods-use-this
  private hasAllUmlautKeys(keys: string[]): boolean {
    return InteractionWriteEditorComponent.UMLAUT_KEYS.every(umlaut => keys.includes(umlaut));
  }
}
