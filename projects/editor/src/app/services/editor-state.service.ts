import { Injectable, signal, inject } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import {
  UnitDefinition, InteractionEnum, ContinueButtonEnum,
  InteractionParameters, ClosingMetaButtonsParams, FirstClickLayerEnum, AnimateButtonEnum, InteractionButtonParams
} from '@shared/models/unit-definition';
import { VariableInfo } from '@shared/models/responses';
import { AudioFeedback } from '@shared/models/feedback';
import { VeronaVariableInfo } from '../models/verona-editor';
import { EditorVeronaPostService } from './editor-verona-post.service';
import { EditorInteractionAdapterRegistry } from './editor-interaction-adapters';
import { EditorDefinitionBuilderService } from './editor-definition-builder.service';
import { EditorDefinitionLoaderService } from './editor-definition-loader.service';
import { EditorVariableMetadataBuilderService } from './editor-variable-metadata-builder.service';
import { EditorStatePatch, EditorStateSnapshot } from './editor-state.model';

@Injectable({ providedIn: 'root' })
export class EditorStateService {
  private veronaPostService = inject(EditorVeronaPostService);
  private interactionAdapters = new EditorInteractionAdapterRegistry();
  private definitionBuilder = new EditorDefinitionBuilderService();
  private definitionLoader = new EditorDefinitionLoaderService(this.interactionAdapters);
  private variableMetadataBuilder = new EditorVariableMetadataBuilderService(this.interactionAdapters);
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

  updateUnitVersion(value: string): void {
    this.unitVersion.set(value);
    this.notifyChange();
  }

  updateBackgroundColor(value: string): void {
    this.backgroundColor.set(value);
    this.notifyChange();
  }

  updateRibbonBars(value: boolean): void {
    this.ribbonBars.set(value);
    this.notifyChange();
  }

  updateContinueButtonShow(value: ContinueButtonEnum): void {
    this.continueButtonShow.set(value);
    this.notifyChange();
  }

  updateMainAudioSource(value: string): void {
    this.mainAudioSource.set(value);
    this.notifyChange();
  }

  updateMainAudioMaxPlay(value: number): void {
    this.mainAudioMaxPlay.set(value);
    this.notifyChange();
  }

  updateMainAudioDisableInteractionUntilComplete(value: boolean): void {
    this.mainAudioDisableInteractionUntilComplete.set(value);
    this.notifyChange();
  }

  updateOpeningImageSource(value: string): void {
    this.openingImageSource.set(value);
    this.notifyChange();
  }

  updateOpeningAudioSource(value: string): void {
    this.openingAudioSource.set(value);
    this.notifyChange();
  }

  updateOpeningPresentationDurationMS(value: number): void {
    this.openingPresentationDurationMS.set(value);
    this.notifyChange();
  }

  setInteractionType(type: InteractionEnum): void {
    this.interactionType.set(type);
    this.resetInteractionParams(type);
    this.notifyChange();
  }

  setInteractionParams(params: InteractionParameters): void {
    this.interactionParams.set(params);
    this.notifyChange();
  }

  updateInteractionParams(update: (params: InteractionParameters) => InteractionParameters): void {
    this.setInteractionParams(update(this.interactionParams()));
  }

  setVariableInfo(variableInfo: VariableInfo[]): void {
    this.variableInfo.set(variableInfo);
    this.notifyChange();
  }

  updateVariableInfo(update: (variableInfo: VariableInfo[]) => VariableInfo[]): void {
    this.setVariableInfo(update(this.variableInfo()));
  }

  setAudioFeedback(audioFeedback: AudioFeedback | undefined): void {
    this.audioFeedback.set(audioFeedback);
    this.notifyChange();
  }

  setClosingMetaButtons(closingMetaButtons: ClosingMetaButtonsParams | undefined): void {
    this.closingMetaButtons.set(closingMetaButtons);
    this.notifyChange();
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
      this.applyPatch(this.definitionLoader.loadFromJson(json));
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
    this.notifyChange();
  }

  setOpeningImageEnabled(enabled: boolean): void {
    this.openingImageEnabled.set(enabled);
    if (!enabled) {
      this.openingImageSource.set('');
      this.openingAudioSource.set('');
      this.openingPresentationDurationMS.set(1500);
    }
    this.notifyChange();
  }

