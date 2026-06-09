import {
  computed, inject, Injectable,
  signal
} from '@angular/core';

import {
  AudioOptions, ClosingMetaButtonsParams,
  ContinueButtonEnum,
  FirstAudioOptionsParams,
  FirstClickLayerEnum,
  AnimateButtonEnum,
  InteractionEnum, InteractionParameters,
  OpeningImageParams,
  UnitDefinition
} from '../models/unit-definition';
import { ResponsesService } from './responses.service';
import { ComponentStateService } from './component-state.service';
import { AudioService } from './audio.service';

@Injectable({
  providedIn: 'root'
})

export class UnitService {
  responsesService = inject(ResponsesService);
  componentStateService = inject(ComponentStateService);
  audioService = inject(AudioService);

  firstAudioOptions = signal<FirstAudioOptionsParams | undefined>(undefined);
  mainAudio = signal<AudioOptions>({} as AudioOptions);
  backgroundColor = signal('#EEE');
  continueButton = signal<ContinueButtonEnum>('NO');
  interaction = signal<InteractionEnum | undefined>(undefined);
  parameters = signal<InteractionParameters>({} as InteractionParameters);
  hasInteraction = signal(false);
  ribbonBars = signal<boolean>(false);
  disableInteractionUntilComplete = signal(false);
  closingMetaButtons = signal<ClosingMetaButtonsParams>({} as ClosingMetaButtonsParams);
  openingImageParams = signal<OpeningImageParams>({} as OpeningImageParams);

  /** To hide the speaker icon when imageSource inside openingImage is being shown */
  // TODO better hideAudioButton()
  showingOpeningImage = signal<boolean>(false);

  /** To show the first click layer */
  private _firstClickLayerClicked = signal<boolean>(false);
  firstClickLayerClicked = this._firstClickLayerClicked.asReadonly();

  /** Any interaction done: click layer clicked, audio heard, or response given */
  interactionDone = computed(() => this._firstClickLayerClicked() ||
      this.componentStateService.mainAudioComplete() ||
      this.responsesService.responseProgress() !== 'none' ||
      this.componentStateService.getPresentationStatus() === 'complete');

  /** Whether to show the first click layer based on configuration and interaction status */
  showFirstClickLayer = computed(() => {
    const options = this.firstAudioOptions();
    const mainAudio = this.mainAudio();
    return (options?.firstClickLayer !== 'OFF') &&
      !!mainAudio?.audioSource &&
      !this.interactionDone();
  });

  /** Whether the continue button should be visible for the current unit and interaction state. */
  showContinueButton = computed(() => {
    if (this.openingFlowActive()) return false;
    if (this.interaction() === 'META' && this.closingMetaButtons().triggerNavigationOnSelect) {
      return false;
    }

    const responseProgress = this.responsesService.responseProgress();
    const state = this.componentStateService;
    switch (this.continueButton()) {
      case 'ALWAYS':
        return true;
      case 'ON_MAIN_AUDIO_COMPLETE':
        return state.mainAudioComplete();
      case 'ON_AUDIO_AND_RESPONSE':
        return state.mainAudioComplete() &&
          (responseProgress === 'complete' || responseProgress === 'some');
      case 'ON_VIDEO_COMPLETE':
        return state.videoComplete();
      case 'ON_ANY_RESPONSE':
        if (state.closingMetaRunning()) {
          return state.metaInteractionDone();
        }
        return responseProgress === 'some' || responseProgress === 'complete';
      case 'ON_RESPONSES_COMPLETE':
        return responseProgress === 'complete';
      default:
        return false;
    }
  });

  /** Whether the interaction overlay should block user input. */
  interactionDisabled = computed(() =>
    (this.disableInteractionUntilComplete() && !this.componentStateService.mainAudioComplete()) ||
    this.componentStateService.feedbackActive());

  /** Opening flow is active: interactions and main audio hidden */
  private _openingFlowActive = signal<boolean>(false);
  openingFlowActive = this._openingFlowActive.asReadonly();

  /** Triggers a single automatic main-audio play after the opening image phase ends. */
  private _autoPlayMainAudioOnce = signal(false);
  autoPlayMainAudioOnce = this._autoPlayMainAudioOnce.asReadonly();

  /** current audio source for the main audio */
  private _currentAudioSrc = signal<AudioOptions>({} as AudioOptions);
  currentAudioSrc = this._currentAudioSrc.asReadonly();

  /** Marks the first click as done to hide the layer and allow audio playback */
  setFirstClickLayerClicked() {
    this._firstClickLayerClicked.set(true);
    this.responsesService.updatePresentationProgress('some');
  }

  finishOpeningFlow() {
    this._openingFlowActive.set(false);
    if (this.mainAudio().audioSource) this._currentAudioSrc.set(this.mainAudio());
  }

