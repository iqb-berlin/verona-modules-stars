import { Component, input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";

import { SyllableCounterElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse, ResponseStatus } from "../../../../../../common/models/verona";
import { UnitStateService } from "../../../services/unit-state.service";
import { ValidationService } from "../../../services/validation.service";

@Component({
  selector: 'stars-syllable-counter',
  templateUrl: './syllable-counter.component.html',
  styleUrls: ['./syllable-counter.component.scss'],
  standalone: false
})
export class SyllableCounterComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<SyllableCounterElement>();

  SyllableInputControl = new FormControl(); // For vertical (radio group)
  MultiChoiceFormGroup = new FormGroup({}); // For row (multi-choice)

  position = input<string>("row");

  private unitStateService = inject(UnitStateService);
  private validationService = inject(ValidationService);

  ngOnInit() {
    const restoredValue = this.unitStateService.registerElementWithRestore(
      this.elementModel().id,
      this.elementModel().alias || this.elementModel().id,
      this.elementModel().value
    );
    this.elementModel().value = restoredValue;
    this.initializeFormControls(restoredValue);

    if (this.elementModel().required) {
      if (this.elementModel().layout === 'vertical') {
        this.validationService.registerFormControl(this.SyllableInputControl);
      } else {
        this.validationService.registerFormControl(this.MultiChoiceFormGroup);
      }
    }
    this.updateElementStatus(ResponseStatus.DISPLAYED);

    console.log(`Syllable counter initialized: ${this.elementModel().id}, layout: ${this.elementModel().layout}, restored value:`, restoredValue);
  }

  private initializeFormControls(restoredValue: any): void {
    if (this.elementModel().layout === 'vertical') {
      let selectedIndex = null;
      if (typeof restoredValue === 'number' && restoredValue >= 1 && restoredValue <= this.elementModel().maxSyllables) {
        selectedIndex = restoredValue - 1;
      }
      this.SyllableInputControl.setValue(selectedIndex, { emitEvent: false });
      this.parentForm()?.addControl(this.elementModel().id, this.SyllableInputControl);
    } else {
      const binaryString = typeof restoredValue === 'number' && restoredValue > 0
        ? SyllableCounterElement.syllableCountToBinaryString(restoredValue, this.elementModel().maxSyllables)
        : '';

      this.elementModel().options.forEach((option, index) => {
        const isChecked = binaryString.length > index && binaryString[index] === '1';
        const formControl = new FormControl();
        formControl.setValue(isChecked, { emitEvent: false });
        this.MultiChoiceFormGroup.addControl(option.id, formControl);
      });

      this.parentForm()?.addControl(this.elementModel().id, this.MultiChoiceFormGroup);
    }
  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.elementModel().id);
  }

  getHandIndices(count: number): number[] {
    return Array(count).fill(0).map((_, index) => index);
  }

  valueChangedVertical($event: any) {
    const syllableCount = $event.value + 1;
    this.saveValue(syllableCount);
  }

  valueChangedRow() {
    let syllableCount = 0;
    for (const field in this.MultiChoiceFormGroup.controls) {
      if (this.MultiChoiceFormGroup.controls[field].value === true) {
        syllableCount++;
      }
    }
    this.saveValue(syllableCount);
  }

  private saveValue(syllableCount: number): void {
    console.log(`Syllable value changed: ${this.elementModel().id} -> syllable count: ${syllableCount}`);
    this.elementModel().value = syllableCount;
    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: syllableCount,
      status: ResponseStatus.VALUE_CHANGED
    });
    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || this.elementModel().id,
      value: syllableCount.toString(),
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
}
