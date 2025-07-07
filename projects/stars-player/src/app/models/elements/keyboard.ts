import {
  AbstractIDService,
  InputElementProperties,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";
import { environment } from "../../../environments/environment";
import { InstantiationError } from "../../errors";

export interface KeyboardButton {
  id: string;
  text: string; // Can be single character or grapheme (multiple characters) - uppercase
  value?: string; // Optional different value
  lowerCaseText?: string; // Lower case version of text (for case switching)
}

export class KeyboardElement extends InputElement {
  type: UIElementType = 'keyboard';
  label?: string;
  buttons: KeyboardButton[] = [];
  showBackspace: boolean = true;
  showSubmit: boolean = false;
  maxLength: number | null = null; // Optional character limit
  submitButtonText?: string;
  backspaceButtonText: string = 'Löschen';
  placeholder?: string;
  graphemeList?: string[];

  static title: string = 'Grapheme Tastatur';
  static icon: string = 'keyboard';

  constructor(element?: Partial<KeyboardProperties>, idService?: AbstractIDService) {
    super({ type: 'keyboard', ...element }, idService);
    if (isKeyboardProperties(element)) {
      this.label = element.label;
      this.buttons = [...element.buttons];
      this.showBackspace = element.showBackspace;
      this.showSubmit = element.showSubmit;
      this.maxLength = element.maxLength;
      this.submitButtonText = element.submitButtonText;
      this.backspaceButtonText = element.backspaceButtonText;
      this.placeholder = element.placeholder || '';
      if (element.graphemeList) this.graphemeList = element.graphemeList;

      // Generate lowercase versions for buttons that don't have them explicitly defined
      this.buttons.forEach(button => {
        if (!button.lowerCaseText && typeof button.text === 'string') {
          button.lowerCaseText = button.text.toLowerCase();
        }
      });
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at KeyboardElement instantiation', element);
      }
      if (element?.label !== undefined) this.label = element.label;
      if (element?.buttons) {
        this.buttons = [...element.buttons];
        // Generate lowercase versions for buttons that don't have them explicitly defined
        this.buttons.forEach(button => {
          if (!button.lowerCaseText && typeof button.text === 'string') {
            button.lowerCaseText = button.text.toLowerCase();
          }
        });
      }
      if (element?.showBackspace !== undefined) this.showBackspace = element.showBackspace;
      if (element?.showSubmit !== undefined) this.showSubmit = element.showSubmit;
      if (element?.maxLength !== undefined) this.maxLength = element.maxLength;
      if (element?.submitButtonText !== undefined) this.submitButtonText = element.submitButtonText;
      if (element?.backspaceButtonText !== undefined) this.backspaceButtonText = element.backspaceButtonText;
      if (element?.placeholder !== undefined) this.placeholder = element.placeholder;
      if (element?.graphemeList !== undefined) this.graphemeList = element.graphemeList;
    }
  }

  // Get the current text to display for a button based on text content
  getButtonText(button: KeyboardButton, textIsEmpty: boolean): string {
    if (textIsEmpty) {
      return button.text; // Uppercase when empty
    } else {
      return button.lowerCaseText || button.text.toLowerCase(); // Lowercase when text exists
    }
  }

  // Get the current value for a button based on text content
  getButtonValue(button: KeyboardButton, textIsEmpty: boolean): string {
    if (button.value) {
      // If a specific value is set, use it regardless of case
      return button.value;
    } else if (textIsEmpty) {
      return button.text; // Uppercase when empty
    } else {
      return button.lowerCaseText || button.text.toLowerCase(); // Lowercase when text exists
    }
  }
}

export interface KeyboardProperties extends InputElementProperties {
  label?: string;
  buttons: KeyboardButton[];
  showBackspace: boolean;
  showSubmit: boolean;
  maxLength: number | null;
  submitButtonText?: string;
  backspaceButtonText: string;
  placeholder?: string;
  graphemeList?: string[];
}

function isKeyboardProperties(blueprint?: Partial<KeyboardProperties>)
  : blueprint is KeyboardProperties {
  if (!blueprint) return false;
  return blueprint.label !== undefined &&
    blueprint.buttons !== undefined &&
    blueprint.showBackspace !== undefined &&
    blueprint.showSubmit !== undefined &&
    blueprint.maxLength !== undefined &&
    blueprint.submitButtonText !== undefined &&
    blueprint.backspaceButtonText !== undefined &&
    blueprint.graphemeList !== undefined;
}
