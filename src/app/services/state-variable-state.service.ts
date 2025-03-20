import { Injectable } from '@angular/core';
// import { ElementCodeService } from '../models/element-code-service';
import { ResponseValueType } from '@iqb/responses';


@Injectable({
  providedIn: 'root'
})

export class StateVariableStateService /*extends ElementCodeService*/ {
  registerElementCode(elementId: string,
                      elementAlias: string,
                      elementValue: ResponseValueType): void {
    this.addElementCode(elementId, elementAlias, elementValue); // id and alias are the same
  }

  private addElementCode(id: string, alias: string, value: ResponseValueType): void {
    // const unitStateElementCode = this.getElementCodeById(id);
    // if (!unitStateElementCode) {
    //   this.addInitialElementCode({
    //     id, alias, value, status: 'UNSET'
    //   });
    // }
  }
}
