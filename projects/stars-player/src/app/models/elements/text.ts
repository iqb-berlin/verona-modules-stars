import { UIElementType } from '../../interfaces';
import { UIElement } from './ui-element';
import { VeronaResponse } from '../../../../../common/models/verona';
import {
  AbstractIDService,
  UIElementProperties
} from "../../interfaces";
import { InstantiationError } from "../../errors";
import { environment } from "../../environments/environment";

export class TextElement extends UIElement implements TextProperties {
  type: UIElementType = "text";
  text: string = '';

  constructor(element?: Partial<TextProperties>, idService?: AbstractIDService) {
    super({ type: 'text', ...element }, idService);
    if (isTextProperties(element)) {
      this.text = element.text;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at Text instantiation', element);
      }
      if (element?.text !== undefined) this.text = element.text;
    }
  }

  getValues(): VeronaResponse[] {
    return [];
  }

  check(values: VeronaResponse[]): void { }
}

export interface TextProperties extends UIElementProperties {
  text: string;
}

function isTextProperties(properties?: Partial<TextProperties>): properties is TextProperties {
  if (!properties) return false;
  return properties.text !== undefined;
}
