import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitFormService } from '../services/unit-form.service';
import { InteractionPolygonButtonsParams } from '../models/unit-definition';

@Component({
  selector: 'app-interaction-polygon-buttons-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-grid">
      <div class="form-group">
        <label>Variable ID</label>
        <input [value]="params().variableId || ''"
               (input)="update('variableId', $event)">
      </div>
      <div class="form-group checkbox-group">
        <label>
          <input type="checkbox" [checked]="params().multiSelect"
                 (change)="updateCheck('multiSelect', $event)">
          Multi Select
        </label>
      </div>
    </div>

    <div class="sub-section">
      <h4>Options (Polygons)</h4>
      <div *ngFor="let opt of params().options || []; let i = index" class="option-block">
        <input [value]="opt.text || ''" placeholder="Text" (input)="updateOption(i, 'text', $event)">
        <input [value]="opt.svgPath || ''" placeholder="SVG Path" (input)="updateOption(i, 'svgPath', $event)">
        <button (click)="removeOption(i)">x</button>
      </div>
      <button (click)="addOption()">Add Polygon Option</button>
    </div>
  `,
  styles: [`
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .form-group { margin-bottom: 10px; display: flex; flex-direction: column; }
    .sub-section { margin-top: 15px; padding: 10px; border: 1px solid #eee; border-radius: 4px; }
    .option-block { display: flex; gap: 5px; margin-bottom: 5px; }
    label { font-weight: bold; margin-bottom: 4px; }
    input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
  `]
})
export class InteractionPolygonButtonsFormComponent {
  formService = inject(UnitFormService);

  params = () => this.formService.unit().interactionParameters as InteractionPolygonButtonsParams;

  update(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.formService.updateInteractionParameters({ [field]: value });
  }

  updateCheck(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.formService.updateInteractionParameters({ [field]: value });
  }

  addOption() {
    const current = this.params();
    const options = [...(current.options || [])];
    options.push({ text: 'New Polygon', svgPath: '' });
    this.formService.updateInteractionParameters({ options });
  }

  removeOption(index: number) {
    const current = this.params();
    const options = [...(current.options || [])];
    options.splice(index, 1);
    this.formService.updateInteractionParameters({ options });
  }

  updateOption(index: number, field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const current = this.params();
    const options = JSON.parse(JSON.stringify(current.options || []));
    options[index][field] = value;
    this.formService.updateInteractionParameters({ options });
  }
}
