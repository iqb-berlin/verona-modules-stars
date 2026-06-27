import { Injectable, signal, inject } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import {
  UnitDefinition, InteractionEnum, ContinueButtonEnum,
  InteractionParameters, MainAudio, OpeningImageParams, FirstAudioOptionsParams,
  InteractionButtonParams, InteractionWriteParams, InteractionDropParams,
  InteractionVideoParams, InteractionFindOnImageParams, InteractionPolygonButtonsParams,
  InteractionPlaceValueParams, InteractionNumberLineParams, InteractionPyramidParams,
  InteractionEquationParams, ClosingMetaButtonsParams, FirstClickLayerEnum, AnimateButtonEnum
} from '@shared/models/unit-definition';
import { VariableInfo } from '@shared/models/responses';
import { AudioFeedback } from '@shared/models/feedback';
import { VeronaVariableInfo } from '../models/verona-editor';
import { EditorVeronaPostService } from './editor-verona-post.service';

@Injectable({ providedIn: 'root' })
export class EditorStateService {
  private veronaPostService = inject(EditorVeronaPostService);
  private changeSubject = new Subject<void>();

  // Unit definition fields
  unitId = signal('stars-unit-definition');
  unitVersion = signal('');
  backgroundColor = signal('#EEE');
  ribbonBars = signal(false);
  continueButtonShow = signal<ContinueButtonEnum>('ALWAYS');
  interactionType = signal<InteractionEnum>('BUTTONS');

  // MainAudio
  mainAudioEnabled = signal(false);
  mainAudioSource = signal('');
  mainAudioMaxPlay = signal(0);
  mainAudioDisableInteractionUntilComplete = signal(false);

  // FirstAudioOptions
  firstClickLayer = signal<boolean | FirstClickLayerEnum>('OFF');
  animateButton = signal<boolean | AnimateButtonEnum>('OFF');

  // Opening Image
  openingImageEnabled = signal(false);
  openingImageSource = signal('');
  openingAudioSource = signal('');
  openingPresentationDurationMS = signal(1500);

  // Interaction parameters (stored as signals per type)
  interactionParams = signal<InteractionParameters>({
    variableId: 'BUTTONS',
    options: { buttons: [] },
    buttonType: 'BIG_SQUARE',
    numberOfRows: 1,
    multiSelect: false
  } as InteractionButtonParams);

  // Variable info
  variableInfo = signal<VariableInfo[]>([]);

  // Audio feedback
  audioFeedback = signal<AudioFeedback | undefined>(undefined);
  closingMetaButtons = signal<ClosingMetaButtonsParams | undefined>(undefined);

  constructor() {
    this.resetState();
    this.changeSubject.pipe(debounceTime(500)).subscribe(() => {
      this.emitDefinitionChanged();
    });
  }

  notifyChange(): void {
    this.changeSubject.next();
  }

  resetState(): void {
    this.unitId.set('stars-unit-definition');
    this.unitVersion.set('');
    this.backgroundColor.set('#EEE');
    this.ribbonBars.set(false);
    this.continueButtonShow.set('ALWAYS');
    this.interactionType.set('BUTTONS');

    this.mainAudioEnabled.set(false);
    this.mainAudioSource.set('');
    this.mainAudioMaxPlay.set(0);
    this.mainAudioDisableInteractionUntilComplete.set(false);

    this.firstClickLayer.set('OFF');
    this.animateButton.set('OFF');

    this.openingImageEnabled.set(false);
    this.openingImageSource.set('');
    this.openingAudioSource.set('');
    this.openingPresentationDurationMS.set(1500);

    this.resetInteractionParams('BUTTONS');
    this.variableInfo.set([]);
    this.audioFeedback.set(undefined);
    this.closingMetaButtons.set(undefined);
  }

