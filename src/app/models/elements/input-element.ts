import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";
import { UIElement } from "./ui-element";
import {
  AbstractIDService,
  InputElementProperties,
  InputElementValue
} from "../../interfaces";


export abstract class InputElement extends UIElement implements InputElementProperties {
  label?: string = '';
  value: InputElementValue = null;
  required: boolean = false;
  requiredWarnMessage: string = 'Eingabe erforderlich';
  readOnly: boolean = false;

  protected constructor(element: { type: string } & Partial<InputElementProperties>, idService?: AbstractIDService) {
    super(element, idService);
    if (isInputElementProperties(element)) {
      if (element.label !== undefined) this.label = element.label;
      this.value = element.value;
      this.required = element.required;
      this.requiredWarnMessage = element.requiredWarnMessage;
      this.readOnly = element.readOnly;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at InputElement instantiation', element);
      }
      if (element?.label !== undefined) this.label = element.label;
      if (element?.value !== undefined) this.value = element.value;
      if (element?.required !== undefined) this.required = element.required;
      if (element?.requiredWarnMessage !== undefined) this.requiredWarnMessage = element.requiredWarnMessage;
      if (element?.readOnly !== undefined) this.readOnly = element.readOnly;
    }
  }
  static stripHTML(htmlString: string): string {
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(htmlString, 'text/html');
    return htmlDocument.documentElement.textContent || '';
  }
}

export function isInputElement(el: UIElement): el is InputElement {
  return el.value !== undefined &&
    el.required !== undefined &&
    el.requiredWarnMessage !== undefined &&
    el.readOnly !== undefined;
}

function isInputElementProperties(properties: Partial<InputElementProperties>): properties is InputElementProperties {
  if (!properties) return false;
  return properties?.value !== undefined &&
    properties?.required !== undefined &&
    properties?.requiredWarnMessage !== undefined &&
    properties?.readOnly !== undefined;
}
