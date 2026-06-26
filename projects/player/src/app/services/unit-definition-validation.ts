/**
 * Unit-definition validation for the STARS player.
 *
 * Error messages on the error page (and vopRuntimeErrorNotification) list required
 * fields that are missing. Checks are conditional: optional blocks are only
 * validated when present in the JSON (openingImage, mainAudio, variableInfo,
 * audioFeedback, closingMetaButtons). Interaction-specific rules apply only for
 * the active interactionType.
 */
import { UnitDefinition } from '../models/unit-definition';
import { Code } from '../models/responses';

function isMissingString(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

function isMissingArray(value: unknown): boolean {
  return !Array.isArray(value) || value.length === 0;
}

function isMissingNumber(value: unknown): boolean {
  return value === undefined || value === null || Number.isNaN(value);
}

function validateCodeEntry(code: Code | undefined, index: number, problems: string[]): void {
  if (!code) {
    problems.push(`variableInfo: codes[${index}] missing`);
    return;
  }
  if (isMissingString(code.method)) {
    problems.push(`variableInfo: codes[${index}].method missing`);
  }
  if (isMissingString(code.parameter)) {
    problems.push(`variableInfo: codes[${index}].parameter missing`);
  }
  if (isMissingNumber(code.code)) {
    problems.push(`variableInfo: codes[${index}].code missing`);
  }
  if (isMissingNumber(code.score)) {
    problems.push(`variableInfo: codes[${index}].score missing`);
  }
}

export function collectUnitDefinitionProblems(unitDefinition: UnitDefinition | null): string[] {
  if (!unitDefinition) return [];

  const problems: string[] = [];
  const params = unitDefinition.interactionParameters as Record<string, unknown> | undefined;

  if (isMissingString(unitDefinition.id)) {
    problems.push('id missing');
  }
  if (isMissingString(unitDefinition.interactionType)) {
    problems.push('interactionType missing');
  }

  if (unitDefinition.openingImage && isMissingString(unitDefinition.openingImage.imageSource)) {
    problems.push('openingImage: imageSource missing');
  }

  if (unitDefinition.mainAudio && isMissingString(unitDefinition.mainAudio.audioSource)) {
    problems.push('mainAudio: audioSource missing');
  }

  switch (unitDefinition.interactionType) {
    case 'DROP':
      if (isMissingArray(params?.options)) {
        problems.push('DROP: options missing');
      }
      break;
    case 'FIND_ON_IMAGE':
      if (isMissingString(params?.imageSource)) {
        problems.push('FIND_ON_IMAGE: imageSource missing');
      }
      break;
    case 'VIDEO':
      if (isMissingString(params?.videoSource)) {
        problems.push('VIDEO: videoSource missing');
      }
      break;
    case 'POLYGON_BUTTONS':
      if (isMissingArray(params?.options)) {
        problems.push('POLYGON_BUTTONS: options missing');
      }
      break;
    case 'PYRAMID':
      if (isMissingNumber(params?.topNumber)) {
        problems.push('PYRAMID: topNumber missing');
      }
      break;
    case 'EQUATION':
      if (isMissingArray(params?.operators)) {
        problems.push('EQUATION: operators missing');
      }
      break;
    default:
      break;
  }

  if (unitDefinition.variableInfo?.length) {
    unitDefinition.variableInfo.forEach((vInfo, index) => {
      if (isMissingString(vInfo?.variableId)) {
        problems.push(`variableInfo[${index}]: variableId missing`);
      }
      if (isMissingArray(vInfo?.codes)) {
        problems.push(`variableInfo[${index}]: codes missing`);
      } else {
        vInfo.codes.forEach((code, codeIndex) => {
          validateCodeEntry(code, codeIndex, problems);
        });
      }
    });
  }

  if (unitDefinition.audioFeedback) {
    if (isMissingArray(unitDefinition.audioFeedback.feedback)) {
      problems.push('audioFeedback: feedback missing');
    } else {
      unitDefinition.audioFeedback.feedback.forEach((entry, index) => {
        if (isMissingString(entry?.variableId)) {
          problems.push(`audioFeedback[${index}]: variableId missing`);
        }
        if (isMissingString(entry?.parameter)) {
          problems.push(`audioFeedback[${index}]: parameter missing`);
        }
        if (isMissingString(entry?.audioSource)) {
          problems.push(`audioFeedback[${index}]: audioSource missing`);
        }
      });
    }
  }

  if (unitDefinition.closingMetaButtons &&
    isMissingString(unitDefinition.closingMetaButtons.variableIdReference)) {
    problems.push('closingMetaButtons: variableIdReference missing');
  }

  return problems;
}
