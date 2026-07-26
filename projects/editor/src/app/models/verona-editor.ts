export interface VoeStartCommand {
  type: 'voeStartCommand';
  sessionId: string;
  unitDefinition?: string;
  unitDefinitionType?: string;
  editorConfig?: EditorConfig;
}

export interface EditorConfig {
  directDownloadUrl?: string;
  role?: 'guest' | 'commentator' | 'developer' | 'maintainer' | 'super';
  sharedParameters?: SharedParameter[];
}

export interface SharedParameter {
  key: string;
  value?: string;
}

export interface VoeReadyNotification {
  type: 'voeReadyNotification';
  metadata: string;
}

export interface VoeDefinitionChangedNotification {
  type: 'voeDefinitionChangedNotification';
  sessionId: string;
  timeStamp: string;
  unitDefinition?: string;
  unitDefinitionType?: string;
  variables?: VeronaVariableInfo[];
  dependenciesToPlay?: VoeDependency[];
  dependenciesToEdit?: VoeDependency[];
  sharedParameters?: SharedParameter[];
}

export interface VoeDependency {
  id: string;
  type: 'file' | 'service';
}

export interface VeronaVariableInfo {
  id: string;
  alias?: string;
  type: 'string' | 'integer' | 'number' | 'boolean' | 'attachment' | 'json' | 'no-value' | 'coded';
  format?: string;
  multiple?: boolean;
  nullable?: boolean;
  values?: { value: string | number | boolean; label?: string }[];
  valuePositionLabels?: string[];
  valuesComplete?: boolean;
  page?: string;
}

export interface VoeMetaData {
  $schema?: string;
  id: string;
  type: string;
  version: string;
  specVersion: string;
  metadataVersion: string;
  name: { lang: string; value: string }[];
  description: { lang: string; value: string }[];
  maintainer: {
    name: { lang: string; value: string }[];
    email: string;
    url: string;
  };
  code: {
    repositoryType: string;
    licenseType: string;
    licenseUrl: string;
    repositoryUrl: string;
  };
}

export type VoeMessage = VoeStartCommand | VoeReadyNotification | VoeDefinitionChangedNotification;
