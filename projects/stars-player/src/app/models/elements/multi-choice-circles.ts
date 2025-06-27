import {AbstractIDService, CircleOption, MultiChoiceCirclesProperties, UIElementType} from "../../interfaces";
import {InputElement} from "./input-element";
import {environment} from "../../environments/environment";
import {InstantiationError} from "../../errors";

export class MultiChoiceCirclesElement extends InputElement {
  type: UIElementType = 'multi-choice-circles';
  label: string = '';
  circles: CircleOption[] = [];
  defaultColor: string = '#000000';
  defaultSize: number = 50;
  defaultBorderColor: string = '#000000';
  defaultOpacity: number = 1;

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
      'circles',
      'defaultColor',
      'defaultSize',
      'defaultBorderColor',
      'defaultOpacity'
    ];

    properties.forEach(prop => {
      if (prop === 'circles' && element[prop]) {
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
    blueprint.circles !== undefined;
}

