import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitFormService } from '../services/unit-form.service';
import { InteractionFindOnImageParams } from '../models/unit-definition';

@Component({
  selector: 'app-interaction-find-on-image-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-grid">
      <div class="form-group">
        <label>Variable ID</label>
        <input [value]="params().variableId || ''"
               (input)="update('variableId', $event)">
      </div>
      <div class="form-group">
        <label>Image Source</label>
        <input [value]="params().imageSource || ''"
               (input)="update('imageSource', $event)">
      </div>
      <div class="form-group">
        <label>Text</label>
        <input [value]="params().text || ''"
               (input)="update('text', $event)">
      </div>
      <div class="form-group">
        <label>Show Area (SVG path or rect)</label>
        <input [value]="params().showArea || ''"
               (input)="update('showArea', $event)">
      </div>
      <div class="form-group">
        <label>Target Size</label>
        <select [value]="params().size || 'MEDIUM'" (change)="update('size', $event)">
          <option value="SMALL">SMALL</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LARGE">LARGE</option>
        </select>
      </div>
    </div>
  `,
  styles: [`
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .form-group { margin-bottom: 10px; display: flex; flex-direction: column; }
    label { font-weight: bold; margin-bottom: 4px; }
    input, select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
  `]
})
export class InteractionFindOnImageFormComponent {
  formService = inject(UnitFormService);

  params = () => this.formService.unit().interactionParameters as InteractionFindOnImageParams;

  update(field: string, event: Event) {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
    this.formService.updateInteractionParameters({ [field]: value });
  }
}
