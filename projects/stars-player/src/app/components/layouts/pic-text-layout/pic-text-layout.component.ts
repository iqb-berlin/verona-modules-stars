import { Component, input, output } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { UIElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse } from "../../../../../../common/models/verona";


@Component({
  selector: 'pic-text-layout',
  templateUrl: './pic-text-layout.component.html',
  styleUrls: ['./pic-text-layout.component.scss'],
  standalone: false
})

export class PicTextLayoutComponent extends ElementComponent {
  instructions = input<UIElement>();
  interaction = input<UIElement>();
  stimulus = input<UIElement>();
  parentForm = input.required<FormGroup>();
  valueChange = output<VeronaResponse>();
  variant = input<string>('col_layout');
}
