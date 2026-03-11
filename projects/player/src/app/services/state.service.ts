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
  #showMainAudio = signal(false);
  showMainAudio = this.#showMainAudio.asReadonly();
  #showFirstClickLayer = signal(false);
  showFirstClickLayer = this.#showFirstClickLayer.asReadonly();
  #openingImageActive = signal(false);
  openingImageActive = this.#openingImageActive.asReadonly();
  #metaInteractionActive = signal(false);
  metaInteractionActive = this.#metaInteractionActive.asReadonly();
  /** current audio source for the main audio */
  #currentAudioSrc = signal<AudioOptions>({} as AudioOptions);
  currentAudioSrc = this.#currentAudioSrc.asReadonly();

  private state: StateEnum = StateEnum.INIT;

  setNewData(unitDefinition: UnitDefinition) {
    this.#firstInteractionDone.set(false);
    this.#showMainAudio.set(this.unitService.openingImageParams().audioSource !== undefined ||
      unitDefinition.mainAudio?.audioSource !== undefined);
  }

  // Public helpers for OpeningImageComponent
  startOpeningImage() {

  }

  finishOpeningImage() {
    this.#openingImageActive.set(false);
    if (this.unitService.mainAudio().audioSource) this.#currentAudioSrc.set(this.unitService.mainAudio());

  }

  layerClicked() {
    this.#showFirstClickLayer.set(false);
    this.#firstInteractionDone.set(true);
  }

  continueButtonClicked() {
    if (this.feedbackService.pendingAudioFeedback()) {

    }
  }

  newResponse(response: Response[]) {
    this.responsesService.newResponses(response);

    this.#showFirstClickLayer.set(false);


    // check for OnAnyResponse, i.e. ContinueButton Show, FeedbackAudio, NavigationNext

    // check Audio, i.e. MainAudioComplete,

    // calc ResponseState

    // calc PresentationState

    // send Response
  }
}
