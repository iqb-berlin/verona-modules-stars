import {Component, input, output} from '@angular/core';
import { FormGroup } from "@angular/forms";

import {ButtonElement, UIElement} from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse } from "../../../models/verona";


@Component({
  selector: 'pic-keyboard-layout',
  templateUrl: './pic-keyboard-layout.component.html',
  styleUrls: ['./pic-keyboard-layout.component.scss'],
  standalone: false
})

export class PicKeyboardLayoutComponent extends ElementComponent {
  instructions = input<UIElement>();
  interaction = input<UIElement>();
  stimulus = input<UIElement>();
  continueButton = input<UIElement>();
  parentForm = input.required<FormGroup>();
  valueChange = output<VeronaResponse>();

  get elementModelAsButtonElement(): ButtonElement {
    return this.continueButton() as ButtonElement;
  }
}
