import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorStateService } from '../../services/editor-state.service';

@Component({
  selector: 'stars-general-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="editor-section">
      <h3 class="section-title" (click)="collapsed = !collapsed">
        <span class="collapse-icon">{{ collapsed ? '▶' : '▼' }}</span>
        Allgemeine Einstellungen
      </h3>
      @if (!collapsed) {
        <div class="section-body">
          <div class="field">
            <label>Unit-ID</label>
            <input
              type="text"
              [value]="state.unitId()"
              (input)="
                state.unitId.set($any($event.target).value);
                state.notifyChange()
              "
            />
          </div>
          <div class="field">
            <label>Version</label>
            <input
              type="text"
              [value]="state.unitVersion()"
              (input)="
                state.unitVersion.set($any($event.target).value);
                state.notifyChange()
              "
            />
          </div>
          <div class="field">
            <label>Hintergrundfarbe</label>
            <div class="color-field">
              <input
                type="color"
                [value]="state.backgroundColor()"
                (input)="
                  state.backgroundColor.set($any($event.target).value);
                  state.notifyChange()
                "
              />
              <input
                type="text"
                [value]="state.backgroundColor()"
                (input)="
                  state.backgroundColor.set($any($event.target).value);
                  state.notifyChange()
                "
                class="color-text"
              />
            </div>
          </div>
          <div class="field">
            <label>Weiter-Button</label>
            <select
              [value]="state.continueButtonShow()"
              (change)="
                state.continueButtonShow.set($any($event.target).value);
                state.notifyChange()
              "
            >
              <option value="ALWAYS">Immer anzeigen</option>
              <option value="NO">Nie anzeigen</option>
              <option value="ON_ANY_RESPONSE">Bei Antwort</option>
              <option value="ON_RESPONSES_COMPLETE">
                Bei vollständiger Antwort
              </option>
              <option value="ON_MAIN_AUDIO_COMPLETE">Nach Audio</option>
              <option value="ON_VIDEO_COMPLETE">Nach Video</option>
              <option value="ON_AUDIO_AND_RESPONSE">
                Nach Audio und Antwort
              </option>
            </select>
          </div>
          <div class="field field-row">
            <label>
              <input
                type="checkbox"
                [checked]="state.ribbonBars()"
                (change)="
                  state.ribbonBars.set($any($event.target).checked);
                  state.notifyChange()
                "
              />
              Übungsleiste anzeigen
            </label>
          </div>
          <div class="field">
            <label>Max. Interaktionszeit (ms)</label>
            <input
              type="number"
              [value]="state.interactionMaxTimeMS()"
              (input)="
                state.interactionMaxTimeMS.set(+$any($event.target).value);
                state.notifyChange()
              "
              min="0"
            />
          </div>
        </div>
      }
    </section>
  `
})
export class GeneralSettingsComponent {
  state = inject(EditorStateService);
  collapsed = false;
}
