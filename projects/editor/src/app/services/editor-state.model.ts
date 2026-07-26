import {
  AnimateButtonEnum,
  ClosingMetaButtonsParams,
  ContinueButtonEnum,
  FirstAudioOptionsParams,
  InteractionEnum,
  InteractionParameters
} from '@shared/models/unit-definition';
import { VariableInfo } from '@shared/models/responses';
import { AudioFeedback } from '@shared/models/feedback';

export interface EditorStateSnapshot {
  unitId: string;
  unitVersion: string;
  backgroundColor: string;
  ribbonBars: boolean;
  continueButtonShow: ContinueButtonEnum;
  interactionType: InteractionEnum;
  unsupportedInteractionType?: string;
  interactionMaxTimeMS?: number;
  mainAudioEnabled: boolean;
  mainAudioSource: string;
  mainAudioMaxPlay: number;
  mainAudioDisableInteractionUntilComplete: boolean;
  firstClickLayer: FirstAudioOptionsParams['firstClickLayer'];
  animateButton: AnimateButtonEnum | boolean | undefined;
  openingImageEnabled: boolean;
  openingImageSource: string;
  openingAudioSource: string;
  openingPresentationDurationMS: number;
  interactionParams: InteractionParameters;
  variableInfo: VariableInfo[];
  audioFeedbackEnabled: boolean;
  audioFeedback?: AudioFeedback;
  closingMetaButtons?: ClosingMetaButtonsParams;
}

export type EditorStatePatch = Partial<EditorStateSnapshot>;
