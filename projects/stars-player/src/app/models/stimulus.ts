import {
  AbstractIDService,
  UIElementProperties,
  UIElementType
} from "../interfaces";
import { InstantiationError } from "../errors";
import { environment } from "../../environments/environment";
import { UIElement } from "./elements/ui-element";


export class StimulusElement extends UIElement implements StimulusProperties {
  type: UIElementType = "stimulus";
  position: string = '';

  constructor(element?: Partial<StimulusProperties>, idService?: AbstractIDService) {
    super({ type: 'stimulus', ...element }, idService);
    if (isStimulusProperties(element)) {
      this.position = element.position;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at Text instantiation', element);
      }
      if (element?.position !== undefined) this.position = element.position;
    }
  }
}

export interface StimulusProperties extends UIElementProperties {
  position: string;
}

function isStimulusProperties(properties?: Partial<StimulusProperties>): properties is StimulusProperties {
  if (!properties) return false;
  return properties.position !== undefined;
}
