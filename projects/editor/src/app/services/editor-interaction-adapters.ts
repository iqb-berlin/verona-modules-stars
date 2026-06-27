import {
  InteractionButtonParams,
  InteractionDropParams,
  InteractionEnum,
  InteractionEquationParams,
  InteractionFindOnImageParams,
  InteractionMetaParams,
  InteractionNumberLineParams,
  InteractionParameters,
  InteractionPlaceValueParams,
  InteractionPolygonButtonsParams,
  InteractionPyramidParams,
  InteractionVideoParams,
  InteractionWriteParams,
  RepeatButtonConfig,
  SelectionOption
} from '@shared/models/unit-definition';
import { VariableInfo } from '@shared/models/responses';

export type VeronaVariableType = 'string' | 'integer' | 'number' | 'boolean' | 'coded';

export interface SelectionMetadata {
  labels: string[];
  multiple: boolean;
}

export interface EditorInteractionAdapter<T extends InteractionParameters = InteractionParameters> {
  readonly type: InteractionEnum;
  defaultParams(): T;
  normalize(params: InteractionParameters): T;
  variableType(variableInfo?: VariableInfo): VeronaVariableType;
  selectionMetadata(params: InteractionParameters): SelectionMetadata | undefined;
}

abstract class BaseEditorInteractionAdapter<T extends InteractionParameters> implements EditorInteractionAdapter<T> {
  abstract readonly type: InteractionEnum;
  abstract defaultParams(): T;

  normalize(params: InteractionParameters): T {
    return { ...this.defaultParams(), ...(params as T) };
  }

  variableType(variableInfo?: VariableInfo): VeronaVariableType {
    return variableInfo?.codes?.length ? 'coded' : 'string';
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  selectionMetadata(params: InteractionParameters): SelectionMetadata | undefined {
    return undefined;
  }
}

function labelForOption(option: SelectionOption | undefined, index: number): string {
  return option?.text || option?.label || `Option ${index + 1}`;
}

function labelsFromRepeatButton(config: RepeatButtonConfig): string[] {
  return Array.from(
    { length: config.numberOfOptions },
    (_, index) => labelForOption(config.option, index)
  );
}

export class ButtonsEditorAdapter extends BaseEditorInteractionAdapter<InteractionButtonParams> {
  readonly type: InteractionEnum = 'BUTTONS';

  defaultParams(): InteractionButtonParams {
    return {
      variableId: 'BUTTONS',
      options: { buttons: [] },
      buttonType: 'BIG_SQUARE',
      numberOfRows: 1,
      multiSelect: false,
      imagePosition: 'LEFT',
      layout: 'LEFT_CENTER'
    };
  }

  selectionMetadata(params: InteractionParameters): SelectionMetadata | undefined {
    const buttonParams = params as InteractionButtonParams;
    const repeatButton = buttonParams.options?.repeatButton;
    const labels = repeatButton ?
      labelsFromRepeatButton(repeatButton) :
      (buttonParams.options?.buttons || []).map(labelForOption);
    return labels.length > 0 ? { labels, multiple: !!buttonParams.multiSelect } : undefined;
  }
}

export class ImageOnlyEditorAdapter extends ButtonsEditorAdapter {
  override readonly type: InteractionEnum = 'IMAGE_ONLY';
}

export class PolygonButtonsEditorAdapter extends BaseEditorInteractionAdapter<InteractionPolygonButtonsParams> {
  readonly type = 'POLYGON_BUTTONS' as const;

  defaultParams(): InteractionPolygonButtonsParams {
    return {
      variableId: 'POLYGON_BUTTONS',
      options: [],
      multiSelect: false
    };
  }

  selectionMetadata(params: InteractionParameters): SelectionMetadata | undefined {
    const polygonParams = params as InteractionPolygonButtonsParams;
    const labels = (polygonParams.options || []).map(labelForOption);
    return labels.length > 0 ? { labels, multiple: !!polygonParams.multiSelect } : undefined;
  }
}

export class WriteEditorAdapter extends BaseEditorInteractionAdapter<InteractionWriteParams> {
  readonly type = 'WRITE' as const;

  defaultParams(): InteractionWriteParams {
    return {
      variableId: 'WRITE',
      addBackspaceKey: true,
      addUmlautKeys: false,
      keyboardMode: 'CHARACTERS',
      keysLine1: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
      keysLine2: ['j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r'],
      keysLine3: ['s', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      keysLine4: [],
      maxInputLength: 20
    };
  }

  override normalize(params: InteractionParameters): InteractionWriteParams {
    const incomingParams = params as InteractionWriteParams;
    const writeParams = { ...this.defaultParams(), ...incomingParams };
    if (!writeParams.keysLine1) {
      writeParams.keysLine1 = this.defaultParams().keysLine1;
    }
    if (!writeParams.keysLine2) {
      writeParams.keysLine2 = this.defaultParams().keysLine2;
    }
    if (!writeParams.keysLine3) {
      writeParams.keysLine3 = this.defaultParams().keysLine3;
    }
    if (!incomingParams.keysLine4) {
      const keysLine4: string[] = [];
      if (writeParams.addUmlautKeys) {
        keysLine4.push('ä', 'ö', 'ü');
      }
      if (writeParams.keysToAdd?.length) {
        keysLine4.push(...writeParams.keysToAdd);
      }
      writeParams.keysLine4 = keysLine4;
    }
    writeParams.addUmlautKeys = ['ä', 'ö', 'ü'].every(umlaut => writeParams.keysLine4?.includes(umlaut));
    return writeParams;
  }
}

export class DropEditorAdapter extends BaseEditorInteractionAdapter<InteractionDropParams> {
  readonly type = 'DROP' as const;

