import { inject, Injectable, signal } from '@angular/core';

import { Response } from '@iqbspecs/response/response.interface';
import { Progress, UnitState, UnitStateDataType } from '../models/verona';
import { VeronaPostService } from './verona-post.service';
import { StateService } from './state.service';
import { AudioFeedbackService } from './audio-feedback.service';
import { ClosingMetaResponseHooks, ClosingMetaService } from './closing-meta.service';
import { ClosingMetaButtonsParams, UnitDefinition } from '../models/unit-definition';
import { Code, VariableInfo } from '../models/responses';
import { collectUnitDefinitionProblems } from './unit-definition-validation';

/**
 * Owns the response store, coding rules, and Verona unit-state posts.
 * Coordinates presentation and audio-feedback services when responses change.
 * Implements hooks used by ClosingMetaService for derived meta-outcome responses.
 */
@Injectable({
  providedIn: 'root'
})

export class ResponsesService implements ClosingMetaResponseHooks {
  unitDefinitionProblem = signal('');
  responseProgress = signal<Progress>('none');
  allResponses: Response[] = [];
  variableInfo: VariableInfo[] = [];
  veronaPostService = inject(VeronaPostService);
  stateService = inject(StateService);
  audioFeedbackService = inject(AudioFeedbackService);
  closingMetaService = inject(ClosingMetaService);
  hasParentWindow = window === window.parent;
  lastResponsesString = '';
  formerStateResponses = signal<Response[]>([]);

