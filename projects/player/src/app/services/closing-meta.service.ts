import { Injectable, signal } from '@angular/core';

import { AudioOptions, ClosingMetaButtonsParams, InteractionParameters } from '../models/unit-definition';
import { AudioPlayerService } from './audio-player.service';
import type { UnitService } from './unit.service';

export interface MetaResponseTouch {
  id: string;
  status: string;
  relevantForResponsesProgress: boolean;
}

/** Hooks into the response store for derived meta-outcome coding and Verona posts. */
export interface ClosingMetaResponseHooks {
  deriveMetaOutcome(buttons: ClosingMetaButtonsParams): void;
  notifyResponsesChanged(triggerResponses?: MetaResponseTouch[]): void;
}

export interface ClosingMetaPhaseDeps {
  unitService: UnitService;
  audioPlayerService: AudioPlayerService;
  hooks: ClosingMetaResponseHooks;
}

/**
 * Orchestrates the closing-meta phase after the main interaction finishes.
 * Manages phase state, UI setup, and meta-selection tracking.
 * Invokes response hooks to derive and post the meta-outcome variable.
 */
@Injectable({
  providedIn: 'root'
})
export class ClosingMetaService {
  closingMetaRunning = signal(false);
  metaInteractionDone = signal(false);
  closingMetaButtons = signal<ClosingMetaButtonsParams>({} as ClosingMetaButtonsParams);

  private metaVariableId = '';

  reset(): void {
    this.closingMetaRunning.set(false);
    this.metaInteractionDone.set(false);
    this.closingMetaButtons.set({} as ClosingMetaButtonsParams);
    this.metaVariableId = '';
  }

  /**
   * Switches the unit into the META interaction and optionally plays closing-meta audio.
   */
  startClosingMetaPhase(deps: ClosingMetaPhaseDeps): void {
    const { unitService, audioPlayerService, hooks } = deps;
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

    this.closingMetaButtons.set(closingMetaButtons);
    this.closingMetaRunning.set(true);
    this.metaInteractionDone.set(false);
    this.metaVariableId = closingMetaButtons.variableIdMetaSelection;

    hooks.deriveMetaOutcome(this.closingMetaButtons());
    hooks.notifyResponsesChanged();
  }

  /**
   * Handles a response batch during or outside the closing-meta phase.
   * Tracks meta selection and refreshes the derived outcome when the phase is active.
   */
  onResponsesBatch(responses: MetaResponseTouch[], hooks: ClosingMetaResponseHooks): void {
    this.trackMetaSelection(responses);
    if (!this.closingMetaRunning()) return;
    hooks.deriveMetaOutcome(this.closingMetaButtons());
  }

  private trackMetaSelection(responses: MetaResponseTouch[]): void {
    if (!this.closingMetaRunning() || !this.metaVariableId) return;
    const metaTouched = responses.some(r =>
      r.id === this.metaVariableId && r.status === 'VALUE_CHANGED' && r.relevantForResponsesProgress);
    if (metaTouched) {
      this.metaInteractionDone.set(true);
    }
  }
}
