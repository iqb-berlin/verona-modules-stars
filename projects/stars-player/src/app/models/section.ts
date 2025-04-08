import { UIElement } from './elements/ui-element';
import { ElementFactory } from './element.factory';
import { environment } from '../environments/environment';
import {
  AbstractIDService,
  Coder,
  UIElementProperties,
  UIElementValue
} from '../interfaces';
import { InstantiationError } from '../errors';


export class Section implements SectionProperties {
  [index: string]: unknown;
  layoutId: string;
  instructions?: UIElement;
  stimulus?: UIElement;
  interaction?: UIElement;
  variant?: string;
  coding?: Coder;

  idService?: AbstractIDService;

  constructor(section?: SectionProperties, idService?: AbstractIDService) {
    this.idService = idService;
    console.log(section);
    if (section) {
      this.layoutId = section.layoutId || "default";
      this.variant = section.variant || undefined;
      this.coding = section.coding || undefined;
      this.instructions = section.instructions ?
        ElementFactory.createElement(section.instructions, idService)
        : undefined;
      this.interaction = section.interaction ?
        ElementFactory.createElement(section.interaction, idService)
        : undefined;
      this.stimulus = section.stimulus ?
        ElementFactory.createElement(section.stimulus, idService)
        : undefined;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at Section instantiation');
      }
    }
    console.log(this.instructions);
  }

  setProperty(property: string, value: UIElementValue): void {
    this[property] = value;
  }

  getAllElements(elementType?: string): UIElement[] {
    let allElements: UIElement[] = [];
    if (elementType) {
      allElements = allElements.filter(element => element.type === elementType);
    }
    return allElements;
  }
}

export interface SectionProperties {
  instructions?: UIElementProperties;
  stimulus?: UIElementProperties;
  interaction?: UIElementProperties;
  layoutId: string;
  variant?: string;
  coding?: Coder;
}
