import {
  AbstractIDService,
  InputElementProperties,
  TextImageLabel,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";

export class MultiChoiceImagesElement extends InputElement {
  type: UIElementType = 'multi-choice-images';
  label: string = 'Beschriftung';
  options: TextImageLabel[] = [];

  static title: string = 'MultipleChoice';
  static icon: string = 'radio_button_checked';

  constructor(element?: Partial<MultiChoiceImagesProperties>, idService?: AbstractIDService) {
    super({ type: 'radio', ...element }, idService);
    if (isMultiChoiceImagesProperties(element)) {
      this.label = element.label;
      this.options = [...element.options];
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at RadioButtonGroupElement instantiation', element);
      }
      if (element?.label !== undefined) this.label = element.label;
      if (element?.options) this.options = [...element.options];
    }
  }
}

export interface MultiChoiceImagesProperties extends InputElementProperties {
  label: string;
  options: TextImageLabel[];
}

function isMultiChoiceImagesProperties(blueprint?: Partial<MultiChoiceImagesProperties>)
  : blueprint is MultiChoiceImagesProperties {
  if (!blueprint) return false;
  return blueprint.label !== undefined &&
    blueprint.options !== undefined;
}
