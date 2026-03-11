import { Response } from '@iqbspecs/response/response.interface';
import { VariableInfo } from './responses';
import { AudioFeedback } from './feedback';

// eslint-disable-next-line max-len
export type ContinueButtonEnum = 'ALWAYS' | 'NO' | 'ON_ANY_RESPONSE' | 'ON_RESPONSES_COMPLETE' |
'ON_MAIN_AUDIO_COMPLETE' | 'ON_VIDEO_COMPLETE' | 'ON_AUDIO_AND_RESPONSE';
export type InteractionEnum = 'BUTTONS' |
'POLYGON_BUTTONS' |
'DROP' |
'WRITE' |
'FIND_ON_IMAGE' |
'VIDEO' |
'IMAGE_ONLY' |
'PLACE_VALUE' |
'NUMBER_LINE' |
'NONE';
export type IconButtonTypeEnum = 'CHECK_GREEN' | 'CLOSE_RED' | 'CLAP_HANDS' | 'SMILEY_1' | 'SMILEY_2' |
'SMILEY_3' | 'SMILEY_4' | 'SMILEY_5' | 'ONES' | 'TENS';
export type ButtonTypeEnum = 'MEDIUM_SQUARE' | 'BIG_SQUARE' | 'SMALL_SQUARE' | 'TEXT' | 'CIRCLE' |
'EXTRA_LARGE_SQUARE' | 'LONG_RECTANGLE' | 'TALL_RECTANGLE';
export type ImagePositionEnum = 'TOP' | 'LEFT' | 'BOTTOM';
export type TargetSizeEnum = 'MEDIUM' | 'LARGE' | 'SMALL';
export type LayoutEnum = 'LEFT_CENTER' | 'TOP_CENTER' | 'LEFT_BOTTOM' | 'LEFT_CENTER_50';

export type InteractionParameters = InteractionButtonParams | InteractionWriteParams | InteractionDropParams |
InteractionVideoParams | InteractionFindOnImageParams | InteractionPolygonButtonsParams | InteractionPlaceValueParams | InteractionNumberLineParams;
export interface UnitDefinition {
  id: string;
  version?: string;
  backgroundColor?: string;
  ribbonBars?: boolean;
  firstAudioOptions?: FirstAudioOptionsParams;
  continueButtonShow?: ContinueButtonEnum;
  openingImage?: OpeningImageParams;
  mainAudio?: MainAudio;
  interactionType: InteractionEnum;
  interactionMaxTimeMS: number
  interactionParameters: InteractionParameters;
  variableInfo: VariableInfo[] | undefined;
  audioFeedback: AudioFeedback | undefined;
}

export interface SelectionOption {
  text?: string;
  imageSource?: string;
  audioSource?: string;
  label?: string;
  icon?: IconButtonTypeEnum;
  svgPath?: string;
}

export interface RepeatButtonConfig {
  option: SelectionOption;
  numberOfOptions: number;
}

export interface InteractionOptions {
  buttons?: SelectionOption[];
  repeatButton?: RepeatButtonConfig;
}

export interface InteractionButtonParams {
  variableId?: string;
  options: InteractionOptions;
  imageSource?: string;
  imagePosition?: ImagePositionEnum;
  layout?: LayoutEnum;
  imageUseFullArea?: boolean;
  text?: string;
  multiSelect?: boolean;
  numberOfRows?: number;
  buttonType?: ButtonTypeEnum;
  triggerNavigationOnSelect?: boolean;
  formerState?: Response[];
}

export interface InteractionDropParams {
  variableId?: string;
  options: SelectionOption[];
  imageSource?: string;
  imagePosition?: ImagePositionEnum;
  imageLandingXY?: string;
  text?: string;
  formerState?: Response[];
}

export interface InteractionPlaceValueParams {
  variableId?: string;
  value: number;
  numberOfRows?: number;
  maxNumberOfTens?: number;
  maxNumberOfOnes?: number;
  formerState?: Response[];
}

export interface InteractionWriteParams {
  variableId?: string;
  imageSource?: string;
  text?: string;
  addBackspaceKey?: boolean;
  addUmlautKeys?: boolean;
  keyboardMode?: 'CHARACTERS' | 'NUMBERS_LINE';
  keysToAdd?: string[];
  maxInputLength?: number;
  formerState?: Response[];
}

export interface InteractionFindOnImageParams {
  variableId?: string;
  imageSource: string;
  text?: string;
  showArea?: string;
  size?: TargetSizeEnum;
  formerState?: Response[];
}

export interface InteractionVideoParams {
  variableId?: string;
  videoSource: string;
  imageSource?: string;
  text?: string;
  triggerNavigationOnEnd?: boolean;
}

export interface InteractionPolygonButtonsParams {
  variableId?: string;
  options: SelectionOption[];
  multiSelect?: boolean;
  formerState?: Response[];
}

export interface InteractionNumberLineParams {
  variableId?: string;
  firstNumber: number;
  lastNumber: number;
  emptyNumber: number;
  style?: string;
  formerState?: Response[];
}

export interface MainAudio {
  audioSource: string;
  maxPlay?: number;
  firstClickLayer?: boolean; // deprecated, use firstAudioOptions.firstClickLayer
  animateButton?: boolean; // deprecated, use firstAudioOptions.animateButton
  disableInteractionUntilComplete?: boolean;
}

export interface FirstAudioOptionsParams {
  firstClickLayer?: boolean;
  animateButton?: boolean;
}

export interface OpeningImageParams {
  audioSource?: string;
  imageSource: string;
  presentationDurationMS?: number;
}

export interface AudioOptions extends MainAudio {
  audioId: string;
  value?: string;
  maxPlay?: number;
}
