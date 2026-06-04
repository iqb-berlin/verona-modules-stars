export interface VariableInfo {
  variableId: string;
  responseComplete: 'ALWAYS' | 'ON_ANY_RESPONSE' | 'ON_FULL_CREDIT';
  codingSource: 'VALUE' | 'VALUE_TO_UPPER' | 'SUM' | 'SUM_CHAR_MATCHES';
  codingSourceParameter?: string;
  codes: Code[];
}

export interface Code {
  method: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN_POSITION_RANGE';
  parameter: string;
  code: number;
  score: number;
}
