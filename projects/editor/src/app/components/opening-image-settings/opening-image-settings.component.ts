import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorStateService } from '../../services/editor-state.service';
import { MediaUploadComponent } from '../media-upload/media-upload.component';

@Component({
  selector: 'stars-opening-image-settings',
  standalone: true,
  imports: [CommonModule, MediaUploadComponent],
  template: `
    <section class="editor-section">
      <h3 class="section-title" (click)="collapsed = !collapsed">
        <span class="collapse-icon">{{ collapsed ? '▶' : '▼' }}</span>
        Einführungs-Bild
      </h3>
      @if (!collapsed) {
        <div class="section-body">
          <div class="field field-row">
            <label>
              <input type="checkbox" [checked]="state.openingImageEnabled()" (change)="state.openingImageEnabled.set($any($event.target).checked); state.notifyChange()">
              Einführungs-Bild aktivieren
            </label>
          </div>
          @if (state.openingImageEnabled()) {
            <stars-media-upload
              label="Bild-Datei"
              type="image"
              [source]="state.openingImageSource()"
              (sourceChange)="state.openingImageSource.set($event); state.notifyChange()">
            </stars-media-upload>
          }
        </div>
      }
    </section>
  `
})
export class OpeningImageSettingsComponent {
  state = inject(EditorStateService);
  collapsed = true;
}