  /**
  * Interpret mixed input as a number
   * @param value mixed input
   * @returns number
  * */
  // eslint-disable-next-line class-methods-use-this
  private asNumberOrZero(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'boolean') return value ? 1 : 0;
    if (typeof value === 'string') {
      const n = Number.parseFloat(value);
      return Number.isNaN(n) ? 0 : n;
    }
    if (Array.isArray(value)) return value.length > 0 ? this.asNumberOrZero(value[0]) : 0;
    return 0;
  }

  /**
   * Resets all state-related properties and signals to their initial values.
   * This ensures a clean state whenever a new unit is loaded.
   */
  reset() {
    this.unitDefinitionProblem.set('');
    this.variableInfo = [];
    this.allResponses = [];
    this.lastResponsesString = '';
    this.responseProgress.set('none');
    this.formerStateResponses.set([]);
    this.stateService.reset();
    this.audioFeedbackService.reset();
    this.closingMetaService.reset();
  }

  /**
   * Initializes the service with a new unit definition.
   * Calls reset() at the beginning to ensure any previous unit state is cleared.
   */
  initResponseConfig(unitDefinition: UnitDefinition = null) {
    this.reset();
    if (unitDefinition) {
      const problems = collectUnitDefinitionProblems(unitDefinition);
      if (problems.length > 0) {
        this.reportUnitDefinitionError(problems.join('; '));
        return;
      }

      if (unitDefinition.variableInfo && unitDefinition.variableInfo.length > 0) {
        unitDefinition.variableInfo.forEach(vInfo => {
          const newVInfo: VariableInfo = {
            variableId: vInfo.variableId,
            responseComplete: 'ALWAYS',
            codingSource: 'VALUE',
            codes: []
          };
          if (vInfo.codingSource) newVInfo.codingSource = vInfo.codingSource;
          vInfo.codes.forEach(c => {
            const newCode: Code = {
              method: 'EQUALS',
              parameter: '',
              code: 1,
              score: 1
            };
            if (c.method) newCode.method = c.method;
            if (c.parameter) newCode.parameter = c.parameter;
            if (c.code) newCode.code = c.code;
            if (c.score) newCode.score = c.score;
            newVInfo.codes.push(newCode);
          });
          this.variableInfo.push(vInfo);
        });
      }
      this.audioFeedbackService.loadFromUnitDefinition(unitDefinition);
    }
  }

  newResponses(responses: StarsResponse[]) {
    responses.forEach(response => {
      const codedResponse = this.getCodedResponse(response);
      const responseInStore = this.allResponses.find(r => r.id === response.id);

      if (response.id === 'mainAudio') {
        const incomingN = this.asNumberOrZero(response.value);
        if (responseInStore) {
          const prevN = this.asNumberOrZero(responseInStore.value);
          // keep maximum to avoid regressions from brief seeks/back jumps
          responseInStore.value = Math.max(prevN, incomingN);
          responseInStore.status = codedResponse.status;
          responseInStore.code = codedResponse.code;
          responseInStore.score = codedResponse.score;
        } else {
          codedResponse.value = incomingN;
          this.allResponses.push(codedResponse);
        }
        if (incomingN >= 1 || this.stateService.mainAudioComplete()) {
          this.stateService.setMainAudioComplete(true);
        }
      } else {
        // Default behavior for all other responses (including closing meta selection)
        this.upsertCodedResponseInStore(response, codedResponse);

        if (response.id === 'VIDEO') {
          const videoValue = response.value as number;
          this.stateService.setVideoComplete(videoValue >= 1);
        }
      }
    });

    this.closingMetaService.onResponsesBatch(responses, this);
    this.notifyResponsesChanged(responses);
  }

  /** Persists coded response fields (status, code, score) like other interaction types. */
  private upsertCodedResponseInStore(givenResponse: Response, codedResponse: Response): void {
    const responseInStore = this.allResponses.find(r => r.id === givenResponse.id);
    if (responseInStore) {
      responseInStore.value = codedResponse.value ?? givenResponse.value;
      responseInStore.status = codedResponse.status;
      responseInStore.code = codedResponse.code ?? 0;
      responseInStore.score = codedResponse.score ?? 0;
    } else {
      this.allResponses.push(codedResponse);
    }
  }

  private reportUnitDefinitionError(message: string): void {
    this.unitDefinitionProblem.set(message);
    if (this.veronaPostService) {
      this.veronaPostService.sendVopRuntimeErrorNotification({
        code: 'STARS_PLAYER_CRASH',
        message
      });
    }
  }

  notifyResponsesChanged(triggerResponses: StarsResponse[] = []): void {
    const responsesAsString = JSON.stringify(this.allResponses);
    if (responsesAsString === this.lastResponsesString) return;

    this.lastResponsesString = responsesAsString;
    if (triggerResponses.some(r => r.relevantForResponsesProgress && r.status === 'VALUE_CHANGED')) {
      this.responseProgress.set(this.getResponsesComplete());
    }
    const unitState: UnitState = {
      unitStateDataType: UnitStateDataType,
      dataParts: {
        responses: responsesAsString
      },
      responseProgress: this.responseProgress(),
      presentationProgress: this.stateService.getPresentationStatus()
    };

    if (this.hasParentWindow) {
      // tslint:disable-next-line:no-console
      console.log('unit state changed: ', unitState);
    }
    if (this.veronaPostService) {
      this.veronaPostService.sendVopStateChangedNotification({ unitState });
      console.log('unit state changed: ', unitState);
    }
    if (this.audioFeedbackService.hasDefinitions() && triggerResponses.length > 0) {
      this.audioFeedbackService.evaluateFromResponses(this.allResponses, triggerResponses[0].id);
    }
  }

  /**
   * Derives variableIdMetaOutcome from the source interaction score and meta-button selection.
   * Requires variableIdReference (main interaction) to be CODING_COMPLETE; otherwise DERIVE_ERROR.
   * Meta selection may stay VALUE_CHANGED; only its value is used in the outcome string.
   */
  deriveMetaOutcome(buttons: ClosingMetaButtonsParams): void {
    const {
      variableIdMetaSelection,
      variableIdReference,
      variableIdMetaOutcome
    } = buttons;
    if (!variableIdMetaOutcome) return;

    const referenceResponse = this.getResponseByVariableId(variableIdReference);
    let outcomeResponse: Response;

    if (!referenceResponse?.id || referenceResponse.status !== 'CODING_COMPLETE') {
      outcomeResponse = {
        id: variableIdMetaOutcome,
        status: 'DERIVE_ERROR',
        value: 0,
        code: 0,
        score: 0
      };
    } else {
      const metaSelectionId = variableIdMetaSelection ?? '';
      const metaSelectionResponse = this.getResponseByVariableId(metaSelectionId);
      const metaSelectionValue = metaSelectionResponse?.value?.toString() ?? '0';
      const referenceScore = referenceResponse.score ?? 0;
      const outcomeValue = `${referenceScore}_${metaSelectionValue}`;
      outcomeResponse = this.getCodedResponse({
        id: variableIdMetaOutcome,
        status: 'VALUE_CHANGED',
        value: outcomeValue
      });
      // No meta selection yet (default meta part is '0') → show outcome as DISPLAYED, not coded
      if (metaSelectionValue === '0') {
        outcomeResponse.status = 'DISPLAYED';
      }
    }

    const outcomeInStore = this.allResponses.find(r => r.id === variableIdMetaOutcome);
    if (outcomeInStore) {
      outcomeInStore.value = outcomeResponse.value;
      outcomeInStore.status = outcomeResponse.status;
      outcomeInStore.code = outcomeResponse.code ?? 0;
      outcomeInStore.score = outcomeResponse.score ?? 0;
    } else {
      this.allResponses.push(outcomeResponse);
    }
  }

  /** True when underscore-separated sub-values have gaps (leading/trailing/double underscore). */
  private static hasIncompleteSubValues(value: string): boolean {
    return value.startsWith('_') || value.endsWith('_') || value.includes('__');
  }

  private static isPositionInRange(responseValue: string, range: string): boolean {
    if (responseValue && range) {
      const responseMatches = responseValue.match(/\d+/g);
      if (responseMatches && responseMatches.length > 1) {
        const responseX = Number.parseInt(responseMatches[0], 10);
        const responseY = Number.parseInt(responseMatches[1], 10);
        const rangeMatches = range.match(/\d+/g);
        if (rangeMatches && rangeMatches.length > 3) {
          const rangeX1 = Number.parseInt(rangeMatches[0], 10);
          const rangeY1 = Number.parseInt(rangeMatches[1], 10);
          const rangeX2 = Number.parseInt(rangeMatches[2], 10);
          const rangeY2 = Number.parseInt(rangeMatches[3], 10);
          let compareXOk: boolean;
          if (rangeX1 < rangeX2) {
            compareXOk = responseX >= rangeX1 && responseX <= rangeX2;
          } else {
            compareXOk = responseX <= rangeX1 && responseX >= rangeX2;
          }
          if (compareXOk) {
            if (rangeY1 < rangeY2) {
              return responseY >= rangeY1 && responseY <= rangeY2;
            }
            return responseY <= rangeY1 && responseY >= rangeY2;
          }
        }
      }
    }
    return false;
  }

  private getCodedResponse(givenResponse: Response): Response {
    const newResponse = {
      id: givenResponse.id,
      status: givenResponse.status,
      value: givenResponse.value,
      code: givenResponse.code || 0,
      score: givenResponse.score || 0
    };
    if (givenResponse.status === 'VALUE_CHANGED') {
      const codingScheme = this.variableInfo.find(v => v.variableId === givenResponse.id);
      if (codingScheme && codingScheme.codes && codingScheme.codes.length > 0) {
        let valueAsNumber = Number.MIN_VALUE;
        let valueAsString = givenResponse.value?.toString() || '';
        if (codingScheme.codingSource === 'SUM') {
          // Sum of ones on the string - for multiselect items
          const matches1 = valueAsString.match(/1/g);
          valueAsNumber = matches1 ? matches1.length : 0;
          valueAsString = valueAsNumber.toString();
        } else if (codingScheme.codingSource === 'VALUE_TO_UPPER') {
          // string to upper for write items
          valueAsString = valueAsString.toUpperCase();
        } else if (codingScheme.codingSource === 'SUM_CHAR_MATCHES') {
          // 'bitwise' AND of strings with ones and zeros - for multiselect items
          if (codingScheme.codingSourceParameter && codingScheme.codingSourceParameter.length === valueAsString.length) {
            let count = 0;
            for (let i = 0; i < valueAsString.length; i++) {
              count += (valueAsString.charCodeAt(i) === codingScheme.codingSourceParameter.charCodeAt(i)) ?
                1 : 0;
            }
            valueAsString = count.toString();
          }
        }
        let newCode = Number.MIN_VALUE;
        let newScore = Number.MIN_VALUE;
        codingScheme.codes.forEach(c => {
          if (newCode === Number.MIN_VALUE) {
            let codeFound: boolean;
            if (c.method === 'EQUALS') {
              codeFound = valueAsString === c.parameter;
            } else if (c.method === 'IN_POSITION_RANGE') {
              codeFound = ResponsesService.isPositionInRange(valueAsString, c.parameter);
            } else {
              if (!Array.isArray(givenResponse.value) && typeof givenResponse.value === 'string') {
                valueAsNumber = Number.parseInt(givenResponse.value, 10);
              }
              const parameterAsNumber = Number.parseInt(c.parameter, 10);
              if (c.method === 'GREATER_THAN') {
                codeFound = valueAsNumber > parameterAsNumber;
              } else {
                codeFound = valueAsNumber < parameterAsNumber;
              }
            }
            if (codeFound) {
              newCode = c.code;
              newScore = c.score;
            }
          }
        });
        const allSubValuesPresent = codingScheme.responseComplete !== 'ON_ALL_SUB_VALUES'
          || !ResponsesService.hasIncompleteSubValues(valueAsString);
        if (allSubValuesPresent) {
          newResponse.status = 'CODING_COMPLETE';
        }
        if (newCode > Number.MIN_VALUE) {
          newResponse.code = newCode;
          newResponse.score = newScore;
        } else {
          newResponse.score = 0;
          const allCodes = codingScheme.codes.map(c => c.code);
          if (allCodes.includes(0)) {
            newCode = Math.max(...allCodes) + 1;
          } else {
            newCode = 0;
          }
        }
      }
    }
    return newResponse;
  }

  /** returns a response for one specific variableId */
  getResponseByVariableId(id: string): Response {
    return this.allResponses.find(r => r.id === id) || {} as Response;
  }

  /** Completed play count for an audio response (integer part of stored value). */
  getAudioPlayCount(id: string): number {
    return Math.floor(this.asNumberOrZero(this.getResponseByVariableId(id).value));
  }

  /** Whether the audio has reached its maxPlay limit for the current unit. */
  isAudioMaxPlayReached(id: string, maxPlay: number): boolean {
    return maxPlay !== 0 && this.getAudioPlayCount(id) >= maxPlay;
  }

  private getResponsesComplete(): Progress {
    if (this.allResponses.length === 0) return 'none';
    if (!this.variableInfo || this.variableInfo.length === 0) return 'complete';
    const onAny = this.variableInfo.filter(coding => coding.responseComplete === 'ON_ANY_RESPONSE')
      .map(coding => coding.variableId);
    const onFullCredit = this.variableInfo
      .filter(coding => coding.responseComplete === 'ON_FULL_CREDIT');
    const onAllSubValues = this.variableInfo
      .filter(coding => coding.responseComplete === 'ON_ALL_SUB_VALUES');
    if (onAny.length + onFullCredit.length + onAllSubValues.length === 0) return 'complete';
    let isComplete = true;
    onAny.forEach(id => {
      const myResponse = this.allResponses
        .find(r => r.id === id && r.status === 'CODING_COMPLETE');
      if (!myResponse) isComplete = false;
    });
    onAllSubValues.forEach(vi => {
      const myResponse = this.allResponses
        .find(r => r.id === vi.variableId && r.status === 'CODING_COMPLETE');
      if (!myResponse) isComplete = false;
    });
    if (isComplete) {
      onFullCredit.forEach(vi => {
        const maxScore = Math.max(...vi.codes.map(c => c.score));
        const myResponse = this.allResponses
          .find(r => r.id === vi.variableId && r.status === 'CODING_COMPLETE');
        if (!myResponse || myResponse.score < maxScore) isComplete = false;
      });
    }
    return isComplete ? 'complete' : 'some';
  }

  getPresentationStatus(): Progress {
    return this.stateService.getPresentationStatus();
  }

  /**
   * Updates the unit's presentation progress (e.g., 'none', 'some', 'complete').
   * This status is used to track whether the user has interacted with the unit's
   * presentation elements, such as dismissing the click-layer or finishing the main audio.
   * A 'complete' status cannot be downgraded to 'some' or 'none'.
   * Each update triggers a vopStateChangedNotification to the Verona host.
   */
  updatePresentationProgress(progress: Progress): void {
    this.stateService.updatePresentationProgress(progress);
    const unitState: UnitState = {
      unitStateDataType: UnitStateDataType,
      dataParts: {
        responses: this.lastResponsesString
      },
      responseProgress: this.responseProgress(),
      presentationProgress: this.stateService.getPresentationStatus()
    };
    if (this.veronaPostService) {
      this.veronaPostService.sendVopStateChangedNotification({ unitState });
    }
  }
}

export interface StarsResponse extends Response {
  relevantForResponsesProgress:boolean;
}
