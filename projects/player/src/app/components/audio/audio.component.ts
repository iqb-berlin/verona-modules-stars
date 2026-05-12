import {
  Component, effect, inject, input, signal
} from '@angular/core';

import { ResponsesService } from '../../services/responses.service';
import { AudioService } from '../../services/audio.service';
import { AudioOptions, FirstAudioOptionsParams } from '../../models/unit-definition';
import { UnitService } from '../../services/unit.service';

@Component({
  selector: 'stars-audio',
  templateUrl: 'audio.component.html',
  styleUrl: 'audio.component.scss',
  standalone: true
})

export class AudioComponent {
  audio = input.required<AudioOptions>();
  firstAudioOptions = input<FirstAudioOptionsParams>();

  audioService = inject(AudioService);
  responsesService = inject(ResponsesService);
  unitService = inject(UnitService);

  movingButton = signal<'OFF' | 'KIND' | 'BOLD'>('OFF');
  isPlaying = signal(false);
  isDisabled = signal(false);

  // timer reference for delayed animateButton start
  private animateTimer: any = undefined;

  constructor() {
    effect(() => {
      // Only the component-provided input should trigger a load.
      if (this.audio()?.audioSource) {
        this.audioService.setAudioSrc(this.audio()).then(() => {});
      }
    });

    effect(() => {
      // play audio when triggered from the firstClickLayer
      if (this.unitService.firstClickLayerClicked()) {
        this.play();
      }
    });

    effect(() => {
      // set play style when triggered somewhere else
      // TODO check if can be done in a more elegant way
      if (this.audioService.isPlaying() && this.audioService.audioId() === this.audio()?.audioId) {
        this.isPlaying.set(true);
      } else {
        this.isPlaying.set(false);
        // if (this.audioService.isPlaying()) {
        //   this.isDisabled.set(true);
        // } else {
        //   this.isDisabled.set(false);
        // }
      }
    });

    // Effect to reactively handle animateButton with a delayed start
    effect(() => {
      // Clear any existing timer
      if (this.animateTimer) {
        clearTimeout(this.animateTimer);
      }

      const animateButton = this.firstAudioOptions()?.animateButton;
      if (animateButton && animateButton !== 'OFF' && !this.unitService.interactionDone()) {
        this.animateTimer = setTimeout(() => {
          if (!this.unitService.interactionDone()) {
            this.movingButton.set(animateButton as 'KIND' | 'BOLD');
          }
        }, 5000);
      } else {
        // Ensure animation is off when not needed
        this.movingButton.set('OFF');
      }
    });
  }

  play() {
    const audio = this.unitService.currentAudioSrc();

    // if (this.isPlaying()) return;

    if (audio && audio.audioId) {
      this.audioService.setAudioSrc(audio).then(() => {
        this.isPlaying.set(true);
        this.audioService.getPlayFinished(audio.audioId).then(() => {
          this.isPlaying.set(false);

          /** check if maxPlay reached */
          const variableId = audio.audioId;
          const maxPlay = audio.maxPlay || 0;
          const currentCount = this.responsesService.getResponseByVariableId(variableId);
          if (maxPlay !== 0 && currentCount.value as number >= maxPlay) {
            this.isDisabled.set(true);
          }
        });
      });
    }

    this.movingButton.set('OFF');
  }

  disabled() {
    return this.audioService.isPlaying() || this.isDisabled();
  }
}
