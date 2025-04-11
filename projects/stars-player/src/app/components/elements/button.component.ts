import { Component, input, output } from '@angular/core';

import { ElementComponent } from '../../directives/element-component.directive';
import { ButtonElement, ButtonEvent } from "../../models/elements/button";


@Component({
  selector: 'stars-button',
  template: `
    <button>{{elementModel().text}}</button>
  `,
  standalone: false,
  styles: [
    ':host {display: flex; width: 100%; height: 100%;}',
    '.full-size {width: 100%; height: 100%;}',
    '.image {object-fit: contain;}',
    '.mdc-button {min-width: unset;}'
  ]
})
export class ButtonComponent extends ElementComponent {
  elementModel = input.required<ButtonElement>();
  buttonActionEvent = output<ButtonEvent>();
}
