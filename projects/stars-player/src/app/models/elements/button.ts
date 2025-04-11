import { UIElement } from './ui-element';
import {
  AbstractIDService,
  UIElementProperties,
  UIElementType
} from "../../interfaces";
import { InstantiationError } from "../../errors";
import { environment } from "../../environments/environment";
import { ImageElement } from "./image";


export class ButtonElement extends UIElement implements ButtonProperties {
  type: UIElementType = "button";
  text: string = '';
  image?: ImageElement | null = null;
  action?: ButtonAction | null = null;
  actionParam?: UnitNavParam | null = null;

  constructor(element?: Partial<ButtonProperties>, idService?: AbstractIDService) {
    super({ type: 'button', ...element }, idService);
    if (isButtonProperties(element)) {
      this.text = element.text;
      this.image = element.image;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at Text instantiation', element);
      }
      if (element?.text !== undefined) this.text = element.text;
      if (element.image !== undefined) this.image = element.image;
    }
  }
}

export interface ButtonProperties extends UIElementProperties {
  text: string;
  image?: ImageElement | null;
}

function isButtonProperties(properties?: Partial<ButtonProperties>): properties is ButtonProperties {
  if (!properties) return false;
  return properties.text !== undefined &&
    properties.image !== undefined;
}

export interface ButtonEvent {
  action: ButtonAction;
  param: UnitNavParam;
}

export type ButtonAction = 'unitNav' | 'pageNav';
export type UnitNavParam = 'previous' | 'next' | 'first' | 'last' | 'end';
