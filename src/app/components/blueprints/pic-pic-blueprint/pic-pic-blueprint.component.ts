import { Component, input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { UIElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";


@Component({
  selector: 'pic-pic-blueprint',
  templateUrl: './pic-pic-blueprint.component.html',
  styleUrls: ['./pic-pic-blueprint.component.scss'],
  standalone: false
})

export class PicPicBlueprintComponent extends ElementComponent {
  instructions = input<UIElement>();
  interaction = input<UIElement>();
  stimulus = input<UIElement>();
  parentForm = input.required<FormGroup>();
}
