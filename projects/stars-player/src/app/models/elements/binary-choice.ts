import {
  AbstractIDService,
  InputElementProperties,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";

export class BinaryChoiceElement extends InputElement {
  type: UIElementType = 'binary-choice';

  static title: string = 'Binärauswahl';
  static icon: string = 'check_box';

  constructor(element?: Partial<BinaryChoiceProperties>, idService?: AbstractIDService) {
    super({ type: 'binary-choice', ...element }, idService);
  }
}

export interface BinaryChoiceProperties extends InputElementProperties {}

function isBinaryChoiceProperties(blueprint?: Partial<BinaryChoiceProperties>)
  : blueprint is BinaryChoiceProperties {
  return !!blueprint;
}
