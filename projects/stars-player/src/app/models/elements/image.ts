import { UIElement } from "./ui-element";
import {
  AbstractIDService,
  UIElementProperties,
  UIElementType
} from "../../interfaces";
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";

export class ImageElement extends UIElement implements ImageProperties {
  type: UIElementType = 'image';
  imgSrc: string | null = null;
  altText: string = 'Bild nicht gefunden';
  fileName?: string = '';

  static title: string = 'Bild';
  static icon: string = 'image';

  constructor(element?: Partial<ImageProperties>, idService?: AbstractIDService) {
    super({ type: 'image', ...element }, idService);
    if (isImageProperties(element)) {
      this.imgSrc = element.imgSrc;
      this.altText = element.altText;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at Image instantiation', element);
      }
      if (element?.imgSrc !== undefined) this.imgSrc = element.imgSrc;
      if (element?.altText !== undefined) this.altText = element.altText;
    }
  }
}

export interface ImageProperties extends UIElementProperties {
  imgSrc: string | null;
  altText: string;
  fileName?: string;
}

function isImageProperties(blueprint?: Partial<ImageProperties>): blueprint is ImageProperties {
  if (!blueprint) return false;
  return blueprint.imgSrc !== undefined &&
    blueprint.altText !== undefined &&
    blueprint.fileName !== undefined;
}
