import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorStateService } from '../../services/editor-state.service';
import { AudioFeedback, FeedbackDefinition } from '@shared/models/feedback';
import { MediaUploadComponent } from '../media-upload/media-upload.component';

@Component({
  selector: 'stars-audio-feedback-editor',
  standalone: true,
  imports: [CommonModule, MediaUploadComponent],
  template: `
    <section class="editor-section">
      <h3 class="section-title" (click)="collapsed = !collapsed">
        <span class="collapse-icon">{{ collapsed ? '▶' : '▼' }}</span>
        Audio-Feedback ({{ feedbackItems.length }})
      </h3>
      @if (!collapsed) {
        <div class="section-body">
          <div class="field field-row">
            <label>
              <input type="checkbox" [checked]="!!state.audioFeedback()" (change)="toggleFeedback($event)">
              Feedback aktivieren
            </label>
          </div>
          @if (state.audioFeedback()) {
            <div class="field">
              <label>Auslöser</label>
              <select [value]="state.audioFeedback()?.trigger" (change)="updateFeedback('trigger', $any($event.target).value)">
                <option value="CONTINUE_BUTTON_CLICK">Weiter-Button Klick</option>
                <option value="ANY_RESPONSE">Bei jeder Antwort</option>
              </select>
            </div>
            
            <div class="sub-section">
              <div class="sub-header">
                <span>Regeln</span>
                <button class="btn-add" (click)="addRule()">+ Regel</button>
              </div>
              @for (rule of feedbackItems; track $index) {
                <div class="option-card">
                  <div class="option-header">
                    <span class="option-index">Regel #{{ $index + 1 }}</span>
                    <button class="btn-icon btn-remove-sm" (click)="removeRule($index)">✕</button>
                  </div>
                  <div class="field">
                    <label>Variable</label>
                    <input type="text" [value]="rule.variableId" (input)="updateRule($index, 'variableId', $any($event.target).value)">
                  </div>
                  <div class="field-row-group">
                    <div class="field">
                      <label>Methode</label>
                      <select [value]="rule.method || 'EQUALS'" (change)="updateRule($index, 'method', $any($event.target).value)">
                        <option value="EQUALS">Gleich (=)</option>
                        <option value="GREATER_THAN">Größer (>)</option>
                        <option value="LESS_THAN">Kleiner (<)</option>
                      </select>
                    </div>
                    <div class="field">
                      <label>Parameter</label>
                      <input type="text" [value]="rule.parameter" (input)="updateRule($index, 'parameter', $any($event.target).value)">
                    </div>
                  </div>
                  <stars-media-upload 
                    label="Audio" 
                    type="audio" 
                    [source]="rule.audioSource" 
                    (sourceChange)="updateRule($index, 'audioSource', $event)">
                  </stars-media-upload>
                </div>
              }
            </div>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .sub-section { margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; }
    .sub-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 13px; font-weight: 600; color: #e2e8f0; }
    .btn-add { background: rgba(139, 92, 246, 0.2); color: #a78bfa; border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 4px; padding: 3px 10px; font-size: 11px; cursor: pointer; }
    .option-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 8px; margin-bottom: 6px; }
    .option-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .option-index { font-size: 11px; color: #64748b; font-weight: 600; }
    .field-row-group { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .btn-remove-sm { width: 18px; height: 18px; font-size: 10px; }
  `]
})
export class AudioFeedbackEditorComponent {
  state = inject(EditorStateService);
  collapsed = true;

  get feedbackItems(): FeedbackDefinition[] {
    return this.state.audioFeedback()?.feedback || [];
  }

  toggleFeedback(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.state.audioFeedback.set({ trigger: 'CONTINUE_BUTTON_CLICK', feedback: [] });
    } else {
      this.state.audioFeedback.set(undefined);
    }
    this.state.notifyChange();
  }

  updateFeedback(field: string, value: any): void {
    const current = this.state.audioFeedback();
    if (current) {
      this.state.audioFeedback.set({ ...current, [field]: value });
      this.state.notifyChange();
    }
  }

  addRule(): void {
    const current = this.state.audioFeedback();
    if (current) {
      const feedback = [...(current.feedback || [])];
      feedback.push({ variableId: '', parameter: '', audioSource: '', method: 'EQUALS' });
      this.state.audioFeedback.set({ ...current, feedback });
      this.state.notifyChange();
    }
  }

  removeRule(index: number): void {
    const current = this.state.audioFeedback();
    if (current) {
      const feedback = [...(current.feedback || [])];
      feedback.splice(index, 1);
      this.state.audioFeedback.set({ ...current, feedback });
      this.state.notifyChange();
    }
  }

  updateRule(index: number, field: string, value: any): void {
    const current = this.state.audioFeedback();
    if (current) {
      const feedback = [...(current.feedback || [])];
      feedback[index] = { ...feedback[index], [field]: value };
      this.state.audioFeedback.set({ ...current, feedback });
      this.state.notifyChange();
    }
  }
}
