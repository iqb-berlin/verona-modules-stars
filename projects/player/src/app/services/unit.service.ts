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
import { UnitState, UnitStateDataType, Progress } from '../models/verona';
import { Response } from '@iqbspecs/response/response.interface';
import { ResponsesService } from './responses.service';
import { ComponentStateService } from './component-state.service';
import { AudioFeedbackService } from './audio-feedback.service';
import { ClosingMetaService } from './closing-meta.service';
import { AudioPlayerService } from './audio-player.service';
import { VeronaPostService } from './verona-post.service';

/**
 * Holds unit-definition config, layout, and computed UI state for the active item.
 * Orchestrates unit load: definition parsing, backward compatibility, and former state.
 * Delegates response storage and coding to ResponsesService.
 */
@Injectable({
  providedIn: 'root'
})

export class UnitService {
  responsesService = inject(ResponsesService);
  componentStateService = inject(ComponentStateService);
  audioFeedbackService = inject(AudioFeedbackService);
  closingMetaService = inject(ClosingMetaService);
  audioPlayerService = inject(AudioPlayerService);
  veronaPostService = inject(VeronaPostService);

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

  /** Full-screen overlay before presentation starts; applies during opening and main phases when mainAudio exists. */
  showFirstClickLayer = computed(() => {
    const options = this.firstAudioOptions();
    const mainAudio = this.mainAudio();
    return !this.isFirstClickLayerOff(options?.firstClickLayer) &&
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
    const presentation = this.componentStateService;
    const closingMeta = this.closingMetaService;
    switch (this.continueButton()) {
      case 'ALWAYS':
        return true;
      case 'ON_MAIN_AUDIO_COMPLETE':
        return presentation.mainAudioComplete();
      case 'ON_AUDIO_AND_RESPONSE':
        return presentation.mainAudioComplete() &&
          (responseProgress === 'complete' || responseProgress === 'some');
      case 'ON_VIDEO_COMPLETE':
        return presentation.videoComplete();
      case 'ON_ANY_RESPONSE':
        if (closingMeta.closingMetaRunning()) {
          return closingMeta.metaInteractionDone();
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
    this.audioFeedbackService.feedbackActive());

  /** Opening flow is active: interactions and main audio hidden */
  private _openingFlowActive = signal<boolean>(false);
  openingFlowActive = this._openingFlowActive.asReadonly();

  /** Triggers a single automatic main-audio play after the opening image phase ends. */
  private _autoPlayMainAudioOnce = signal(false);
  autoPlayMainAudioOnce = this._autoPlayMainAudioOnce.asReadonly();

  /** current audio source for the main audio */
  private _currentAudioSrc = signal<AudioOptions>({} as AudioOptions);
  currentAudioSrc = this._currentAudioSrc.asReadonly();

  /** Whether firstClickLayer is unset or explicitly OFF. */
  isFirstClickLayerOff(layer: FirstClickLayerEnum | boolean | undefined = this.firstAudioOptions()?.firstClickLayer): boolean {
    return !layer || layer === 'OFF';
  }

  /** Marks the first click as done to hide the layer and allow audio playback */
  setFirstClickLayerClicked() {
    this._firstClickLayerClicked.set(true);
    this.responsesService.updatePresentationProgress('some');
  }

  /**
   * Loads a unit from the Verona host or standalone menu.
   * Initializes ResponsesService coding rules, restores former state, then applies unit config.
   */
  loadUnit(unitDefinition: unknown, unitState: UnitState | null = null): void {
    const def = unitDefinition as UnitDefinition;
    this.responsesService.initResponseConfig(def);
    if (this.responsesService.unitDefinitionProblem()) {
      return;
    }
    if (unitState) {
      this.setFormerState(unitState);
    }
    this.setNewData(def);
  }

  /** Restores saved responses and presentation progress from a Verona unitState. */
  private setFormerState(unitState: UnitState | null): void {
    const rs = this.responsesService;
    const prevPresentation = this.componentStateService.getPresentationStatus();
    const prevResponse = rs.responseProgress();

    rs.formerStateResponses.set([]);
    rs.allResponses = [];
    rs.lastResponsesString = '';
    rs.responseProgress.set('none');
    this.componentStateService.reset();
    this.componentStateService.updatePresentationProgress('some');

    if (unitState?.dataParts) {
      const dataParts = unitState.dataParts || {};
      const responsesJson = dataParts.responses;

      if (responsesJson) {
        try {
          const parsedResponses = JSON.parse(responsesJson as string) as Response[];
          rs.formerStateResponses.set(parsedResponses);
          rs.allResponses = JSON.parse(JSON.stringify(parsedResponses));
          rs.lastResponsesString = responsesJson as string;

          const mainAudioResp = parsedResponses.find(r => r.id === 'mainAudio');
          const videoResp = parsedResponses.find(r => r.id === 'VIDEO');
          const restorePresentationState: {
            presentationProgress?: Progress;
            mainAudioComplete?: boolean;
            videoComplete?: boolean;
          } = {};
          if (unitState.presentationProgress !== undefined) {
            restorePresentationState.presentationProgress = unitState.presentationProgress;
          }
          if (mainAudioResp) {
            restorePresentationState.mainAudioComplete =
              UnitService.asNumberOrZero(mainAudioResp.value) >= 1;
          }
          if (videoResp) {
            restorePresentationState.videoComplete =
              UnitService.asNumberOrZero(videoResp.value) >= 1;
          }
          this.componentStateService.restorePresentationState(restorePresentationState);

          const hasInteractionValueChanged =
            parsedResponses.some(r => (r.status === 'VALUE_CHANGED' || r.status === 'CODING_COMPLETE') &&
              r.id !== 'mainAudio' && r.id !== 'VIDEO');
          if (hasInteractionValueChanged) {
            rs.responseProgress.set('complete');
          } else if (unitState.responseProgress) {
            rs.responseProgress.set(unitState.responseProgress);
          }
        } catch (error) {
          console.warn('UNIT SERVICE Failed to parse former state responses:', error);
        }
      }
    }

    const newPresentation = this.componentStateService.getPresentationStatus();
    const newResponse = rs.responseProgress();
    if ((newPresentation !== prevPresentation || newResponse !== prevResponse) && this.veronaPostService) {
      const restoredDataParts: Record<string, string> = unitState?.dataParts ?
        { ...unitState.dataParts } :
        {};
      const unitStateToPost: UnitState = {
        unitStateDataType: UnitStateDataType,
        dataParts: restoredDataParts,
        responseProgress: newResponse,
        presentationProgress: newPresentation
      };

      if (restoredDataParts.responses) {
        rs.lastResponsesString = restoredDataParts.responses;
      }

      this.veronaPostService.sendVopStateChangedNotification({ unitState: unitStateToPost });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private static asNumberOrZero(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'boolean') return value ? 1 : 0;
    if (typeof value === 'string') {
      const n = Number.parseFloat(value);
      return Number.isNaN(n) ? 0 : n;
    }
    if (Array.isArray(value)) return value.length > 0 ? UnitService.asNumberOrZero(value[0]) : 0;
    return 0;
  }

  finishOpeningFlow() {
    this._openingFlowActive.set(false);
    if (this.mainAudio().audioSource) this._currentAudioSrc.set(this.mainAudio());
  }

  setCurrentAudioSrc(audio: AudioOptions): void {
    this._currentAudioSrc.set(audio);
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
    this.closingMetaService.startClosingMetaPhase({
      unitService: this,
      audioPlayerService: this.audioPlayerService,
      hooks: this.responsesService
    });
  }

  reset() {
    this.audioPlayerService.reset();
    this.mainAudio.set({} as AudioOptions);
    this._currentAudioSrc.set({} as AudioOptions);
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

  /**
   * Applies presentation and interaction config from the unit definition (interaction type,
   * audio, opening image, continue button, etc.). Called by loadUnit after the response
   * subsystem is initialized; does not configure coding rules or restore saved responses.
   */
  setNewData(unitDefinition: unknown) {
    this.reset();
    const def = unitDefinition as UnitDefinition;
    const firstAudioOptions: FirstAudioOptionsParams = {};
    this.firstAudioOptions.set(def.firstAudioOptions || firstAudioOptions);
    this.hasInteraction.set(def.interactionType !== undefined || def.interactionParameters !== undefined);
    // add audioId to the mainAudio object to be able to use it in audioPlayerService.setAudioSrc()
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
