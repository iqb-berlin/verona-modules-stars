import {AbstractIDService, CircleOption, MultiChoiceCirclesProperties, UIElementType} from "../../interfaces";
import {InputElement} from "./input-element";
import {environment} from "../../environments/environment";
import {InstantiationError} from "../../errors";

export class MultiChoiceCirclesElement extends InputElement {
  type: UIElementType = 'multi-choice-circles';
  label: string = '';
  options: CircleOption[] = [];
  defaultColor: string = '#FFFFFF';
  defaultSize: number = 100;

  static title: string = 'MultipleChoiceCircles';
  static icon: string = 'radio_button_checked';

  constructor(element?: Partial<MultiChoiceCirclesProperties>, idService?: AbstractIDService) {
    super({type: 'radio', ...element}, idService);

    if (!element) return;

    if (!isMultiChoiceCirclesProperties(element) && environment.strictInstantiation) {
      throw new InstantiationError('Error at MultiChoiceCirclesElement instantiation', element);
    }

    // Common property assignments
    const properties: (keyof MultiChoiceCirclesProperties)[] = [
      'label',
      'options',
      'defaultColor',
      'defaultSize',
    ];

    properties.forEach(prop => {
      if (prop === 'options' && element[prop]) {
        this[prop] = [...element[prop]!];
      } else if (element[prop] !== undefined) {
        (this as any)[prop] = element[prop];
      }
    });
  }
}

function isMultiChoiceCirclesProperties(blueprint?: Partial<MultiChoiceCirclesProperties>): blueprint is MultiChoiceCirclesProperties {
  if (!blueprint) return false;
  return blueprint.label !== undefined &&
    blueprint.options !== undefined;
}

