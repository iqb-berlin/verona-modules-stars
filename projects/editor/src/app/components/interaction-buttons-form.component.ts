import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitFormService } from '../services/unit-form.service';
import { InteractionButtonParams } from '../models/unit-definition';

@Component({
  selector: 'app-interaction-buttons-form',
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
        <label>Layout</label>
        <select [value]="params().layout || 'LEFT_CENTER'" (change)="update('layout', $event)">
          <option value="LEFT_CENTER">LEFT_CENTER</option>
          <option value="TOP_CENTER">TOP_CENTER</option>
          <option value="LEFT_BOTTOM">LEFT_BOTTOM</option>
          <option value="LEFT_CENTER_50">LEFT_CENTER_50</option>
        </select>
      </div>
      <div class="form-group">
        <label>Button Type</label>
        <select [value]="params().buttonType || 'MEDIUM_SQUARE'" (change)="update('buttonType', $event)">
          <option *ngFor="let type of buttonTypes" [value]="type">{{type}}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Number of Rows</label>
        <input type="number" [value]="params().numberOfRows || 1"
               (input)="updateNumber('numberOfRows', $event)">
      </div>
      <div class="form-group checkbox-group">
        <label>
          <input type="checkbox" [checked]="params().multiSelect"
                 (change)="updateCheck('multiSelect', $event)">
          Multi Select
        </label>
        <label>
          <input type="checkbox" [checked]="params().imageUseFullArea"
                 (change)="updateCheck('imageUseFullArea', $event)">
          Image Use Full Area
        </label>
        <label>
          <input type="checkbox" [checked]="params().triggerNavigationOnSelect"
                 (change)="updateCheck('triggerNavigationOnSelect', $event)">
          Trigger Navigation On Select
        </label>
      </div>
    </div>

    <div class="sub-section">
      <h4>Options</h4>
      <div *ngFor="let opt of params().options?.buttons || []; let i = index" class="option-block">
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
    .checkbox-group { justify-content: space-around; }
    .sub-section { margin-top: 15px; padding: 10px; border: 1px solid #eee; border-radius: 4px; }
    .option-block { display: flex; gap: 5px; margin-bottom: 5px; }
    label { font-weight: bold; margin-bottom: 4px; }
    input, select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
  `]
})
export class InteractionButtonsFormComponent {
  formService = inject(UnitFormService);

  params = () => this.formService.unit().interactionParameters as InteractionButtonParams;

  buttonTypes: string[] = [
    'MEDIUM_SQUARE', 'BIG_SQUARE', 'SMALL_SQUARE', 'EXTRA_SMALL_SQUARE',
    'TEXT', 'CIRCLE', 'EXTRA_LARGE_SQUARE', 'LONG_RECTANGLE', 'TALL_RECTANGLE'
  ];

  update(field: string, event: Event) {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
    this.formService.updateInteractionParameters({ [field]: value });
  }

  updateNumber(field: string, event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.formService.updateInteractionParameters({ [field]: value });
  }

  updateCheck(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.formService.updateInteractionParameters({ [field]: value });
  }

  addOption() {
    const current = this.params();
    const buttons = [...(current.options?.buttons || [])];
    buttons.push({ text: 'New Option' });
    this.formService.updateInteractionParameters({
      options: { ...current.options, buttons }
    });
  }

  removeOption(index: number) {
    const current = this.params();
    const buttons = [...(current.options?.buttons || [])];
    buttons.splice(index, 1);
    this.formService.updateInteractionParameters({
      options: { ...current.options, buttons }
    });
  }

  updateOption(index: number, field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const current = this.params();
    const buttons = JSON.parse(JSON.stringify(current.options?.buttons || []));
    buttons[index][field] = value;
    this.formService.updateInteractionParameters({
      options: { ...current.options, buttons }
    });
  }
}
