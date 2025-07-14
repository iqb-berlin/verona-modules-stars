import { ResponseStatusType } from '@iqb/responses';

export type NavigationTarget = 'first' | 'last' | 'previous' | 'next' | 'end';
export type Progress = 'none' | 'some' | 'complete';
export type PagingMode = 'separate' | 'buttons' | 'concat-scroll' | 'concat-scroll-snap';
export enum ElementCodeStatusValue {
  UNSET = 0, NOT_REACHED = 1, DISPLAYED = 2, VALUE_CHANGED = 3, INVALID = 4,
  DERIVE_ERROR = 5, CODING_COMPLETE = 6, NO_CODING = 7, CODING_INCOMPLETE = 8,
  CODING_ERROR = 9, PARTLY_DISPLAYED = 10, DERIVE_PENDING = 11
}

export enum ResponseStatus {
  UNSET = 'UNSET',
  NOT_REACHED = 'NOT_REACHED',
  DISPLAYED = 'DISPLAYED',
  VALUE_CHANGED = 'VALUE_CHANGED',
  INVALID = 'INVALID',
  DERIVE_ERROR = 'DERIVE_ERROR',
  CODING_COMPLETE = 'CODING_COMPLETE',
  NO_CODING = 'NO_CODING',
  CODING_INCOMPLETE = 'CODING_INCOMPLETE',
  CODING_ERROR = 'CODING_ERROR',
  PARTLY_DISPLAYED = 'PARTLY_DISPLAYED',
  DERIVE_PENDING = 'DERIVE_PENDING'
}

export const UnitStateDataType = 'iqb-standard@1.1';

export interface StatusChangeElement {
  id: string;
  status: ResponseStatusType;
}

export interface VeronaResponse {
  id: string;
  alias?: string;
  value: string;
  status: ResponseStatusType;
  subform?: string;
  code?: number;
  score?: number;
  label?: string;
  timeStamp?: number;
}

export interface PlayerConfig {
  printMode?: 'off' | 'on' | 'on-with-ids';
  unitNumber?: number;
  unitTitle?: number;
  unitId?: number;
  pagingMode?: PagingMode;
  logPolicy?: 'lean' | 'rich' | 'debug' | 'disabled';
  startPage?: string;
  enabledNavigationTargets?: NavigationTarget[];
  directDownloadUrl?: string;
}

export interface UnitState {
  dataParts?: Record<string, string>;
  presentationProgress?: Progress;
  responseProgress?: Progress;
  unitStateDataType?: string;
}

export interface PlayerState {
  validPages?: ValidPage[];
  currentPage?: string;
}

export interface ValidPage {
  id: string;
  label?: string;
}

export interface LogData {
  timeStamp: number,
  key: string,
  content?: string
}

export interface VopStartCommand {
  type: 'vopStartCommand';
  sessionId: string;
  unitDefinition?: string;
  unitDefinitionType?: string;
  unitState?: UnitState;
  playerConfig?: PlayerConfig;
}

export interface VopRuntimeErrorNotification {
  type: 'vopRuntimeErrorNotification';
  sessionId: string;
  code: string;
  message?: string;
}

export interface VopNavigationDeniedNotification {
  type: 'vopNavigationDeniedNotification';
  sessionId: string;
  reason?: Array<'presentationIncomplete' | 'responsesIncomplete'>
}

export interface VopPlayerConfigChangedNotification {
  type: 'vopPlayerConfigChangedNotification'
  sessionId: string;
  playerConfig: PlayerConfig;
}

export interface VopPageNavigationCommand {
  type: 'vopPageNavigationCommand';
  sessionId: string;
  target: string;
}

export interface VopReadyNotification {
  type: 'vopReadyNotification';
  metadata: VopMetaData;
}

export interface VopError {
  code: string;
  message?: string;
}

export interface VopMetaData {
  $schema: string,
  id: string;
  type: string;
  version: string;
  specVersion: string;
  metadataVersion: string
  name: {
    lang: string;
    value: string;
  }[];
  description: {
    lang: string;
    value: string;
  }[];
  maintainer: {
    name: Record<string, string>[];
    email: string;
    url: string;
  }
  code: {
    repositoryType: string;
    licenseType: string;
    licenseUrl: string;
    repositoryUrl: string;
  }
  notSupportedFeatures: string[];
}

export interface VopStateChangedNotification {
  type: 'vopStateChangedNotification';
  sessionId: string;
  timeStamp: number;
  unitState?: UnitState;
  playerState?: PlayerState;
  log?: LogData[];
}

export interface VopUnitNavigationRequestedNotification {
  type: 'vopUnitNavigationRequestedNotification';
  sessionId: string;
  target: 'first' | 'last' | 'previous' | 'next' | 'end';
}

export interface VopWindowFocusChangedNotification {
  type: 'vopWindowFocusChangedNotification';
  timeStamp: number;
  hasFocus: boolean;
}

export type VopMessage =
  VopStartCommand |
  VopPlayerConfigChangedNotification |
  VopRuntimeErrorNotification |
  VopNavigationDeniedNotification |
  VopPageNavigationCommand |
  VopReadyNotification |
  VopStateChangedNotification |
  VopWindowFocusChangedNotification |
  VopUnitNavigationRequestedNotification;
