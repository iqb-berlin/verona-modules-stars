import {
  Component, effect, inject, signal
} from '@angular/core';
import { UnitService } from '../../services/unit.service';
import { AudioPlayerService } from '../../services/audio-player.service';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { OpeningImageParams } from '../../models/unit-definition';

@Component({
  selector: 'stars-opening-image',
  templateUrl: './opening-image.component.html',
  styleUrls: ['./opening-image.component.scss'],
  standalone: true,
  imports: []
})
export class OpeningImageComponent extends InteractionComponentDirective {
  /** Local copy of the component parameters with defaults applied. */
  localParameters!: OpeningImageParams;

  /** local flag to show the image during the opening sequence */
  showImage = signal<boolean>(false);

  unitService = inject(UnitService);
  audioPlayerService = inject(AudioPlayerService);

  private imagePhaseEntered = false;
  private finishScheduled = false;
  private openingFlowFinished = false;
  private finishTimerId: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    super();
    effect(() => {
      if (!this.unitService.openingFlowActive()) return;
      const params = this.parameters() as OpeningImageParams;
      this.localParameters = this.createDefaultParameters();
      if (!params) return;

      this.localParameters.audioSource = params.audioSource || '';
      this.localParameters.imageSource = params.imageSource || '';
      this.localParameters.presentationDurationMS = params.presentationDurationMS || 0;

      if (params.audioSource === '') {
        this.enterImagePhase();
      }
    });

    effect(() => {
      if (!this.unitService.openingFlowActive()) return;
      const params = this.unitService.openingImageParams();
      if (!params?.audioSource) return;

      const currentAudioId = this.audioPlayerService.audioId();
      const isPlaying = this.audioPlayerService.isPlaying();
      const playCount = this.audioPlayerService.playCount();

      if (currentAudioId === 'openingAudio' && !isPlaying && playCount >= 1) {
        this.enterImagePhase();
      }
    });
  }

  private enterImagePhase(): void {
    if (this.imagePhaseEntered) return;
    this.imagePhaseEntered = true;

    this.audioPlayerService.stopPlayback();
    this.unitService.clearCurrentAudioSrc();
    this.showImage.set(true);
    this.unitService.showingOpeningImage.set(true);
    this.scheduleFinishAfterDuration();
  }

  private scheduleFinishAfterDuration(): void {
    if (this.finishScheduled) return;
    this.finishScheduled = true;

    const duration = Number(this.unitService.openingImageParams()?.presentationDurationMS || 0);
    if (!Number.isFinite(duration) || duration <= 0) {
      this.finishOpeningFlowAndStartMainAudio();
      return;
    }
    this.finishTimerId = setTimeout(() => {
      this.finishOpeningFlowAndStartMainAudio();
    }, duration);
  }

  private finishOpeningFlowAndStartMainAudio(): void {
    if (this.openingFlowFinished) return;
    this.openingFlowFinished = true;

    if (this.finishTimerId) {
      clearTimeout(this.finishTimerId);
      this.finishTimerId = undefined;
    }

    this.unitService.showingOpeningImage.set(false);
    this.unitService.finishOpeningFlow();

    const currentOpts = this.unitService.firstAudioOptions() || {};
    if (currentOpts.firstClickLayer) {
      this.unitService.firstAudioOptions.set({ ...currentOpts, firstClickLayer: false });
    }

    if (this.unitService.mainAudio()?.audioSource) {
      this.unitService.requestMainAudioAutoPlayOnce();
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
