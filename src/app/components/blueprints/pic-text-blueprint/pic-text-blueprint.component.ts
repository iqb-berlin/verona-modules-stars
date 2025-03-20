import { Component, input } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { UIElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";


@Component({
  selector: 'pic-text-blueprint',
  templateUrl: './pic-text-blueprint.component.html',
  styleUrls: ['./pic-text-blueprint.component.scss'],
  standalone: false
})

export class PicTextBlueprintComponent extends ElementComponent {
  instructions = input<UIElement>();
  interaction = input<UIElement>();
  stimulus = input<UIElement>();
  parentForm = input.required<FormGroup>();
}
