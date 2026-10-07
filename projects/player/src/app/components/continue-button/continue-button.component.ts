import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy, output,
} from '@angular/core';

import { ResponsesService, StarsResponse } from '../../services/responses.service';
import { AudioService } from '../../services/audio.service';
import { UnitService } from '../../services/unit.service';

@Component({
  selector: 'stars-continue-button',
  standalone: true,
  templateUrl: 'continue-button.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./continue-button.component.scss'],
})
export class ContinueButtonComponent {
  navigate = output();
  responseService = inject(ResponsesService);
  audioService = inject(AudioService);
  unitService = inject(UnitService);

  clicked = signal(false);

  lastAudioSource = '';

  isFeedbackPlaying(): boolean {
    return (
      this.audioService.isPlaying() &&
      this.audioService.audioId() === 'AudioFeedback'
    );
  }

  handleClick() {
    if (this.isFeedbackPlaying()) return;
    this.clicked.set(true);

    setTimeout(() => {
      this.clicked.set(false);
    }, 200);

    if (this.responseService.pendingAudioFeedback()) {
      const newAudioSource = this.responseService.getAudioFeedback(true);
      if (newAudioSource !== this.lastAudioSource) {
        this.audioService
          .setAudioSrc({
            audioSource: newAudioSource,
            audioId: 'AudioFeedback',
          })
          .then(() => {
            this.audioService.getPlayFinished('AudioFeedback').then(() => {
              if (this.responseService.triggerNavigationOnEnd()) {
                setTimeout(() => {
                  this.navigate.emit();
                }, 500);
              }
            });
            this.responseService.startFeedback();
          });
        this.lastAudioSource = newAudioSource;
      } else {
        this.navigateNext();
      }
    } else if (
      this.unitService.closingMetaButtons()?.variableIdReference &&
      !this.responseService.closingMetaRunning()
    ) {
      this.unitService.startClosingMeta();
    } else {
      this.navigateNext();
    }
  }

  navigateNext() {
    const response: StarsResponse = {
      id: 'continueButton',
      value: '1',
      status: 'VALUE_CHANGED',
      relevantForResponsesProgress: false,
    };

    this.responseService.newResponses([response]);

    setTimeout(() => {
      this.navigate.emit();
    }, 200);
  }
}
