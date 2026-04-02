import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorStateService } from '../../services/editor-state.service';
import { InteractionVideoParams } from '@shared/models/unit-definition';

@Component({
  selector: 'stars-interaction-video-editor',
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
      <div class="field field-row">
        <label><input type="checkbox" [checked]="params.triggerNavigationOnEnd" (change)="updateField('triggerNavigationOnEnd', $any($event.target).checked)"> Navigation nach Video-Ende</label>
      </div>
      <div class="field">
        <label>Video</label>
        <div class="upload-row">
          @if (params.videoSource) {
            <span class="video-badge">🎬 Video geladen</span>
            <button class="btn-icon" (click)="updateField('videoSource', '')">✕</button>
          }
          <label class="btn-upload">
            <span>{{ params.videoSource ? 'Ersetzen' : 'Video wählen' }}</span>
            <input type="file" accept="video/*" (change)="onVideoSelected($event)" hidden>
          </label>
        </div>
      </div>
      <div class="field">
        <label>Vorschaubild</label>
        <div class="upload-row">
          @if (params.imageSource) {
            <img [src]="params.imageSource" class="preview-thumb" alt="Poster">
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
    .preview-thumb { max-width: 80px; max-height: 50px; border-radius: 4px; }
    .upload-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .video-badge { font-size: 12px; color: #60a5fa; }
  `]
})
export class InteractionVideoEditorComponent {
  state = inject(EditorStateService);

  get params(): InteractionVideoParams {
    return this.state.interactionParams() as InteractionVideoParams;
  }

  updateField(field: string, value: any): void {
    const current = { ...this.params };
    (current as any)[field] = value;
    this.state.interactionParams.set(current);
    this.state.notifyChange();
  }

  onVideoSelected(event: Event): void {
    this.readFile(event, (r) => this.updateField('videoSource', r));
  }

  onImageSelected(event: Event): void {
    this.readFile(event, (r) => this.updateField('imageSource', r));
  }

  private readFile(event: Event, cb: (r: string) => void): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => cb(reader.result as string);
    reader.readAsDataURL(file);
  }
}
