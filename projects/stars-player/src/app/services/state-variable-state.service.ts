import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { VeronaResponse, ResponseStatus } from '../../../../common/models/verona';

export interface StateVariableCode {
  id: string;
  alias: string;
  value: any;
  status: ResponseStatus;
  timeStamp: number;
}

export interface StateVariableIdentifier {
  id: string;
  alias: string;
}

@Injectable({
  providedIn: 'root'
})
export class StateVariableStateService {
  private stateVariableCodes: Map<string, StateVariableCode> = new Map();
  private _elementCodeChanged = new Subject<StateVariableCode>();

  get elementCodeChanged() {
    return this._elementCodeChanged.asObservable();
  }

  registerElementCode(elementId: string, elementAlias: string, elementValue: any): void {
    const stateVariableCode: StateVariableCode = {
      id: elementId,
      alias: elementAlias,
      value: elementValue,
      status: ResponseStatus.UNSET,
      timeStamp: Date.now()
    };

    this.stateVariableCodes.set(elementId, stateVariableCode);
    this._elementCodeChanged.next(stateVariableCode);
  }

  getResponses(): VeronaResponse[] {
    return Array.from(this.stateVariableCodes.values()).map(code => ({
      id: code.id,
      alias: code.alias,
      value: code.value,
      status: code.status,
      timeStamp: code.timeStamp
    }));
  }

  setElementCodes(stateVariableCodes: any[], stateVariableIdentifiers: StateVariableIdentifier[]): void {
    stateVariableCodes.forEach(code => {
      this.stateVariableCodes.set(code.id, {
        id: code.id,
        alias: code.alias || code.id,
        value: code.value,
        status: code.status || ResponseStatus.UNSET,
        timeStamp: code.timeStamp || Date.now()
      });
    });
  }

  reset(): void {
    this.stateVariableCodes.clear();
  }
}
