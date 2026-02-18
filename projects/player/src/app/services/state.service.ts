import { Injectable, signal } from '@angular/core';

import { UnitDefinition } from '../models/unit-definition';

@Injectable({
  providedIn: 'root'
})

export class StateService {
  #firstInteractionDone = signal(false);
  firstInteractionDone = this.#firstInteractionDone.asReadonly();
  #firstClickLayerActive = signal(false);
  firstClickLayerActive = this.#firstClickLayerActive.asReadonly();
  #showMainAudio = signal(false);
  showMainAudio = this.#showMainAudio.asReadonly();

  setNewData(unitDefinition: UnitDefinition) {
    this.#firstInteractionDone.set(false);
    this.#firstClickLayerActive.set(unitDefinition.firstAudioOptions?.firstClickLayer ?? false);
    this.#showMainAudio.set(unitDefinition.mainAudio?.audioSource !== undefined);
  }

  interactionDone() {
    this.#firstInteractionDone.set(true);
  }

  layerClicked() {
    this.#firstClickLayerActive.set(false);
  }
}
