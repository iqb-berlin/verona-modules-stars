import { Component, input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl } from "@angular/forms";
import { ReducedKeyboardElement } from "../../../models/elements/reduced-keyboard";
import { ElementComponent } from "../../../directives/element-component.directive";
import { ResponseStatus, VeronaResponse } from "../../../../../../common/models/verona";
import { UnitStateService } from "../../../services/unit-state.service";
import { ValidationService } from "../../../services/validation.service";

@Component({
  selector: 'stars-reduced-keyboard',
  templateUrl: './reduced-keyboard.component.html',
  styleUrls: ['./reduced-keyboard.component.scss'],
  standalone: false
})
export class ReducedKeyboardComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<ReducedKeyboardElement>();
  KeyboardInputControl = new FormControl('');
  currentText: string = '';
  isSubmitted: boolean = false;
  position = input<string>("row");

  private unitStateService = inject(UnitStateService);
  private validationService = inject(ValidationService);

  ngOnInit() {
    const restoredValue = this.unitStateService.registerElementWithRestore(
      this.elementModel().id,
      this.elementModel().alias || this.elementModel().id,
      this.elementModel().value || ""
    );

    this.currentText = typeof restoredValue === 'string' ? restoredValue : '';
    this.elementModel().value = this.currentText;
    this.KeyboardInputControl.setValue(this.currentText, { emitEvent: false });

    this.parentForm()?.addControl(this.elementModel().id, this.KeyboardInputControl);

    if (this.elementModel().required) {
      this.validationService.registerFormControl(this.KeyboardInputControl);
    }
    this.updateElementStatus(ResponseStatus.DISPLAYED);
  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.elementModel().id);
  }

  get textIsEmpty(): boolean {
    return this.currentText.length === 0;
  }

  addChar(button: any) {
    if (this.isSubmitted) return;
    if (this.elementModel().maxLength !== null &&
      this.currentText.length >= this.elementModel().maxLength) {
      return;
    }

    const charToAdd = this.elementModel().getButtonValue(button, this.textIsEmpty);
    this.currentText += charToAdd;
    this.updateStateAndModel();
  }

  deleteChar() {
    if (this.currentText.length > 0) {
      this.currentText = this.currentText.slice(0, -1);
      this.updateStateAndModel();
    }
  }


  submitText() {
    this.isSubmitted = true;
    this.elementModel().value = this.currentText;

    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: this.currentText,
      status: ResponseStatus.CODING_COMPLETE
    });

    this.emitStateChange(ResponseStatus.CODING_COMPLETE);
  }

  private updateStateAndModel() {
    this.elementModel().value = this.currentText;
    this.KeyboardInputControl.setValue(this.currentText);

    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: this.currentText,
      status: ResponseStatus.VALUE_CHANGED
    });

    this.emitStateChange(ResponseStatus.VALUE_CHANGED);
  }

  private updateElementStatus(status: ResponseStatus) {
    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: this.currentText,
      status: status
    });
  }

  private emitStateChange(status: ResponseStatus) {
    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || this.elementModel().id,
      value: this.currentText,
      status: status
    };

    this.valueChange.emit(response);
  }
}
