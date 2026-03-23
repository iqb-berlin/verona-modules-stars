import { effect, inject, Injectable, signal } from '@angular/core';

import { UnitDefinition } from '../models/unit-definition';
import { FeedbackDefinition, ShowResponse } from "../models/feedback";
import { ResponsesService } from "./responses.service";
import { AudioService } from "./audio.service";

@Injectable({
  providedIn: 'root'
})

export class FeedbackService {
  private responseService = inject(ResponsesService);
  private audioService = inject(AudioService);

  // provides Info on FeedbackAudio available
  #pendingAudioFeedback = signal(false);
  pendingAudioFeedback = this.#pendingAudioFeedback.asReadonly();
  // sets to  hint answer to be shown when available
  #feedbackHint = signal('');
  feedbackHint = this.#feedbackHint.asReadonly();
  // feedback is runnning
  #feedbackActive = signal(false);
  feedbackActive = this.#feedbackActive.asReadonly();

  private pendingAudioFeedbackSource = '';
  private pendingFeedbackHint = '';
  private pendingHintDelay = 0;


  private feedbackDefinitions: FeedbackDefinition[] = [];

  constructor() {
    effect(() => {
      if (this.audioService.audioId() === 'AudioFeedback' && this.pendingHintDelay > 0) {
        if (this.pendingHintDelay >= this.audioService.percentElapsed()) {
          this.showAnswers();
        }
      }
    });
  }

  /**
   * Reset
   */
  resetData() {
    this.#pendingAudioFeedback.set(false);
    this.pendingAudioFeedbackSource = '';
    this.#feedbackHint.set('');
    this.#feedbackActive.set(false);
    this.feedbackDefinitions = [];
    this.pendingFeedbackHint = '';
    this.pendingHintDelay = 0;
  }

  /**
   * Set New Data for FeedbackService aka new unit has been loaded
   * incl. reset all variables
   * @param unitDefinition
   */
  setNewData(unitDefinition: UnitDefinition) {
    if (unitDefinition.audioFeedback?.feedback && unitDefinition.audioFeedback.feedback.length > 0) {
      unitDefinition.audioFeedback.feedback.forEach(f => {
        if (f.variableId && f.variableId.length > 0 && f.parameter && f.audioSource) {
          let showResponse: ShowResponse = {
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
        }
      });
    }
  }

  /**
   * return pendingAudioSource and reset it
   * @param setAsPlayed
   */
  getFeedbackAudio(setAsPlayed: boolean): string {
    const returnValue = this.pendingAudioFeedbackSource;
    if (setAsPlayed) {
      this.pendingAudioFeedbackSource = '';
      this.#pendingAudioFeedback.set(false);
    }
    return returnValue;
  }

  startFeedback() {
    if (this.pendingFeedbackHint === '') return;
    if (this.pendingHintDelay != 0) {
      setTimeout(() => {
        this.#feedbackHint.set(this.pendingFeedbackHint);
      }, this.pendingHintDelay);
    } else {
      this.#feedbackHint.set(this.pendingFeedbackHint);
    }
    this.#feedbackActive.set(true);
  }

  private provideFeedback(startVariable: string): void {
    // reset Audio
    this.#pendingAudioFeedback.set(false);
    this.pendingAudioFeedbackSource = '';

    const responsesToCheck: string[] = [startVariable,
      ...this.responseService.allResponses.filter(r => r.id !== startVariable).map(r => r.id)];
    const audioToPlay: any = responsesToCheck.map(varId => {
      const responseToCheck = this.responseService.allResponses.find(r => r.id === varId);
      if (responseToCheck) {
        const feedbacksToUse = this.feedbackDefinitions
          .filter(f => f.variableId === responseToCheck.id);
        const feedbackToTake = feedbacksToUse.find(f => {
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
        return feedbackToTake ? feedbackToTake.audioSource : '';
      }
      return '';
    }).find(sourceString => !!sourceString);
    if (audioToPlay) {
      this.#pendingAudioFeedback.set(true);
      this.pendingAudioFeedbackSource = audioToPlay.audioSource;
      this.pendingFeedbackHint = audioToPlay.showResponse?.value || '';
      this.pendingHintDelay = audioToPlay.showResponse?.delayMS || 0;
    }
  }

  private showAnswers() {

  }
}
