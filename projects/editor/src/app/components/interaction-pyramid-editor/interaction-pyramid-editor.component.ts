import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractionPyramidParams } from '@shared/models/unit-definition';
import { EditorStateService } from '../../services/editor-state.service';

@Component({
  selector: 'stars-interaction-pyramid-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="interaction-editor">
      <div class="field">
        <label>Variablen-ID</label>
        <input type="text" [value]="params.variableId" (input)="updateField('variableId', $any($event.target).value)">
      </div>
      <div class="field">
        <label>Spitzenzahl</label>
        <input type="number" [value]="params.topNumber" (input)="updateField('topNumber', +$any($event.target).value)">
      </div>
      <div class="sub-section">
        <div class="sub-header"><span>Beispiel (optional)</span></div>
        <div class="field field-row">
          <label>
            <input type="checkbox" [checked]="!!params.example" (change)="toggleExample($event)">
            Beispiel anzeigen
          </label>
        </div>
        @if (params.example) {
          <div class="field-row-group">
            <div class="field">
              <label>Spitze</label>
              <input type="number" [value]="params.example.topNumber" (input)="updateExample('topNumber', +$any($event.target).value)">
            </div>
            <div class="field">
              <label>Unten links</label>
              <input type="number" [value]="params.example.bottomLeftNumber" (input)="updateExample('bottomLeftNumber', +$any($event.target).value)">
            </div>
            <div class="field">
              <label>Unten rechts</label>
              <input type="number" [value]="params.example.bottomRightNumber" (input)="updateExample('bottomRightNumber', +$any($event.target).value)">
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .field-row-group { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .sub-section { margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; }
    .sub-header { font-size: 13px; font-weight: 600; color: #e2e8f0; margin-bottom: 8px; }
  `]
})
export class InteractionPyramidEditorComponent {
  state = inject(EditorStateService);

  get params(): InteractionPyramidParams {
    return this.state.interactionParams() as InteractionPyramidParams;
  }

  updateField(field: string, value: any): void {
    const current = { ...this.params };
    (current as any)[field] = value;
    this.state.interactionParams.set(current);
    this.state.notifyChange();
  }

  toggleExample(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current = { ...this.params };
    if (checked) {
      current.example = { topNumber: 10, bottomLeftNumber: 7, bottomRightNumber: 3 };
    } else {
      current.example = undefined;
    }
    this.state.interactionParams.set(current);
    this.state.notifyChange();
  }

  updateExample(field: string, value: number): void {
    const current = { ...this.params };
    if (current.example) {
      current.example = { ...current.example, [field]: value };
      this.state.interactionParams.set(current);
      this.state.notifyChange();
    }
  }
}
