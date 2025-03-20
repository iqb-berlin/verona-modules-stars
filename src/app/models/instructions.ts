import {
  AbstractIDService,
  UIElementProperties,
  UIElementType
} from "../interfaces";
import { UIElement } from "./elements/ui-element";


export class InstructionsElement extends UIElement {
  type: UIElementType = "instructions";

  constructor(element?: Partial<UIElementProperties>, idService?: AbstractIDService) {
    super({ type: 'instructions', ...element }, idService);
  }
}