  setFirstClickLayerFromSelection(value: string): void {
    if (value === 'true') {
      this.firstClickLayer.set(true);
      this.notifyChange();
      return;
    }
    this.firstClickLayer.set(value as FirstClickLayerEnum);
    this.notifyChange();
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
      this.notifyChange();
      return;
    }
    this.animateButton.set(value as AnimateButtonEnum);
    this.notifyChange();
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
    this.interactionParams.set(this.interactionAdapters.defaultParams(type));
  }

  buildUnitDefinition(): UnitDefinition {
    return this.definitionBuilder.build(this.snapshot());
  }

  buildVariables(): VeronaVariableInfo[] {
    return this.variableMetadataBuilder.build(this.snapshot());
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

  private snapshot(): EditorStateSnapshot {
    return {
      unitId: this.unitId(),
      unitVersion: this.unitVersion(),
      backgroundColor: this.backgroundColor(),
      ribbonBars: this.ribbonBars(),
      continueButtonShow: this.continueButtonShow(),
      interactionType: this.interactionType(),
      mainAudioEnabled: this.mainAudioEnabled(),
      mainAudioSource: this.mainAudioSource(),
      mainAudioMaxPlay: this.mainAudioMaxPlay(),
      mainAudioDisableInteractionUntilComplete: this.mainAudioDisableInteractionUntilComplete(),
      firstClickLayer: this.firstClickLayer(),
      animateButton: this.animateButton(),
      openingImageEnabled: this.openingImageEnabled(),
      openingImageSource: this.openingImageSource(),
      openingAudioSource: this.openingAudioSource(),
      openingPresentationDurationMS: this.openingPresentationDurationMS(),
      interactionParams: this.interactionParams(),
      variableInfo: this.variableInfo(),
      audioFeedback: this.audioFeedback(),
      closingMetaButtons: this.closingMetaButtons()
    };
  }

  private applyPatch(patch: EditorStatePatch): void {
    if (patch.unitId !== undefined) this.unitId.set(patch.unitId);
    if (patch.unitVersion !== undefined) this.unitVersion.set(patch.unitVersion);
    if (patch.backgroundColor !== undefined) this.backgroundColor.set(patch.backgroundColor);
    if (patch.ribbonBars !== undefined) this.ribbonBars.set(patch.ribbonBars);
    if (patch.continueButtonShow !== undefined) this.continueButtonShow.set(patch.continueButtonShow);
    if (patch.interactionType !== undefined) this.interactionType.set(patch.interactionType);
    if (patch.mainAudioEnabled !== undefined) this.mainAudioEnabled.set(patch.mainAudioEnabled);
    if (patch.mainAudioSource !== undefined) this.mainAudioSource.set(patch.mainAudioSource);
    if (patch.mainAudioMaxPlay !== undefined) this.mainAudioMaxPlay.set(patch.mainAudioMaxPlay);
    if (patch.mainAudioDisableInteractionUntilComplete !== undefined) {
      this.mainAudioDisableInteractionUntilComplete.set(patch.mainAudioDisableInteractionUntilComplete);
    }
    if (patch.firstClickLayer !== undefined) this.firstClickLayer.set(patch.firstClickLayer);
    if (patch.animateButton !== undefined) this.animateButton.set(patch.animateButton);
    if (patch.openingImageEnabled !== undefined) this.openingImageEnabled.set(patch.openingImageEnabled);
    if (patch.openingImageSource !== undefined) this.openingImageSource.set(patch.openingImageSource);
    if (patch.openingAudioSource !== undefined) this.openingAudioSource.set(patch.openingAudioSource);
    if (patch.openingPresentationDurationMS !== undefined) {
      this.openingPresentationDurationMS.set(patch.openingPresentationDurationMS);
    }
    if (patch.interactionParams !== undefined) this.interactionParams.set(patch.interactionParams);
    if (patch.variableInfo !== undefined) this.variableInfo.set(patch.variableInfo);
    if ('audioFeedback' in patch) this.audioFeedback.set(patch.audioFeedback);
    if ('closingMetaButtons' in patch) this.closingMetaButtons.set(patch.closingMetaButtons);
  }
}
