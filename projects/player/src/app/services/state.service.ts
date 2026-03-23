import { computed, inject, Injectable, signal } from '@angular/core';

import { Response } from '@iqbspecs/response/response.interface';

import { FeedbackService } from "./feedback.service";
import { ResponsesService } from "./responses.service";
import { AudioService } from "./audio.service";
import { AudioOptions, OpeningImageParams, UnitDefinition } from '../models/unit-definition';
import { StateEnum } from "../models/state";
import { UnitService } from "./unit.service";
import { Progress, UnitState, UnitStateDataType } from "../models/verona";
import { VeronaPostService } from "./verona-post.service";

@Injectable({
  providedIn: 'root'
})

export class StateService {
  private feedbackService = inject(FeedbackService);
  private responsesService = inject(ResponsesService);
  private unitService = inject(UnitService);
  private veronaPostService = inject(VeronaPostService);
  private audioService = inject(AudioService);

  #presentationProgress = signal<Progress>('none');
  #responseProgress = signal<Progress>('none');
  private lastResponsesString = '';

  #mainAudioComplete = signal(false);

  #interactionDone = signal(false);
  interactionDone = this.#interactionDone.asReadonly();

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

  practiceMode = computed(() => {
    return this.unitService.ribbonBars();
  });

  showDisableInteractionLayer = computed(() => {
    return (this.unitService.disableInteractionUntilComplete() && !this.responsesService.mainAudioComplete()) ||
      this.feedbackService.feedbackActive();
  });


  setNewData(unitDefinition: UnitDefinition) {
    this.#interactionDone.set(false);
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
    this.#interactionDone.set(true);
  }

  continueButtonClicked() {
    if (this.feedbackService.pendingAudioFeedback()) {

    }
  }

  mainAudioClicked() {
    this.#interactionDone.set(true);
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

  /**
   * Updates the unit's presentation progress (e.g., 'none', 'some', 'complete').
   * This status is used to track whether the user has interacted with the unit's
   * presentation elements, such as dismissing the click-layer or finishing the main audio.
   * A 'complete' status cannot be downgraded to 'some' or 'none'.
   * Each update triggers a vopStateChangedNotification to the Verona host.
   */
  updatePresentationProgress(progress: Progress): void {
    if (this.#presentationProgress() === 'complete' && progress !== 'complete') {
      return;
    }
    this.#presentationProgress.set(progress);
    const unitState: UnitState = {
      unitStateDataType: UnitStateDataType,
      dataParts: {
        responses: this.lastResponsesString
      },
      responseProgress: this.#responseProgress(),
      presentationProgress: this.getPresentationStatus()
    };
    if (this.veronaPostService) {
      this.veronaPostService.sendVopStateChangedNotification({ unitState });
    }
  }

  /**
   * Get PresentationStatus
   * when loaded -> 'some'
   * when audio finished -> 'complete'
   */
  getPresentationStatus(): Progress {
    // TODO check for other possibilities
    if (this.#mainAudioComplete()) return 'complete';
    return 'some';
  }
}
