import {
  FirstAudioOptionsParams,
  MainAudio,
  OpeningImageParams,
  UnitDefinition
} from '@shared/models/unit-definition';
import { ShowResponse } from '@shared/models/feedback';
import { EditorStateSnapshot } from './editor-state.model';
import { EditorInteractionAdapterRegistry } from './editor-interaction-adapters';
import {
  collectResponseVariableCandidates,
  collectResponseVariables,
  EditorResponseVariableSource
} from './editor-response-variables';

export interface ValidationIssue {
  path: string;
  severity: 'error' | 'warning';
  message: string;
}

export interface DefinitionBuildResult {
  draft: UnitDefinition;
  issues: ValidationIssue[];
  runtimeDefinition?: UnitDefinition;
}

export class EditorDefinitionBuilderService {
  private interactionAdapters = new EditorInteractionAdapterRegistry();

  build(snapshot: EditorStateSnapshot): UnitDefinition {
    return this.buildResult(snapshot).draft;
  }

  buildResult(snapshot: EditorStateSnapshot): DefinitionBuildResult {
    const issues: ValidationIssue[] = [];
    const def = { id: snapshot.unitId || 'stars-unit-definition' } as UnitDefinition;

    if (snapshot.unitVersion) def.version = snapshot.unitVersion;
    if (snapshot.backgroundColor !== '#EEE') def.backgroundColor = snapshot.backgroundColor;
    if (snapshot.ribbonBars) def.ribbonBars = true;

    const firstClickLayer = snapshot.firstClickLayer;
    const animateButton = snapshot.animateButton;
    if (animateButton === true || (typeof animateButton === 'string' && animateButton !== 'OFF') ||
      firstClickLayer === true || (typeof firstClickLayer === 'string' && firstClickLayer !== 'OFF')) {
      const firstAudioOptions: FirstAudioOptionsParams = {};
      if (firstClickLayer === true || (typeof firstClickLayer === 'string' && firstClickLayer !== 'OFF')) {
        firstAudioOptions.firstClickLayer = firstClickLayer;
      }
      if (animateButton === true || (typeof animateButton === 'string' && animateButton !== 'OFF')) {
        firstAudioOptions.animateButton = animateButton;
      }
      def.firstAudioOptions = firstAudioOptions;
    }

    if (snapshot.continueButtonShow !== 'ALWAYS') def.continueButtonShow = snapshot.continueButtonShow;

    if (snapshot.openingImageEnabled) {
      const params: OpeningImageParams = {
        imageSource: snapshot.openingImageSource,
        presentationDurationMS: snapshot.openingPresentationDurationMS
      };
      if (snapshot.openingAudioSource) params.audioSource = snapshot.openingAudioSource;
      def.openingImage = params;
      if (!snapshot.openingImageSource.trim()) {
        issues.push(this.error(
          'openingImage.imageSource',
          'Für das Einführungsbild ist eine Bildquelle erforderlich.'
        ));
      }
    }

    if (snapshot.mainAudioEnabled) {
      const mainAudio: MainAudio = {
        audioSource: snapshot.mainAudioSource,
        maxPlay: snapshot.mainAudioMaxPlay,
        disableInteractionUntilComplete: snapshot.mainAudioDisableInteractionUntilComplete
      };
      def.mainAudio = mainAudio;
      if (!snapshot.mainAudioSource.trim()) {
        issues.push(this.error('mainAudio.audioSource', 'Für das Haupt-Audio ist eine Audioquelle erforderlich.'));
      }
    }

    def.interactionType = (
      snapshot.unsupportedInteractionType || snapshot.interactionType
    ) as UnitDefinition['interactionType'];
    if (snapshot.interactionMaxTimeMS !== undefined) def.interactionMaxTimeMS = snapshot.interactionMaxTimeMS;
    def.interactionParameters = snapshot.unsupportedInteractionType ?
      snapshot.interactionParams :
      this.interactionAdapters.serialize(
        snapshot.interactionType,
        snapshot.interactionParams
      );
    if (snapshot.variableInfo.length > 0) def.variableInfo = snapshot.variableInfo;
    if (snapshot.audioFeedbackEnabled && snapshot.audioFeedback) def.audioFeedback = snapshot.audioFeedback;

    if (snapshot.closingMetaButtons) {
      def.closingMetaButtons = snapshot.closingMetaButtons;
    }

    if (snapshot.unsupportedInteractionType) {
      issues.push(this.error(
        'interactionType',
        `Der Interaktionstyp ${snapshot.unsupportedInteractionType} wird nicht unterstützt.`
      )
      );
    }
    this.validateVariableInfo(snapshot, issues);
    this.validateAudioFeedback(snapshot, issues);
    this.validateClosingMetaButtons(snapshot, issues);
    this.validateResponseVariables(snapshot, issues);
    this.validateInteractionParameters(snapshot, issues);

    return {
      draft: def,
      issues,
      runtimeDefinition: issues.some(issue => issue.severity === 'error') ?
        undefined :
        def
    };
  }

