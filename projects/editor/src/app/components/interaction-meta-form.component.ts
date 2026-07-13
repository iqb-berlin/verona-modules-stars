import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitFormService } from '../services/unit-form.service';
import { InteractionMetaParams } from '../models/unit-definition';

@Component({
  selector: 'app-interaction-meta-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-grid">
      <div class="form-group">
        <label>Variable ID</label>
        <input [value]="params().variableId || ''"
               (input)="update('variableId', $event)">
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
export class InteractionMetaFormComponent {
  formService = inject(UnitFormService);

  params = () => this.formService.unit().interactionParameters as InteractionMetaParams;

  update(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.formService.updateInteractionParameters({ [field]: value });
  }
}
