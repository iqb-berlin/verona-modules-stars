import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitFormService } from '../services/unit-form.service';
import { InteractionVideoParams } from '../models/unit-definition';

@Component({
  selector: 'app-interaction-video-form',
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
        <label>Video Source</label>
        <input [value]="params().videoSource || ''"
               (input)="update('videoSource', $event)">
      </div>
      <div class="form-group">
        <label>Image Source (Poster)</label>
        <input [value]="params().imageSource || ''"
               (input)="update('imageSource', $event)">
      </div>
      <div class="form-group">
        <label>Text</label>
        <input [value]="params().text || ''"
               (input)="update('text', $event)">
      </div>
      <div class="form-group checkbox-group">
        <label>
          <input type="checkbox" [checked]="params().triggerNavigationOnEnd"
                 (change)="updateCheck('triggerNavigationOnEnd', $event)">
          Trigger Navigation On End
        </label>
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
export class InteractionVideoFormComponent {
  formService = inject(UnitFormService);

  params = () => this.formService.unit().interactionParameters as InteractionVideoParams;

  update(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.formService.updateInteractionParameters({ [field]: value });
  }

  updateCheck(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.formService.updateInteractionParameters({ [field]: value });
  }
}