  private validateVariableInfo(
    snapshot: EditorStateSnapshot,
    issues: ValidationIssue[]
  ): void {
    const ids = snapshot.variableInfo.map(variable => variable.variableId.trim()
    );
    const responseVariableIds = this.responseVariableIds(snapshot);
    const interactionVariableId = (
      snapshot.interactionParams as { variableId?: string }
    ).variableId?.trim();
    const selectionMetadata = this.interactionAdapters
      .get(snapshot.interactionType)
      .selectionMetadata(snapshot.interactionParams);
    snapshot.variableInfo.forEach((variable, variableIndex) => {
      const path = `variableInfo[${variableIndex}]`;
      const rawVariableId = variable.variableId;
      const variableId = rawVariableId.trim();
      if (!variableId) {
        issues.push(
          this.error(
            `${path}.variableId`,
            'Die Variablen-ID darf nicht leer sein.'
          )
        );
      } else if (rawVariableId !== variableId) {
        issues.push(
          this.error(
            `${path}.variableId`,
            'Die Variablen-ID darf keine Leerzeichen am Anfang oder Ende enthalten.'
          )
        );
      } else if (ids.filter(id => id === variableId).length > 1) {
        issues.push(
          this.error(
            `${path}.variableId`,
            'Die Variablen-ID muss eindeutig sein.'
          )
        );
      } else if (!responseVariableIds.has(variableId)) {
        issues.push(
          this.error(
            `${path}.variableId`,
            'Für diese Coding-Variable wird keine Response erzeugt.'
          )
        );
      }

      const usesMultiSelectCoding =
        variable.codingSource === 'SUM' ||
        variable.codingSource === 'SUM_CHAR_MATCHES';
      const isMatchingMultiSelect =
        variableId === interactionVariableId &&
        selectionMetadata?.multiple === true;
      if (usesMultiSelectCoding && !isMatchingMultiSelect) {
        issues.push(
          this.error(
            `${path}.codingSource`,
            `${variable.codingSource} ist nur für die Variable einer Mehrfachauswahl verfügbar.`
          )
        );
      }
      if (variable.codingSource === 'SUM_CHAR_MATCHES') {
        const parameter = variable.codingSourceParameter || '';
        if (!/^[01]+$/.test(parameter)) {
          issues.push(
            this.error(
              `${path}.codingSourceParameter`,
              'SUM_CHAR_MATCHES benötigt eine nichtleere Folge aus 0 und 1.'
            )
          );
        } else if (
          isMatchingMultiSelect &&
          parameter.length !== selectionMetadata.labels.length
        ) {
          issues.push(
            this.error(
              `${path}.codingSourceParameter`,
              `SUM_CHAR_MATCHES benötigt genau ${selectionMetadata.labels.length} Stellen.`
            )
          );
        }
      }
      if (variable.codes.length === 0) {
        issues.push(
          this.error(
            `${path}.codes`,
            'Für die Coding-Variable ist mindestens eine Code-Regel erforderlich.'
          )
        );
      }
      variable.codes.forEach((code, codeIndex) => {
        if (!code.parameter.trim()) {
          issues.push(
            this.error(
              `${path}.codes[${codeIndex}].parameter`,
              'Der Code-Parameter darf nicht leer sein.'
            )
          );
        }
      });
    });
  }

  private validateAudioFeedback(
    snapshot: EditorStateSnapshot,
    issues: ValidationIssue[]
  ): void {
    if (!snapshot.audioFeedbackEnabled || !snapshot.audioFeedback) return;
    const knownVariableIds = this.responseVariableIds(snapshot);

    snapshot.audioFeedback.feedback.forEach((feedback, index) => {
      const path = `audioFeedback.feedback[${index}]`;
      if (!feedback.variableId.trim()) {
        issues.push(
          this.error(
            `${path}.variableId`,
            'Für die Feedback-Regel ist eine Variable erforderlich.'
          )
        );
      } else if (!knownVariableIds.has(feedback.variableId)) {
        issues.push(
          this.error(
            `${path}.variableId`,
            'Die Feedback-Variable ist in dieser Unit nicht definiert.'
          )
        );
      }
      if (!feedback.parameter.trim()) {
        issues.push(
          this.error(
            `${path}.parameter`,
            'Für die Feedback-Regel ist ein Parameter erforderlich.'
          )
        );
      }
      if (!feedback.audioSource.trim()) {
        issues.push(
          this.error(
            `${path}.audioSource`,
            'Für die Feedback-Regel ist eine Audioquelle erforderlich.'
          )
        );
      }
      let showResponses: ShowResponse[] = [];
      if (feedback.showResponse) {
        showResponses = Array.isArray(feedback.showResponse) ?
          feedback.showResponse : [feedback.showResponse];
      }
      showResponses.forEach((showResponse, responseIndex) => {
        const responsePath = `${path}.showResponse[${responseIndex}]`;
        const rawVariableId = showResponse.variableId;
        if (!rawVariableId.trim()) {
          issues.push(
            this.error(
              `${responsePath}.variableId`,
              'Für Show Response ist eine Variable erforderlich.'
            )
          );
        } else if (rawVariableId !== rawVariableId.trim()) {
          issues.push(
            this.error(
              `${responsePath}.variableId`,
              'Die Show-Response-Variable darf keine Leerzeichen am Anfang oder Ende enthalten.'
            )
          );
        } else if (!knownVariableIds.has(rawVariableId)) {
          issues.push(
            this.error(
              `${responsePath}.variableId`,
              'Die Show-Response-Variable ist in dieser Unit nicht definiert.'
            )
          );
        }
        if (
          showResponse.delayMS !== undefined &&
          (!Number.isFinite(showResponse.delayMS) || showResponse.delayMS < 0)
        ) {
          issues.push(
            this.error(
              `${responsePath}.delayMS`,
              'Die Show-Response-Verzögerung muss eine endliche, nichtnegative Zahl sein.'
            )
          );
        }
      });
    });
  }

