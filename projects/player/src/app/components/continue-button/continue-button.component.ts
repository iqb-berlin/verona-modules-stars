import {
  Component, EventEmitter, inject, Output, signal
} from '@angular/core';

import { AudioFeedbackService } from '../../services/audio-feedback.service';
import { ClosingMetaService } from '../../services/closing-meta.service';
import { AudioPlayerService } from '../../services/audio-player.service';
import { UnitService } from '../../services/unit.service';

@Component({
  selector: 'stars-continue-button',
  standalone: true,
  templateUrl: 'continue-button.component.html',
  styleUrls: ['./continue-button.component.scss']
})

export class ContinueButtonComponent {
  @Output() navigate = new EventEmitter();
  audioFeedbackService = inject(AudioFeedbackService);
  closingMetaService = inject(ClosingMetaService);
  audioPlayerService = inject(AudioPlayerService);
  unitService = inject(UnitService);

  clicked = signal(false);

  lastAudioSource = '';

  handleClick() {
    if (this.audioPlayerService.isPlaying()) return;
    this.clicked.set(true);

    setTimeout(() => {
      this.clicked.set(false);
    }, 200);

    if (this.audioFeedbackService.pendingAudioFeedback()) {
      const newAudioSource = this.audioFeedbackService.getAudioFeedback(true);
      if (newAudioSource !== this.lastAudioSource) {
        this.audioPlayerService.setAudioSrc({
          audioSource: newAudioSource,
          audioId: 'AudioFeedback'
        }).then(() => {
          this.audioPlayerService.getPlayFinished('AudioFeedback').then(() => {
            // TODO add here automatic function when audio finished aka navigation next
          });
          this.audioFeedbackService.startFeedback();
        });
        this.lastAudioSource = newAudioSource;
      } else {
        setTimeout(() => {
          this.navigate.emit();
        }, 200);
      }
    } else if (this.unitService.closingMetaButtons()?.variableIdReference &&
      !this.closingMetaService.closingMetaRunning()) {
      this.unitService.startClosingMeta();
    } else {
      setTimeout(() => {
        this.navigate.emit();
      }, 200);
    }
  }
}
