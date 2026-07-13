import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitFormService } from '../services/unit-form.service';
import { AudioFeedback, FeedbackDefinition } from '../models/feedback';

@Component({
  selector: 'app-audio-feedback-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>Audio Feedback</h3>
    <div class="form-group">
      <label>Trigger</label>
      <select [value]="formService.unit().audioFeedback?.trigger || 'ANY_RESPONSE'"
              (change)="updateTrigger($event)">
        <option value="ANY_RESPONSE">ANY_RESPONSE</option>
        <option value="CONTINUE_BUTTON_CLICK">CONTINUE_BUTTON_CLICK</option>
      </select>
    </div>

    <div *ngFor="let feedback of formService.unit().audioFeedback?.feedback || []; let i = index" class="feedback-block">
      <div class="form-grid">
        <div class="form-group">
          <label>Variable ID</label>
          <input [value]="feedback.variableId" (input)="updateFeedback(i, 'variableId', $event)">
        </div>
        <div class="form-group">
          <label>Source</label>
          <select [value]="feedback.source || 'VALUE'" (change)="updateFeedback(i, 'source', $event)">
            <option value="VALUE">VALUE</option>
            <option value="CODE">CODE</option>
            <option value="SCORE">SCORE</option>
          </select>
        </div>
        <div class="form-group">
          <label>Method</label>
          <select [value]="feedback.method || 'EQUALS'" (change)="updateFeedback(i, 'method', $event)">
            <option value="EQUALS">EQUALS</option>
            <option value="GREATER_THAN">GREATER_THAN</option>
            <option value="LESS_THAN">LESS_THAN</option>
          </select>
        </div>
        <div class="form-group">
          <label>Parameter</label>
          <input [value]="feedback.parameter" (input)="updateFeedback(i, 'parameter', $event)">
        </div>
        <div class="form-group">
          <label>Audio Source</label>
          <input [value]="feedback.audioSource" (input)="updateFeedback(i, 'audioSource', $event)">
        </div>
      </div>
      <button class="remove-btn" (click)="removeFeedback(i)">Remove Feedback</button>
    </div>
    <button (click)="addFeedback()">Add Feedback Rule</button>
  `,
  styles: [`
    .feedback-block { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 4px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
    .form-group { margin-bottom: 10px; display: flex; flex-direction: column; }
    label { font-size: 0.9em; font-weight: bold; }
    input, select { padding: 6px; border: 1px solid #ccc; border-radius: 3px; }
    .remove-btn { background: #fee; color: #c00; border: 1px solid #c00; padding: 4px 8px; cursor: pointer; margin-top: 5px; }
  `]
})
export class AudioFeedbackFormComponent {
  formService = inject(UnitFormService);

  updateTrigger(event: Event) {
    const trigger = (event.target as HTMLSelectElement).value as any;
    const current = this.formService.unit().audioFeedback || { trigger: 'ANY_RESPONSE', feedback: [] };
    this.formService.updateUnit({ audioFeedback: { ...current, trigger } });
  }

  addFeedback() {
    const current = this.formService.unit().audioFeedback || { trigger: 'ANY_RESPONSE', feedback: [] };
    const feedback = [...current.feedback];
    feedback.push({
      variableId: '',
      parameter: '',
      audioSource: '',
      source: 'VALUE',
      method: 'EQUALS'
    });
    this.formService.updateUnit({ audioFeedback: { ...current, feedback } });
  }

  removeFeedback(index: number) {
    const current = this.formService.unit().audioFeedback!;
    const feedback = [...current.feedback];
    feedback.splice(index, 1);
    this.formService.updateUnit({ audioFeedback: { ...current, feedback } });
  }

  updateFeedback(index: number, field: string, event: Event) {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
    const current = JSON.parse(JSON.stringify(this.formService.unit().audioFeedback));
    current.feedback[index][field] = value;
    this.formService.updateUnit({ audioFeedback: current });
  }
}
