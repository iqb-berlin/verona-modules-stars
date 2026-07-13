import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitFormService } from '../services/unit-form.service';
import { InteractionPlaceValueParams } from '../models/unit-definition';

@Component({
  selector: 'app-interaction-place-value-form',
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
        <label>Value</label>
        <input type="number" [value]="params().value"
               (input)="updateNumber('value', $event)">
      </div>
      <div class="form-group">
        <label>Max Number of Tens</label>
        <input type="number" [value]="params().maxNumberOfTens || 0"
               (input)="updateNumber('maxNumberOfTens', $event)">
      </div>
      <div class="form-group">
        <label>Max Number of Ones</label>
        <input type="number" [value]="params().maxNumberOfOnes || 0"
               (input)="updateNumber('maxNumberOfOnes', $event)">
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
export class InteractionPlaceValueFormComponent {
  formService = inject(UnitFormService);

  params = () => this.formService.unit().interactionParameters as InteractionPlaceValueParams;

  update(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.formService.updateInteractionParameters({ [field]: value });
  }

  updateNumber(field: string, event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.formService.updateInteractionParameters({ [field]: value });
  }
}
