import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitFormService } from '../services/unit-form.service';
import { ClosingMetaButtonsParams } from '../models/unit-definition';

@Component({
  selector: 'app-closing-meta-buttons-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>Closing Meta Buttons</h3>
    <div class="form-grid">
      <div class="form-group">
        <label>Variable ID Reference</label>
        <input [value]="params().variableIdReference" (input)="update('variableIdReference', $event)">
      </div>
      <div class="form-group">
        <label>Variable ID Meta Selection</label>
        <input [value]="params().variableIdMetaSelection || ''" (input)="update('variableIdMetaSelection', $event)">
      </div>
      <div class="form-group">
        <label>Variable ID Meta Outcome</label>
        <input [value]="params().variableIdMetaOutcome || ''" (input)="update('variableIdMetaOutcome', $event)">
      </div>
      <div class="form-group">
        <label>Audio Source</label>
        <input [value]="params().audioSource || ''" (input)="update('audioSource', $event)">
      </div>
      <div class="form-group checkbox-group">
        <label>
          <input type="checkbox" [checked]="params().autoPlay" (change)="updateCheck('autoPlay', $event)">
          Auto Play
        </label>
        <label>
          <input type="checkbox" [checked]="params().triggerNavigationOnSelect" (change)="updateCheck('triggerNavigationOnSelect', $event)">
          Trigger Navigation On Select
        </label>
      </div>
    </div>
  `,
  styles: [`
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .form-group { margin-bottom: 10px; display: flex; flex-direction: column; }
    .checkbox-group { flex-direction: row; gap: 20px; align-items: center; }
    label { font-size: 0.9em; font-weight: bold; }
    input { padding: 6px; border: 1px solid #ccc; border-radius: 3px; }
  `]
})
export class ClosingMetaButtonsFormComponent {
  formService = inject(UnitFormService);

  params = () => this.formService.unit().closingMetaButtons;

  update(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.formService.updateUnit({
      closingMetaButtons: { ...this.params(), [field]: value }
    });
  }

  updateCheck(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.formService.updateUnit({
      closingMetaButtons: { ...this.params(), [field]: value }
    });
  }
}
