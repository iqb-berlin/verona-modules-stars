import { Component, input, OnInit } from "@angular/core";

import {
  ImageElement,
  TextElement,
  AudioElement,
  UIElement
} from "../../../models";
import { UIElementType } from "../../../interfaces";
import { ElementComponent } from "../../../directives/element-component.directive";


@Component({
  selector: 'instructions-selection',
  templateUrl: './instructions-selection.component.html',
  styleUrls: ['./instructions-selection.component.scss'],
  standalone: false
})

export class InstructionsSelectionComponent extends ElementComponent implements OnInit {
  elementModel = input.required<UIElement>();
  elementType: UIElementType | undefined;

  instructionsTypes: UIElementType[] = [
    "text",
    "image",
    "audio"
  ];

  ngOnInit() {
    this.elementType = this.instructionsTypes.find(type => type === this.elementModel().type );
  }

  get elementModelAsTextElement(): TextElement {
    return this.elementModel() as TextElement;
  }

  get elementModelAsImageElement(): ImageElement {
    return this.elementModel() as ImageElement;
  }

  get elementModelAsAudioElement(): AudioElement {
    return this.elementModel() as AudioElement;
  }
}
