import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  InteractionButtonParams,
  IconButtonTypeEnum,
  SelectionOption
} from '@shared/models/unit-definition';
import { EditorStateService } from '../../services/editor-state.service';

@Component({
  selector: 'stars-interaction-buttons-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="interaction-editor">
      <div class="field">
        <label>Variablen-ID</label>
        <input
          type="text"
          [value]="params.variableId"
          (input)="updateField('variableId', $any($event.target).value)"
        />
      </div>
      <div class="field">
        <label>Button-Typ</label>
        <select
          [value]="params.buttonType"
          (change)="updateField('buttonType', $any($event.target).value)"
        >
          @for (opt of buttonTypes; track opt.value) {
            <option [value]="opt.value">{{ opt.label }}</option>
          }
        </select>
      </div>
      <div class="field-row-group">
        <div class="field">
          <label>Zeilen</label>
          <input
            type="number"
            [value]="params.numberOfRows"
            (input)="updateField('numberOfRows', +$any($event.target).value)"
            min="1"
            max="5"
          />
        </div>
        <div class="field">
          <label>Bildposition</label>
          <select
            [value]="params.imagePosition"
            (change)="updateField('imagePosition', $any($event.target).value)"
          >
            <option value="LEFT">Links</option>
            <option value="TOP">Oben</option>
            <option value="BOTTOM">Unten</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label>Layout</label>
        <select
          [value]="params.layout"
          (change)="updateField('layout', $any($event.target).value)"
        >
          <option value="LEFT_CENTER">Links zentriert</option>
          <option value="TOP_CENTER">Oben zentriert</option>
          <option value="LEFT_BOTTOM">Links unten</option>
          <option value="LEFT_CENTER_50">Links zentriert 50%</option>
        </select>
      </div>
      <div class="field field-row">
        <label
          ><input
            type="checkbox"
            [checked]="params.multiSelect"
            (change)="updateField('multiSelect', $any($event.target).checked)"
          />
          Mehrfachauswahl</label
        >
      </div>
      <div class="field field-row">
        <label
          ><input
            type="checkbox"
            [checked]="params.triggerNavigationOnSelect"
            (change)="
              updateField(
                'triggerNavigationOnSelect',
                $any($event.target).checked
              )
            "
          />
          Navigation bei Auswahl</label
        >
      </div>
      <div class="field field-row">
        <label
          ><input
            type="checkbox"
            [checked]="params.imageUseFullArea"
            (change)="
              updateField('imageUseFullArea', $any($event.target).checked)
            "
          />
          Bild: volle Fläche</label
        >
      </div>
      <div class="field">
        <label>Text</label>
        <input
          type="text"
          [value]="params.text"
          (input)="updateField('text', $any($event.target).value)"
        />
      </div>
      <div class="field">
        <label>Bild</label>
        <div class="upload-row">
          @if (params.imageSource) {
            <img
              [src]="params.imageSource"
              class="preview-thumb"
              alt="Btn Img"
            />
            <button class="btn-icon" (click)="updateField('imageSource', '')">
              ✕
            </button>
          }
          <label class="btn-upload">
            <span>{{ params.imageSource ? 'Ersetzen' : 'Bild wählen' }}</span>
            <input
              type="file"
              accept="image/*"
              (change)="onImageSelected($event)"
              hidden
            />
          </label>
        </div>
      </div>

      <!-- Button Options -->
      <div class="sub-section">
        <div class="sub-header">
          <span>Optionen ({{ buttons.length }})</span>
          <button class="btn-add" (click)="addButton()">+ Hinzufügen</button>
        </div>
        @for (btn of buttons; track $index) {
          <div class="option-card">
            <div class="option-header">
              <span class="option-index">#{{ $index + 1 }}</span>
              <button
                class="btn-icon btn-remove-sm"
                (click)="removeButton($index)"
              >
                ✕
              </button>
            </div>
            <div class="option-fields">
              <div class="field">
                <label>Text</label>
                <input
                  type="text"
                  [value]="btn.text"
                  (input)="
                    updateButton($index, 'text', $any($event.target).value)
                  "
                />
              </div>
              <div class="field">
                <label>Icon</label>
                <select
                  [value]="btn.icon || ''"
                  (change)="
                    updateButton(
                      $index,
                      'icon',
                      $any($event.target).value || undefined
                    )
                  "
                >
                  <option value="">Kein Icon</option>
                  @for (icon of iconTypes; track icon) {
                    <option [value]="icon">{{ icon }}</option>
                  }
                </select>
              </div>
              <div class="field">
                <label>Bild</label>
                <div class="upload-row">
                  @if (btn.imageSource) {
                    <img
                      [src]="btn.imageSource"
                      class="preview-thumb-sm"
                      alt="Opt"
                    />
                    <button
                      class="btn-icon"
                      (click)="updateButton($index, 'imageSource', '')"
                    >
                      ✕
                    </button>
                  }
                  <label class="btn-upload btn-upload-sm">
                    <span>Bild</span>
                    <input
                      type="file"
                      accept="image/*"
                      (change)="onOptionImageSelected($event, $index)"
                      hidden
                    />
                  </label>
                </div>
              </div>
              <div class="field">
                <label>Audio</label>
                <div class="upload-row">
                  @if (btn.audioSource) {
                    <span class="audio-badge-sm">🔊</span>
                    <button
                      class="btn-icon"
                      (click)="updateButton($index, 'audioSource', '')"
                    >
                      ✕
                    </button>
                  }
                  <label class="btn-upload btn-upload-sm">
                    <span>Audio</span>
                    <input
                      type="file"
                      accept="audio/*"
                      (change)="onOptionAudioSelected($event, $index)"
                      hidden
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .preview-thumb {
        max-width: 60px;
        max-height: 40px;
        border-radius: 4px;
      }
      .preview-thumb-sm {
        max-width: 40px;
        max-height: 30px;
        border-radius: 3px;
      }
      .upload-row {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }
      .audio-badge-sm {
        font-size: 14px;
      }
      .sub-section {
        margin-top: 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 8px;
      }
      .sub-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 600;
        color: #e2e8f0;
      }
      .btn-add {
        background: rgba(139, 92, 246, 0.2);
        color: #a78bfa;
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 4px;
        padding: 3px 10px;
        font-size: 11px;
        cursor: pointer;
      }
      .option-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        padding: 8px;
        margin-bottom: 6px;
      }
      .option-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
      }
      .option-index {
        font-size: 11px;
        color: #64748b;
        font-weight: 600;
      }
      .option-fields {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
      }
      .btn-remove-sm {
        width: 18px;
        height: 18px;
        font-size: 10px;
      }
      .field-row-group {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
    `
  ]
})
export class InteractionButtonsEditorComponent {
  state = inject(EditorStateService);

  buttonTypes = [
    { value: 'BIG_SQUARE', label: 'Groß (Quadrat)' },
    { value: 'MEDIUM_SQUARE', label: 'Mittel (Quadrat)' },
    { value: 'SMALL_SQUARE', label: 'Klein (Quadrat)' },
    { value: 'EXTRA_LARGE_SQUARE', label: 'Extra Groß (Quadrat)' },
    { value: 'TEXT', label: 'Text' },
    { value: 'CIRCLE', label: 'Kreis' },
    { value: 'LONG_RECTANGLE', label: 'Langes Rechteck' },
    { value: 'TALL_RECTANGLE', label: 'Hohes Rechteck' }
  ];

  iconTypes: IconButtonTypeEnum[] = [
    'CHECK_GREEN',
    'CLOSE_RED',
    'CLAP_HANDS',
    'SMILEY_1',
    'SMILEY_2',
    'SMILEY_3',
    'SMILEY_4',
    'SMILEY_5',
    'ONES',
    'TENS'
  ];

  get params(): InteractionButtonParams {
    return this.state.interactionParams() as InteractionButtonParams;
  }

  get buttons(): SelectionOption[] {
    return this.params.options?.buttons || [];
  }

  updateField(field: string, value: any): void {
    const current = { ...this.params };
    (current as any)[field] = value;
    this.state.interactionParams.set(current);
    this.state.notifyChange();
  }

  addButton(): void {
    const current = { ...this.params };
    const buttons = [...(current.options?.buttons || [])];
    buttons.push({ text: `Option ${buttons.length + 1}` });
    current.options = { ...current.options, buttons };
    this.state.interactionParams.set(current);
    this.state.notifyChange();
  }

  removeButton(index: number): void {
    const current = { ...this.params };
    const buttons = [...(current.options?.buttons || [])];
    buttons.splice(index, 1);
    current.options = { ...current.options, buttons };
    this.state.interactionParams.set(current);
    this.state.notifyChange();
  }

  updateButton(index: number, field: string, value: any): void {
    const current = { ...this.params };
    const buttons = [...(current.options?.buttons || [])];
    buttons[index] = { ...buttons[index], [field]: value };
    current.options = { ...current.options, buttons };
    this.state.interactionParams.set(current);
    this.state.notifyChange();
  }

  onImageSelected(event: Event): void {
    this.readFile(event, r => this.updateField('imageSource', r));
  }

  onOptionImageSelected(event: Event, index: number): void {
    this.readFile(event, r => this.updateButton(index, 'imageSource', r));
  }

  onOptionAudioSelected(event: Event, index: number): void {
    this.readFile(event, r => this.updateButton(index, 'audioSource', r));
  }

  private readFile(event: Event, cb: (r: string) => void): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => cb(reader.result as string);
    reader.readAsDataURL(file);
  }
}
