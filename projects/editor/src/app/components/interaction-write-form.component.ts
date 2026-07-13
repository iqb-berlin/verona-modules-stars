import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitFormService } from '../services/unit-form.service';
import { InteractionWriteParams } from '../models/unit-definition';

@Component({
  selector: 'app-interaction-write-form',
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
        <label>Keyboard Mode</label>
        <select [value]="params().keyboardMode || 'CHARACTERS'"
                (change)="update('keyboardMode', $event)">
          <option value="CHARACTERS">Characters</option>
          <option value="NUMBERS_LINE">Numbers Line</option>
        </select>
      </div>
      <div class="form-group">
        <label>Max Input Length</label>
        <input type="number" [value]="params().maxInputLength || 0"
               (input)="updateNumber('maxInputLength', $event)">
      </div>
      <div class="form-group checkbox-group">
        <label>
          <input type="checkbox" [checked]="params().addBackspaceKey"
                 (change)="updateCheck('addBackspaceKey', $event)">
          Add Backspace Key
        </label>
        <label>
          <input type="checkbox" [checked]="params().addUmlautKeys"
                 (change)="updateCheck('addUmlautKeys', $event)">
          Add Umlaut Keys
        </label>
      </div>
    </div>
  `,
  styles: [`
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .form-group { margin-bottom: 10px; display: flex; flex-direction: column; }
    .checkbox-group { justify-content: space-around; }
    label { font-weight: bold; margin-bottom: 4px; }
    input, select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
  `]
})
export class InteractionWriteFormComponent {
  formService = inject(UnitFormService);

  params = () => this.formService.unit().interactionParameters as InteractionWriteParams;

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
}
