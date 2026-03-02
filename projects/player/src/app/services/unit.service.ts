import { Injectable, signal, inject, computed } from '@angular/core';
import { AudioService } from './audio.service';

import {
  AudioOptions,
  ContinueButtonEnum,
  FirstAudioOptionsParams,
  InteractionEnum,
  InteractionParameters,
  OpeningImageParams,
  UnitDefinition
} from '../models/unit-definition';
import { ResponsesService } from "./responses.service";

@Injectable({
  providedIn: 'root'
})

export class UnitService {
  private audioService = inject(AudioService);
  private responsesService = inject(ResponsesService);

  // TODO make more signals readonly
  firstAudioOptions = signal<FirstAudioOptionsParams>({} as FirstAudioOptionsParams);
  mainAudio = signal<AudioOptions>({} as AudioOptions);
  backgroundColor = signal('#EEE');
  continueButton = signal<ContinueButtonEnum>('NO');
  interaction = signal<InteractionEnum | undefined>(undefined);
  parameters = signal<InteractionParameters>({});
  hasInteraction = signal(false);
  ribbonBars = signal<boolean>(false);
  disableInteractionUntilComplete = signal(false);
  openingImageParams = signal<OpeningImageParams>({} as OpeningImageParams);

  /** To hide the speaker icon when imageSource inside openingImage is being shown */
  // TODO better hideAudioButton()
  showingOpeningImage = signal<boolean>(false);

  /** To show the first click layer */
  private _firstClickLayerClicked = signal<boolean>(false);
  firstClickLayerClicked = this._firstClickLayerClicked.asReadonly();

  /** Any interaction done: click layer clicked, audio heard, or response given */
  interactionDone = computed(() => this._firstClickLayerClicked() ||
      this.responsesService.mainAudioComplete() ||
      this.responsesService.responseProgress() !== 'none' ||
      this.responsesService.getPresentationStatus() === 'complete');

  /** Whether to show the first click layer based on configuration and interaction status */
  showFirstClickLayer = computed(() => {
    const options = this.firstAudioOptions();
    const mainAudio = this.mainAudio();
    return !!options?.firstClickLayer &&
      !!mainAudio?.audioSource &&
      !this.interactionDone();
  });

  /** Opening flow is active: interactions and main audio hidden */
  // TODO rename functions to be more descriptive
  private _openingFlowActive = signal<boolean>(false);
  openingFlowActive = this._openingFlowActive.asReadonly();

  /** Player button status: ready, paused, playing, ended, hide */
  /** current audio source for the main audio */
  private _currentAudioSrc = signal<AudioOptions>({} as AudioOptions);
  currentAudioSrc = this._currentAudioSrc.asReadonly();

  // Public helpers for OpeningImageComponent
  startOpeningFlow(params: OpeningImageParams = {} as OpeningImageParams) {
    this.openingImageParams.set(params);
    this._openingFlowActive.set(true);
  }

  /** Marks the first click as done to hide the layer and allow audio playback */
  setFirstClickLayerClicked() {
    this._firstClickLayerClicked.set(true);
  }

  finishOpeningFlow() {
    this._openingFlowActive.set(false);
    if (this.mainAudio().audioSource) this._currentAudioSrc.set(this.mainAudio());
  }

  reset() {
    this.mainAudio.set({} as AudioOptions);
    this.firstAudioOptions.set({} as FirstAudioOptionsParams);
    this.backgroundColor.set('#EEE');
    this.continueButton.set('NO');
    this.interaction.set(undefined);
    this.parameters.set({});
    this.ribbonBars.set(false);
    this.disableInteractionUntilComplete.set(false);
    this.openingImageParams.set({} as OpeningImageParams);
    this.showingOpeningImage.set(false);
    this._openingFlowActive.set(false);
    this._firstClickLayerClicked.set(false);
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
    const pattern = /^#([a-f0-9]{3}|[a-f0-9]{6})$/i;
    if (def.backgroundColor && pattern.test(def.backgroundColor)) {
      this.backgroundColor.set(def.backgroundColor);
    }
    if (def.continueButtonShow) {
      this.continueButton.set(def.continueButtonShow);
    } else {
      this.continueButton.set('ALWAYS');
    }
    if (def.interactionType) this.interaction.set(def.interactionType);
    if (def.interactionParameters) this.parameters.set(def.interactionParameters);
    if (def.ribbonBars) this.ribbonBars.set(def.ribbonBars);
    if (def.mainAudio?.disableInteractionUntilComplete) {
      this.disableInteractionUntilComplete.set(def.mainAudio.disableInteractionUntilComplete);
    }

    /** starts opening flow if openingImage is set and imageSource is set */
    if (def.openingImage && def.openingImage.imageSource) {
      this.openingImageParams.set(def.openingImage);
      this._openingFlowActive.set(true);
    }

    if (mainAudio) this.mainAudio.set(mainAudio);

    const openingAudioSource = def.openingImage?.audioSource?.trim();
    const openingParams = def.openingImage;
    // TODO don't access audioService directly, only
    if (openingAudioSource && openingParams) {
      this.openingImageParams.set(openingParams);
      this._currentAudioSrc.set({
        audioSource: openingAudioSource,
        audioId: 'openingAudio'
      } as AudioOptions);
    } else if (mainAudio?.audioSource) {
      this._currentAudioSrc.set(mainAudio);
    }
  }
}
