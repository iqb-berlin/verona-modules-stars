import {
  AbstractIDService,
  InputElementProperties,
  TextImageLabel,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";
import { environment } from "../../../environments/environment";
import { InstantiationError } from "../../errors";
import { ImageElement } from "./image";

export class DropListElement extends InputElement {
  type: UIElementType = 'drop-list';
  label: string = '';
  options: TextImageLabel[] = [];
  dropTarget: ImageElement = null;

  static title: string = 'DropList';
  static icon: string = 'radio_button_checked';

  constructor(element?: Partial<DropListProperties>, idService?: AbstractIDService) {
    super({ type: 'drop-list', ...element }, idService);
    if (isDropListProperties(element)) {
      this.label = element.label;
      this.options = [...element.options];
      this.dropTarget = element.dropTarget
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at DropListElement instantiation', element);
      }
      if (element?.label !== undefined) this.label = element.label;
      if (element?.options) this.options = [...element.options];
      if (element?.dropTarget) this.dropTarget = element.dropTarget;
    }
  }
}

export interface DropListProperties extends InputElementProperties {
  label: string;
  options: TextImageLabel[];
  dropTarget: ImageElement;
}

function isDropListProperties(blueprint?: Partial<DropListProperties>)
  : blueprint is DropListProperties {
  if (!blueprint) return false;
  return blueprint.label !== undefined &&
    blueprint.options !== undefined &&
    blueprint.dropTarget !== undefined;
}
