import { Component, input, OnInit } from "@angular/core";

import {
  ImageElement,
  TextElement,
  UIElement
} from "../../../models";
import { UIElementType } from "../../../interfaces";


@Component({
  selector: 'stimulus-selection',
  templateUrl: './stimulus-selection.component.html',
  styleUrls: ['./stimulus-selection.component.scss'],
  standalone: false
})

export class StimulusSelectionComponent implements OnInit {
  elementModel = input.required<UIElement>();
  elementType: UIElementType | undefined;

  stimulusTypes: UIElementType[] = [
    "text",
    "image"
  ];

  ngOnInit() {
    this.elementType = this.stimulusTypes.find(type => type === this.elementModel().type );
  }

  get elementModelAsTextElement(): TextElement {
    return this.elementModel() as TextElement;
  }

  get elementModelAsImageElement(): ImageElement {
    return this.elementModel() as ImageElement;
  }
}
