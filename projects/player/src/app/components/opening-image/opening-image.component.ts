import {
  Component, effect, inject, signal
} from '@angular/core';
import { UnitService } from '../../services/unit.service';
import { StateService } from '../../services/state.service';
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
  stateService = inject(StateService);
  audioPlayerService = inject(AudioPlayerService);

  private imagePhaseEntered = false;
  private finishScheduled = false;
  private finishTimerId: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    super();
    effect(() => {
      if (!this.stateService.openingFlowActive()) return;
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
      if (!this.stateService.openingFlowActive()) return;
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
    this.stateService.clearCurrentAudioSrc();
    this.showImage.set(true);
    this.unitService.showingOpeningImage.set(true);
    this.scheduleFinishAfterDuration();
  }

  private scheduleFinishAfterDuration(): void {
    if (this.finishScheduled) return;
    this.finishScheduled = true;

    const duration = Number(this.unitService.openingImageParams()?.presentationDurationMS || 0);
    if (!Number.isFinite(duration) || duration <= 0) {
      this.unitService.finishOpeningFlowAndStartMainAudio();
      return;
    }
    this.finishTimerId = setTimeout(() => {
      this.finishTimerId = undefined;
      this.unitService.finishOpeningFlowAndStartMainAudio();
    }, duration);
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
