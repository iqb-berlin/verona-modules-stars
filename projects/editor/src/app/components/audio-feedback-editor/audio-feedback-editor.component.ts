import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AudioFeedback, FeedbackDefinition, ShowResponse } from '@shared/models/feedback';
import { EditorStateService } from '../../services/editor-state.service';
import { MediaUploadComponent } from '../media-upload/media-upload.component';

@Component({
  selector: 'stars-audio-feedback-editor',
  standalone: true,
  imports: [CommonModule, MediaUploadComponent],
  templateUrl: './audio-feedback-editor.component.html',
  styleUrl: './audio-feedback-editor.component.scss'
})
export class AudioFeedbackEditorComponent {
  state = inject(EditorStateService);
  collapsed = true;

  get feedbackItems(): FeedbackDefinition[] {
    return this.state.audioFeedback()?.feedback || [];
  }

  toggleFeedback(enabled: boolean): void {
    this.state.setAudioFeedbackEnabled(enabled);
  }

  updateFeedback<K extends keyof AudioFeedback>(field: K, value: AudioFeedback[K]): void {
    const current = this.state.audioFeedback();
    if (current) this.state.setAudioFeedback({ ...current, [field]: value });
  }

  addRule(): void {
    const current = this.state.audioFeedback();
    if (!current) return;
    const feedback = [...(current.feedback || [])];
    feedback.push({
      variableId: '',
      source: 'CODE',
      parameter: '',
      audioSource: '',
      method: 'EQUALS'
    });
    this.state.setAudioFeedback({ ...current, feedback });
  }

  removeRule(index: number): void {
    const current = this.state.audioFeedback();
    if (!current) return;
    const feedback = [...(current.feedback || [])];
    feedback.splice(index, 1);
    this.state.setAudioFeedback({ ...current, feedback });
  }

  updateRule<K extends keyof FeedbackDefinition>(index: number, field: K, value: FeedbackDefinition[K]): void {
    const current = this.state.audioFeedback();
    if (!current) return;
    const feedback = [...(current.feedback || [])];
    feedback[index] = { ...feedback[index], [field]: value };
    this.state.setAudioFeedback({ ...current, feedback });
  }

  addShowResponse(ruleIndex: number): void {
    const responses = [...this.getShowResponses(this.feedbackItems[ruleIndex])];
    responses.push({ variableId: '', value: '', delayMS: 0 });
    this.setShowResponses(ruleIndex, responses);
  }

  removeShowResponse(ruleIndex: number, responseIndex: number): void {
    const responses = [...this.getShowResponses(this.feedbackItems[ruleIndex])];
    responses.splice(responseIndex, 1);
    this.setShowResponses(ruleIndex, responses);
  }

  updateShowResponse<K extends keyof ShowResponse>(
    ruleIndex: number,
    responseIndex: number,
    field: K,
    value: ShowResponse[K]
  ): void {
    const responses = [...this.getShowResponses(this.feedbackItems[ruleIndex])];
    responses[responseIndex] = { ...responses[responseIndex], [field]: value };
    this.setShowResponses(ruleIndex, responses);
  }

  // Used directly from the template; it intentionally depends only on its argument.
  // eslint-disable-next-line class-methods-use-this
  getShowResponses(rule: FeedbackDefinition): ShowResponse[] {
    if (!rule.showResponse) return [];
    return Array.isArray(rule.showResponse) ? rule.showResponse : [rule.showResponse];
  }

  private setShowResponses(ruleIndex: number, responses: ShowResponse[]): void {
    const current = this.feedbackItems[ruleIndex]?.showResponse;
    const showResponse = Array.isArray(current) || responses.length > 1 ? responses : responses[0];
    this.updateRule(ruleIndex, 'showResponse', showResponse);
  }
}
