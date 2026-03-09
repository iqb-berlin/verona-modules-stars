import {
  Component, EventEmitter, inject, Output, signal
} from '@angular/core';

import { AudioService } from '../../services/audio.service';
import { FeedbackService } from '../../services/feedback.service';
import { UnitService } from "../../services/unit.service";

@Component({
  selector: 'stars-continue-button',
  standalone: true,
  templateUrl: 'continue-button.component.html',
  styleUrls: ['./continue-button.component.scss']
})

export class ContinueButtonComponent {
  @Output() navigate = new EventEmitter();
  feedbackService = inject(FeedbackService);
  unitService = inject(UnitService);
  audioService = inject(AudioService);

  clicked = signal(false);

  lastAudioSource = '';

  handleClick() {
    if (this.audioService.isPlaying()) return;
    this.clicked.set(true);

    setTimeout(() => {
      this.clicked.set(false);
    }, 200);

    if (this.feedbackService.pendingAudioFeedback()) {
      const newAudioSource = this.feedbackService.getFeedbackAudio(true);
      if (newAudioSource !== this.lastAudioSource) {
        this.audioService.setAudioSrc({
          audioSource: newAudioSource,
          audioId: 'AudioFeedback'
        }).then(() => {
          this.audioService.getPlayFinished('AudioFeedback').then(() => {
            // TODO add here automatic function when audio finished aka navigation next
          });
        });
        this.lastAudioSource = newAudioSource;
      } else {
        setTimeout(() => {
          this.navigate.emit();
        }, 200);
      }
    } else {
      setTimeout(() => {
        this.navigate.emit();
      }, 200);
    }
  }
}