  /** Clears the active audio source during silent opening-image display. */
  clearCurrentAudioSrc(): void {
    this._currentAudioSrc.set({} as AudioOptions);
  }

  requestMainAudioAutoPlayOnce(): void {
    this._autoPlayMainAudioOnce.set(true);
  }

  clearMainAudioAutoPlayOnce(): void {
    this._autoPlayMainAudioOnce.set(false);
  }

  /** Starts the closing meta phase */
  startClosingMeta() {
    // TODO: Change this logic
    if (this.closingMetaButtons()?.triggerNavigationOnSelect === false) {
      this.continueButton.set('ON_ANY_RESPONSE');
    } else {
      this.continueButton.set('NO');
    }

    const parameters: InteractionParameters = {} as InteractionParameters;
    parameters.variableId = this.closingMetaButtons().variableIdMetaSelection;
    this.parameters.set(parameters);
    this.interaction.set('META');
    if (this.closingMetaButtons()?.audioSource?.trim()) {
      const audioOptions: AudioOptions = {
        audioSource: this.closingMetaButtons().audioSource as string,
        audioId: 'closingMetaButtonsAudio'
      };
      this._currentAudioSrc.set(audioOptions);
      if (this.closingMetaButtons().autoPlay) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.audioService.setAudioSrc(audioOptions).then(ready => {
          if (ready) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.audioService.getPlayFinished('closingMetaButtonsAudio');
          }
        });
      }
    } else {
      this._currentAudioSrc.set({} as AudioOptions);
    }
    this.componentStateService.startClosingMeta(this.closingMetaButtons().variableIdMetaSelection);
  }

  reset() {
    this.audioService.reset();
    this.mainAudio.set({} as AudioOptions);
    this.firstAudioOptions.set(undefined);
    this.backgroundColor.set('#EEE');
    this.continueButton.set('NO');
    this.interaction.set(undefined);
    this.parameters.set({} as InteractionParameters);
    this.hasInteraction.set(false);
    this.ribbonBars.set(false);
    this.disableInteractionUntilComplete.set(false);
    this.closingMetaButtons.set({} as ClosingMetaButtonsParams);
    this.openingImageParams.set({} as OpeningImageParams);
    this.showingOpeningImage.set(false);
    this._openingFlowActive.set(false);
    this._firstClickLayerClicked.set(false);
    this._autoPlayMainAudioOnce.set(false);
  }

  setNewData(unitDefinition: unknown) {
    this.reset();
    const def = unitDefinition as UnitDefinition;
    const firstAudioOptions: FirstAudioOptionsParams = {};
    this.firstAudioOptions.set(def.firstAudioOptions || firstAudioOptions);
    this.hasInteraction.set(def.interactionType !== undefined || def.interactionParameters !== undefined);
    // add audioId to the mainAudio object to be able to use it in audioService.setAudioSrc()
    const mainAudio: AudioOptions | undefined = def.mainAudio ?
      ({ ...def.mainAudio, audioId: 'mainAudio' } as AudioOptions) :
      undefined;

    // Backward compatibility for animateButton and firstClickLayer (which were previously inside mainAudio)
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

    // Backward compatibility boolean firstClickLayer
    if (typeof this.firstAudioOptions()?.firstClickLayer === 'boolean') {
      const firstClickLayer: FirstClickLayerEnum = this.firstAudioOptions()?.firstClickLayer ? 'TRANSPARENT' : 'OFF';
      this.firstAudioOptions.set({ ...this.firstAudioOptions(), firstClickLayer: firstClickLayer });
    }

    // Backward compatibility boolean animateButton
    if (typeof this.firstAudioOptions()?.animateButton === 'boolean') {
      const animateButton: AnimateButtonEnum = this.firstAudioOptions()?.animateButton ? 'BOLD' : 'OFF';
      this.firstAudioOptions.set({ ...this.firstAudioOptions(), animateButton: animateButton });
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
    if (def.interactionParameters) {
      if (def.interactionType === 'WRITE') {
        const writeParams = def.interactionParameters as any;
        // Backward compatibility for old WRITE Property keysToAdd
        if (!writeParams.keysLine4) {
          if (writeParams.addUmlautKeys) {
            const umlautKeys = ['ä', 'ö', 'ü'];
            writeParams.keysLine4 = [...umlautKeys];
          }
          if (writeParams.keysToAdd) {
            writeParams.keysLine4 = [...writeParams.keysLine4, ...writeParams.keysToAdd];
          }
        }
      }
      this.parameters.set(def.interactionParameters);
    }
    if (def.ribbonBars) this.ribbonBars.set(def.ribbonBars);
    if (def.closingMetaButtons) this.closingMetaButtons.set(def.closingMetaButtons);
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