  defaultParams(): InteractionDropParams {
    return {
      variableId: 'DROP',
      options: [],
      buttonType: 'SMALL_SQUARE',
      imagePosition: 'BOTTOM'
    };
  }
}

export class FindOnImageEditorAdapter extends BaseEditorInteractionAdapter<InteractionFindOnImageParams> {
  readonly type = 'FIND_ON_IMAGE' as const;

  defaultParams(): InteractionFindOnImageParams {
    return {
      variableId: 'FIND_ON_IMAGE',
      imageSource: '',
      size: 'MEDIUM'
    };
  }
}

export class VideoEditorAdapter extends BaseEditorInteractionAdapter<InteractionVideoParams> {
  readonly type = 'VIDEO' as const;

  defaultParams(): InteractionVideoParams {
    return {
      variableId: 'VIDEO',
      videoSource: ''
    };
  }
}

abstract class IntegerVariableEditorAdapter<T extends InteractionParameters> extends BaseEditorInteractionAdapter<T> {
  override variableType(variableInfo?: VariableInfo): VeronaVariableType {
    return variableInfo?.codes?.length ? 'coded' : 'integer';
  }
}

export class PlaceValueEditorAdapter extends IntegerVariableEditorAdapter<InteractionPlaceValueParams> {
  readonly type = 'PLACE_VALUE' as const;

  defaultParams(): InteractionPlaceValueParams {
    return {
      variableId: 'PLACE_VALUE',
      value: 0,
      maxNumberOfTens: 9,
      maxNumberOfOnes: 9
    };
  }
}

export class NumberLineEditorAdapter extends IntegerVariableEditorAdapter<InteractionNumberLineParams> {
  readonly type = 'NUMBER_LINE' as const;

  defaultParams(): InteractionNumberLineParams {
    return {
      variableId: 'NUMBER_LINE',
      firstNumber: 0,
      lastNumber: 20,
      numberInput: 10,
      style: 'WAVE'
    };
  }
}

export class PyramidEditorAdapter extends BaseEditorInteractionAdapter<InteractionPyramidParams> {
  readonly type = 'PYRAMID' as const;

  defaultParams(): InteractionPyramidParams {
    return {
      variableId: 'PYRAMID',
      topNumber: 10
    };
  }
}

export class EquationEditorAdapter extends IntegerVariableEditorAdapter<InteractionEquationParams> {
  readonly type = 'EQUATION' as const;

  defaultParams(): InteractionEquationParams {
    return {
      variableId: 'EQUATION',
      operators: ['+']
    };
  }
}

export class MetaEditorAdapter extends BaseEditorInteractionAdapter<InteractionMetaParams> {
  readonly type = 'META' as const;

  defaultParams(): InteractionMetaParams {
    return {
      variableId: 'META_SELECTION'
    };
  }
}

class NoneEditorAdapter extends BaseEditorInteractionAdapter<InteractionMetaParams> {
  readonly type = 'NONE' as const;

  defaultParams(): InteractionMetaParams {
    return {
      variableId: 'NONE'
    };
  }
}

export class EditorInteractionAdapterRegistry {
  private readonly adapters = new Map<InteractionEnum, EditorInteractionAdapter>([
    ['BUTTONS', new ButtonsEditorAdapter()],
    ['IMAGE_ONLY', new ImageOnlyEditorAdapter()],
    ['WRITE', new WriteEditorAdapter()],
    ['DROP', new DropEditorAdapter()],
    ['FIND_ON_IMAGE', new FindOnImageEditorAdapter()],
    ['VIDEO', new VideoEditorAdapter()],
    ['POLYGON_BUTTONS', new PolygonButtonsEditorAdapter()],
    ['PLACE_VALUE', new PlaceValueEditorAdapter()],
    ['NUMBER_LINE', new NumberLineEditorAdapter()],
    ['PYRAMID', new PyramidEditorAdapter()],
    ['EQUATION', new EquationEditorAdapter()],
    ['META', new MetaEditorAdapter()],
    ['NONE', new NoneEditorAdapter()]
  ]);

  get(type: InteractionEnum): EditorInteractionAdapter {
    return this.adapters.get(type) || this.adapters.get('NONE') as EditorInteractionAdapter;
  }

  defaultParams(type: InteractionEnum): InteractionParameters {
    return this.get(type).defaultParams();
  }

  normalize(type: InteractionEnum, params: InteractionParameters): InteractionParameters {
    return this.get(type).normalize(params);
  }
}
