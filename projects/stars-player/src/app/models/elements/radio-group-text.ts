import {
  AbstractIDService,
  InputElementProperties,
  TextLabel,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";

export class RadioGroupTextElement extends InputElement {
  type: UIElementType = 'radio-group-text';
  label: string = '';
  options: TextLabel[] = [];

  static title: string = 'Optionsfelder (Text)';
  static icon: string = 'radio_button_checked';

  constructor(element?: Partial<RadioGroupTextProperties>, idService?: AbstractIDService) {
    super({ type: 'radio-group-text', ...element }, idService);
    if (isRadioGroupTextProperties(element)) {
      this.label = element.label;
      this.options = [...element.options];
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at RadioGroupTextElement instantiation', element);
      }
      if (element?.label !== undefined) this.label = element.label;
      if (element?.options) this.options = [...element.options];
    }
  }
}

export interface RadioGroupTextProperties extends InputElementProperties {
  label: string;
  options: TextLabel[];
}

function isRadioGroupTextProperties(blueprint?: Partial<RadioGroupTextProperties>)
  : blueprint is RadioGroupTextProperties {
  if (!blueprint) return false;
  return blueprint.label !== undefined &&
    blueprint.options !== undefined;
}
