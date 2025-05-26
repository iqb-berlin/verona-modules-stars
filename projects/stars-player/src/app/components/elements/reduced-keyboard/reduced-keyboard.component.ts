import { Component, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";

import { ReducedKeyboardElement } from "../../../models/elements/reduced-keyboard";
import { ElementComponent } from "../../../directives/element-component.directive";
import { ResponseStatus, VeronaResponse } from "../../../models/verona";

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

  ngOnInit() {
    this.currentText = this.elementModel().value as string || '';
    this.KeyboardInputControl.setValue(this.currentText, { emitEvent: false });

    this.parentForm().addControl(this.elementModel().id, this.KeyboardInputControl);

    if (this.currentText) {
      this.emitStateChange(ResponseStatus.DISPLAYED);
    }
  }

  ngOnDestroy() {
    this.parentForm().removeControl(this.elementModel().id);
  }

  get textIsEmpty(): boolean {
    return this.currentText.length === 0;
  }


  addChar(button: any) {
    if (this.elementModel().maxLength !== null &&
      this.currentText.length >= this.elementModel().maxLength) {
      return;
    }

    const charToAdd = this.elementModel().getButtonValue(button, this.textIsEmpty);
    this.currentText += charToAdd;
    this.KeyboardInputControl.setValue(this.currentText);
    this.updateModelValue();
  }


  deleteChar() {
    if (this.currentText.length > 0) {
      this.currentText = this.currentText.slice(0, -1);
      this.KeyboardInputControl.setValue(this.currentText);
      this.updateModelValue();
    }
  }


  clearText() {
    this.currentText = '';
    this.KeyboardInputControl.setValue(this.currentText);
    this.updateModelValue();
  }


  submitText() {
    this.isSubmitted = true;
    this.elementModel().value = this.currentText;

    this.emitStateChange(ResponseStatus.CODING_COMPLETE);
  }


  private updateModelValue() {
    this.elementModel().value = this.currentText;

    // Emit value change with VALUE_CHANGED status
    this.emitStateChange(ResponseStatus.VALUE_CHANGED);
  }


  private emitStateChange(status: ResponseStatus) {
    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || undefined,
      value: this.currentText,
      status: status
    };

    this.valueChange.emit(response);
  }
}
