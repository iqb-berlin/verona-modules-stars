import { VeronaVariableInfo } from '../models/verona-editor';
import { EditorStateSnapshot } from './editor-state.model';
import { EditorInteractionAdapterRegistry } from './editor-interaction-adapters';
import {
  collectResponseVariables,
  EditorResponseVariable
} from './editor-response-variables';

export class EditorVariableMetadataBuilderService {
  constructor(private interactionAdapters: EditorInteractionAdapterRegistry = new EditorInteractionAdapterRegistry()) {}

  build(snapshot: EditorStateSnapshot): VeronaVariableInfo[] {
    const variables: VeronaVariableInfo[] = [];
    const params = snapshot.interactionParams as { variableId?: string };
    const declaredVariables = snapshot.variableInfo;
    const adapter = this.interactionAdapters.get(snapshot.interactionType);
    collectResponseVariables(snapshot, this.interactionAdapters)
      .forEach(responseVariable => {
        const variableId = responseVariable.id;
        const currentVariableInfo = declaredVariables.find(variable => variable.variableId === variableId);
        const variable: VeronaVariableInfo = {
          id: variableId,
          type: responseVariable.source === 'interaction' ?
            adapter.variableType(currentVariableInfo) :
            this.nonInteractionVariableType(responseVariable, !!currentVariableInfo?.codes.length),
          multiple: false,
          nullable: false,
          page: '1'
        };
        const selectionMetadata = variableId === params?.variableId ?
          adapter.selectionMetadata(snapshot.interactionParams) :
          undefined;

        if (selectionMetadata) {
          if (selectionMetadata.multiple) {
            variable.multiple = true;
            variable.valuePositionLabels = selectionMetadata.labels;
          } else {
            variable.valuesComplete = true;
            variable.values = selectionMetadata.labels.map((label: string, i: number) => ({
              value: (i + 1).toString(),
              label
            }));
          }
        }

        variables.push(variable);
      });
    return variables;
  }

  // eslint-disable-next-line class-methods-use-this
  private nonInteractionVariableType(
    responseVariable: EditorResponseVariable,
    coded: boolean
  ): VeronaVariableInfo['type'] {
    if (coded) return 'coded';
    return responseVariable.source === 'mainAudio' ? 'number' : 'string';
  }
}
