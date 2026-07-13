import {
  Injectable,
  signal,
  linkedSignal
} from '@angular/core';
import { UnitDefinition, InteractionEnum, InteractionParameters } from '../models/unit-definition';

@Injectable({
  providedIn: 'root'
})
export class UnitFormService {
  private _unit = signal<UnitDefinition>(this.getInitialUnit());

  unit = this._unit.asReadonly();

  // Use linkedSignal for interaction parameters that depend on the interaction type
  interactionParameters = linkedSignal({
    source: () => this.unit().interactionType,
    computation: () => this.unit().interactionParameters
  });

  updateUnit(patch: Partial<UnitDefinition>) {
    this._unit.update(u => ({ ...u, ...patch }));
  }

  updateInteractionParameters(params: Partial<InteractionParameters>) {
    this._unit.update(u => ({
      ...u,
      interactionParameters: { ...u.interactionParameters, ...params } as InteractionParameters
    }));
  }

  setInteractionType(type: InteractionEnum) {
    this._unit.update(u => ({
      ...u,
      interactionType: type,
      interactionParameters: this.getDefaultParameters(type)
    }));
  }

  private getInitialUnit(): UnitDefinition {
    return {
      id: 'new-unit',
      version: '1.0.0',
      interactionType: 'NONE',
      interactionMaxTimeMS: 0,
      interactionParameters: {} as any,
      variableInfo: [],
      audioFeedback: undefined,
      closingMetaButtons: {
        variableIdReference: ''
      }
    };
  }

  private getDefaultParameters(type: InteractionEnum): InteractionParameters {
    switch (type) {
      case 'BUTTONS': return { variableId: '', options: { buttons: [] } } as any;
      case 'POLYGON_BUTTONS': return { variableId: '', options: [] } as any;
      case 'WRITE': return { variableId: '' } as any;
      case 'DROP': return { variableId: '', options: [] } as any;
      case 'FIND_ON_IMAGE': return { variableId: '', imageSource: '' } as any;
      case 'VIDEO': return { videoSource: '' } as any;
      case 'PLACE_VALUE': return { variableId: '', value: 0 } as any;
      case 'NUMBER_LINE': return { variableId: '' } as any;
      case 'PYRAMID': return { variableId: '', topNumber: 0 } as any;
      case 'EQUATION': return { variableId: '', operators: [] } as any;
      default: return {} as any;
    }
  }

  loadUnit(unit: UnitDefinition) {
    this._unit.set(unit);
  }
}
