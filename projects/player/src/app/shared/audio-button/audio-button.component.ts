import {
  Component, inject, input, output, signal
} from '@angular/core';

import { AudioService } from '../../services/audio.service';
import { AudioOptions } from '../../models/unit-definition';

@Component({
  selector: 'stars-audio-button',
  templateUrl: 'audio-button.component.html',
  styleUrl: 'audio-button.component.scss'
})

export class AudioButtonComponent {
  audio = input.required<AudioOptions>();
  elementValueChanged = output();

  isPlaying = signal(false);
  audioService = inject(AudioService);

  // TODO: Refactoring to be able to use this component and audio.component.html instead of using similar components

  play() {
    if (this.audioService.isPlaying()) return;
    if (this.audio().audioSource && this.audio().audioId) {
      this.audioService.setAudioSrc(this.audio()).then(() => {
        this.isPlaying.set(true);
        this.audioService.getPlayFinished(this.audio().audioId).then(() => {
          this.isPlaying.set(false);
        });
      });
    }
  }

  disabled() {
    return this.audioService.isPlaying();
  }
}
