import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitFormService } from '../services/unit-form.service';
import { InteractionDropParams, DropButtonTypeEnum, ImagePositionEnum } from '../models/unit-definition';

@Component({
  selector: 'app-interaction-drop-form',
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
        <label>Image Position</label>
        <select [value]="params().imagePosition || 'TOP'" (change)="update('imagePosition', $event)">
          <option value="TOP">TOP</option>
          <option value="LEFT">LEFT</option>
          <option value="BOTTOM">BOTTOM</option>
        </select>
      </div>
      <div class="form-group">
        <label>Button Type</label>
        <select [value]="params().buttonType || 'SMALL_SQUARE'" (change)="update('buttonType', $event)">
          <option value="SMALL_SQUARE">SMALL_SQUARE</option>
          <option value="EXTRA_SMALL_SQUARE">EXTRA_SMALL_SQUARE</option>
        </select>
      </div>
      <div class="form-group">
        <label>Image Landing XY</label>
        <input [value]="params().imageLandingXY || ''"
               (input)="update('imageLandingXY', $event)"
               placeholder="e.g. 100,200">
      </div>
    </div>

    <div class="sub-section">
      <h4>Options</h4>
      <div *ngFor="let opt of params().options || []; let i = index" class="option-block">
        <input [value]="opt.text || ''" placeholder="Text" (input)="updateOption(i, 'text', $event)">
        <input [value]="opt.imageSource || ''" placeholder="Image Source" (input)="updateOption(i, 'imageSource', $event)">
        <button (click)="removeOption(i)">x</button>
      </div>
      <button (click)="addOption()">Add Option</button>
    </div>
  `,
  styles: [`
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .form-group { margin-bottom: 10px; display: flex; flex-direction: column; }
    .sub-section { margin-top: 15px; padding: 10px; border: 1px solid #eee; border-radius: 4px; }
    .option-block { display: flex; gap: 5px; margin-bottom: 5px; }
    label { font-weight: bold; margin-bottom: 4px; }
    input, select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
  `]
})
export class InteractionDropFormComponent {
  formService = inject(UnitFormService);

  params = () => this.formService.unit().interactionParameters as InteractionDropParams;

  update(field: string, event: Event) {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
    this.formService.updateInteractionParameters({ [field]: value });
  }

  addOption() {
    const current = this.params();
    const options = [...(current.options || [])];
    options.push({ text: 'New Option' });
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
