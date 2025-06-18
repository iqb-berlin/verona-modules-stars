import { Component, input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl } from "@angular/forms";

import { RadioGroupImagesElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse, ResponseStatus } from "../../../models/verona";
import { UnitStateService } from "../../../services/unit-state.service";
import { ValidationService } from "../../../services/validation.service";

@Component({
  selector: 'stars-radio-group-images',
  templateUrl: './radio-group-images.component.html',
  styleUrls: ['./radio-group-images.component.scss'],
  standalone: false
})
export class RadioGroupImagesComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<RadioGroupImagesElement>();
  RadioInputControl = new FormControl();
  position = input<string>("row");
  sectionVariant = input<string>('row_layout'); // Add variant input

  layoutClass: string = 'row-layout';

  private unitStateService = inject(UnitStateService);
  private validationService = inject(ValidationService);

  ngOnInit() {
    this.layoutClass = this.getLayoutClass();

    const restoredValue = this.unitStateService.registerElementWithRestore(
      this.elementModel().id,
      this.elementModel().alias || this.elementModel().id,
      this.elementModel().value
    );

    let internalValue = null;
    if (typeof restoredValue === 'number' && restoredValue >= 1) {
      internalValue = restoredValue - 1; //
    }

    // Set the restored value in both model and form control
    this.elementModel().value = restoredValue;
    this.RadioInputControl.setValue(internalValue, { emitEvent: false });
    this.parentForm()?.addControl(this.elementModel().id, this.RadioInputControl);

    // Register for validation if required
    if (this.elementModel().required) {
      this.validationService.registerFormControl(this.RadioInputControl);
    }

    // Mark as displayed when component initializes
    this.updateElementStatus(ResponseStatus.DISPLAYED);

  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.elementModel().id);
  }

  valueChanged($event: any) {

    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: $event.value + 1,
      status: ResponseStatus.VALUE_CHANGED
    });

    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || this.elementModel().id,
      value: $event.value + 1,
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
    console.log(`🎨 Section variant for radio-group: ${variant}`);

    switch (variant) {
      case 'grid_layout':
        return 'grid-layout';
      case 'row_layout':
      default:
        return 'row-layout';
    }
  }
}
