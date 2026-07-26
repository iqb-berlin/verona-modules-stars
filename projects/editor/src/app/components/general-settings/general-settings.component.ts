import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClosingMetaButtonsParams } from '@shared/models/unit-definition';
import { EditorStateService } from '../../services/editor-state.service';
import { MediaUploadComponent } from '../media-upload/media-upload.component';

@Component({
  selector: 'stars-general-settings',
  standalone: true,
  imports: [CommonModule, MediaUploadComponent],
  template: `
    <section class="editor-section">
      <h3 class="section-title" (click)="collapsed = !collapsed">
        <span class="collapse-icon">{{ collapsed ? '▶' : '▼' }}</span>
        Allgemeine Einstellungen
      </h3>
      @if (!collapsed) {
        <div class="section-body">
          <div class="field">
            <label>Definition-ID</label>
            <input
              type="text"
              [value]="state.unitId()"
              readonly
            />
          </div>
          <div class="field">
            <label>Version</label>
            <input
              type="text"
              [value]="state.unitVersion()"
              (input)="state.updateUnitVersion($any($event.target).value)"
            />
          </div>
          <div class="field">
            <label>Hintergrundfarbe</label>
            <div class="color-field">
              <input
                type="color"
                [value]="state.backgroundColor()"
                (input)="state.updateBackgroundColor($any($event.target).value)"
              />
              <input
                type="text"
                [value]="state.backgroundColor()"
                (input)="state.updateBackgroundColor($any($event.target).value)"
                class="color-text"
              />
            </div>
          </div>
          <div class="field">
            <label>Weiter-Button</label>
            <select
              [value]="state.continueButtonShow()"
              (change)="state.updateContinueButtonShow($any($event.target).value)"
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
                (change)="state.updateRibbonBars($any($event.target).checked)"
              />
              Übungsleiste anzeigen
            </label>
          </div>

          <div class="sub-section">
            <div class="field field-row">
              <label>
                <input
                  type="checkbox"
                  [checked]="!!state.closingMetaButtons()"
                  (change)="toggleClosingMetaButtons($any($event.target).checked)"
                />
                Closing Meta Buttons konfigurieren
              </label>
            </div>

            @if (state.closingMetaButtons(); as closingMetaButtons) {
              <div class="field">
                <label>Referenz-Variable</label>
                <input
                  type="text"
                  [value]="closingMetaButtons.variableIdReference"
                  (input)="updateClosingMetaButtons('variableIdReference', $any($event.target).value)"
                />
              </div>
              <div class="field-row-group">
                <div class="field">
                  <label>Meta Selection ID</label>
                  <input
                    type="text"
                    [value]="closingMetaButtons.variableIdMetaSelection || ''"
                    (input)="updateClosingMetaButtons('variableIdMetaSelection', $any($event.target).value)"
                  />
                </div>
                <div class="field">
                  <label>Meta Outcome ID</label>
                  <input
                    type="text"
                    [value]="closingMetaButtons.variableIdMetaOutcome || ''"
                    (input)="updateClosingMetaButtons('variableIdMetaOutcome', $any($event.target).value)"
                  />
                </div>
              </div>
              <stars-media-upload
                label="Closing-Meta-Audio"
                type="audio"
                [source]="closingMetaButtons.audioSource || ''"
                (sourceChange)="updateClosingMetaButtons('audioSource', $event)"
              >
              </stars-media-upload>
              <div class="field-row-group">
                <div class="field field-row">
                  <label>
                    <input
                      type="checkbox"
                      [checked]="closingMetaButtons.autoPlay || false"
                      (change)="updateClosingMetaButtons('autoPlay', $any($event.target).checked)"
                    />
                    Audio automatisch abspielen
                  </label>
                </div>
                <div class="field field-row">
                  <label>
                    <input
                      type="checkbox"
                      [checked]="closingMetaButtons.triggerNavigationOnSelect !== false"
                      (change)="updateClosingMetaButtons('triggerNavigationOnSelect', $any($event.target).checked)"
                    />
                    Navigation bei Auswahl
                  </label>
                </div>
              </div>
            }
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
    .field-row-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
  `]
})
export class GeneralSettingsComponent {
  state = inject(EditorStateService);
  collapsed = false;

  toggleClosingMetaButtons(enabled: boolean): void {
    if (enabled) {
      const currentVariableId = (this.state.interactionParams() as { variableId?: string }).variableId || 'BUTTONS';
      this.state.setClosingMetaButtons({
        audioSource: '',
        autoPlay: false,
        variableIdReference: currentVariableId,
        variableIdMetaSelection: 'META_SELECTION',
        variableIdMetaOutcome: 'META_OUTCOME',
        triggerNavigationOnSelect: true
      });
    } else {
      this.state.setClosingMetaButtons(undefined);
    }
  }

  updateClosingMetaButtons(
    field: keyof ClosingMetaButtonsParams,
    value: string | boolean
  ): void {
    const current = this.state.closingMetaButtons();
    if (!current) {
      return;
    }
    this.state.setClosingMetaButtons({
      ...current,
      [field]: value
    });
  }
}
