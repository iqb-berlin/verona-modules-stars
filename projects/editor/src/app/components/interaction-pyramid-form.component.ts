import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitFormService } from '../services/unit-form.service';
import { InteractionPyramidParams } from '../models/unit-definition';

@Component({
  selector: 'app-interaction-pyramid-form',
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
        <label>Top Number</label>
        <input type="number" [value]="params().topNumber"
               (input)="updateNumber('topNumber', $event)">
      </div>
    </div>

    <div class="sub-section">
      <h4>Example</h4>
      <div class="form-grid">
        <div class="form-group">
          <label>Top Number</label>
          <input type="number" [value]="params().example?.topNumber || 0"
                 (input)="updateExample('topNumber', $event)">
        </div>
        <div class="form-group">
          <label>Bottom Left Number</label>
          <input type="number" [value]="params().example?.bottomLeftNumber || 0"
                 (input)="updateExample('bottomLeftNumber', $event)">
        </div>
        <div class="form-group">
          <label>Bottom Right Number</label>
          <input type="number" [value]="params().example?.bottomRightNumber || 0"
                 (input)="updateExample('bottomRightNumber', $event)">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .form-group { margin-bottom: 10px; display: flex; flex-direction: column; }
    .sub-section { margin-top: 15px; padding: 10px; border: 1px solid #eee; border-radius: 4px; }
    label { font-weight: bold; margin-bottom: 4px; }
    input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
  `]
})
export class InteractionPyramidFormComponent {
  formService = inject(UnitFormService);

  params = () => this.formService.unit().interactionParameters as InteractionPyramidParams;

  update(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.formService.updateInteractionParameters({ [field]: value });
  }

  updateNumber(field: string, event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.formService.updateInteractionParameters({ [field]: value });
  }

  updateExample(field: string, event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    const example = { ...(this.params().example || { topNumber: 0, bottomLeftNumber: 0, bottomRightNumber: 0 }), [field]: value };
    this.formService.updateInteractionParameters({ example });
  }
}
