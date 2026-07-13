import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitFormService } from '../services/unit-form.service';
import { InteractionNumberLineParams } from '../models/unit-definition';

@Component({
  selector: 'app-interaction-number-line-form',
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
        <label>First Number</label>
        <input type="number" [value]="params().firstNumber || 0"
               (input)="updateNumber('firstNumber', $event)">
      </div>
      <div class="form-group">
        <label>Last Number</label>
        <input type="number" [value]="params().lastNumber || 10"
               (input)="updateNumber('lastNumber', $event)">
      </div>
      <div class="form-group">
        <label>Number Input</label>
        <input type="number" [value]="params().numberInput || 0"
               (input)="updateNumber('numberInput', $event)">
      </div>
      <div class="form-group">
        <label>Style</label>
        <input [value]="params().style || ''"
               (input)="update('style', $event)">
      </div>
    </div>
  `,
  styles: [`
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .form-group { margin-bottom: 10px; display: flex; flex-direction: column; }
    label { font-weight: bold; margin-bottom: 4px; }
    input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
  `]
})
export class InteractionNumberLineFormComponent {
  formService = inject(UnitFormService);

  params = () => this.formService.unit().interactionParameters as InteractionNumberLineParams;

  update(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.formService.updateInteractionParameters({ [field]: value });
  }

  updateNumber(field: string, event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.formService.updateInteractionParameters({ [field]: value });
  }
}
