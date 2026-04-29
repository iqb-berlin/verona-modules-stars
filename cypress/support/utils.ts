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
