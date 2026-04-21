import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractionDropParams, SelectionOption } from '@shared/models/unit-definition';
import { EditorStateService } from '../../services/editor-state.service';

@Component({
  selector: 'stars-interaction-drop-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="interaction-editor">
      <div class="field">
        <label>Variablen-ID</label>
        <input type="text" [value]="params.variableId" (input)="updateField('variableId', $any($event.target).value)">
      </div>
      <div class="field">
        <label>Text</label>
        <input type="text" [value]="params.text" (input)="updateField('text', $any($event.target).value)">
      </div>
      <div class="field">
        <label>Bildposition</label>
        <select [value]="params.imagePosition" (change)="updateField('imagePosition', $any($event.target).value)">
          <option value="TOP">Oben</option>
          <option value="BOTTOM">Unten</option>
        </select>
      </div>
      <div class="field">
        <label>Bild-Landing X,Y</label>
        <input type="text" [value]="params.imageLandingXY" (input)="updateField('imageLandingXY', $any($event.target).value)" placeholder="z.B. 50,100">
      </div>
      <div class="field">
        <label>Bild</label>
        <div class="upload-row">
          @if (params.imageSource) {
            <img [src]="params.imageSource" class="preview-thumb" alt="Drop Img">
            <button class="btn-icon" (click)="updateField('imageSource', '')">✕</button>
          }
          <label class="btn-upload">
            <span>{{ params.imageSource ? 'Ersetzen' : 'Bild wählen' }}</span>
            <input type="file" accept="image/*" (change)="onImageSelected($event)" hidden>
          </label>
        </div>
      </div>
      <div class="sub-section">
        <div class="sub-header">
          <span>Drop-Optionen ({{ options.length }})</span>
          <button class="btn-add" (click)="addOption()">+ Hinzufügen</button>
        </div>
        @for (opt of options; track $index) {
          <div class="option-card">
            <div class="option-header">
              <span class="option-index">#{{ $index + 1 }}</span>
              <button class="btn-icon btn-remove-sm" (click)="removeOption($index)">✕</button>
            </div>
            <div class="field">
              <label>Text</label>
              <input type="text" [value]="opt.text" (input)="updateOption($index, 'text', $any($event.target).value)">
            </div>
            <div class="field">
              <label>Bild</label>
              <div class="upload-row">
                @if (opt.imageSource) {
                  <img [src]="opt.imageSource" class="preview-thumb-sm" alt="Opt">
                  <button class="btn-icon" (click)="updateOption($index, 'imageSource', '')">✕</button>
                }
                <label class="btn-upload btn-upload-sm">
                  <span>Bild</span>
                  <input type="file" accept="image/*" (change)="onOptionImageSelected($event, $index)" hidden>
                </label>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .preview-thumb { max-width: 60px; max-height: 40px; border-radius: 4px; }
    .preview-thumb-sm { max-width: 40px; max-height: 30px; border-radius: 3px; }
    .upload-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .sub-section { margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; }
    .sub-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 13px; font-weight: 600; color: #e2e8f0; }
    .btn-add { background: rgba(139, 92, 246, 0.2); color: #a78bfa; border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 4px; padding: 3px 10px; font-size: 11px; cursor: pointer; }
    .option-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 8px; margin-bottom: 6px; }
    .option-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .option-index { font-size: 11px; color: #64748b; font-weight: 600; }
    .btn-remove-sm { width: 18px; height: 18px; font-size: 10px; }
  `]
})
export class InteractionDropEditorComponent {
  state = inject(EditorStateService);

  get params(): InteractionDropParams {
    return this.state.interactionParams() as InteractionDropParams;
  }

  get options(): SelectionOption[] {
    return this.params.options || [];
  }

  updateField(field: string, value: any): void {
    const current = { ...this.params };
    (current as any)[field] = value;
    this.state.interactionParams.set(current);
    this.state.notifyChange();
  }

  addOption(): void {
    const current = { ...this.params };
    const options = [...(current.options || [])];
    options.push({ text: `Option ${options.length + 1}` });
    current.options = options;
    this.state.interactionParams.set(current);
    this.state.notifyChange();
  }

  removeOption(index: number): void {
    const current = { ...this.params };
    const options = [...(current.options || [])];
    options.splice(index, 1);
    current.options = options;
    this.state.interactionParams.set(current);
    this.state.notifyChange();
  }

  updateOption(index: number, field: string, value: any): void {
    const current = { ...this.params };
    const options = [...(current.options || [])];
    options[index] = { ...options[index], [field]: value };
    current.options = options;
    this.state.interactionParams.set(current);
    this.state.notifyChange();
  }

  onImageSelected(event: Event): void {
    this.readFile(event, r => this.updateField('imageSource', r));
  }

  onOptionImageSelected(event: Event, index: number): void {
    this.readFile(event, r => this.updateOption(index, 'imageSource', r));
  }

  private readFile(event: Event, cb: (r: string) => void): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => cb(reader.result as string);
    reader.readAsDataURL(file);
  }
}