  responseVariableIds(snapshot: EditorStateSnapshot): Set<string> {
    return new Set(
      collectResponseVariables(snapshot, this.interactionAdapters).map(
        variable => variable.id
      )
    );
  }

  private validateClosingMetaButtons(
    snapshot: EditorStateSnapshot,
    issues: ValidationIssue[]
  ): void {
    if (!snapshot.closingMetaButtons) return;
    const metaVariableFields = [
      'variableIdMetaSelection',
      'variableIdMetaOutcome'
    ] as const;
    metaVariableFields.forEach(field => {
      const rawVariableId = snapshot.closingMetaButtons?.[field];
      if (
        rawVariableId !== undefined &&
        rawVariableId !== rawVariableId.trim()
      ) {
        issues.push(
          this.error(
            `closingMetaButtons.${field}`,
            'Die Variablen-ID darf keine Leerzeichen am Anfang oder Ende enthalten.'
          )
        );
      }
    });
    const rawReferenceId =
      snapshot.closingMetaButtons.variableIdReference || '';
    const referenceId = rawReferenceId.trim();
    const interactionVariableId = (
      snapshot.interactionParams as { variableId?: string }
    ).variableId?.trim();
    if (!referenceId) {
      issues.push(
        this.error(
          'closingMetaButtons.variableIdReference',
          'Für die Abschlussauswahl ist eine Referenzvariable erforderlich.'
        )
      );
    } else if (rawReferenceId !== referenceId) {
      issues.push(
        this.error(
          'closingMetaButtons.variableIdReference',
          'Die Referenzvariable darf keine Leerzeichen am Anfang oder Ende enthalten.'
        )
      );
    } else if (referenceId !== interactionVariableId) {
      issues.push(
        this.error(
          'closingMetaButtons.variableIdReference',
          'Die Referenzvariable muss der Variablen-ID der Hauptinteraktion entsprechen.'
        )
      );
    }
  }

  private validateResponseVariables(
    snapshot: EditorStateSnapshot,
    issues: ValidationIssue[]
  ): void {
    const candidates = collectResponseVariableCandidates(
      snapshot,
      this.interactionAdapters
    );
    candidates
      .filter(
        candidate => candidate.id === 'mainAudio' && candidate.source !== 'mainAudio'
      )
      .forEach(candidate => issues.push(
        this.error(
          this.responseVariablePath(candidate.source),
          'Die Variablen-ID „mainAudio“ ist für das Haupt-Audio reserviert.'
        )
      )
      );

    const candidatesById = new Map<string, typeof candidates>();
    candidates.forEach(candidate => {
      candidatesById.set(candidate.id, [
        ...(candidatesById.get(candidate.id) || []),
        candidate
      ]);
    });
    candidatesById.forEach(sameIdCandidates => {
      if (sameIdCandidates.length < 2 || sameIdCandidates[0].id === 'mainAudio') return;
      sameIdCandidates
        .slice(1)
        .forEach(candidate => issues.push(
          this.error(
            this.responseVariablePath(candidate.source),
            `Die Response-ID „${candidate.id}“ wird von mehreren Bereichen verwendet.`
          )
        )
        );
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private responseVariablePath(source: EditorResponseVariableSource): string {
    if (source === 'interaction') return 'interactionParameters.variableId';
    if (source === 'metaSelection') return 'closingMetaButtons.variableIdMetaSelection';
    if (source === 'metaOutcome') return 'closingMetaButtons.variableIdMetaOutcome';
    return 'mainAudio';
  }

  private validateInteractionParameters(
    snapshot: EditorStateSnapshot,
    issues: ValidationIssue[]
  ): void {
    this.interactionAdapters
      .validate(snapshot.interactionType, snapshot.interactionParams)
      .forEach(issue => issues.push(
        this.error(`interactionParameters.${issue.path}`, issue.message)
      )
      );
  }

  // eslint-disable-next-line class-methods-use-this
  private error(path: string, message: string): ValidationIssue {
    return { path, severity: 'error', message };
  }
}
