import { Injectable, signal } from '@angular/core';

import { AudioOptions, InteractionParameters } from '../models/unit-definition';
import { AudioPlayerService } from './audio-player.service';
import type { UnitService } from './unit.service';

export interface ClosingMetaPhaseDeps {
  unitService: UnitService;
  audioPlayerService: AudioPlayerService;
}

/**
 * Runtime state and orchestration for the closing-meta interaction phase.
 * Unit config (closingMetaButtons) stays on UnitService; this service owns the phase lifecycle.
 */
@Injectable({
  providedIn: 'root'
})
export class ClosingMetaService {
  closingMetaRunning = signal(false);
  metaInteractionDone = signal(false);

  private metaVariableId = '';

  reset(): void {
    this.closingMetaRunning.set(false);
    this.metaInteractionDone.set(false);
    this.metaVariableId = '';
  }

  /**
   * Switches the unit into the META interaction and optionally plays closing-meta audio.
   */
  startClosingMetaPhase(deps: ClosingMetaPhaseDeps): void {
    const { unitService, audioPlayerService } = deps;
    const closingMetaButtons = unitService.closingMetaButtons();

    if (closingMetaButtons?.triggerNavigationOnSelect === false) {
      unitService.continueButton.set('ON_ANY_RESPONSE');
    } else {
      unitService.continueButton.set('NO');
    }

    const parameters: InteractionParameters = {} as InteractionParameters;
    parameters.variableId = closingMetaButtons.variableIdMetaSelection;
    unitService.parameters.set(parameters);
    unitService.interaction.set('META');

    if (closingMetaButtons?.audioSource?.trim()) {
      const audioOptions: AudioOptions = {
        audioSource: closingMetaButtons.audioSource as string,
        audioId: 'closingMetaButtonsAudio'
      };
      unitService.setCurrentAudioSrc(audioOptions);
      if (closingMetaButtons.autoPlay) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        audioPlayerService.setAudioSrc(audioOptions).then(ready => {
          if (ready) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            audioPlayerService.getPlayFinished('closingMetaButtonsAudio');
          }
        });
      }
    } else {
      unitService.clearCurrentAudioSrc();
    }

    this.closingMetaRunning.set(true);
    this.metaInteractionDone.set(false);
    this.metaVariableId = closingMetaButtons.variableIdMetaSelection;
  }

  handleMetaResponses(responses: { id: string; status: string; relevantForResponsesProgress: boolean }[]): void {
    if (!this.closingMetaRunning() || !this.metaVariableId) return;
    const metaTouched = responses.some(r =>
      r.id === this.metaVariableId && r.status === 'VALUE_CHANGED' && r.relevantForResponsesProgress);
    if (metaTouched) {
      this.metaInteractionDone.set(true);
    }
  }
}
