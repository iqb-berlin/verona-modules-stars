import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorStateService } from '../../services/editor-state.service';
import { MediaUploadComponent } from '../media-upload/media-upload.component';

@Component({
  selector: 'stars-main-audio-settings',
  standalone: true,
  imports: [CommonModule, MediaUploadComponent],
  template: `
    <section class="editor-section">
      <h3 class="section-title" (click)="collapsed = !collapsed">
        <span class="collapse-icon">{{ collapsed ? '▶' : '▼' }}</span>
        Haupt-Audio
      </h3>
      @if (!collapsed) {
        <div class="section-body">
          <div class="field field-row">
            <label>
              <input type="checkbox" [checked]="state.mainAudioEnabled()" (change)="state.mainAudioEnabled.set($any($event.target).checked); state.notifyChange()">
              Haupt-Audio aktivieren
            </label>
          </div>
          @if (state.mainAudioEnabled()) {
            <stars-media-upload
              label="Audio-Datei"
              type="audio"
              [source]="state.mainAudioSource()"
              (sourceChange)="state.mainAudioSource.set($event); state.notifyChange()">
            </stars-media-upload>

            <div class="field-row-group">
              <div class="field field-row">
                <label>
                  <input type="checkbox" [checked]="state.mainAudioRepeat()" (change)="state.mainAudioRepeat.set($any($event.target).checked); state.notifyChange()">
                  Wiederholung erlauben
                </label>
              </div>
              @if (state.mainAudioRepeat()) {
                <div class="field">
                  <label>Max. Wiederholungen</label>
                  <input type="number" [value]="state.mainAudioMaxRepeat()" (input)="state.mainAudioMaxRepeat.set(+$any($event.target).value); state.notifyChange()" min="1" max="10">
                </div>
              }
            </div>
          }
        </div>
      }
    </section>
  `
})
export class MainAudioSettingsComponent {
  state = inject(EditorStateService);
  collapsed = true;
}
