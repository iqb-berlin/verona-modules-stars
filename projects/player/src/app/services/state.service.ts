import { inject, Injectable, signal } from '@angular/core';

import { AudioOptions } from '../models/unit-definition';
import { NavigationTarget, Progress } from '../models/verona';
import { VeronaPostService } from './verona-post.service';

/**
 * Tracks presentation progress, UI flow state, and navigation requests.
 * Posts navigation requests when the player signals interaction completion.
 */
@Injectable({
  providedIn: 'root'
})
export class StateService {
  private veronaPostService = inject(VeronaPostService);

  mainAudioComplete = signal(false);
  videoComplete = signal(false);
  presentationProgress = signal<Progress>('some');

  /** Opening flow is active: interactions and main audio hidden */
  private _openingFlowActive = signal<boolean>(false);
  openingFlowActive = this._openingFlowActive.asReadonly();

  /** To show the first click layer */
  private _firstClickLayerClicked = signal<boolean>(false);
  firstClickLayerClicked = this._firstClickLayerClicked.asReadonly();

  /** Current audio source for the main audio */
  private _currentAudioSrc = signal<AudioOptions>({} as AudioOptions);
  currentAudioSrc = this._currentAudioSrc.asReadonly();

  reset(): void {
    this.mainAudioComplete.set(false);
    this.videoComplete.set(false);
    this.presentationProgress.set('some');
    this._openingFlowActive.set(false);
    this._firstClickLayerClicked.set(false);
    this._currentAudioSrc.set({} as AudioOptions);
  }

  resetClickLayerAndAudioSrc(): void {
    this._firstClickLayerClicked.set(false);
    this._currentAudioSrc.set({} as AudioOptions);
  }

  finishOpeningFlow(): void {
    this._openingFlowActive.set(false);
  }

  startOpeningFlow(): void {
    this._openingFlowActive.set(true);
  }

  /** Marks the first click as done to hide the layer and allow audio playback */
  setFirstClickLayerClicked(): void {
    this._firstClickLayerClicked.set(true);
    this.updatePresentationProgress('some');
  }

  setCurrentAudioSrc(audio: AudioOptions): void {
    this._currentAudioSrc.set(audio);
  }

  /** Clears the active audio source during silent opening-image display. */
  clearCurrentAudioSrc(): void {
    this._currentAudioSrc.set({} as AudioOptions);
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

  requestNavigation(target: NavigationTarget): void {
    this.veronaPostService.sendVopUnitNavigationRequestedNotification(target);
  }
}
