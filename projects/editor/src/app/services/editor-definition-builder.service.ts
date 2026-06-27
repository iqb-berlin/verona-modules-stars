import {
  FirstAudioOptionsParams,
  MainAudio,
  OpeningImageParams,
  UnitDefinition
} from '@shared/models/unit-definition';
import { EditorStateSnapshot } from './editor-state.model';

export class EditorDefinitionBuilderService {
  build(snapshot: EditorStateSnapshot): UnitDefinition {
    const def: UnitDefinition = {
      id: snapshot.unitId || 'stars-unit-definition',
      interactionType: snapshot.interactionType,
      interactionParameters: snapshot.interactionParams,
      variableInfo: snapshot.variableInfo.length > 0 ? snapshot.variableInfo : undefined,
      audioFeedback: snapshot.audioFeedback
    };

    if (snapshot.unitVersion) def.version = snapshot.unitVersion;
    if (snapshot.backgroundColor !== '#EEE') def.backgroundColor = snapshot.backgroundColor;
    if (snapshot.ribbonBars) def.ribbonBars = true;
    if (snapshot.continueButtonShow !== 'ALWAYS') def.continueButtonShow = snapshot.continueButtonShow;

    if (snapshot.mainAudioEnabled && snapshot.mainAudioSource) {
      const mainAudio: MainAudio = {
        audioSource: snapshot.mainAudioSource,
        maxPlay: snapshot.mainAudioMaxPlay,
        disableInteractionUntilComplete: snapshot.mainAudioDisableInteractionUntilComplete
      };
      def.mainAudio = mainAudio;
    }

    const firstClickLayer = snapshot.firstClickLayer;
    const animateButton = snapshot.animateButton;
    if (animateButton === true || (typeof animateButton === 'string' && animateButton !== 'OFF') ||
      firstClickLayer === true || (typeof firstClickLayer === 'string' && firstClickLayer !== 'OFF')) {
      const firstAudioOptions: FirstAudioOptionsParams = {};
      if (animateButton === true || (typeof animateButton === 'string' && animateButton !== 'OFF')) {
        firstAudioOptions.animateButton = animateButton;
      }
      if (firstClickLayer === true || (typeof firstClickLayer === 'string' && firstClickLayer !== 'OFF')) {
        firstAudioOptions.firstClickLayer = firstClickLayer;
      }
      def.firstAudioOptions = firstAudioOptions;
    }

    if (snapshot.openingImageEnabled && snapshot.openingImageSource) {
      const params: OpeningImageParams = {
        imageSource: snapshot.openingImageSource
      };
      if (snapshot.openingAudioSource) params.audioSource = snapshot.openingAudioSource;
      if (snapshot.openingPresentationDurationMS !== 1500) {
        params.presentationDurationMS = snapshot.openingPresentationDurationMS;
      }
      def.openingImage = params;
    }

    if (snapshot.closingMetaButtons) {
      def.closingMetaButtons = snapshot.closingMetaButtons;
    }

    return def;
  }
}
