import { DEFAULT_META_SELECTION_VARIABLE_ID } from '@shared/models/unit-definition';
import { EditorStateSnapshot } from './editor-state.model';
import { EditorInteractionAdapterRegistry } from './editor-interaction-adapters';

export type EditorResponseVariableSource =
  'interaction' |
  'mainAudio' |
  'metaSelection' |
  'metaOutcome';

export interface EditorResponseVariable {
  id: string;
  source: EditorResponseVariableSource;
}

export function collectResponseVariables(
  snapshot: EditorStateSnapshot,
  interactionAdapters: EditorInteractionAdapterRegistry
): EditorResponseVariable[] {
  const candidates = collectResponseVariableCandidates(snapshot, interactionAdapters);
  const variables = new Map<string, EditorResponseVariable>();

  candidates.forEach(variable => {
    if (!variables.has(variable.id)) variables.set(variable.id, variable);
  });

  return [...variables.values()];
}

export function collectResponseVariableCandidates(
  snapshot: EditorStateSnapshot,
  interactionAdapters: EditorInteractionAdapterRegistry
): EditorResponseVariable[] {
  const variables: EditorResponseVariable[] = [];
  const addVariable = (id: string | undefined, source: EditorResponseVariableSource): void => {
    const normalizedId = id?.trim();
    if (normalizedId) variables.push({ id: normalizedId, source });
  };

  const interactionAdapter = interactionAdapters.get(snapshot.interactionType);
  if (interactionAdapter.hasVariable) {
    const variableId = (snapshot.interactionParams as { variableId?: string }).variableId;
    addVariable(variableId, 'interaction');
    if (snapshot.interactionType === 'PLACE_VALUE' && variableId?.trim()) {
      addVariable(`${variableId.trim()}_TENS`, 'interaction');
    }
  }
  if (snapshot.mainAudioEnabled) addVariable('mainAudio', 'mainAudio');
  if (snapshot.closingMetaButtons) {
    addVariable(
      snapshot.closingMetaButtons.variableIdMetaSelection?.trim() || DEFAULT_META_SELECTION_VARIABLE_ID,
      'metaSelection'
    );
    addVariable(snapshot.closingMetaButtons.variableIdMetaOutcome, 'metaOutcome');
  }

  return variables;
}
