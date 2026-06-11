import { Injectable, signal } from '@angular/core';

import { Response } from '@iqbspecs/response/response.interface';
import { UnitDefinition } from '../models/unit-definition';
import { FeedbackDefinition, ShowResponse } from '../models/feedback';

/**
 * Queues and plays audio feedback after responses, and manages feedback UI state
 * (pending clip, active overlay, hints).
 */
@Injectable({
  providedIn: 'root'
})
export class AudioFeedbackService {
  pendingAudioFeedback = signal(false);
  feedbackHint = signal('');
  feedbackActive = signal(false);

  private feedbackDefinitions: FeedbackDefinition[] = [];
  private pendingAudioFeedbackSource = '';
  private pendingFeedbackHint = '';
  private pendingHintDelay = 0;

  reset(): void {
    this.feedbackDefinitions = [];
    this.pendingAudioFeedback.set(false);
    this.pendingAudioFeedbackSource = '';
    this.feedbackHint.set('');
    this.feedbackActive.set(false);
    this.pendingFeedbackHint = '';
    this.pendingHintDelay = 0;
  }

  /** Loads feedback rules from the unit definition. */
  loadFromUnitDefinition(unitDefinition: UnitDefinition | null, problems: string[]): void {
    if (!unitDefinition?.audioFeedback?.feedback?.length) return;

    unitDefinition.audioFeedback.feedback.forEach(f => {
      if (f.variableId && f.variableId.length > 0 && f.parameter && f.audioSource) {
        const showResponse: ShowResponse = {
          variableId: f.showResponse?.variableId || '',
          value: f.showResponse?.value || '',
          delayMS: f.showResponse?.delayMS || 0
        };
        this.feedbackDefinitions.push({
          variableId: f.variableId,
          source: f.source || 'CODE',
          method: f.method || 'EQUALS',
          parameter: f.parameter,
          audioSource: f.audioSource,
          showResponse: showResponse
        });
      } else {
        problems.push('audioFeedback: variableId or parameter or audioSource missing');
      }
    });
  }

  hasDefinitions(): boolean {
    return this.feedbackDefinitions.length > 0;
  }

  /**
   * Evaluates stored responses and queues matching feedback audio for the continue button.
   * @param allResponses current coded responses for the unit
   * @param startVariable variable id that triggered the evaluation
   */
  evaluateFromResponses(allResponses: Response[], startVariable: string): void {
    this.clearPendingFeedback();
    if (this.feedbackDefinitions.length === 0) return;

    const responsesToCheck: string[] = [
      startVariable,
      ...allResponses.filter(r => r.id !== startVariable).map(r => r.id)
    ];
    const audioToPlay = responsesToCheck.map(varId => {
      const responseToCheck = allResponses.find(r => r.id === varId);
      if (!responseToCheck) return undefined;

      const feedbacksToUse = this.feedbackDefinitions
        .filter(f => f.variableId === responseToCheck.id);
      return feedbacksToUse.find(f => {
        let valueToCompare: string | number | boolean;
        if (f.source === 'VALUE') {
          if (Array.isArray(responseToCheck.value)) {
            valueToCompare = responseToCheck.value.length > 0 ? responseToCheck.value[0] : '';
          } else {
            valueToCompare = responseToCheck.value;
          }
        } else {
          valueToCompare = f.source === 'SCORE' ? responseToCheck.score : responseToCheck.code;
        }
        if (f.method === 'EQUALS') {
          const valueToCompareAsString = typeof valueToCompare === 'string' ?
            valueToCompare : valueToCompare.toString();
          return valueToCompareAsString === f.parameter;
        }
        let valueAsNumber: number;
        if (typeof valueToCompare === 'number') {
          valueAsNumber = valueToCompare;
        } else if (typeof valueToCompare === 'boolean') {
          valueAsNumber = valueToCompare ? 1 : 0;
        } else {
          valueAsNumber = Number.parseInt(valueToCompare, 10);
        }
        const parameterAsNumber = Number.parseInt(f.parameter, 10);
        if (f.method === 'GREATER_THAN') {
          return valueAsNumber > parameterAsNumber;
        }
        return valueAsNumber < parameterAsNumber;
      });
    }).find(feedback => !!feedback);

    if (audioToPlay) {
      this.setPendingFeedback(
        audioToPlay.audioSource,
        audioToPlay.showResponse?.value || '',
        audioToPlay.showResponse?.delayMS || 0
      );
    }
  }

  clearPendingFeedback(): void {
    this.pendingAudioFeedback.set(false);
    this.pendingAudioFeedbackSource = '';
    this.pendingFeedbackHint = '';
    this.pendingHintDelay = 0;
  }

  setPendingFeedback(audioSource: string, hint = '', hintDelay = 0): void {
    this.pendingAudioFeedback.set(true);
    this.pendingAudioFeedbackSource = audioSource;
    this.pendingFeedbackHint = hint;
    this.pendingHintDelay = hintDelay;
  }

  getAudioFeedback(setAsPlayed: boolean): string {
    const returnValue = this.pendingAudioFeedbackSource;
    if (setAsPlayed) {
      this.pendingAudioFeedbackSource = '';
      this.pendingAudioFeedback.set(false);
    }
    return returnValue;
  }

  startFeedback(): void {
    this.feedbackActive.set(true);
    if (this.pendingFeedbackHint === '') return;
    if (this.pendingHintDelay > 0) {
      setTimeout(() => {
        this.feedbackHint.set(this.pendingFeedbackHint);
      }, this.pendingHintDelay);
    } else {
      this.feedbackHint.set(this.pendingFeedbackHint);
    }
  }
}
