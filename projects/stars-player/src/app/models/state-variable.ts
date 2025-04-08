import { VariableInfo } from '@iqb/responses';

export class StateVariable {
  id: string;
  alias: string;
  value: string;

  constructor(id: string, alias: string, value: string) {
    this.id = id;
    this.alias = alias;
    this.value = value;
  }

  getVariableInfo(): VariableInfo {
    return {
      id: this.id,
      alias: this.alias,
      type: 'no-value',
      format: '',
      multiple: false,
      nullable: false,
      values: [],
      valuePositionLabels: [],
      page: '',
      valuesComplete: false
    };
  }
}
