import {
  Component, EventEmitter, inject, Output, signal
} from '@angular/core';

import { ComponentStateService } from '../../services/component-state.service';
import { AudioService } from '../../services/audio.service';
import { UnitService } from '../../services/unit.service';

@Component({
  selector: 'stars-continue-button',
  standalone: true,
  templateUrl: 'continue-button.component.html',
  styleUrls: ['./continue-button.component.scss']
})

export class ContinueButtonComponent {
  @Output() navigate = new EventEmitter();
  componentStateService = inject(ComponentStateService);
  audioService = inject(AudioService);
  unitService = inject(UnitService);

  clicked = signal(false);

  lastAudioSource = '';

  handleClick() {
    if (this.audioService.isPlaying()) return;
    this.clicked.set(true);

    setTimeout(() => {
      this.clicked.set(false);
    }, 200);

    if (this.componentStateService.pendingAudioFeedback()) {
      const newAudioSource = this.componentStateService.getAudioFeedback(true);
      if (newAudioSource !== this.lastAudioSource) {
        this.audioService.setAudioSrc({
          audioSource: newAudioSource,
          audioId: 'AudioFeedback'
        }).then(() => {
          this.audioService.getPlayFinished('AudioFeedback').then(() => {
            // TODO add here automatic function when audio finished aka navigation next
          });
          this.componentStateService.startFeedback();
        });
        this.lastAudioSource = newAudioSource;
      } else {
        setTimeout(() => {
          this.navigate.emit();
        }, 200);
      }
    } else if (this.unitService.closingMetaButtons()?.variableIdReference &&
      !this.componentStateService.closingMetaRunning()) {
      this.unitService.startClosingMeta();
    } else {
      setTimeout(() => {
        this.navigate.emit();
      }, 200);
    }
  }
}
