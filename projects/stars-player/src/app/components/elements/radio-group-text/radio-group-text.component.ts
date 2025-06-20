import { Component, input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl } from "@angular/forms";

import { RadioGroupTextElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse, ResponseStatus } from "../../../models/verona";
import { UnitStateService } from "../../../services/unit-state.service";
import { ValidationService } from "../../../services/validation.service";

@Component({
  selector: 'stars-radio-group-text',
  templateUrl: './radio-group-text.component.html',
  styleUrls: ['./radio-group-text.component.scss'],
  standalone: false
})
export class RadioGroupTextComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<RadioGroupTextElement>();
  RadioInputControl = new FormControl();
  position = input<string>("row");
  sectionVariant = input<string>('row_layout');

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

    this.elementModel().value = restoredValue;
    this.RadioInputControl.setValue(restoredValue -1 , { emitEvent: false });
    this.parentForm()?.addControl(this.elementModel().id, this.RadioInputControl);
    if (this.elementModel().required) {
      this.validationService.registerFormControl(this.RadioInputControl);
    }
    this.updateElementStatus(ResponseStatus.DISPLAYED);
  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.elementModel().id);
  }

  valueChanged($event: any) {
    const selectedIndex = $event.value;
    const selectedValue = selectedIndex + 1;
    const selectedOption = this.elementModel().options[selectedIndex];
    const selectedText = selectedOption ? selectedOption.text : '';

    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: selectedValue,
      status: ResponseStatus.VALUE_CHANGED
    });

    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || this.elementModel().id,
      value: selectedValue,
      label: selectedText,
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
    const hasWords = this.elementModel().options.some(option => option.text.length > 1);
    switch (variant) {
      case 'grid_layout':
        return hasWords ? 'grid-layout words-grid' : 'grid-layout';
      case 'row_layout':
      default:
        if (this.elementModel().options.length === 4) {
          return hasWords ? 'grid-layout words-grid' : 'grid-layout';
        }
        return hasWords ? 'row-layout words-layout' : 'row-layout';
    }
  }
}
