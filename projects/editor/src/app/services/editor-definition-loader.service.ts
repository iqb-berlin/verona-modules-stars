import {
  InteractionEnum,
  InteractionParameters,
  UnitDefinition
} from '@shared/models/unit-definition';
import { EditorStatePatch } from './editor-state.model';
import { EditorInteractionAdapterRegistry } from './editor-interaction-adapters';

export class EditorDefinitionLoaderService {
  constructor(private interactionAdapters: EditorInteractionAdapterRegistry = new EditorInteractionAdapterRegistry()) {}

  loadFromJson(json: string): EditorStatePatch {
    const rawDef = JSON.parse(json) as Record<string, unknown>;
    const def = rawDef as unknown as UnitDefinition;
    const interactionTypeResult = this.readInteractionType(rawDef);
    const interactionType = interactionTypeResult.interactionType;
    const patch: EditorStatePatch = {
      unitId: def.id || 'stars-unit-definition',
      unitVersion: def.version || '',
      backgroundColor: def.backgroundColor ?? '#EEE',
      ribbonBars: def.ribbonBars ?? false,
      continueButtonShow: def.continueButtonShow || 'ALWAYS',
      interactionType,
      unsupportedInteractionType: interactionTypeResult.unsupportedInteractionType,
      interactionMaxTimeMS: def.interactionMaxTimeMS,
      mainAudioEnabled: !!def.mainAudio,
      mainAudioSource: def.mainAudio?.audioSource || '',
      mainAudioMaxPlay: def.mainAudio?.maxPlay ?? 0,
      mainAudioDisableInteractionUntilComplete: def.mainAudio?.disableInteractionUntilComplete || false,
      firstClickLayer: def.firstAudioOptions?.firstClickLayer ?? 'OFF',
      animateButton: def.firstAudioOptions?.animateButton ?? 'OFF',
      openingImageEnabled: !!def.openingImage,
      openingImageSource: def.openingImage?.imageSource || '',
      openingAudioSource: def.openingImage?.audioSource || '',
      openingPresentationDurationMS: def.openingImage?.presentationDurationMS ?? 1500,
      interactionParams: this.readInteractionParameters(def, interactionTypeResult),
      variableInfo: def.variableInfo || [],
      audioFeedbackEnabled: !!def.audioFeedback,
      audioFeedback: def.audioFeedback,
      closingMetaButtons: def.closingMetaButtons
    };

    const firstAudioOptions = def.firstAudioOptions ?? {};
    if (def.mainAudio?.firstClickLayer !== undefined &&
      !Object.prototype.hasOwnProperty.call(firstAudioOptions, 'firstClickLayer')) {
      patch.firstClickLayer = def.mainAudio.firstClickLayer;
    }
    if (def.mainAudio?.animateButton !== undefined &&
      !Object.prototype.hasOwnProperty.call(firstAudioOptions, 'animateButton')) {
      patch.animateButton = def.mainAudio.animateButton;
    }

    return patch;
  }

  private readInteractionType(rawDef: Record<string, unknown>): InteractionTypeLoadResult {
    if (typeof rawDef.interactionType !== 'string') {
      return { interactionType: 'BUTTONS' };
    }
    if (rawDef.interactionType === 'META_BUTTONS') {
      return { interactionType: 'META' };
    }
    if (this.interactionAdapters.isSupported(rawDef.interactionType)) {
      return { interactionType: rawDef.interactionType };
    }
    return {
      interactionType: 'NONE',
      unsupportedInteractionType: rawDef.interactionType
    };
  }

  private readInteractionParameters(
    def: UnitDefinition,
    interactionTypeResult: InteractionTypeLoadResult
  ): InteractionParameters {
    if (interactionTypeResult.unsupportedInteractionType) {
      return def.interactionParameters || ({} as InteractionParameters);
    }
    if (def.interactionParameters) {
      return this.interactionAdapters.normalize(
        interactionTypeResult.interactionType,
        def.interactionParameters
      );
    }
    return this.interactionAdapters.defaultParams(interactionTypeResult.interactionType);
  }
}

interface InteractionTypeLoadResult {
  interactionType: InteractionEnum;
  unsupportedInteractionType?: string;
}
