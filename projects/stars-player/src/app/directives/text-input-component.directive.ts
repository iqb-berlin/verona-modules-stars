import {
  Directive, EventEmitter, OnInit, Output
} from '@angular/core';

import { FormElementComponent } from "./form-element-component.directive";


@Directive()

export abstract class TextInputComponent extends FormElementComponent implements OnInit {
  @Output() focusChanged = new EventEmitter<{ inputElement: HTMLElement; focused: boolean }>();
  @Output() onKeyDown = new EventEmitter<{
    keyboardEvent: KeyboardEvent;
    inputElement: HTMLInputElement | HTMLTextAreaElement | HTMLElement;
  }>();

  ngOnInit() {
  }
}
