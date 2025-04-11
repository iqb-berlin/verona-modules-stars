import {
  AbstractIDService,
  InputElementProperties,
  KeyboardParameter,
  TextImageLabel,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";

export class GraphemeKeyboardElement extends InputElement {
  type: UIElementType = 'grapheme-keyboard';
  label: string = 'Beschriftung';
  options: TextImageLabel[] = [];
  parameters: KeyboardParameter = {};

  static title: string = 'Grapheme Keyboard';
  static icon: string = 'radio_button_checked';

  constructor(element?: Partial<GraphemeKeyboardProperties>, idService?: AbstractIDService) {
    super({ type: 'grapheme-keyboard', ...element }, idService);
    if (isGraphemeKeyboardProperties(element)) {
      this.label = element.label;
      this.options = element.options;
      this.parameters = element.parameters
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at GraphemeKeyboardElement instantiation', element);
      }
      if (element?.label !== undefined) this.label = element.label;
      if (element?.options) this.options = [...element.options];
      if (element?.parameters !== undefined) this.parameters = element.parameters;
    }
  }
}

export interface GraphemeKeyboardProperties extends InputElementProperties {
  label: string;
  options: TextImageLabel[];
  parameters: KeyboardParameter;
}

function isGraphemeKeyboardProperties(blueprint?: Partial<GraphemeKeyboardProperties>)
  : blueprint is GraphemeKeyboardProperties {
  if (!blueprint) return false;
  return blueprint.label !== undefined &&
    blueprint.options !== undefined &&
    blueprint.parameters !== undefined;
}
