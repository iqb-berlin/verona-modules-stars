import { Component, input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { MultiChoiceImagesElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse, ResponseStatus } from "../../../models/verona";
import { UnitStateService } from "../../../services/unit-state.service";
import { ValidationService } from "../../../services/validation.service";

@Component({
  selector: 'stars-multi-choice-images',
  templateUrl: 'multi-choice-images.component.html',
  styleUrls: ['multi-choice-images.component.scss'],
  standalone: false
})
export class MultiChoiceImagesComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<MultiChoiceImagesElement>();
  formId = Math.floor(Math.random() * 20000000 + 10000000).toString();
  MultiCheckboxFormGroup = new FormGroup({});
  sectionVariant = input<string>('row_layout');
  layoutClass: string = 'row-layout';

  private unitStateService = inject(UnitStateService);
  private validationService = inject(ValidationService);

  ngOnInit() {
    this.layoutClass = this.getLayoutClass();

    const restoredValue = this.unitStateService.registerElementWithRestore(
      this.elementModel().id,
      this.elementModel().alias || this.elementModel().id,
      this.elementModel().value || "" // default empty string
    );

    this.elementModel().value = restoredValue;
    this.elementModel().options.forEach((option, index) => {
      const formControl = new FormControl();

      if (typeof restoredValue === 'string' && restoredValue.length > index) {
        const isChecked = restoredValue[index] === '1';
        formControl.setValue(isChecked, { emitEvent: false });
      }
      this.MultiCheckboxFormGroup.addControl(option.id, formControl, { emitEvent: false });
    });
    this.parentForm()?.addControl(this.formId, this.MultiCheckboxFormGroup);
    if (this.elementModel().required) {
      this.validationService.registerFormControl(this.MultiCheckboxFormGroup);
    }
    this.updateElementStatus(ResponseStatus.DISPLAYED);

  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.formId);
  }

  valueChanged(event: any) {
    let value = "";
    for (let i = 0; i < this.elementModel().options.length; i++) {
      const option = this.elementModel().options[i];
      const formControl = this.MultiCheckboxFormGroup.controls[option.id];
      value += formControl.value === true ? '1' : '0';
    }
    this.elementModel().value = value;

    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: value,
      status: ResponseStatus.VALUE_CHANGED
    });

    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || this.elementModel().id,
      value: value,
      status: ResponseStatus.VALUE_CHANGED
    };

    this.valueChange.emit(response);
  }

  private updateElementStatus(status: ResponseStatus) {
    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: this.elementModel().value,
      status: status
    });
  }

  getLayoutClass(): string {
    const variant = this.sectionVariant();
    console.log(`Section variant for multi-choice: ${variant}`);

    switch (variant) {
      case 'grid_layout':
        return 'grid-layout';
      case 'row_layout':
      default:
        return 'row-layout';
    }
  }
}
