import { Component, input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

import {
  MultiChoiceImagesElement,
  RadioGroupImagesElement,
  ReducedKeyboardElement,
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
  sectionVariant = input<string>('row_layout');
  elementType: UIElementType | undefined;

  stimulusTypes: UIElementType[] = [
    "radio-group-images",
    "multi-choice-images",
    "reduced-keyboard",
    "syllable-counter"
  ];

  ngOnInit() {
    this.elementType = this.stimulusTypes.find(type => type === this.elementModel().type );
  }

  get elementModelAsRadioGroupImagesElement(): RadioGroupImagesElement {
    return this.elementModel() as RadioGroupImagesElement;
  }

  get elementModelAsMultiChoiceImagesElement(): MultiChoiceImagesElement {
    return this.elementModel() as MultiChoiceImagesElement;
  }

  get elementModelAsReducedKeyboardElement(): ReducedKeyboardElement {
    return this.elementModel() as ReducedKeyboardElement;
  }

  get elementModelAsSyllableCounterElement(): SyllableCounterElement {
    return this.elementModel() as SyllableCounterElement;
  }
}
