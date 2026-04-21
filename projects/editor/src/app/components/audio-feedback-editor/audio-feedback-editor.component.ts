import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackDefinition, ShowResponse } from '@shared/models/feedback';
import { EditorStateService } from '../../services/editor-state.service';
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
              <input
                type="checkbox"
                [checked]="!!state.audioFeedback()"
                (change)="toggleFeedback($event)"
              />
              Feedback aktivieren
            </label>
          </div>
          @if (state.audioFeedback()) {
            <div class="field">
              <label>Auslöser</label>
              <select
                [value]="state.audioFeedback()?.trigger"
                (change)="updateFeedback('trigger', $any($event.target).value)"
              >
                <option value="CONTINUE_BUTTON_CLICK">Weiter-Button Klick</option>
                <option value="ANY_RESPONSE">Bei jeder Antwort</option>
              </select>
            </div>

            <div class="sub-section">
              <div class="sub-header">
                <span>Regeln</span>
                <button class="btn-add" (click)="addRule()">+ Regel</button>
              </div>

              @if (feedbackItems.length === 0) {
                <div class="empty-state">
                  Noch keine Feedback-Regel vorhanden.
                </div>
              }

              @for (rule of feedbackItems; track $index; let ruleIndex = $index) {
                <div class="option-card">
                  <div class="option-header">
                    <span class="option-index">Regel #{{ ruleIndex + 1 }}</span>
                    <button
                      class="btn-icon btn-remove-sm"
                      (click)="removeRule(ruleIndex)"
                    >
                      ✕
                    </button>
                  </div>

                  <div class="field">
                    <label>Variable</label>
                    <input
                      type="text"
                      [value]="rule.variableId"
                      (input)="updateRule(ruleIndex, 'variableId', $any($event.target).value)"
                    />
                  </div>

                  <div class="field-row-group">
                    <div class="field">
                      <label>Quelle</label>
                      <select
                        [value]="rule.source || 'CODE'"
                        (change)="updateRule(ruleIndex, 'source', $any($event.target).value)"
                      >
                        <option value="CODE">Code</option>
                        <option value="VALUE">Wert</option>
                        <option value="SCORE">Score</option>
                      </select>
                    </div>
                    <div class="field">
                      <label>Methode</label>
                      <select
                        [value]="rule.method || 'EQUALS'"
                        (change)="updateRule(ruleIndex, 'method', $any($event.target).value)"
                      >
                        <option value="EQUALS">Gleich (=)</option>
                        <option value="GREATER_THAN">Größer (>)</option>
                        <option value="LESS_THAN">Kleiner (<)</option>
                      </select>
                    </div>
                  </div>

                  <div class="field">
                    <label>Parameter</label>
                    <input
                      type="text"
                      [value]="rule.parameter"
                      (input)="updateRule(ruleIndex, 'parameter', $any($event.target).value)"
                    />
                  </div>

                  <stars-media-upload
                    label="Audio"
                    type="audio"
                    [source]="rule.audioSource"
                    (sourceChange)="updateRule(ruleIndex, 'audioSource', $event)"
                  >
                  </stars-media-upload>

                  <div class="sub-section nested">
                    <div class="sub-header">
                      <span>Show Response</span>
                      <label class="toggle-inline">
                        <input
                          type="checkbox"
                          [checked]="!!getShowResponse(rule)"
                          (change)="toggleShowResponse(ruleIndex, $any($event.target).checked)"
                        />
                        Aktivieren
                      </label>
                    </div>

                    @if (getShowResponse(rule); as showResponse) {
                      <div class="field">
                        <label>Response-Variable</label>
                        <input
                          type="text"
                          [value]="showResponse.variableId"
                          (input)="updateShowResponse(ruleIndex, 'variableId', $any($event.target).value)"
                        />
                      </div>
                      <div class="field">
                        <label>Response-Wert</label>
                        <input
                          type="text"
                          [value]="showResponse.value"
                          (input)="updateShowResponse(ruleIndex, 'value', $any($event.target).value)"
                        />
                      </div>
                      <div class="field">
                        <label>Verzögerung (ms)</label>
                        <input
                          type="number"
                          [value]="showResponse.delayMS || 0"
                          (input)="updateShowResponse(ruleIndex, 'delayMS', +$any($event.target).value)"
                          min="0"
                          step="100"
                        />
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .sub-section {
      margin-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 8px;
    }
    .sub-section.nested {
      margin-top: 10px;
    }
    .sub-header,
    .option-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #e2e8f0;
    }
    .toggle-inline {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #94a3b8;
      font-weight: 400;
    }
    .empty-state {
      font-size: 12px;
      color: #64748b;
      padding: 8px 0;
    }
    .btn-add {
      background: rgba(139, 92, 246, 0.2);
      color: #a78bfa;
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 4px;
      padding: 3px 10px;
      font-size: 11px;
      cursor: pointer;
    }
    .option-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      padding: 8px;
      margin-bottom: 6px;
    }
    .option-index {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }
    .field-row-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .btn-remove-sm {
      width: 18px;
      height: 18px;
      font-size: 10px;
    }
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
      this.state.audioFeedback.set({
        trigger: 'CONTINUE_BUTTON_CLICK',
        feedback: []
      });
    } else {
      this.state.audioFeedback.set(undefined);
    }
    this.state.notifyChange();
  }

  updateFeedback(field: string, value: any): void {
    const current = this.state.audioFeedback();
    if (!current) {
      return;
    }
    this.state.audioFeedback.set({ ...current, [field]: value });
    this.state.notifyChange();
  }

  addRule(): void {
    const current = this.state.audioFeedback();
    if (!current) {
      return;
    }
    const feedback = [...(current.feedback || [])];
    feedback.push({
      variableId: '',
      source: 'CODE',
      parameter: '',
      audioSource: '',
      method: 'EQUALS'
    });
    this.state.audioFeedback.set({ ...current, feedback });
    this.state.notifyChange();
  }

  removeRule(index: number): void {
    const current = this.state.audioFeedback();
    if (!current) {
      return;
    }
    const feedback = [...(current.feedback || [])];
    feedback.splice(index, 1);
    this.state.audioFeedback.set({ ...current, feedback });
    this.state.notifyChange();
  }

  updateRule(index: number, field: keyof FeedbackDefinition, value: any): void {
    const current = this.state.audioFeedback();
    if (!current) {
      return;
    }
    const feedback = [...(current.feedback || [])];
    feedback[index] = { ...feedback[index], [field]: value };
    this.state.audioFeedback.set({ ...current, feedback });
    this.state.notifyChange();
  }

  toggleShowResponse(index: number, enabled: boolean): void {
    if (enabled) {
      this.updateRule(index, 'showResponse', {
        variableId: '',
        value: '',
        delayMS: 0
      });
    } else {
      this.updateRule(index, 'showResponse', undefined);
    }
  }

  updateShowResponse(index: number, field: keyof ShowResponse, value: any): void {
    const rule = this.feedbackItems[index];
    const currentShowResponse = this.getShowResponse(rule) || {
      variableId: '',
      value: '',
      delayMS: 0
    };
    this.updateRule(index, 'showResponse', {
      ...currentShowResponse,
      [field]: value
    });
  }

  getShowResponse(rule: FeedbackDefinition): ShowResponse | undefined {
    if (!rule.showResponse) {
      return undefined;
    }
    if (Array.isArray(rule.showResponse)) {
      return rule.showResponse[0];
    }
    return rule.showResponse;
  }
}
