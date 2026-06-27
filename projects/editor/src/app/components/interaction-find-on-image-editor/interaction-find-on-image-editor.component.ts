import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractionFindOnImageParams } from '@shared/models/unit-definition';
import { EditorStateService } from '../../services/editor-state.service';

@Component({
  selector: 'stars-interaction-find-on-image-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="interaction-editor">
      <div class="field">
        <label>Variablen-ID</label>
        <input type="text" [value]="params.variableId || ''" (input)="updateField('variableId', $any($event.target).value)">
      </div>
      <div class="field">
        <label>Text</label>
        <input type="text" [value]="params.text || ''" (input)="updateField('text', $any($event.target).value)">
      </div>
      <div class="field">
        <label>Zielbereich (Koordinaten)</label>
        <input type="text" [value]="params.showArea || ''" (input)="updateField('showArea', $any($event.target).value)" placeholder="x1,y1,x2,y2">
      </div>
      <div class="field">
        <label>Zielgröße</label>
        <select [value]="params.size || 'MEDIUM'" (change)="updateField('size', $any($event.target).value)">
          <option value="SMALL">Klein</option>
          <option value="MEDIUM">Mittel</option>
          <option value="LARGE">Groß</option>
        </select>
      </div>
      <div class="field">
        <label>Bild</label>
        <div class="upload-row">
          @if (params.imageSource) {
            <img [src]="params.imageSource" class="preview-thumb" alt="Find">
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
    .preview-thumb { max-width: 80px; max-height: 60px; border-radius: 4px; }
    .upload-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  `]
})
export class InteractionFindOnImageEditorComponent {
  state = inject(EditorStateService);

  get params(): InteractionFindOnImageParams {
    return this.state.interactionParams() as InteractionFindOnImageParams;
  }

  updateField(field: string, value: any): void {
    const current = { ...this.params };
    (current as any)[field] = value;
    this.state.setInteractionParams(current);
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.updateField('imageSource', reader.result as string);
    reader.readAsDataURL(file);
  }
}
