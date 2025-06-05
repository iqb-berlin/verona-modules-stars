import {
  AbstractIDService,
  InputElementProperties,
  TextImageLabel,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";

export class SyllableCounterElement extends InputElement {
  type: UIElementType = 'syllable-counter';
  maxSyllables: number = 0;
  handImageSrc: string = 'assets/images/hands/clapping-hand.png'; // Default fallback image
  options: TextImageLabel[] = [];

  static title: string = 'Silbenzähler';
  static icon: string = 'pan_tool';

  constructor(element?: Partial<SyllableCounterProperties>, idService?: AbstractIDService) {
    super({ type: 'syllable-counter', ...element }, idService);

    if (isSyllableCounterProperties(element)) {
      this.maxSyllables = element.maxSyllables;
      this.handImageSrc = element.handImageSrc || this.handImageSrc;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at SyllableCounterElement instantiation', element);
      }
      if (element?.maxSyllables !== undefined) this.maxSyllables = element.maxSyllables;
      if (element?.handImageSrc !== undefined) this.handImageSrc = element.handImageSrc;
    }

    // Generate options based on maxSyllables and provided image
    this.generateSyllableOptions();
  }

  private generateSyllableOptions(): void {
    this.options = [];

    for (let i = 1; i <= this.maxSyllables; i++) {
      const option: TextImageLabel = {
        id: `syllable_${i}`,
        text: `${i} Silbe${i > 1 ? 'n' : ''}`,
        imgSrc: this.handImageSrc, // Use the provided image (base64 or URL)
        imgFileName: this.isBase64Image(this.handImageSrc) ? `hand_${i}.png` : 'clapping-hand.png',
        altText: `${i} ${i === 1 ? 'Hand klatscht' : 'Hände klatschen'} - ${i} Silbe${i > 1 ? 'n' : ''}`
      };
      this.options.push(option);
    }
  }

  private isBase64Image(src: string): boolean {
    return src.startsWith('data:image/');
  }

  updateMaxSyllables(newMax: number): void {
    this.maxSyllables = Math.max(1, Math.min(newMax, 5));
    this.generateSyllableOptions();
  }

  updateHandImage(newImageSrc: string): void {
    this.handImageSrc = newImageSrc;
    this.generateSyllableOptions();
  }
}

export interface SyllableCounterProperties extends InputElementProperties {
  maxSyllables: number;
  handImageSrc?: string; // Can be base64 or URL
}

function isSyllableCounterProperties(blueprint?: Partial<SyllableCounterProperties>)
  : blueprint is SyllableCounterProperties {
  if (!blueprint) return false;
  return blueprint.maxSyllables !== undefined;
}
