import {
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UnitService } from '../../services/unit.service';
import { AudioService } from '../../services/audio.service';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { OpeningImageParams } from '../../models/unit-definition';

@Component({
  selector: 'stars-opening-image',
  templateUrl: './opening-image.component.html',
  styleUrls: ['./opening-image.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class OpeningImageComponent extends InteractionComponentDirective {
  /** Local copy of the component parameters with defaults applied. */
  localParameters!: OpeningImageParams;

  /** local flag to show the image during the opening sequence */
  showImage = signal<boolean>(false);

  unitService = inject(UnitService);
  audioService = inject(AudioService);

  /** timer that ends the opening flow after presentationDurationMS */
  private finishTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => clearTimeout(this.finishTimer));

    // When opening flow starts
    effect(() => {
      // TODO avoid using two signals in effect
      if (!this.unitService.openingFlowActive()) return;
      const params = this.parameters() as OpeningImageParams;
      untracked(() => {
        // The component is reused when the next unit also has an opening image,
        // so the timer and image state of the previous unit must not carry over
        clearTimeout(this.finishTimer);
        this.showImage.set(false);
        this.localParameters = this.createDefaultParameters();
        if (params) {
          this.localParameters.audioSource = params.audioSource || '';
          this.localParameters.imageSource = params.imageSource || '';
          this.localParameters.presentationDurationMS =
            params.presentationDurationMS || 0;

          // If there is no opening audio, show image immediately and schedule finish based on duration
          // (same check as in UnitService: missing or blank audioSource means no opening audio)
          if (!params.audioSource?.trim()) {
            this.showImage.set(true);
            this.unitService.showingOpeningImage.set(true);
            this.scheduleFinishAfterDuration();
          }
        }
      });
    });

    effect(() => {
      if (!this.unitService.openingFlowActive()) return;
      const params = this.unitService.openingImageParams();
      if (!params?.audioSource?.trim()) return;

      const currentAudioId = this.audioService.audioId();
      const isPlaying = this.audioService.isPlaying();
      const playCount = this.audioService.playCount();

      // When opening audio finished, show image and schedule finish
      // Only schedule once, this effect re-runs on every audio signal change
      if (currentAudioId === 'openingAudio' && !isPlaying && playCount >= 1 && !this.showImage()) {
        this.showImage.set(true);
        this.unitService.showingOpeningImage.set(true);
        this.scheduleFinishAfterDuration();
      }
    });
  }

  private scheduleFinishAfterDuration() {
    clearTimeout(this.finishTimer);
    const params = this.unitService.openingImageParams();
    const duration = Number(params?.presentationDurationMS || 0);
    if (!Number.isFinite(duration) || duration <= 0) {
      this.finishOpeningFlowAndStartMainAudio();
      return;
    }
    this.finishTimer = setTimeout(() => {
      // A new unit may have been loaded before change detection cleared this timer
      if (this.unitService.openingImageParams() !== params) return;
      this.finishOpeningFlowAndStartMainAudio();
    }, duration);
  }

  private finishOpeningFlowAndStartMainAudio() {
    // Close opening flow
    this.unitService.showingOpeningImage.set(false);
    this.unitService.finishOpeningFlow();
    // After opening flow, disable the first click layer for the main audio
    const currentOpts = this.unitService.firstAudioOptions();
    if (currentOpts?.firstClickLayer !== 'OFF') {
      this.unitService.firstAudioOptions.set({
        ...currentOpts,
        firstClickLayer: 'OFF',
      });
    }
    // Now that the opening image has disappeared, the audio component loads the main audio
    // (currentAudioSrc switches to it) and plays it once after loading
    if (this.unitService.mainAudio()?.audioSource) {
      this.unitService.requestAutoPlay('mainAudio');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private createDefaultParameters(): OpeningImageParams {
    return {
      audioSource: '',
      imageSource: '',
      presentationDurationMS: 0,
    };
  }
}
