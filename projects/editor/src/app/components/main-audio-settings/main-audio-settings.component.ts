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
              <input
                type="checkbox"
                [checked]="mainAudioEnabled()"
                (change)="toggleMainAudio($any($event.target).checked)"
              />
              Haupt-Audio aktivieren
            </label>
          </div>
          @if (mainAudioEnabled()) {
            <stars-media-upload
              label="Audio-Datei"
              type="audio"
              [source]="state.mainAudioSource()"
              (sourceChange)="
                state.mainAudioSource.set($event); state.notifyChange()
              "
            >
            </stars-media-upload>

            <div class="field-row-group">
              <div class="field field-row">
                <label>
                  <input
                    type="checkbox"
                    [checked]="state.mainAudioDisableInteractionUntilComplete()"
                    (change)="
                      state.mainAudioDisableInteractionUntilComplete.set(
                        $any($event.target).checked
                      );
                      state.notifyChange()
                    "
                  />
                  Interaktion deaktivieren bis Audio fertig
                </label>
              </div>
              <div class="field">
                <label>Max. Wiederholungen</label>
                <input
                  type="number"
                  [value]="state.mainAudioMaxPlay()"
                  (input)="
                    state.mainAudioMaxPlay.set(+$any($event.target).value);
                    state.notifyChange()
                  "
                  min="1"
                  max="10"
                />
              </div>
            </div>
          }
        </div>
      }
    </section>
  `,
})
export class MainAudioSettingsComponent {
  state = inject(EditorStateService);
  collapsed = true;

  mainAudioEnabled(): boolean {
    return this.state.mainAudioSource() !== '';
  }

  toggleMainAudio(enabled: boolean): void {
    if (enabled) {
      // If enabling, set a default audio source? Maybe leave empty and let user upload.
      // We'll keep the current source, which might be empty.
      // If source is empty, the user will need to upload.
    } else {
      // If disabling, clear the audio source.
      this.state.mainAudioSource.set('');
    }
    this.state.notifyChange();
  }
}
