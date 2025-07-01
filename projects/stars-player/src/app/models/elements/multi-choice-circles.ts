import { AbstractIDService, InputElementProperties, UIElementType } from "../../interfaces";
import { InputElement } from "./input-element";
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";
import { CircleOption } from "../../../app/components/elements/multi-choice-circles/multi-choice-circles.component";

export class MultiChoiceCirclesElement extends InputElement {
  type: UIElementType = 'multi-choice-circles';
  label: string = '';
  optionsCount: number = 0;
  options: CircleOption[] = [];
  defaultColor: string = '#FFFFFF';
  defaultSize: number = 100;

  static title: string = 'MultipleChoiceCircles';
  static icon: string = 'radio_button_checked';

  constructor(element?: Partial<MultiChoiceCirclesProperties>, idService?: AbstractIDService) {
    super({ type: 'radio', ...element }, idService);

    if (!element) return;

    if (!isMultiChoiceCirclesProperties(element) && environment.strictInstantiation) {
      throw new InstantiationError('Error at MultiChoiceCirclesElement instantiation', element);
    }

    /* Common property assignments */
    const properties: (keyof MultiChoiceCirclesProperties)[] = [
      'label',
      'optionsCount',
      'options',
      'defaultColor',
      'defaultSize',
    ];

    /* property initialization logic */
    properties.forEach(prop => {
      if (prop === 'options' && element[prop]) {
        /* create a new array copy for options */
        this[prop] = [...element[prop]!];
      } else if (element[prop] !== undefined) {
        /* assign other properties directly */
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

interface MultiChoiceCirclesProperties extends InputElementProperties {
  label: string;
  optionsCount: number;
  options: CircleOption[];
  defaultColor?: string;
  defaultSize?: number;
}
