import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorStateService } from '../../services/editor-state.service';

@Component({
  selector: 'stars-media-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="media-upload">
      <label class="upload-label">{{ label }}</label>
      <div class="upload-controls">
        @if (currentValue) {
          <div class="preview-container">
            @if (mediaType === 'image') {
              <img [src]="currentValue" class="preview-image" alt="Preview">
            } @else {
              <div class="audio-indicator">
                <span class="audio-icon">🔊</span>
                <span class="audio-text">Audio geladen</span>
              </div>
            }
            <button class="btn-remove" (click)="removeMedia()">✕</button>
          </div>
        }
        <label class="btn-upload" [for]="inputId">
          <span>{{ currentValue ? 'Ersetzen' : 'Datei wählen' }}</span>
          <input [id]="inputId" type="file" [accept]="acceptType" (change)="onFileSelected($event)" hidden>
        </label>
      </div>
    </div>
  `,
  styles: [`
    .media-upload { margin-bottom: 8px; }
    .upload-label { display: block; font-size: 12px; color: #94a3b8; margin-bottom: 4px; }
    .upload-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .preview-container { position: relative; display: inline-flex; align-items: center; gap: 4px;
      background: rgba(255,255,255,0.05); border-radius: 6px; padding: 4px 8px; }
    .preview-image { max-width: 60px; max-height: 40px; border-radius: 4px; object-fit: cover; }
    .audio-indicator { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #a78bfa; }
    .audio-icon { font-size: 16px; }
    .btn-remove { background: #ef4444; color: white; border: none; border-radius: 50%; width: 20px;
      height: 20px; font-size: 11px; cursor: pointer; display: flex; align-items: center;
      justify-content: center; padding: 0; line-height: 1; }
    .btn-upload { display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px;
      background: rgba(139, 92, 246, 0.2); color: #a78bfa; border: 1px dashed rgba(139, 92, 246, 0.4);
      border-radius: 6px; font-size: 12px; cursor: pointer; transition: all 0.2s; }
    .btn-upload:hover { background: rgba(139, 92, 246, 0.3); border-color: #a78bfa; }
  `]
})
export class MediaUploadComponent {
  label = '';
  mediaType: 'image' | 'audio' | 'video' = 'image';
  currentValue = '';
  inputId = 'media-' + Math.random().toString(36).substring(7);

  onValueChange: (value: string) => void = () => {};

  get acceptType(): string {
    switch (this.mediaType) {
      case 'image': return 'image/*';
      case 'audio': return 'audio/*';
      case 'video': return 'video/*';
      default: return '*/*';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.currentValue = base64;
      this.onValueChange(base64);
    };
    reader.readAsDataURL(file);
  }

  removeMedia(): void {
    this.currentValue = '';
    this.onValueChange('');
  }
}
