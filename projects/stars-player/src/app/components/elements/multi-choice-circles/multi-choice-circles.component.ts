import {Component, inject, Input, input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ElementComponent} from "../../../directives/element-component.directive";
import {UnitStateService} from "../../../services/unit-state.service";
import {ValidationService} from "../../../services/validation.service";
import {MultiChoiceCirclesElement} from "../../../models";

@Component({
  selector: 'stars-multi-choice-circles',
  templateUrl: 'multi-choice-circles.component.html',
  styleUrls: ['multi-choice-circles.component.scss'],
  standalone: false
})
export class MultiChoiceCirclesComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<MultiChoiceCirclesElement>();
  formId = Math.floor(Math.random() * 20000000 + 10000000).toString();
  MultiCheckboxFormGroup = new FormGroup({});
  sectionVariant = input<string>('row_layout');
  layoutClass: string = 'row-layout';

  private unitStateService = inject(UnitStateService);
  private validationService = inject(ValidationService);
  @Input() elemenMultitModel!: MultiChoiceCirclesElement;

  ngOnInit() {
    // this.layoutClass = this.getLayoutClass();

    const restoredValue = this.unitStateService.registerElementWithRestore(
      this.elementModel().id,
      this.elementModel().alias || this.elementModel().id,
      this.elementModel().value || "" // default empty string
    );

    this.elementModel().value = restoredValue;
    this.elementModel().circles.forEach((circle, index) => {
      const formControl = new FormControl();

      if (typeof restoredValue === 'string' && restoredValue.length > index) {
        const isChecked = restoredValue[index] === '1';
        formControl.setValue(isChecked, {emitEvent: false});
      }
      this.MultiCheckboxFormGroup.addControl(circle.id, formControl, {emitEvent: false});
    });
    this.parentForm()?.addControl(this.formId, this.MultiCheckboxFormGroup);
    if (this.elementModel().required) {
      this.validationService.registerFormControl(this.MultiCheckboxFormGroup);
    }

    console.log('Number of circles=======>:', this.elementModel().circles.length);
    this.elementModel().circles.forEach((circle, index) => {
      console.log(`Circle ${index}:`, circle);
    });

  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.formId);
  }
}
