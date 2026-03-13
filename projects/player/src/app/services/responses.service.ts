import { inject, Injectable, signal } from '@angular/core';

import { Response } from '@iqbspecs/response/response.interface';
import { Progress, UnitState, UnitStateDataType } from '../models/verona';
import { VeronaPostService } from './verona-post.service';
import { UnitDefinition } from '../models/unit-definition';
import { Code, VariableInfo } from '../models/responses';
import { FeedbackDefinition, ShowResponse } from '../models/feedback';

@Injectable({
  providedIn: 'root'
})

export class ResponsesService {
  unitDefinitionProblem = signal('');
  responseProgress = signal<Progress>('none');
  mainAudioComplete = signal(false);
  videoComplete = signal(false);

  allResponses: Response[] = [];
  variableInfo: VariableInfo[] = [];
  veronaPostService = inject(VeronaPostService);
  hasParentWindow = window === window.parent;
  lastResponsesString = '';
  pendingAudioFeedback = signal(false);
  feedbackHint = signal('');
  feedbackActive = signal(false);
  private pendingAudioFeedbackSource = '';
  private pendingFeedbackHint = '';
  private pendingHintDelay = 0;
  feedbackDefinitions: FeedbackDefinition[] = [];
  formerStateResponses = signal<Response[]>([]);
  presentationProgress = signal<Progress>('some');

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
    this.videoComplete.set(false);
    this.variableInfo = [];
    this.allResponses = [];
    this.lastResponsesString = '';
    this.pendingAudioFeedback.set(false);
    this.pendingAudioFeedbackSource = '';
    this.feedbackHint.set('');
    this.feedbackActive.set(false);
    this.feedbackDefinitions = [];
    this.pendingFeedbackHint = '';
    this.pendingHintDelay = 0;
    this.responseProgress.set('none');
    this.presentationProgress.set('some');
    this.mainAudioComplete.set(false);
    this.formerStateResponses.set([]);
  }

  /**
   * Initializes the service with a new unit definition.
   * Calls reset() at the beginning to ensure any previous unit state is cleared.
   */
  setNewData(unitDefinition: UnitDefinition = null) {
    this.reset();
    if (unitDefinition) {
      const problems: string[] = [];
      if (unitDefinition.variableInfo && unitDefinition.variableInfo.length > 0) {
        unitDefinition.variableInfo.forEach(vInfo => {
          if (vInfo.variableId && vInfo.variableId.length > 0 && vInfo.codes && vInfo.codes.length > 0) {
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
          } else {
            problems.push('variableInfo: variableId or codes missing');
          }
        });
      }
      if (unitDefinition.audioFeedback && unitDefinition.audioFeedback.feedback &&
        unitDefinition.audioFeedback.feedback.length > 0) {
        unitDefinition.audioFeedback.feedback.forEach(f => {
          if (f.variableId && f.variableId.length > 0 && f.parameter && f.audioSource) {
            let showResponse: ShowResponse = {
              variableId: f.showResponse?.variableId || '',
              value: f.showResponse?.value || '',
              delayMS: f.showResponse?.delayMS || 0
            };
            this.feedbackDefinitions.push({
              variableId: f.variableId,
              source: f.source || 'CODE',
              method: f.method || 'EQUALS',
              parameter: f.parameter,
              audioSource: f.audioSource,
              showResponse: showResponse
            });
          } else {
            problems.push('audioFeedback: variableId or parameter or audioSource missing');
          }
        });
      }
      if (problems.length > 0) this.unitDefinitionProblem.set(problems.join('; '));
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
        if (incomingN >= 1 || this.mainAudioComplete()) {
          this.mainAudioComplete.set(true);
          this.presentationProgress.set('complete');
        }
      } else {
        // Default behavior for all other responses
        if (responseInStore) {
          responseInStore.value = response.value;
          responseInStore.status = codedResponse.status;
          responseInStore.code = codedResponse.code;
          responseInStore.score = codedResponse.score;
        } else {
          this.allResponses.push(codedResponse);
        }
        if (response.id === 'videoPlayer') {
          this.videoComplete.set((response.value as number) >= 1);
        }
      }
    });

    const responsesAsString = JSON.stringify(this.allResponses);
    if (responsesAsString !== this.lastResponsesString) {
      this.lastResponsesString = responsesAsString;
      // only set response progress if it is relevant for the progress and the status is VALUE_CHANGED
      if (responses.some(r => r.relevantForResponsesProgress && r.status === 'VALUE_CHANGED')) {
        const getResponsesCompleteOutput = this.getResponsesComplete();
        this.responseProgress.set(getResponsesCompleteOutput);
      }
      const unitState: UnitState = {
        unitStateDataType: UnitStateDataType,
        dataParts: {
          responses: responsesAsString
        },
        responseProgress: this.responseProgress(),
        presentationProgress: this.getPresentationStatus()
      };

      if (this.hasParentWindow) {
        // tslint:disable-next-line:no-console
        console.log('unit state changed: ', unitState);
      }
      if (this.veronaPostService) {
        this.veronaPostService.sendVopStateChangedNotification({ unitState });
        console.log('unit state changed: ', unitState);
      }
      if (this.feedbackDefinitions.length > 0 && responses.length > 0) {
        this.provideFeedback(responses[0].id);
      }
    }
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
          if (codingScheme.codingSourceParameter && codingScheme.codingSourceParameter.length == valueAsString.length) {
            let count = 0;
            for(let i = 0; i < valueAsString.length; i++) {
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
        newResponse.status = 'CODING_COMPLETE';
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

  private getResponsesComplete(): Progress {
    if (this.allResponses.length === 0) return 'none';
    if (!this.variableInfo || this.variableInfo.length === 0) return 'complete';
    const onAny = this.variableInfo.filter(coding => coding.responseComplete === 'ON_ANY_RESPONSE')
      .map(coding => coding.variableId);
    const onFullCredit = this.variableInfo
      .filter(coding => coding.responseComplete === 'ON_FULL_CREDIT');
    if (onAny.length + onFullCredit.length === 0) return 'complete';
    let isComplete = true;
    onAny.forEach(id => {
      const myResponse = this.allResponses
        .find(r => r.id === id && r.status === 'CODING_COMPLETE');
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
    return this.presentationProgress();
  }

  /**
   * Updates the unit's presentation progress (e.g., 'none', 'some', 'complete').
   * This status is used to track whether the user has interacted with the unit's
   * presentation elements, such as dismissing the click-layer or finishing the main audio.
   * A 'complete' status cannot be downgraded to 'some' or 'none'.
   * Each update triggers a vopStateChangedNotification to the Verona host.
   */
  updatePresentationProgress(progress: Progress): void {
    if (this.presentationProgress() === 'complete' && progress !== 'complete') {
      return;
    }
    this.presentationProgress.set(progress);
    const unitState: UnitState = {
      unitStateDataType: UnitStateDataType,
      dataParts: {
        responses: this.lastResponsesString
      },
      responseProgress: this.responseProgress(),
      presentationProgress: this.presentationProgress()
    };
    if (this.veronaPostService) {
      this.veronaPostService.sendVopStateChangedNotification({ unitState });
    }
  }

  getAudioFeedback(setAsPlayed: boolean): string {
    const returnValue = this.pendingAudioFeedbackSource;
    if (setAsPlayed) {
      this.pendingAudioFeedbackSource = '';
      this.pendingAudioFeedback.set(false);
    }
    return returnValue;
  }

  startFeedback() {
    if (this.pendingFeedbackHint === '') return;
    if (this.pendingHintDelay != 0) {
      setTimeout(() => {
        this.feedbackHint.set(this.pendingFeedbackHint);
      }, this.pendingHintDelay);
    } else {
      this.feedbackHint.set(this.pendingFeedbackHint);
    }
    this.feedbackActive.set(true);
  }

  private provideFeedback(startVariable: string): void {
    this.pendingAudioFeedback.set(false);
    this.pendingAudioFeedbackSource = '';
    const responsesToCheck: string[] = [startVariable,
      ...this.allResponses.filter(r => r.id !== startVariable).map(r => r.id)];
    const audioToPlay = responsesToCheck.map(varId => {
      const responseToCheck = this.allResponses.find(r => r.id === varId);
      if (responseToCheck) {
        const feedbacksToUse = this.feedbackDefinitions
          .filter(f => f.variableId === responseToCheck.id);
        const feedbackToTake = feedbacksToUse.find(f => {
          let valueToCompare: string | number | boolean;
          if (f.source === 'VALUE') {
            if (Array.isArray(responseToCheck.value)) {
              valueToCompare = responseToCheck.value.length > 0 ? responseToCheck.value[0] : '';
            } else {
              valueToCompare = responseToCheck.value;
            }
          } else {
            valueToCompare = f.source === 'SCORE' ? responseToCheck.score : responseToCheck.code;
          }
          if (f.method === 'EQUALS') {
            const valueToCompareAsString = typeof valueToCompare === 'string' ?
              valueToCompare : valueToCompare.toString();
            return valueToCompareAsString === f.parameter;
          }
          let valueAsNumber: number;
          if (typeof valueToCompare === 'number') {
            valueAsNumber = valueToCompare;
          } else if (typeof valueToCompare === 'boolean') {
            valueAsNumber = valueToCompare ? 1 : 0;
          } else {
            valueAsNumber = Number.parseInt(valueToCompare, 10);
          }
          const parameterAsNumber = Number.parseInt(f.parameter, 10);
          if (f.method === 'GREATER_THAN') {
            return valueAsNumber > parameterAsNumber;
          }
          return valueAsNumber < parameterAsNumber;
        });
        return feedbackToTake || undefined;
      }
      return undefined;
    }).find(sourceString => !!sourceString);
    if (audioToPlay) {
      this.pendingAudioFeedback.set(true);
      this.pendingAudioFeedbackSource = audioToPlay.audioSource;
      this.pendingFeedbackHint = audioToPlay.showResponse?.value || '';
      this.pendingHintDelay = audioToPlay.showResponse?.delayMS || 0;
    }
  }

  setFormerState(unitState: UnitState | null) {
    const prevPresentation = this.getPresentationStatus();
    const prevResponse = this.responseProgress();

    // Reset all state to defaults first
    this.formerStateResponses.set([]);
    this.mainAudioComplete.set(false);
    this.presentationProgress.set('some');
    this.allResponses = [];
    this.lastResponsesString = '';
    this.responseProgress.set('none');

    if (unitState) {
      if (unitState.presentationProgress) {
        this.presentationProgress.set(unitState.presentationProgress);
      }
      if (unitState.dataParts) {
        const dataParts = unitState.dataParts || {};
        const responsesJson = dataParts['responses'];

        if (responsesJson) {
          try {
            const parsedResponses = JSON.parse(responsesJson as string) as Response[];
            this.formerStateResponses.set(parsedResponses);

            this.allResponses = JSON.parse(JSON.stringify(parsedResponses));
            this.lastResponsesString = responsesJson as string;

            // Restore mainAudio completion from saved responses
            const mainAudioResp = parsedResponses.find(r => r.id === 'mainAudio');
            if (mainAudioResp) {
              const n = this.asNumberOrZero(mainAudioResp.value);
              this.mainAudioComplete.set(n >= 1);
            }
            if (this.mainAudioComplete()) {
              this.presentationProgress.set('complete');
            }

            // Restore responseProgress: if any interaction response has VALUE_CHANGED (or CODING_COMPLETE), mark complete
            const hasInteractionValueChanged =
              parsedResponses.some(r => (r.status === 'VALUE_CHANGED' || r.status === 'CODING_COMPLETE') &&
                r.id !== 'mainAudio' && r.id !== 'videoPlayer');
            if (hasInteractionValueChanged) {
              this.responseProgress.set('complete');
            } else if (unitState.responseProgress) {
              // fall back to provided responseProgress from unitState when available
              this.responseProgress.set(unitState.responseProgress);
            }
          } catch (error) {
            console.warn('RESPONSE SERVICE Failed to parse former state responses:', error);
          }
        }
      }
    }

    const newPresentation = this.getPresentationStatus();
    const newResponse = this.responseProgress();
    if ((newPresentation !== prevPresentation || newResponse !== prevResponse) && this.veronaPostService) {
      const restoredDataParts: Record<string, string> = unitState?.dataParts ?
        { ...unitState.dataParts } :
        {};
      const unitStateToPost: UnitState = {
        unitStateDataType: UnitStateDataType,
        dataParts: restoredDataParts,
        responseProgress: newResponse,
        presentationProgress: newPresentation
      };

      // Keep lastResponsesString in sync to avoid duplicate postings after first interaction
      if (restoredDataParts && restoredDataParts.responses) {
        this.lastResponsesString = restoredDataParts.responses;
      }

      this.veronaPostService.sendVopStateChangedNotification({ unitState: unitStateToPost });
    }
  }
}

export interface StarsResponse extends Response {
  relevantForResponsesProgress:boolean;
}
