import { Component, input } from '@angular/core';

import { TextElement } from "../../models";
import { ElementComponent } from "../../directives/element-component.directive";


@Component({
  selector: 'stars-text',
  standalone: false,
  template: `
    <p [ngClass]="position()">
        {{elementModel().text}}
    </p>
  `,
  styles: [
    '.center { text-align: center; }',
    '.right { text-align: right; }'
  ]
})

export class TextComponent extends ElementComponent {
  elementModel = input.required<TextElement>();
  position = input<string>("center");
}
