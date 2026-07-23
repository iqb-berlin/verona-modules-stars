import {
  InteractionParameters,
  SelectionOption,
  UnitDefinition
} from '../../projects/player/src/app/models/unit-definition';

/**
 * Returns the index of an item from an array based on a user-facing index (1-based).
 *
 * Users usually count from 1 (e.g. "1st", "2nd", "3rd"),
 * but JavaScript arrays are 0-based. This helper converts
 * the user index to the correct array index.
 *
 * @param arr - The array to select from
 * @param userIndex - The 1-based index provided by the user (string or number)
 * @returns The item at that position, or undefined if invalid
 */

export const getIndexByOneBasedInput = (
  arr: unknown[],
  userIndex: string | number
): number | undefined => {
  const idx = Number(userIndex) - 1; // convert to 0-based
  if (Number.isNaN(idx) || idx < 0 || idx >= arr.length) {
    return undefined; // invalid input
  }
  return idx; // return 1-based index back
};

/**
 * Gets the parameter from the first code in the first variable of test data
 * @param testData - The unit definition containing variable information
 * @returns The parameter string or empty string if not found
 */
export function getCorrectAnswerParam(testData: UnitDefinition): string {
  if (!testData || !Array.isArray(testData.variableInfo)) {
    return '';
  }
  const variableInfo = testData.variableInfo;
  return variableInfo[0]?.codes[0]?.parameter || '';
}

/**
 * Parses a place-value response/coding parameter into tens and ones counts.
 * Supported formats:
 * - `"20_2"` → tens contribution_ones (2 tens, 2 ones)
 * - `"2,1"` → tens count,ones count (legacy navigator format)
 * - `22` / `"22"` → combined numeric value (2 tens, 2 ones)
 */
export function parsePlaceValueParam(
  param: string | number | undefined | null
): { tens: number; ones: number } {
  if (param === undefined || param === null || param === '') {
    return { tens: 0, ones: 0 };
  }

  if (typeof param === 'number') {
    const total = Number.isFinite(param) ? Math.max(0, param) : 0;
    return { tens: Math.floor(total / 10), ones: total % 10 };
  }

  if (param.includes('_')) {
    const [tensPart, onesPart] = param.split('_');
    const tensValue = Number.parseInt(tensPart ?? '0', 10);
    const ones = Number.parseInt(onesPart ?? '0', 10);
    return {
      tens: Number.isFinite(tensValue) ? Math.max(0, Math.floor(tensValue / 10)) : 0,
      ones: Number.isFinite(ones) ? Math.max(0, ones) : 0
    };
  }

  if (param.includes(',')) {
    const [tensPart, onesPart] = param.split(',');
    const tens = Number.parseInt(tensPart?.trim() ?? '0', 10);
    const ones = Number.parseInt(onesPart?.trim() ?? '0', 10);
    return {
      tens: Number.isFinite(tens) ? Math.max(0, tens) : 0,
      ones: Number.isFinite(ones) ? Math.max(0, ones) : 0
    };
  }

  const total = Number.parseInt(param, 10);
  if (!Number.isFinite(total)) {
    return { tens: 0, ones: 0 };
  }
  return { tens: Math.floor(Math.max(0, total) / 10), ones: Math.max(0, total) % 10 };
}

export type MockMessage = {
  data: {
    type: string;
    unitState?: {
      dataParts: Record<string, unknown>;
      responseProgress?: string;
    };
    sessionId?: string;
    target?: string;
  };
  origin: string;
};

export type CypressResponseItem = {
  id?: string;
  status?: string;
  value?: string | number;
  score?: number;
  code?: number;
  [key: string]: unknown;
};

/**
 * Parse `dataParts` and extract arrays of responses from JSON string values.
 */
export const parseDataPartsResponses = (dataParts: Record<string, unknown>): CypressResponseItem[][] =>
  Object.values(dataParts)
    .filter((dataPart): dataPart is string => typeof dataPart === 'string')
    .map(rawPart => {
      try {
        const parsed = JSON.parse(rawPart) as unknown;
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'object' && item !== null)) {
          return parsed as CypressResponseItem[];
        }
      } catch {
        console.warn(`Non-JSON string found in dataParts: ${rawPart}`);
      }
      return null;
    })
    .filter((parsed): parsed is CypressResponseItem[] => Array.isArray(parsed));

/**
 * Function that extracts and returns an array of selection options from the given interaction parameters.
 * Supports BUTTONS, DROP, and POLYGON_BUTTONS interaction types.
 * @param interactionParameters - The interaction parameters containing options
 * @returns SelectionOption[]
 */
export const getButtonOptions =
  (interactionParameters: InteractionParameters): SelectionOption[] => {
    const opts = (interactionParameters as any).options;

    // If options is already an array (drop or polygon interaction)
    if (Array.isArray(opts)) {
      return opts;
    }

    // If options is an object with buttons property (button interaction)
    if (opts && typeof opts === 'object' && 'buttons' in opts && Array.isArray(opts.buttons)) {
      return opts.buttons;
    }

    return [];
  };
