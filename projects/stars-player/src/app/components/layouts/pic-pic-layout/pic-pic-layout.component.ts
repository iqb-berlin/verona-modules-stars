import { Component, input, output } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { UIElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse } from "../../../models/verona";


@Component({
  selector: 'pic-pic-layout',
  templateUrl: './pic-pic-layout.component.html',
  styleUrls: ['./pic-pic-layout.component.scss'],
  standalone: false
})

export class PicPicLayoutComponent extends ElementComponent {
  instructions = input<UIElement>();
  interaction = input<UIElement>();
  stimulus = input<UIElement>();
  parentForm = input.required<FormGroup>();
  valueChange = output<VeronaResponse>();
}
