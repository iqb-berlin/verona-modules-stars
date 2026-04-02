import { Injectable, signal, inject } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import {
  UnitDefinition, InteractionEnum, ContinueButtonEnum,
  InteractionParameters, MainAudio, OpeningImageParams, FirstAudioOptionsParams,
  InteractionButtonParams, InteractionWriteParams, InteractionDropParams,
  InteractionVideoParams, InteractionFindOnImageParams, InteractionPolygonButtonsParams,
  InteractionPlaceValueParams, InteractionNumberLineParams, InteractionPyramidParams,
  InteractionEquationParams
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
  unitId = signal('unit1');
  unitVersion = signal('');
  backgroundColor = signal('#EEE');
  ribbonBars = signal(false);
  continueButtonShow = signal<ContinueButtonEnum>('ALWAYS');
  interactionType = signal<InteractionEnum>('BUTTONS');
  interactionMaxTimeMS = signal(0);

  // MainAudio
  mainAudioSource = signal('');
  mainAudioMaxPlay = signal(3);
  mainAudioDisableInteractionUntilComplete = signal(false);

  // FirstAudioOptions
  firstClickLayer = signal(false);
  animateButton = signal(false);

  // Opening Image
  openingImageSource = signal('');
  openingAudioSource = signal('');
  openingPresentationDurationMS = signal(3000);

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

  constructor() {
    this.changeSubject.pipe(debounceTime(500)).subscribe(() => {
      this.emitDefinitionChanged();
    });
  }

  notifyChange(): void {
    this.changeSubject.next();
  }

  loadFromDefinition(json: string): void {
    try {
      const def = JSON.parse(json) as UnitDefinition;
      if (def.id) this.unitId.set(def.id);
      if (def.version) this.unitVersion.set(def.version);
      if (def.backgroundColor) this.backgroundColor.set(def.backgroundColor);
      if (def.ribbonBars !== undefined) this.ribbonBars.set(def.ribbonBars);
      if (def.continueButtonShow) this.continueButtonShow.set(def.continueButtonShow);
      if (def.interactionType) this.interactionType.set(def.interactionType);
      if (def.interactionMaxTimeMS) this.interactionMaxTimeMS.set(def.interactionMaxTimeMS);

      // MainAudio
      if (def.mainAudio) {
        this.mainAudioSource.set(def.mainAudio.audioSource || '');
        this.mainAudioMaxPlay.set(def.mainAudio.maxPlay ?? 3);
        this.mainAudioDisableInteractionUntilComplete.set(def.mainAudio.disableInteractionUntilComplete || false);
      }

      // FirstAudioOptions
      if (def.firstAudioOptions) {
        this.firstClickLayer.set(def.firstAudioOptions.firstClickLayer || false);
        this.animateButton.set(def.firstAudioOptions.animateButton || false);
      }

      // Opening image
      if (def.openingImage) {
        this.openingImageSource.set(def.openingImage.imageSource || '');
        this.openingAudioSource.set(def.openingImage.audioSource || '');
        this.openingPresentationDurationMS.set(def.openingImage.presentationDurationMS || 3000);
      }

      // Interaction parameters
      if (def.interactionParameters) {
        this.interactionParams.set(def.interactionParameters);
      } else {
        this.resetInteractionParams(def.interactionType || 'BUTTONS');
      }

      // Variable info
      if (def.variableInfo) {
        this.variableInfo.set(def.variableInfo);
      }

      // Audio feedback
      if (def.audioFeedback) {
        this.audioFeedback.set(def.audioFeedback);
      }
    } catch (e) {
      console.warn('Editor: failed to parse unit definition', e);
    }
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
          maxInputLength: 20
        } as InteractionWriteParams);
        break;
      case 'DROP':
        this.interactionParams.set({
          variableId: 'DROP',
          options: [],
          imagePosition: 'LEFT'
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
          numberOfRows: 1,
          maxNumberOfTens: 9,
          maxNumberOfOnes: 9
        } as InteractionPlaceValueParams);
        break;
      case 'NUMBER_LINE':
        this.interactionParams.set({
          variableId: 'NUMBER_LINE',
          firstNumber: 0,
          lastNumber: 20,
          numberInput: 10
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
      default:
        this.interactionParams.set({
          variableId: 'NONE'
        } as any);
    }
  }

  buildUnitDefinition(): UnitDefinition {
    const def: UnitDefinition = {
      id: this.unitId(),
      interactionType: this.interactionType(),
      interactionMaxTimeMS: this.interactionMaxTimeMS(),
      interactionParameters: this.interactionParams(),
      variableInfo: this.variableInfo().length > 0 ? this.variableInfo() : undefined,
      audioFeedback: this.audioFeedback()
    };

    if (this.unitVersion()) def.version = this.unitVersion();
    if (this.backgroundColor() !== '#EEE') def.backgroundColor = this.backgroundColor();
    if (this.ribbonBars()) def.ribbonBars = true;
    if (this.continueButtonShow() !== 'ALWAYS') def.continueButtonShow = this.continueButtonShow();

    // MainAudio
    if (this.mainAudioSource()) {
      const mainAudio: MainAudio = {
        audioSource: this.mainAudioSource(),
        maxPlay: this.mainAudioMaxPlay(),
        disableInteractionUntilComplete: this.mainAudioDisableInteractionUntilComplete()
      };
      def.mainAudio = mainAudio;
    }

    // FirstAudioOptions
    if (this.firstClickLayer() || this.animateButton()) {
      def.firstAudioOptions = {
        firstClickLayer: this.firstClickLayer(),
        animateButton: this.animateButton()
      };
    }

    // Opening Image
    if (this.openingImageSource()) {
      const params: OpeningImageParams = {
        imageSource: this.openingImageSource()
      };
      if (this.openingAudioSource()) params.audioSource = this.openingAudioSource();
      if (this.openingPresentationDurationMS() !== 3000) {
        params.presentationDurationMS = this.openingPresentationDurationMS();
      }
      def.openingImage = params;
    }

    return def;
  }

  buildVariables(): VeronaVariableInfo[] {
    const variables: VeronaVariableInfo[] = [];
    const params = this.interactionParams() as any;
    if (params?.variableId) {
      const variableType = this.getVariableType();
      const variable: VeronaVariableInfo = {
        id: params.variableId,
        type: variableType,
        multiple: false,
        nullable: false,
        page: '1'
      };

      // For button interactions with defined options, add values
      if ((this.interactionType() === 'BUTTONS' || this.interactionType() === 'POLYGON_BUTTONS') && params.options) {
        const buttons = params.options.buttons || params.options;
        if (Array.isArray(buttons) && buttons.length > 0) {
          variable.valuesComplete = true;
          variable.values = buttons.map((_: any, i: number) => ({
            value: i.toString(),
            label: buttons[i]?.text || buttons[i]?.label || `Option ${i}`
          }));
        }
      }
      variables.push(variable);
    }
    return variables;
  }

  private getVariableType(): 'string' | 'integer' | 'number' | 'boolean' | 'coded' {
    const vInfo = this.variableInfo();
    if (vInfo.length > 0 && vInfo[0].codes?.length > 0) {
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
