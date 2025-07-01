import { inject, Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UnitStateService } from './unit-state.service';
import { ResponseStatus, VeronaResponse } from '../models/verona';
import { InputElementValue } from "../interfaces";
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class MultiChoiceService {
  private unitStateService = inject(UnitStateService);
  private validationService = inject(ValidationService);

  initializeFormControls(params: {
    elementId: string,
    elementAlias: string,
    elementValue: InputElementValue,
    options: Array<any>,
    formGroup: FormGroup,
    formId: string,
    parentForm: () => FormGroup | null,
    required: boolean
  }) {
    const { elementId, elementAlias, elementValue, options, formGroup, formId, parentForm, required } = params;

    const restoredValue = this.unitStateService.registerElementWithRestore(
      elementId,
      elementAlias || elementId,
      elementValue || "" // default empty string
    );

    options.forEach((option, index) => {
      const formControl = new FormControl();

      if (typeof restoredValue === 'string' && restoredValue.length > index) {
        const isChecked = restoredValue[index] === '1';
        formControl.setValue(isChecked, { emitEvent: false });
      }
      formGroup.addControl(option.id, formControl, { emitEvent: false });
    });

    parentForm()?.addControl(formId, formGroup);

    if (required) {
      this.validationService.registerFormControl(formGroup);
    }

    return restoredValue;
  }


  valueChanged(params: {
    formGroup: FormGroup,
    options: Array<any>,
    elementId: string,
    elementAlias: string,
    elementValue: InputElementValue
  }): VeronaResponse {
    const { formGroup, options, elementId, elementAlias } = params;
    let value = "";

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const formControl = formGroup.controls[option.id];
      value += formControl.value === true ? '1' : '0';
    }

    this.unitStateService.changeElementCodeValue({
      id: elementId,
      value: value,
      status: ResponseStatus.VALUE_CHANGED
    });

    const response: VeronaResponse = {
      id: elementId,
      alias: elementAlias || elementId,
      value: value,
      status: ResponseStatus.VALUE_CHANGED
    };

    return response;
  }

  updateElementStatus(params: {
    elementId: string,
    elementValue: InputElementValue,
    status: ResponseStatus
  }): void {
    if (!params.elementId) {
      throw new Error('Element ID is required');
    }

    try {
      this.unitStateService.changeElementCodeValue({
        id: params.elementId,
        value: params.elementValue,
        status: params.status
      });
    } catch (error) {
      console.error('Failed to update element status:', error);
      throw error;
    }
  }
}
