import {
  AbstractIDService,
  UIElementProperties,
  UIElementType
} from "../interfaces";
import { UIElement } from "./elements/ui-element";


export class InteractionElement extends UIElement {
  type: UIElementType = "interaction";

  constructor(element?: Partial<UIElementProperties>, idService?: AbstractIDService) {
    super({ type: 'interaction', ...element }, idService);
  }
}
