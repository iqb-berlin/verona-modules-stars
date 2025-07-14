import {
  AbstractIDService,
  InputElementProperties,
  TextImageLabel,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";
import { environment } from "../../../environments/environment";
import { InstantiationError } from "../../errors";

export type SyllableCounterLayout = 'vertical' | 'row';

export class SyllableCounterElement extends InputElement {
  type: UIElementType = 'syllable-counter';
  maxSyllables: number = 0;
  imgSrc: string = 'assets/images/hands/clapping-hand.png';
  layout: SyllableCounterLayout = 'vertical'; // New layout property
  options: TextImageLabel[] = [];

  static title: string = 'Silbenzähler';
  static icon: string = 'pan_tool';

  constructor(element?: Partial<SyllableCounterProperties>, idService?: AbstractIDService) {
    super({ type: 'syllable-counter', ...element }, idService);

    if (isSyllableCounterProperties(element)) {
      this.maxSyllables = element.maxSyllables;
      this.imgSrc = element.imgSrc || this.imgSrc;
      this.layout = element.layout || 'vertical';
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at SyllableCounterElement instantiation', element);
      }
      if (element?.maxSyllables !== undefined) this.maxSyllables = element.maxSyllables;
      if (element?.imgSrc !== undefined) this.imgSrc = element.imgSrc;
      if (element?.layout !== undefined) this.layout = element.layout;
    }

    // Generate options based on layout and maxSyllables
    this.generateSyllableOptions();
  }

  private generateSyllableOptions(): void {
    this.options = [];

    if (this.layout === 'vertical') {
      // Vertical layout: each option shows multiple hands (1, 2, 3, 4 hands)
      for (let i = 1; i <= this.maxSyllables; i++) {
        const option: TextImageLabel = {
          id: `syllable_${i}`,
          text: `${i} Silbe${i > 1 ? 'n' : ''}`,
          imgSrc: this.imgSrc,
          imgFileName: this.isBase64Image(this.imgSrc) ? `hand_${i}.png` : 'clapping-hand.png',
          altText: `${i} ${i === 1 ? 'Hand klatscht' : 'Hände klatschen'} - ${i} Silbe${i > 1 ? 'n' : ''}`
        };
        this.options.push(option);
      }
    } else {
      // Row layout: each option shows one hand, user selects multiple
      for (let i = 1; i <= this.maxSyllables; i++) {
        const option: TextImageLabel = {
          id: `hand_${i}`,
          text: `Hand ${i}`,
          imgSrc: this.imgSrc,
          imgFileName: this.isBase64Image(this.imgSrc) ? `single_hand_${i}.png` : 'clapping-hand.png',
          altText: `Hand ${i} - klicken zum Auswählen`
        };
        this.options.push(option);
      }
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
    this.imgSrc = newImageSrc;
    this.generateSyllableOptions();
  }

  updateLayout(newLayout: SyllableCounterLayout): void {
    this.layout = newLayout;
    this.generateSyllableOptions();
  }

  // Helper method to convert multi-choice binary string to syllable count
  static binaryStringToSyllableCount(binaryString: string): number {
    if (!binaryString) return 0;
    return binaryString.split('').filter(bit => bit === '1').length;
  }

  // Helper method to convert syllable count to binary string for multi-choice
  static syllableCountToBinaryString(count: number, maxSyllables: number): string {
    if (count <= 0) return '0'.repeat(maxSyllables);
    if (count > maxSyllables) count = maxSyllables;

    // Create binary string: first 'count' positions are '1', rest are '0'
    const selected = '1'.repeat(count);
    const unselected = '0'.repeat(maxSyllables - count);
    return selected + unselected;
  }
}

export interface SyllableCounterProperties extends InputElementProperties {
  maxSyllables: number;
  imgSrc?: string;
  layout?: SyllableCounterLayout; // New layout property
}

function isSyllableCounterProperties(blueprint?: Partial<SyllableCounterProperties>)
  : blueprint is SyllableCounterProperties {
  if (!blueprint) return false;
  return blueprint.maxSyllables !== undefined;
}
