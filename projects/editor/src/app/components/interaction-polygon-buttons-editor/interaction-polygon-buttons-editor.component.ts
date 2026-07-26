import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractionPolygonButtonsParams, SelectionOption } from '@shared/models/unit-definition';
import { EditorStateService } from '../../services/editor-state.service';

@Component({
  selector: 'stars-interaction-polygon-buttons-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="interaction-editor">
      <div class="field">
        <label>Variablen-ID</label>
        <input type="text" [value]="params.variableId || ''" (input)="updateField('variableId', $any($event.target).value)">
      </div>
      <div class="field field-row">
        <label><input type="checkbox" [checked]="params.multiSelect" (change)="updateField('multiSelect', $any($event.target).checked)"> Mehrfachauswahl</label>
      </div>
      <div class="sub-section">
        <div class="sub-header">
          <span>Polygon-Optionen ({{ options.length }})</span>
          <button class="btn-add" (click)="addOption()">+ Hinzufügen</button>
        </div>
        @for (opt of options; track $index) {
          <div class="option-card">
            <div class="option-header">
              <span class="option-index">#{{ $index + 1 }}</span>
              <button class="btn-icon btn-remove-sm" (click)="removeOption($index)">✕</button>
            </div>
            <div class="field">
              <label>Label</label>
              <input type="text" [value]="opt.label" (input)="updateOption($index, 'label', $any($event.target).value)">
            </div>
            <div class="field">
              <label>SVG-Pfad</label>
              <textarea [value]="opt.svgPath || ''" (input)="updateOption($index, 'svgPath', $any($event.target).value)" rows="2"></textarea>
            </div>
            <div class="field">
              <label>Bild</label>
              <div class="upload-row">
                @if (opt.imageSource) {
                  <img [src]="opt.imageSource" class="preview-thumb-sm" alt="Poly">
                  <button class="btn-icon" (click)="updateOption($index, 'imageSource', '')">✕</button>
                }
                <label class="btn-upload btn-upload-sm">
                  <span>Bild</span>
                  <input type="file" accept="image/*" (change)="onOptionImageSelected($event, $index)" hidden>
                </label>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .preview-thumb-sm { max-width: 40px; max-height: 30px; border-radius: 3px; }
    .upload-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .sub-section { margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; }
    .sub-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 13px; font-weight: 600; color: #e2e8f0; }
    .btn-add { background: rgba(139, 92, 246, 0.2); color: #a78bfa; border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 4px; padding: 3px 10px; font-size: 11px; cursor: pointer; }
    .option-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 8px; margin-bottom: 6px; }
    .option-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .option-index { font-size: 11px; color: #64748b; font-weight: 600; }
    .btn-remove-sm { width: 18px; height: 18px; font-size: 10px; }
    textarea { width: 100%; background: #0f172a; border: 1px solid #334155; border-radius: 4px; color: #e2e8f0; padding: 6px; font-size: 12px; font-family: monospace; resize: vertical; }
  `]
})
export class InteractionPolygonButtonsEditorComponent {
  state = inject(EditorStateService);

  get params(): InteractionPolygonButtonsParams {
    return this.state.interactionParams() as InteractionPolygonButtonsParams;
  }

  get options(): SelectionOption[] {
    return this.params.options || [];
  }

  updateField<K extends keyof InteractionPolygonButtonsParams>(
    field: K,
    value: InteractionPolygonButtonsParams[K]
  ): void {
    const current = { ...this.params };
    current[field] = value;
    this.state.setInteractionParams(current);
  }

  addOption(): void {
    const current = { ...this.params };
    const options = [...(current.options || [])];
    options.push({ label: `Polygon ${options.length + 1}` });
    current.options = options;
    this.state.setInteractionParams(current);
  }

  removeOption(index: number): void {
    const current = { ...this.params };
    const options = [...(current.options || [])];
    options.splice(index, 1);
    current.options = options;
    this.state.setInteractionParams(current);
  }

  updateOption<K extends keyof SelectionOption>(index: number, field: K, value: SelectionOption[K]): void {
    const current = { ...this.params };
    const options = [...(current.options || [])];
    options[index] = { ...options[index], [field]: value };
    current.options = options;
    this.state.setInteractionParams(current);
  }

  onOptionImageSelected(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.updateOption(index, 'imageSource', reader.result as string);
    reader.readAsDataURL(file);
  }
}
