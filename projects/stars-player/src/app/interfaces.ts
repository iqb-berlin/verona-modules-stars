import { StateVariable } from './models/state-variable';
import { UIElement } from './models';

export type UIElementType =
  'text'
  | 'button'
  | 'text-field'
  | 'text-field-simple'
  | 'checkbox'
  | 'radio'
  | 'radio-button-group'
  | 'image'
  | 'audio'
  | 'video'
  | 'radio-group-images'
  | 'radio-group-text'
  | 'multi-choice-images'
  | 'multi-choice-circles'
  | 'hotspot-image'
  | 'drop-list'
  | 'stimulus'
  | 'interaction'
  | 'instructions'
  | 'keyboard'
  | 'syllable-counter'
  | 'binary-choice';

export type UIBlueprintType =
  'PicPicBlueprint'
  | 'PicTextBlueprint';

export interface JSONObject {
  [key: string]: any
}

export interface TextLabel {
  text: string;
}

export interface TextImageLabel extends TextLabel {
  id: string;
  imgSrc: string | null;
  imgFileName: string;
  text: string;
  altText: string;
}

export interface Coder {
  fullCredit: string;
  partialCredit: [JSONObject] | string;
}

export interface DragNDropValueObject extends TextImageLabel {
  id: string;
  alias: string;
  originListID: string;
  originListIndex: number;
  audioSrc: string | null;
  audioFileName: string;
}

export type Label = TextLabel | TextImageLabel | DragNDropValueObject;

// export interface OptionElement extends UIElement {
//   getNewOptionLabel(optionText: string): Label;
// }

export type IDTypes = UIElementType | 'value' | 'state-variable';

export interface AbstractIDService {
  getAndRegisterNewID: (idType: IDTypes, alias?: boolean) => string;
  register: (id: string, idType: IDTypes, useIDRegistry: boolean, useAliasRegistry: boolean) => void;
  unregister: (id: string, idType: IDTypes, useIDRegistry: boolean, useAliasRegistry: boolean) => void;
  isAliasAvailable: (id: string, idType: IDTypes) => boolean;
  changeAlias: (oldID: string, newID: string, idType: IDTypes) => void
}

export type InputElementValue =
  TextLabel[]
  | string[]
  | string
  | number[]
  | number
  | boolean[]
  | boolean
  | null;

export interface InputElementProperties extends UIElementProperties {
  label?: string;
  value: InputElementValue;
  required: boolean;
  requiredWarnMessage: string;
  readOnly: boolean;
}

export interface ValueChangeElement {
  id: string;
  value: InputElementValue;
}

export type UIElementValue = string | number | boolean | undefined | UIElementType | InputElementValue |
  TextLabel | TextLabel[] | StateVariable | UIElement[];

export type InputAssistancePreset = null | 'french' | 'numbers' | 'numbersAndOperators' | 'numbersAndBasicOperators'
  | 'comparisonOperators' | 'squareDashDot' | 'placeValue' | 'space' | 'comma' | 'custom';

export interface UIElementProperties {
  type: UIElementType;
  id: string;
  alias?: string;
  position?: string;
}

export type TooltipPosition = 'left' | 'right' | 'above' | 'below';

export interface KeyInputElementProperties {
  inputAssistancePreset: InputAssistancePreset;
  inputAssistancePosition: 'floating' | 'right';
  inputAssistanceFloatingStartPosition: 'startBottom' | 'endCenter';
  showSoftwareKeyboard: boolean;
  addInputAssistanceToKeyboard: boolean;
  hideNativeKeyboard: boolean;
  hasArrowKeys: boolean;
}

export interface TextInputElementProperties extends KeyInputElementProperties, InputElementProperties {
  inputAssistanceCustomKeys: string;
  restrictedToInputAssistanceChars: boolean;
  hasBackspaceKey: boolean;
}

export interface PlayerElementBlueprint extends UIElementProperties {
  player: PlayerProperties;
}

export interface PlayerProperties {
  [index: string]: unknown;

  autostart: boolean;
  autostartDelay: number;
  loop: boolean;
  startControl: boolean;
  pauseControl: boolean;
  progressBar: boolean;
  interactiveProgressbar: boolean;
  volumeControl: boolean;
  defaultVolume: number;
  minVolume: number;
  muteControl: boolean;
  interactiveMuteControl: boolean;
  hintLabel: string;
  hintLabelDelay: number;
  activeAfterID: string;
  minRuns: number;
  maxRuns: number | null;
  showRestRuns: boolean;
  showRestTime: boolean;
  playbackTime: number;
  fileName: string;
}

export type SectionLayoutVariant = 'grid_layout' | 'row_layout' | 'col_layout';

export interface SectionVariantConfig {
  variant?: SectionLayoutVariant;
  columns?: number; // For future customization of grid columns
  aspectRatio?: 'square' | 'wide' | 'portrait'; // For future image aspect ratio control
}


