import { inject, Injectable, signal } from '@angular/core';

import { NavigationTarget, Progress } from '../models/verona';
import { VeronaPostService } from './verona-post.service';

/**
 * Presentation state for the player: main audio, video, and Verona presentation progress.
 */
@Injectable({
  providedIn: 'root'
})
export class ComponentStateService {
  private veronaPostService = inject(VeronaPostService);

  mainAudioComplete = signal(false);
  videoComplete = signal(false);
  presentationProgress = signal<Progress>('some');

  reset(): void {
    this.mainAudioComplete.set(false);
    this.videoComplete.set(false);
    this.presentationProgress.set('some');
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
