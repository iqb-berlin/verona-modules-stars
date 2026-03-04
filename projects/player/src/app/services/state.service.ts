import { computed, inject, Injectable, signal } from '@angular/core';

import { Response } from '@iqbspecs/response/response.interface';

import { FeedbackService } from "./feedback.service";
import { ResponsesService } from "./responses.service";
import { AudioService } from "./audio.service";
import { AudioOptions, OpeningImageParams, UnitDefinition } from '../models/unit-definition';
import { StateEnum } from "../models/state";
import { UnitService } from "./unit.service";

@Injectable({
  providedIn: 'root'
})

export class StateService {
  private feedbackService = inject(FeedbackService);
  private responsesService = inject(ResponsesService);
  private unitService = inject(UnitService);
  private audioService = inject(AudioService);

  #firstInteractionDone = signal(false);
  firstInteractionDone = this.#firstInteractionDone.asReadonly();
  #firstClickLayerActive = signal(false);
  firstClickLayerActive = this.#firstClickLayerActive.asReadonly();
  #showMainAudio = signal(false);
  showMainAudio = this.#showMainAudio.asReadonly();
  #openingImageActive = signal(false);
  openingImageActive = this.#openingImageActive.asReadonly();
  #metaInteractionActive = signal(false);
  metaInteractionActive = this.#metaInteractionActive.asReadonly();

  private state: StateEnum = StateEnum.INIT;

  setNewData(unitDefinition: UnitDefinition) {
    this.#firstInteractionDone.set(false);
    this.#firstClickLayerActive.set(unitDefinition.firstAudioOptions?.firstClickLayer ?? false);
    this.#showMainAudio.set(unitDefinition.mainAudio?.audioSource !== undefined);
  }

  /** Whether to show the first click layer based on configuration and interaction status */
  showFirstClickLayer = computed(() => {
    const options = this.unitService.firstAudioOptions();
    const mainAudio = this.unitService.mainAudio();
    return !!options?.firstClickLayer &&
      !!mainAudio?.audioSource &&
      !this.interactionDone();
  });

  // Public helpers for OpeningImageComponent
  startOpeningFlow(params: OpeningImageParams = {} as OpeningImageParams) {
    this.unitService.openingImageParams.set(params);
    this.#openingImageActive.set(true);
  }

  finishOpeningFlow() {
    this.#openingImageActive.set(false);
    if (this.unitService.mainAudio().audioSource) this._currentAudioSrc.set(this.unitService.mainAudio());
  }

  /** Any interaction done: click layer clicked, audio heard, or response given */
  interactionDone= computed(() => this.firstClickLayerActive() ||
    this.responsesService.mainAudioComplete() ||
    this.responsesService.getResponseStatus() !== 'none' ||
    this.responsesService.getPresentationStatus() === 'complete');

  layerClicked() {
    if (this.state === StateEnum.INIT) {}
    this.#firstClickLayerActive.set(false);
    this.#firstInteractionDone.set(true);
  }

  /** Player button status: ready, paused, playing, ended, hide */
  /** current audio source for the main audio */
  private _currentAudioSrc = signal<AudioOptions>({} as AudioOptions);
  currentAudioSrc = this._currentAudioSrc.asReadonly();


  continueButtonClicked() {
    if (this.feedbackService.pendingAudioFeedback()) {

    }
  }

  newResponse(response: Response[]) {
    // check for OnAnyResponse, i.e. ContinueButton Show, FeedbackAudio, NavigationNext

    // check Audio, i.e. MainAudioComplete,

    // calc ResponseState

    // calc PresentationState

    // send Response
  }
}
