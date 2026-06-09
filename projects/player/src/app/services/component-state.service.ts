import { inject, Injectable, signal } from '@angular/core';

import { NavigationTarget, Progress } from '../models/verona';
import { VeronaPostService } from './verona-post.service';

/**
 * Manages UI-facing presentation state for the player: main audio, video, feedback audio,
 * closing-meta flow, and navigation requests. Continue-button visibility and interaction
 * blocking are computed in UnitService, which owns unit config and reads state from here.
 * Response coding and storage remain in ResponsesService.
 */
@Injectable({
  providedIn: 'root'
})
export class ComponentStateService {
  private veronaPostService = inject(VeronaPostService);
  private metaVariableId = '';

  mainAudioComplete = signal(false);
  videoComplete = signal(false);
  presentationProgress = signal<Progress>('some');
  closingMetaRunning = signal(false);
  metaInteractionDone = signal(false);

  pendingAudioFeedback = signal(false);
  feedbackHint = signal('');
  feedbackActive = signal(false);
  private pendingAudioFeedbackSource = '';
  private pendingFeedbackHint = '';
  private pendingHintDelay = 0;

  /**
   * Resets all presentation and feedback state to initial values.
   * Called when a new unit is loaded or former state is restored.
   */
  reset(): void {
    this.mainAudioComplete.set(false);
    this.videoComplete.set(false);
    this.presentationProgress.set('some');
    this.closingMetaRunning.set(false);
    this.metaInteractionDone.set(false);
    this.pendingAudioFeedback.set(false);
    this.pendingAudioFeedbackSource = '';
    this.feedbackHint.set('');
    this.feedbackActive.set(false);
    this.pendingFeedbackHint = '';
    this.pendingHintDelay = 0;
    this.metaVariableId = '';
  }

  /**
   * Updates main-audio completion and marks presentation progress as complete when finished.
   * @param complete whether the main audio has been fully played
   */
  setMainAudioComplete(complete: boolean): void {
    this.mainAudioComplete.set(complete);
    if (complete) {
      this.presentationProgress.set('complete');
    }
  }

  /**
   * Updates video completion and marks presentation progress as complete when finished.
   * @param complete whether the video has been fully played
   */
  setVideoComplete(complete: boolean): void {
    this.videoComplete.set(complete);
    if (complete) {
      this.presentationProgress.set('complete');
    }
  }

  /** Returns the current presentation progress sent to the Verona host. */
  getPresentationStatus(): Progress {
    return this.presentationProgress();
  }

  /**
   * Updates presentation progress (e.g. after dismissing the first-click layer).
   * A 'complete' status cannot be downgraded to 'some' or 'none'.
   * @param progress new presentation progress value
   */
  updatePresentationProgress(progress: Progress): void {
    if (this.presentationProgress() === 'complete' && progress !== 'complete') {
      return;
    }
    this.presentationProgress.set(progress);
  }

  /**
   * Restores presentation state from a saved unit state (e.g. on session resume).
   * @param options saved presentation, main-audio, and video completion values
   */
  restorePresentationState(options: {
    presentationProgress?: Progress;
    mainAudioComplete?: boolean;
    videoComplete?: boolean;
  }): void {
    if (options.presentationProgress) {
      this.presentationProgress.set(options.presentationProgress);
    }
    if (options.mainAudioComplete !== undefined) {
      this.mainAudioComplete.set(options.mainAudioComplete);
    }
    if (options.videoComplete !== undefined) {
      this.videoComplete.set(options.videoComplete);
    }
    if (this.mainAudioComplete() || this.videoComplete()) {
      this.presentationProgress.set('complete');
    }
  }

  /**
   * Enters the closing-meta phase after the main interaction is done.
   * @param metaVariableId response variable id used to detect meta selection
   */
  startClosingMeta(metaVariableId = ''): void {
    this.closingMetaRunning.set(true);
    this.metaInteractionDone.set(false);
    this.metaVariableId = metaVariableId;
  }

  /**
   * Marks meta interaction as done when the user changes the meta selection variable.
   * Used to control continue-button visibility during closing-meta with ON_ANY_RESPONSE.
   * @param responses incoming response updates from an interaction component
   */
  handleMetaResponses(responses: { id: string; status: string; relevantForResponsesProgress: boolean }[]): void {
    if (!this.closingMetaRunning() || !this.metaVariableId) return;
    const metaTouched = responses.some(r =>
      r.id === this.metaVariableId && r.status === 'VALUE_CHANGED' && r.relevantForResponsesProgress);
    if (metaTouched) {
      this.metaInteractionDone.set(true);
    }
  }

  /** Clears any queued audio feedback before evaluating a new response. */
  clearPendingFeedback(): void {
    this.pendingAudioFeedback.set(false);
    this.pendingAudioFeedbackSource = '';
    this.pendingFeedbackHint = '';
    this.pendingHintDelay = 0;
  }

  /**
   * Queues audio feedback to play on the next continue-button click.
   * @param audioSource base64 audio source for the feedback clip
   * @param hint optional hint text shown after feedback starts
   * @param hintDelay optional delay in ms before the hint is shown
   */
  setPendingFeedback(audioSource: string, hint = '', hintDelay = 0): void {
    this.pendingAudioFeedback.set(true);
    this.pendingAudioFeedbackSource = audioSource;
    this.pendingFeedbackHint = hint;
    this.pendingHintDelay = hintDelay;
  }

  /**
   * Returns the queued feedback audio source and optionally clears the pending state.
   * @param setAsPlayed when true, clears pending feedback after returning the source
   * @returns the feedback audio source, or an empty string if none is queued
   */
  getAudioFeedback(setAsPlayed: boolean): string {
    const returnValue = this.pendingAudioFeedbackSource;
    if (setAsPlayed) {
      this.pendingAudioFeedbackSource = '';
      this.pendingAudioFeedback.set(false);
    }
    return returnValue;
  }

  /**
   * Activates feedback mode: blocks interaction via overlay and shows any queued hint.
   * Called when feedback audio starts playing after a continue-button click.
   */
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

  /**
   * Sends a navigation request to the Verona host (e.g. advance to the next unit).
   * @param target navigation target, typically 'next'
   */
  requestNavigation(target: NavigationTarget): void {
    this.veronaPostService.sendVopUnitNavigationRequestedNotification(target);
  }
}
