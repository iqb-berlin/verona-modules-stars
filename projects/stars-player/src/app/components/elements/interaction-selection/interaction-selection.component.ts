import { Component, input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

import {
  BinaryChoiceElement,
  MultiChoiceCirclesElement,
  MultiChoiceImagesElement,
  RadioGroupImagesElement,
  RadioGroupTextElement,
  KeyboardElement,
  SyllableCounterElement,
  UIElement
} from "../../../models";
import { UIElementType } from "../../../interfaces";
import { ElementComponent } from "../../../directives/element-component.directive";


@Component({
  selector: 'interaction-selection',
  templateUrl: './interaction-selection.component.html',
  styleUrls: ['./interaction-selection.component.scss'],
  standalone: false
})

export class InteractionSelectionComponent extends ElementComponent implements OnInit {
  elementModel = input.required<UIElement>();
  parentForm = input.required<FormGroup>();
  sectionVariant = input<string>('grid_layout');
  elementType: UIElementType | undefined;

  interactionTypes: UIElementType[] = [
    "radio-group-images",
    "multi-choice-images",
    "multi-choice-circles",
    "radio-group-text",
    "keyboard",
    "syllable-counter",
    "binary-choice"
  ];

  ngOnInit() {
    this.elementType = this.interactionTypes.find(type => type === this.elementModel().type);
  }

  get elementModelAsRadioGroupImagesElement(): RadioGroupImagesElement {
    return this.elementModel() as RadioGroupImagesElement;
  }

  get elementModelAsMultiChoiceImagesElement(): MultiChoiceImagesElement {
    return this.elementModel() as MultiChoiceImagesElement;
  }

  get elementModelAsMultiChoiceCirclesElement(): MultiChoiceCirclesElement {
    return this.elementModel() as MultiChoiceCirclesElement;
  }

  get elementModelAsKeyboardElement(): KeyboardElement {
    return this.elementModel() as KeyboardElement;
  }

  get elementModelAsSyllableCounterElement(): SyllableCounterElement {
    return this.elementModel() as SyllableCounterElement;
  }

  get elementModelAsRadioGroupTextElement(): RadioGroupTextElement {
    return this.elementModel() as RadioGroupTextElement;
  }

  get elementModelAsBinaryChoiceElement(): BinaryChoiceElement {
    return this.elementModel() as BinaryChoiceElement;
  }
}
