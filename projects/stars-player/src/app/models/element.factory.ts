import {Type} from '@angular/core';

import {
  AudioElement,
  BinaryChoiceElement,
  CheckboxElement,
  ImageElement,
  MultiChoiceCirclesElement,
  MultiChoiceImagesElement,
  RadioGroupImagesElement,
  RadioGroupTextElement,
  KeyboardElement,
  SyllableCounterElement,
  TextElement,
  UIElement,
  DropListElement
} from './index';
import {AbstractIDService, UIElementProperties, UIElementType} from "../interfaces";


export abstract class ElementFactory {
  static ELEMENT_CLASSES: Record<string, Type<UIElement>> = {
    "text": TextElement,
    "image": ImageElement,
    "checkbox": CheckboxElement,
    "radio-group-images": RadioGroupImagesElement,
    "multi-choice-images": MultiChoiceImagesElement,
    "multi-choice-circles": MultiChoiceCirclesElement,
    "radio-group-text": RadioGroupTextElement,
    "audio": AudioElement,
    "keyboard": KeyboardElement,
    "syllable-counter": SyllableCounterElement,
    "binary-choice": BinaryChoiceElement,
    "drop-list": DropListElement
  };

  static createElement(element: { type: UIElementType } & Partial<UIElementProperties>, idService?: AbstractIDService)
    : UIElement {
    return new ElementFactory.ELEMENT_CLASSES[element.type](element, idService);
  }
}
