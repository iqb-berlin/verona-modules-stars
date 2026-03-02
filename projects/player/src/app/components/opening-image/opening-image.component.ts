import {
  Component, effect, inject, signal
} from '@angular/core';
import { UnitService } from '../../services/unit.service';
import { AudioService } from '../../services/audio.service';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { OpeningImageParams } from '../../models/unit-definition';

@Component({
  selector: 'stars-opening-image',
  templateUrl: './opening-image.component.html',
  styleUrls: ['./opening-image.component.scss']
})
export class OpeningImageComponent extends InteractionComponentDirective {
  /** Local copy of the component parameters with defaults applied. */
  localParameters!: OpeningImageParams;

  /** local flag to show the image during the opening sequence */
  showImage = signal<boolean>(false);

  unitService = inject(UnitService);
  audioService = inject(AudioService);

  constructor() {
    super();
    // When opening flow starts
    effect(() => {
      // TODO avoid using two signals in effect
      if (!this.unitService.openingFlowActive()) return;
      const params = this.parameters() as OpeningImageParams;
      this.localParameters = this.createDefaultParameters();
      if (params) {
        this.localParameters.audioSource = params.audioSource || '';
        this.localParameters.imageSource = params.imageSource || '';
        this.localParameters.presentationDurationMS = params.presentationDurationMS || 0;

        // If there is no opening audio, show image immediately and schedule finish based on duration
        if (params.audioSource === '') {
          if (!this.showImage()) {
            this.showImage.set(true);
            this.unitService.showingOpeningImage.set(true);
          }
          this.scheduleFinishAfterDuration();
        }
      }
    });

    effect(() => {
      if (!this.unitService.openingFlowActive()) return;
      const params = this.unitService.openingImageParams();
      if (!params?.audioSource) return;

      const currentAudioId = this.audioService.audioId();
      const isPlaying = this.audioService.isPlaying();
      const playCount = this.audioService.playCount();

      // When opening audio finished, show image and schedule finish
      if (currentAudioId === 'openingAudio' && !isPlaying && playCount >= 1) {
        if (!this.showImage()) {
          this.showImage.set(true);
          this.unitService.showingOpeningImage.set(true);
        }
        this.scheduleFinishAfterDuration();
      }
    });
  }

  private scheduleFinishAfterDuration() {
    const duration = Number(this.unitService.openingImageParams()?.presentationDurationMS || 0);
    if (!Number.isFinite(duration) || duration <= 0) {
      this.finishOpeningFlowAndStartMainAudio();
      return;
    }
    setTimeout(() => {
      this.finishOpeningFlowAndStartMainAudio();
    }, duration);
  }

  private finishOpeningFlowAndStartMainAudio() {
    // Close opening flow
    this.unitService.showingOpeningImage.set(false);
    this.unitService.finishOpeningFlow();
    // After opening flow, disable the first click layer for the main audio
    const currentOpts = this.unitService.firstAudioOptions() || {};
    if (currentOpts.firstClickLayer) {
      this.unitService.firstAudioOptions.set({ ...currentOpts, firstClickLayer: false });
    }
    // Now that the opening image has disappeared, switch to main audio and auto-play once
    const main = this.unitService.mainAudio();
    if (main?.audioSource) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.audioService.setAudioSrc({ ...main, audioId: 'mainAudio' }).then(ready => {
        if (ready) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.audioService.getPlayFinished('mainAudio');
        }
      }).catch(err => {
        // eslint-disable-next-line no-console
        console.error('Failed to load main audio after opening image', err);
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private createDefaultParameters(): OpeningImageParams {
    return {
      audioSource: '',
      imageSource: '',
      presentationDurationMS: 0
    };
  }
}
