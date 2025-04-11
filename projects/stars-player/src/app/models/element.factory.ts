import { Type } from '@angular/core';

import {
  UIElement,
  ImageElement,
  TextElement,
  AudioElement,
  ButtonElement,
  CheckboxElement,
  RadioGroupImagesElement,
  MultiChoiceImagesElement,
} from './index';
import {
  AbstractIDService,
  UIElementProperties,
  UIElementType
} from "../interfaces";
import {GraphemeKeyboardElement} from "./elements/grapheme-keyboard";


export abstract class ElementFactory {
  static ELEMENT_CLASSES: Record<string, Type<UIElement>> = {
    "text": TextElement,
    "button": ButtonElement,
    "image": ImageElement,
    "checkbox": CheckboxElement,
    "radio-group-images": RadioGroupImagesElement,
    "multi-choice-images": MultiChoiceImagesElement,
    "audio": AudioElement,
    "grapheme-keyboard": GraphemeKeyboardElement
  };

  static createElement(element: { type: UIElementType } & Partial<UIElementProperties>, idService?: AbstractIDService)
    : UIElement {
    return new ElementFactory.ELEMENT_CLASSES[element.type](element, idService);
  }
}