  loadFromDefinition(json: string): void {
    try {
      this.resetState();
      const rawDef = JSON.parse(json) as Record<string, unknown>;
      const def = rawDef as unknown as UnitDefinition;
      if (def.id) this.unitId.set(def.id);
      if (def.version) this.unitVersion.set(def.version);
      if (def.backgroundColor !== undefined) this.backgroundColor.set(def.backgroundColor);
      if (def.ribbonBars !== undefined) this.ribbonBars.set(def.ribbonBars);
      if (def.continueButtonShow) this.continueButtonShow.set(def.continueButtonShow);
      if (typeof rawDef.interactionType === 'string') {
        this.interactionType.set(rawDef.interactionType === 'META_BUTTONS' ? 'META' : rawDef.interactionType as InteractionEnum);
      }

      // MainAudio
      if (def.mainAudio) {
        this.mainAudioEnabled.set(true);
        this.mainAudioSource.set(def.mainAudio.audioSource || '');
        this.mainAudioMaxPlay.set(def.mainAudio.maxPlay ?? 0);
        this.mainAudioDisableInteractionUntilComplete.set(def.mainAudio.disableInteractionUntilComplete || false);
        if (def.mainAudio.firstClickLayer !== undefined && !def.firstAudioOptions?.firstClickLayer) {
          this.firstClickLayer.set(def.mainAudio.firstClickLayer);
        }
        if (def.mainAudio.animateButton !== undefined && !def.firstAudioOptions?.animateButton) {
          this.animateButton.set(def.mainAudio.animateButton);
        }
      }

      // FirstAudioOptions
      if (def.firstAudioOptions) {
        this.firstClickLayer.set(def.firstAudioOptions.firstClickLayer ?? 'OFF');
        this.animateButton.set(def.firstAudioOptions.animateButton ?? 'OFF');
      }

      // Opening image
      if (def.openingImage) {
        this.openingImageEnabled.set(true);
        this.openingImageSource.set(def.openingImage.imageSource || '');
        this.openingAudioSource.set(def.openingImage.audioSource || '');
        this.openingPresentationDurationMS.set(def.openingImage.presentationDurationMS ?? 1500);
      }

      // Interaction parameters
      if (def.interactionParameters) {
        this.interactionParams.set(
          this.normalizeInteractionParams(this.interactionType(), def.interactionParameters)
        );
      } else {
        this.resetInteractionParams(this.interactionType());
      }

      // Variable info
      if (def.variableInfo) {
        this.variableInfo.set(def.variableInfo);
      }

      // Audio feedback
      if (def.audioFeedback) {
        this.audioFeedback.set(def.audioFeedback);
      }

      if (def.closingMetaButtons) {
        this.closingMetaButtons.set(def.closingMetaButtons);
      }
    } catch (e) {
      console.warn('Editor: failed to parse unit definition', e);
    }
  }

  setMainAudioEnabled(enabled: boolean): void {
    this.mainAudioEnabled.set(enabled);
    if (!enabled) {
      this.mainAudioSource.set('');
      this.mainAudioMaxPlay.set(0);
      this.mainAudioDisableInteractionUntilComplete.set(false);
    }
  }

  setOpeningImageEnabled(enabled: boolean): void {
    this.openingImageEnabled.set(enabled);
    if (!enabled) {
      this.openingImageSource.set('');
      this.openingAudioSource.set('');
      this.openingPresentationDurationMS.set(1500);
    }
  }

  setFirstClickLayerFromSelection(value: string): void {
    if (value === 'true') {
      this.firstClickLayer.set(true);
      return;
    }
    this.firstClickLayer.set(value as FirstClickLayerEnum);
  }

  firstClickLayerSelection(): string {
    const value = this.firstClickLayer();
    if (value === true) {
      return 'true';
    }
    if (value === false || value === undefined) {
      return 'OFF';
    }
    return value;
  }

  setAnimateButtonFromSelection(value: string): void {
    if (value === 'true') {
      this.animateButton.set(true);
      return;
    }
    this.animateButton.set(value as AnimateButtonEnum);
  }

  animateButtonSelection(): string {
    const value = this.animateButton();
    if (value === true) {
      return 'true';
    }
    if (value === false || value === undefined) {
      return 'OFF';
    }
    return value;
  }

