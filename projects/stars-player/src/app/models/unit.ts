import { Section, SectionProperties } from './section';
import { UIElement } from './elements/ui-element';
import { StateVariable } from './state-variable';
import { environment } from '../environments/environment';
import { AbstractIDService } from '../interfaces';
import { InstantiationError } from '../errors';

export class Unit implements UnitProperties {
  type = 'aspect-unit-definition';
  version: string;
  stateVariables: StateVariable[] = [];
  sections: Section[] = [];
  showUnitNavNext: boolean = false;

  layoutId: string;
  variant?: string;
  instructions?: UIElement;
  interaction?: UIElement;
  stimulus?: UIElement;

  constructor(unit?: UnitProperties, idService?: AbstractIDService) {
    if (unit && isValid(unit)) {
      this.version = unit.version;
      this.stateVariables = unit.stateVariables
        .map(variable => new StateVariable(variable.id, variable.alias ?? variable.id, variable.value));
      this.sections = unit.sections
        .map(section => new Section(section, idService));
      this.showUnitNavNext = unit.showUnitNavNext;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at unit instantiation');
      }
      if (unit?.stateVariables !== undefined) {
        this.stateVariables = unit.stateVariables
          .map(variable => new StateVariable(variable.id, variable.alias ?? variable.id, variable.value));
      }
      this.sections = unit?.sections
        .map(section => new Section(section, idService)) || [new Section(undefined, idService)];
      if (unit?.showUnitNavNext !== undefined) this.showUnitNavNext = unit.showUnitNavNext;
    }
  }

  getAllElements(elementType?: string): UIElement[] {
    return this.sections.map(section => section.getAllElements(elementType)).flat();
  }
}

function isValid(blueprint?: UnitProperties): boolean {
  if (!blueprint) return false;
  if (blueprint.stateVariables !== undefined &&
      blueprint.stateVariables.length > 0 &&
      blueprint.stateVariables[0].alias === undefined) {
    return false;
  }
  return blueprint.version !== undefined &&
    blueprint.stateVariables !== undefined &&
    blueprint.type !== undefined &&
    blueprint.sections !== undefined &&
    blueprint.showUnitNavNext !== undefined;
}

export interface UnitProperties {
  type: string;
  version: string;
  stateVariables: StateVariable[];
  sections: SectionProperties[];
  showUnitNavNext: boolean;
}
