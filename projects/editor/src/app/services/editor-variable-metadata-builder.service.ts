import { VeronaVariableInfo } from '../models/verona-editor';
import { EditorStateSnapshot } from './editor-state.model';
import { EditorInteractionAdapterRegistry } from './editor-interaction-adapters';

export class EditorVariableMetadataBuilderService {
  constructor(private interactionAdapters: EditorInteractionAdapterRegistry = new EditorInteractionAdapterRegistry()) {}

  build(snapshot: EditorStateSnapshot): VeronaVariableInfo[] {
    const variables: VeronaVariableInfo[] = [];
    const params = snapshot.interactionParams as any;
    const declaredVariables = snapshot.variableInfo;
    const variableIds = declaredVariables.length > 0
      ? declaredVariables.map(variable => variable.variableId)
      : (params?.variableId ? [params.variableId] : []);
    const adapter = this.interactionAdapters.get(snapshot.interactionType);

    variableIds
      .filter((value, index, values) => !!value && values.indexOf(value) === index)
      .forEach(variableId => {
        const currentVariableInfo = declaredVariables.find(variable => variable.variableId === variableId);
        const variable: VeronaVariableInfo = {
          id: variableId,
          type: adapter.variableType(currentVariableInfo),
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
}