  resetInteractionParams(type: InteractionEnum): void {
    switch (type) {
      case 'BUTTONS':
      case 'IMAGE_ONLY':
        this.interactionParams.set({
          variableId: 'BUTTONS',
          options: { buttons: [] },
          buttonType: 'BIG_SQUARE',
          numberOfRows: 1,
          multiSelect: false,
          imagePosition: 'LEFT',
          layout: 'LEFT_CENTER'
        } as InteractionButtonParams);
        break;
      case 'WRITE':
        this.interactionParams.set({
          variableId: 'WRITE',
          addBackspaceKey: true,
          addUmlautKeys: false,
          keyboardMode: 'CHARACTERS',
          keysLine1: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
          keysLine2: ['j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r'],
          keysLine3: ['s', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
          keysLine4: [],
          maxInputLength: 20
        } as InteractionWriteParams);
        break;
      case 'DROP':
        this.interactionParams.set({
          variableId: 'DROP',
          options: [],
          buttonType: 'SMALL_SQUARE',
          imagePosition: 'BOTTOM'
        } as InteractionDropParams);
        break;
      case 'FIND_ON_IMAGE':
        this.interactionParams.set({
          variableId: 'FIND_ON_IMAGE',
          imageSource: '',
          size: 'MEDIUM'
        } as InteractionFindOnImageParams);
        break;
      case 'VIDEO':
        this.interactionParams.set({
          variableId: 'VIDEO',
          videoSource: ''
        } as InteractionVideoParams);
        break;
      case 'POLYGON_BUTTONS':
        this.interactionParams.set({
          variableId: 'POLYGON_BUTTONS',
          options: [],
          multiSelect: false
        } as InteractionPolygonButtonsParams);
        break;
      case 'PLACE_VALUE':
        this.interactionParams.set({
          variableId: 'PLACE_VALUE',
          value: 0,
          maxNumberOfTens: 9,
          maxNumberOfOnes: 9
        } as InteractionPlaceValueParams);
        break;
      case 'NUMBER_LINE':
        this.interactionParams.set({
          variableId: 'NUMBER_LINE',
          firstNumber: 0,
          lastNumber: 20,
          numberInput: 10,
          style: 'WAVE'
        } as InteractionNumberLineParams);
        break;
      case 'PYRAMID':
        this.interactionParams.set({
          variableId: 'PYRAMID',
          topNumber: 10
        } as InteractionPyramidParams);
        break;
      case 'EQUATION':
        this.interactionParams.set({
          variableId: 'EQUATION',
          operators: ['+']
        } as InteractionEquationParams);
        break;
      case 'META':
        this.interactionParams.set({
          variableId: 'META_SELECTION'
        } as any);
        break;
      default:
        this.interactionParams.set({
          variableId: 'NONE'
        } as any);
    }
  }

  buildUnitDefinition(): UnitDefinition {
    const def: UnitDefinition = {
      id: this.unitId() || 'stars-unit-definition',
      interactionType: this.interactionType(),
      interactionParameters: this.interactionParams(),
      variableInfo: this.variableInfo().length > 0 ? this.variableInfo() : undefined,
      audioFeedback: this.audioFeedback()
    };

    if (this.unitVersion()) def.version = this.unitVersion();
    if (this.backgroundColor() !== '#EEE') def.backgroundColor = this.backgroundColor();
    if (this.ribbonBars()) def.ribbonBars = true;
    if (this.continueButtonShow() !== 'ALWAYS') def.continueButtonShow = this.continueButtonShow();

    // MainAudio
    if (this.mainAudioEnabled() && this.mainAudioSource()) {
      const mainAudio: MainAudio = {
        audioSource: this.mainAudioSource(),
        maxPlay: this.mainAudioMaxPlay(),
        disableInteractionUntilComplete: this.mainAudioDisableInteractionUntilComplete()
      };
      def.mainAudio = mainAudio;
    }

    // FirstAudioOptions
    const firstClickLayer = this.firstClickLayer();
    const animateButton = this.animateButton();
    if (animateButton === true || (typeof animateButton === 'string' && animateButton !== 'OFF') || firstClickLayer === true ||
      (typeof firstClickLayer === 'string' && firstClickLayer !== 'OFF')) {
      const firstAudioOptions: FirstAudioOptionsParams = {};
      if (animateButton !== false) {
        firstAudioOptions.animateButton = animateButton;
      }
      if (firstClickLayer !== false) {
        firstAudioOptions.firstClickLayer = firstClickLayer;
      }
      def.firstAudioOptions = firstAudioOptions;
    }

    // Opening Image
    if (this.openingImageEnabled() && this.openingImageSource()) {
      const params: OpeningImageParams = {
        imageSource: this.openingImageSource()
      };
      if (this.openingAudioSource()) params.audioSource = this.openingAudioSource();
      if (this.openingPresentationDurationMS() !== 1500) {
        params.presentationDurationMS = this.openingPresentationDurationMS();
      }
      def.openingImage = params;
    }

    if (this.closingMetaButtons()) {
      def.closingMetaButtons = this.closingMetaButtons();
    }

    return def;
  }

  buildVariables(): VeronaVariableInfo[] {
    const variables: VeronaVariableInfo[] = [];
    const params = this.interactionParams() as any;
    const declaredVariables = this.variableInfo();
    const variableIds = declaredVariables.length > 0
      ? declaredVariables.map(variable => variable.variableId)
      : (params?.variableId ? [params.variableId] : []);

    variableIds
      .filter((value, index, values) => !!value && values.indexOf(value) === index)
      .forEach(variableId => {
        const currentVariableInfo = declaredVariables.find(variable => variable.variableId === variableId);
        const variable: VeronaVariableInfo = {
          id: variableId,
          type: this.getVariableType(currentVariableInfo),
          multiple: false,
          nullable: false,
          page: '1'
        };

        if ((this.interactionType() === 'BUTTONS' || this.interactionType() === 'POLYGON_BUTTONS') &&
          variableId === params?.variableId && params.options) {
          const buttons = params.options.buttons || params.options;
          if (Array.isArray(buttons) && buttons.length > 0) {
            variable.valuesComplete = true;
            variable.values = buttons.map((_: any, i: number) => ({
              value: i.toString(),
              label: buttons[i]?.text || buttons[i]?.label || `Option ${i + 1}`
            }));
          }
        }
        variables.push(variable);
      });
    return variables;
  }

  private getVariableType(variableInfo?: VariableInfo): 'string' | 'integer' | 'number' | 'boolean' | 'coded' {
    if (variableInfo?.codes?.length) {
      return 'coded';
    }
    switch (this.interactionType()) {
      case 'NUMBER_LINE':
      case 'PLACE_VALUE':
      case 'EQUATION':
        return 'integer';
      default:
        return 'string';
    }
  }

  private normalizeInteractionParams(type: InteractionEnum, params: InteractionParameters): InteractionParameters {
    if (type === 'WRITE') {
      const writeParams = { ...(params as InteractionWriteParams) };
      if (!writeParams.keysLine1) {
        writeParams.keysLine1 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
      }
      if (!writeParams.keysLine2) {
        writeParams.keysLine2 = ['j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r'];
      }
      if (!writeParams.keysLine3) {
        writeParams.keysLine3 = ['s', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
      }
      if (!writeParams.keysLine4) {
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
    if (type === 'DROP') {
      return {
        buttonType: 'SMALL_SQUARE',
        ...(params as InteractionDropParams)
      } as InteractionDropParams;
    }
    return params;
  }

  private emitDefinitionChanged(): void {
    const def = this.buildUnitDefinition();
    const defString = JSON.stringify(def, null, 2);
    const variables = this.buildVariables();
    this.veronaPostService.sendDefinitionChangedNotification(
      defString,
      `iqb-stars@${this.unitVersion() || '1.0'}`,
      variables
    );
  }
}
