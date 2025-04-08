import { UIElement } from "./ui-element";
import {
  AbstractIDService,
  UIElementProperties,
  UIElementType
} from "../../interfaces";
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";
import {ImageElement} from "./image";


export class AudioElement extends UIElement implements AudioProperties {
  type: UIElementType = 'audio';
  audioSrc: string | null = null;
  fileName: string = '';
  image?: ImageElement | null = null;

  static title: string = 'Audio';
  static icon: string = 'volume_up';

  constructor(element?: Partial<AudioProperties>, idService?: AbstractIDService) {
    super({ type: 'audio', ...element }, idService);
    if (isAudioProperties(element)) {
      this.audioSrc = element.audioSrc;
      this.fileName = element.fileName;
      this.image =  element.image;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at Audio instantiation', element);
      }
      if (element?.audioSrc !== undefined) this.src = element.audioSrc;
      if (element?.fileName !== undefined) this.fileName = element.fileName;
    }
  }
}

export interface AudioProperties extends UIElementProperties {
  audioSrc: string | null;
  fileName: string;
  image?: ImageElement;
}

function isAudioProperties(blueprint?: Partial<AudioProperties>): blueprint is AudioProperties {
  if (!blueprint) return false;
  return blueprint.audioSrc !== undefined &&
    blueprint.image !== undefined;
}
