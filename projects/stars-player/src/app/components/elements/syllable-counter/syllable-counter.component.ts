import { Component, input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl } from "@angular/forms";

import { SyllableCounterElement } from "../../../models/elements/syllable-counter";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse, ResponseStatus } from "../../../models/verona";
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
  SyllableInputControl = new FormControl();
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
    this.SyllableInputControl.setValue(restoredValue, { emitEvent: false });
    this.parentForm()?.addControl(this.elementModel().id, this.SyllableInputControl);

    if (this.elementModel().required) {
      this.validationService.registerFormControl(this.SyllableInputControl);
    }

    this.updateElementStatus(ResponseStatus.DISPLAYED);

    console.log(`🔄 Syllable counter initialized: ${this.elementModel().id}, restored value:`, restoredValue);
    console.log(`📊 Generated options:`, this.elementModel().options);
  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.elementModel().id);
  }

  getHandIndices(count: number): number[] {
    return Array(count).fill(0).map((_, index) => index);
  }

  valueChanged($event: any) {
    console.log(`Syllable value changed: ${this.elementModel().id} ->`, $event.value);

    this.elementModel().value = $event.value;

    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: $event.value,
      status: ResponseStatus.VALUE_CHANGED
    });

    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || this.elementModel().id,
      value: $event.value,
      status: ResponseStatus.VALUE_CHANGED,
      timeStamp: Date.now()
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
