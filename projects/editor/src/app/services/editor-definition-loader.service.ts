import {
  FirstClickLayerEnum,
  InteractionEnum,
  UnitDefinition
} from '@shared/models/unit-definition';
import { EditorStatePatch } from './editor-state.model';
import { EditorInteractionAdapterRegistry } from './editor-interaction-adapters';

export class EditorDefinitionLoaderService {
  constructor(private interactionAdapters: EditorInteractionAdapterRegistry = new EditorInteractionAdapterRegistry()) {}

  loadFromJson(json: string): EditorStatePatch {
    const rawDef = JSON.parse(json) as Record<string, unknown>;
    const def = rawDef as unknown as UnitDefinition;
    const interactionType = this.readInteractionType(rawDef);
    const patch: EditorStatePatch = {
      unitId: def.id || 'stars-unit-definition',
      unitVersion: def.version || '',
      backgroundColor: def.backgroundColor ?? '#EEE',
      ribbonBars: def.ribbonBars ?? false,
      continueButtonShow: def.continueButtonShow || 'ALWAYS',
      interactionType,
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
      interactionParams: def.interactionParameters ?
        this.interactionAdapters.normalize(interactionType, def.interactionParameters) :
        this.interactionAdapters.defaultParams(interactionType),
      variableInfo: def.variableInfo || [],
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

  // eslint-disable-next-line class-methods-use-this
  private readInteractionType(rawDef: Record<string, unknown>): InteractionEnum {
    if (typeof rawDef.interactionType !== 'string') {
      return 'BUTTONS';
    }
    return rawDef.interactionType === 'META' || rawDef.interactionType === 'META_BUTTONS' ?
      'META' :
      rawDef.interactionType as InteractionEnum;
  }
}
