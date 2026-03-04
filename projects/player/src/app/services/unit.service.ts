import { Injectable, signal, inject, computed } from '@angular/core';

import {
  AudioOptions,
  ContinueButtonEnum,
  FirstAudioOptionsParams,
  InteractionEnum,
  InteractionParameters,
  MetaInteractionParams,
  OpeningImageParams,
  UnitDefinition
} from '../models/unit-definition';

@Injectable({
  providedIn: 'root'
})

/**
 * UnitService holds UnitDefinition, calculate Parameters, Fallback versioning
 */
export class UnitService {
  // TODO make more signals readonly
  firstAudioOptions = signal<FirstAudioOptionsParams>({} as FirstAudioOptionsParams);
  mainAudio = signal<AudioOptions>({} as AudioOptions);
  backgroundColor = signal('#EEE');
  continueButton = signal<ContinueButtonEnum>('NO');
  interaction = signal<InteractionEnum | undefined>(undefined);
  parameters = signal<InteractionParameters>({});
  ribbonBars = signal<boolean>(false);
  disableInteractionUntilComplete = signal(false);
  openingImageParams = signal<OpeningImageParams>({} as OpeningImageParams);
  metaInteraction = signal<MetaInteractionParams>({} as MetaInteractionParams);

  reset() {
    this.firstAudioOptions.set({} as FirstAudioOptionsParams);
    this.mainAudio.set({} as AudioOptions);
    this.backgroundColor.set('#EEE');
    this.continueButton.set('NO');
    this.interaction.set(undefined);
    this.parameters.set({});
    this.ribbonBars.set(false);
    this.disableInteractionUntilComplete.set(false);
    this.openingImageParams.set({} as OpeningImageParams);
    this.metaInteraction.set({} as MetaInteractionParams);
  }

  setNewData(unitDefinition: unknown) {
    this.reset();
    const def = unitDefinition as UnitDefinition;
    this.firstAudioOptions.set(def.firstAudioOptions || {});

    // add audioId to the mainAudio object to be able to use it in audioService.setAudioSrc()
    const mainAudio: AudioOptions | undefined = def.mainAudio ?
      ({ ...def.mainAudio, audioId: 'mainAudio' } as AudioOptions) :
      undefined;

    // Backward compatibility for animateButton and firstClickLayer
    if (mainAudio?.animateButton) {
      if (!this.firstAudioOptions()?.animateButton) {
        this.firstAudioOptions.set({ ...this.firstAudioOptions(), animateButton: mainAudio.animateButton });
      }
    }
    if (mainAudio?.firstClickLayer) {
      if (!this.firstAudioOptions()?.firstClickLayer) {
        this.firstAudioOptions.set({ ...this.firstAudioOptions(), firstClickLayer: mainAudio.firstClickLayer });
      }
    }
    if (mainAudio) this.mainAudio.set(mainAudio);

    // check for valid background color
    const pattern = /^#([a-f0-9]{3}|[a-f0-9]{6})$/i;
    if (def.backgroundColor && pattern.test(def.backgroundColor)) {
      this.backgroundColor.set(def.backgroundColor);
    }

    this.continueButton.set(def.continueButtonShow || 'ALWAYS');
    this.interaction.set(def.interactionType);
    this.parameters.set(def.interactionParameters || {});
    this.ribbonBars.set(def.ribbonBars || false);
    this.disableInteractionUntilComplete.set(def.mainAudio?.disableInteractionUntilComplete || false);
  }
}
