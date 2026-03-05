import { VopStartCommand } from '../../projects/player/src/app/models/verona';
import { UnitDefinition } from '../../projects/player/src/app/models/unit-definition';

export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {

      /**
       * Load unit definition example file for component testing
       * @param fileName - Test data file name
       */
      loadUnit(fileName: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Setup test data for component testing
       * @param configFile - Test data file name (eg: buttons_test...)
       * @param interactionType - interactionType parameter of component being tested (eg: buttons, drop...)
       */
      setupTestData(configFile: string, interactionType: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Clear all cached unit states from previous setupTestData calls
       */
      clearUnitStates(): Chainable<void>;

      /**
       * Click on the click layer
       * */
      removeClickLayer(): Chainable<void>;

      /**
       * Setup test data for postMessages testing
       * @param configFile - Test data file name (eg: buttons_test...)
       * @param interactionType - interactionType parameter of component being tested (eg: buttons, drop...)
       */
      // eslint-disable-next-line max-len
      setupTestDataWithPostMessageMock(configFile: string, interactionType: string): Chainable<JQuery<HTMLElement>>

      /**
       * Send message from parent window
       * @param data - Message data
       * @param origin - Message origin
       */
      sendMessageFromParent(data: VopStartCommand, origin?: string): Chainable<void>;

      /**
       * Assert that the continue button exists and visible
       * */
      assertContinueButtonExistsAndVisible(): Chainable<void>;

      /**
       * Assert that the continue button does NOT exists
       * */
      assertContinueButtonNotExists(): Chainable<void>;

      /**
       * Click on the continue button
       * */
      clickContinueButton(): Chainable<void>;

      /**
       * Clicks the button at index 1
       * */
      clickButtonAtIndexOne(): Chainable<void>;

      /**
       * Assert that the audio is played until the end
       * */
      waitUntilAudioIsFinishedPlaying(): Chainable<void>;

      /**
       * Writes text on keyboard
       * @param text - Array of the letters to write on keyboard
       * */
      writeTextOnKeyboard(text: string): Chainable<void>;

      /**
       * Assert that the feedback is played until the end
       * */
      waitUntilFeedbackIsFinishedPlaying(): Chainable<void>;

      /**
       * Clicks within a position range on an image element
       * @param positionRange - Position range in format "x1,y1-x2,y2", e.g. "42,35-55,87"
       */
      clickInPositionRange(positionRange: string): Chainable<void>;

      /**
       * Custom command to clear text input by clicking backspace until text span is empty
       * Uses maxInputLength from testData if available, otherwise uses default value
       * @param testData Optional test data containing interactionParameters.maxInputLength
       */
      clearTextInput(testData?: UnitDefinition): Chainable<void>

      /**
       * Move specified number of tens and ones in place_value interaction
       * @param targetTens - Number of tens to move
       * @param targetOnes - Number of ones to move
       */
      movePlaceValueIcons(targetTens: number, targetOnes: number): Chainable<void>

      /**
       * Apply standard scenarios that are wrong based on interaction type
       * @param interactionType - The type of interaction
       * @param navigator - Optional navigator to choose what to click (e.g., 'character-button-b', 'button-2', 'polygon-3', '[data-cy=...]', '100,150', [200,350])
       */
      applyStandardScenarios(interactionType: string, navigator?: unknown): Chainable<void>;

      /**
       * Apply correct answer scenarios based on interaction type
       * @param interactionType - The type of interaction
       * @param dataToCheck - The unit definition data
       */
      applyCorrectAnswerScenarios(interactionType: string, dataToCheck: UnitDefinition): Chainable<void>;

      /**
       * Asserts that the interaction container or a primary element is visible
       * Useful for waiting for a unit to load.
       * @param interactionType - the type of interaction.
       */
      assertInteractionComponentVisible(interactionType:string): Chainable<void>;

      /**
       * Asserts that the interaction's visual state has been restored correctly from a former unit state
       * This should be used after a former state has been applied (e.g. via vopStartCommand)
       * @param interactionType - the type of interaction
       * @param expected - Optional expected state descriptor (e.g., for place_value: 'tens,ones' like '1,2' or a number 12)
       */
      assertRestoredState(interactionType:string, expected?: unknown): Chainable<void>;
    }
  }
}
