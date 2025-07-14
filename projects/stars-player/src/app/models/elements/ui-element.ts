import {
  AbstractIDService,
  UIElementType
} from '../../interfaces';
import { VeronaResponse } from '../../../../../common/models/verona';
import { UIElementProperties } from "../../interfaces";
import { environment } from "../../../environments/environment";
import { InstantiationError } from "../../errors";

export abstract class UIElement implements UIElementProperties {
  [index: string]: unknown;
  id: string;
  alias: string;
  type: UIElementType;
  idService?: AbstractIDService;
  hidden: boolean = false;
  position?: string;
  helpText = '';

  constructor(element: { type: UIElementType } & Partial<UIElementProperties>, idService?: AbstractIDService) {
    this.idService = idService;
    if (isUIElementProperties(element)) {
      this.id = element.id;
      this.alias = element.alias || element.id;
      this.position = element.position || undefined;
      if (idService) {
        // Only register after the child constructior has run. ID-registration needs the type and possibly values.
        setTimeout(() => this.registerIDs());
      }
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at UIElement instantiation', element);
      }
      this.id = element.id ??
        idService?.getAndRegisterNewID(element.type) ??
        (() => { throw new Error(`No ID or IDService given: ${this.type}`); })();
      this.alias = element.alias ??
        idService?.getAndRegisterNewID(element.type, true) ??
        (() => { throw new Error(`No Alias or IDService given: ${this.type}`); })();
    }
  }

  registerIDs(): void {
    if (!this.idService) throw new Error(`IDService not available: ${this.type} ${this.id}`);
    this.idService.register(this.id, this.type, true, false);
    this.idService.register(this.alias, this.type, false, true);
  }

  unregisterIDs(): void {
    if (!this.idService) throw new Error(`IDService not available: ${this.type} ${this.id}`);
    this.idService.unregister(this.id, this.type, true, false);
    this.idService.unregister(this.alias, this.type, false, true);
  }

  hide(): void {
    this.hidden = true;
  }

  getValues(): VeronaResponse[] {
    return [{
      id: this.id,
      alias: this.alias,
      value: null,
      status: "UNSET",
      subform: undefined
    }];
  }
}

function isUIElementProperties(blueprint: Partial<UIElementProperties>): blueprint is UIElementProperties {
  return blueprint.id !== undefined &&
    blueprint.position !== undefined;
}
