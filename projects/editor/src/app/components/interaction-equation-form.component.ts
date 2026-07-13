import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitFormService } from '../services/unit-form.service';
import { InteractionEquationParams } from '../models/unit-definition';

@Component({
  selector: 'app-interaction-equation-form',
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
        <label>Fix Operand 1</label>
        <input type="number" [value]="params().fixOperand1"
               (input)="updateNumber('fixOperand1', $event)">
      </div>
      <div class="form-group">
        <label>Fix Operand 2</label>
        <input type="number" [value]="params().fixOperand2"
               (input)="updateNumber('fixOperand2', $event)">
      </div>
      <div class="form-group">
        <label>Fix Result</label>
        <input type="number" [value]="params().fixResult"
               (input)="updateNumber('fixResult', $event)">
      </div>
      <div class="form-group">
        <label>Operators (comma separated)</label>
        <input [value]="params().operators.join(',')"
               (input)="updateOperators($event)">
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
export class InteractionEquationFormComponent {
  formService = inject(UnitFormService);

  params = () => this.formService.unit().interactionParameters as InteractionEquationParams;

  update(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.formService.updateInteractionParameters({ [field]: value });
  }

  updateNumber(field: string, event: Event) {
    const valStr = (event.target as HTMLInputElement).value;
    const value = valStr === '' ? undefined : parseInt(valStr, 10);
    this.formService.updateInteractionParameters({ [field]: value });
  }

  updateOperators(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const operators = value.split(',').map(s => s.trim()).filter(s => s !== '');
    this.formService.updateInteractionParameters({ operators });
  }
}
