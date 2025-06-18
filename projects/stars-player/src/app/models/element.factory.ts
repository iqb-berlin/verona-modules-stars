import { Type } from '@angular/core';

import {
  UIElement,
  ImageElement,
  TextElement,
  AudioElement,
  CheckboxElement,
  RadioGroupImagesElement,
  RadioGroupTextElement,
  MultiChoiceImagesElement,
  ReducedKeyboardElement,
  SyllableCounterElement,
  BinaryChoiceElement
} from './index';
import {
  AbstractIDService,
  UIElementProperties,
  UIElementType
} from "../interfaces";


export abstract class ElementFactory {
  static ELEMENT_CLASSES: Record<string, Type<UIElement>> = {
    "text": TextElement,
    "image": ImageElement,
    "checkbox": CheckboxElement,
    "radio-group-images": RadioGroupImagesElement,
    "multi-choice-images": MultiChoiceImagesElement,
    "radio-group-text": RadioGroupTextElement,
    "audio": AudioElement,
    "reduced-keyboard": ReducedKeyboardElement,
    "syllable-counter": SyllableCounterElement,
    "binary-choice": BinaryChoiceElement
  };

  static createElement(element: { type: UIElementType } & Partial<UIElementProperties>, idService?: AbstractIDService)
    : UIElement {
    return new ElementFactory.ELEMENT_CLASSES[element.type](element, idService);
  }
}
