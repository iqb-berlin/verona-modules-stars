import {
  AbstractIDService,
  InputElementProperties,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";
import { environment } from "../../../environments/environment";
import { InstantiationError } from "../../errors";


export class CheckboxElement extends InputElement implements CheckboxProperties {
  type: UIElementType = 'checkbox';
  label: string = undefined;
  imgSrc: string | null = null;
  value: boolean = false;
  altText: string = undefined;

  static title: string = 'Kontrollkästchen';
  static icon: string = 'check_box';

  constructor(element?: Partial<CheckboxProperties>, idService?: AbstractIDService) {
    super({ type: 'checkbox', ...element }, idService);
    if (isCheckboxProperties(element)) {
      this.label = element.label;
      this.imgSrc = element.imgSrc;
      this.value = element.value;
      this.altText = element.altText;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at Checkbox instantiation', element);
      }
      if (element?.label !== undefined) this.label = element.label;
      if (element?.imgSrc !== undefined) this.imgSrc = element.imgSrc;
      if (element?.value !== undefined) this.value = element.value;
      if (element?.altText !== undefined) this.altText = element.altText;
    }
  }
}

export interface CheckboxProperties extends InputElementProperties {
  label: string;
  imgSrc: string | null;
  altText: string;
  value: boolean;
}

function isCheckboxProperties(properties?: Partial<CheckboxProperties>): properties is CheckboxProperties {
  if (!properties) return false;
  return properties.label !== undefined &&
    properties.imgSrc !== undefined &&
    properties.altText !== undefined;
}
