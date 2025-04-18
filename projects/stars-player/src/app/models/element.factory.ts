import { Type } from '@angular/core';

import {
  UIElement,
  ImageElement,
  TextElement,
  AudioElement,
  CheckboxElement,
  RadioGroupImagesElement,
  MultiChoiceImagesElement,
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
    "audio": AudioElement
  };

  static createElement(element: { type: UIElementType } & Partial<UIElementProperties>, idService?: AbstractIDService)
    : UIElement {
    return new ElementFactory.ELEMENT_CLASSES[element.type](element, idService);
  }
}
