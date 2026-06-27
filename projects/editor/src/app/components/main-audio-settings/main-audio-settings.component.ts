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
                [checked]="state.mainAudioEnabled()"
                (change)="toggleMainAudio($any($event.target).checked)"
              />
              Haupt-Audio aktivieren
            </label>
          </div>
          @if (state.mainAudioEnabled()) {
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
                  min="0"
                  max="99"
                />
              </div>
            </div>
          }

          <div class="sub-section">
            <div class="sub-header">Optionen für den ersten Audiostart</div>
            <div class="field">
              <label>First Click Layer</label>
              <select
                [value]="state.firstClickLayerSelection()"
                (change)="updateFirstClickLayer($any($event.target).value)"
              >
                <option value="OFF">Aus</option>
                <option value="TRANSPARENT">Transparent</option>
                <option value="BLUR">Blur</option>
                <option value="DISABLED">Disabled</option>
                <option value="true">Legacy: Ein</option>
              </select>
            </div>
            <div class="field field-row">
              <label>Audio-Button Animation</label>
              <select
                [value]="state.animateButtonSelection()"
                (change)="updateAnimateButton($any($event.target).value)"
              >
                <option value="OFF">Aus</option>
                <option value="KIND">Kind</option>
                <option value="BOLD">Bold</option>
                <option value="true">Legacy: Ein</option>
              </select>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .sub-section {
      margin-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 8px;
    }
    .sub-header {
      font-size: 13px;
      font-weight: 600;
      color: #e2e8f0;
      margin-bottom: 8px;
    }
  `]
})
export class MainAudioSettingsComponent {
  state = inject(EditorStateService);
  collapsed = true;

  toggleMainAudio(enabled: boolean): void {
    this.state.setMainAudioEnabled(enabled);
    this.state.notifyChange();
  }

  updateFirstClickLayer(value: string): void {
    this.state.setFirstClickLayerFromSelection(value);
    this.state.notifyChange();
  }

  updateAnimateButton(value: string): void {
    this.state.setAnimateButtonFromSelection(value);
    this.state.notifyChange();
  }
}
