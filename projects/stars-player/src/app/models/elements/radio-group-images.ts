import {
  AbstractIDService,
  InputElementProperties,
  TextImageLabel,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";
import { environment } from "../../../environments/environment";
import { InstantiationError } from "../../errors";

export class RadioGroupImagesElement extends InputElement {
  type: UIElementType = 'radio-group-images';
  label: string = '';
  options: TextImageLabel[] = [];

  static title: string = 'Optionsfelder';
  static icon: string = 'radio_button_checked';

  constructor(element?: Partial<RadioGroupImagesProperties>, idService?: AbstractIDService) {
    super({ type: 'radio-group-images', ...element }, idService);
    if (isRadioGroupImagesProperties(element)) {
      this.label = element.label;
      this.options = [...element.options];
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at RadioGroupImagesElement instantiation', element);
      }
      if (element?.label !== undefined) this.label = element.label;
      if (element?.options) this.options = [...element.options];
    }
  }
}

export interface RadioGroupImagesProperties extends InputElementProperties {
  label: string;
  options: TextImageLabel[];
}

function isRadioGroupImagesProperties(blueprint?: Partial<RadioGroupImagesProperties>)
  : blueprint is RadioGroupImagesProperties {
  if (!blueprint) return false;
  return blueprint.label !== undefined &&
    blueprint.options !== undefined;
}
