import {
  UnitDefinition
} from '../../../projects/player/src/app/models/unit-definition';

export function testAudioFeedback(interactionType: string, configFile: string) {
  describe(`Audio Feedback Features for interactionType - ${interactionType}`, () => {

    beforeEach(() => {
      cy.clearUnitStates();
    });

    const loadDefaultTestFile = () => {
      cy.setupTestData(configFile, interactionType);
      return cy.get('@testData') as unknown as Cypress.Chainable<UnitDefinition>;
    };

    const getHintElementSelector = (intType: string) => {
      switch (intType.toUpperCase()) {
        case 'WRITE':
        case 'EQUATION':
        case 'PYRAMID':
        case 'FIND_ON_IMAGE':
        case 'PLACE_VALUE':
          return 'div.hint';
        case 'BUTTON':
        case 'DROP':
        case 'META':
          return 'input.hint';
        case 'NUMBER_LINE':
          return 'text.hint';
        case 'POLYGON_BUTTONS':
          return 'path.hint';
        default:
          return '.hint';
      }
    };

    it('shows the hint class after feedback, if answer is wrong', () => {

      cy.log('Checking wrong answer scenario');

      // Load the file
      loadDefaultTestFile().then(testData => {
        // Perform interaction with wrong answer
        cy.applyStandardScenarios(interactionType, testData);

        // Click on the continue button
        cy.clickContinueButton();

        // Wait until the feedback is played until the end
        cy.waitUntilFeedbackIsFinishedPlaying();

        // First check that the overlay is visible and then remove it to inspect hint class
        cy.get('[data-cy=interaction-disabled-overlay]').should('be.visible').invoke('remove');

        const hintSelector = getHintElementSelector(interactionType);
        cy.get(hintSelector).should('exist');
      });
    });

    it('does not show the hint class after feedback, if the answer is correct', () => {

      cy.log('Checking correct answer scenario');

      // Load the file again for correct answer scenario
      loadDefaultTestFile().then(testData => {

        // Perform the interaction with correct answer
        cy.applyCorrectAnswerScenarios(interactionType, testData);

        // Click on the continue button
        cy.clickContinueButton();

        // Wait until the feedback is played until the end
        cy.waitUntilFeedbackIsFinishedPlaying();

        // The overlay should still be there to make the interaction not possible
        // First check that the overlay is visible and then remove it to inspect hint class
        cy.get('[data-cy=interaction-disabled-overlay]').should('be.visible').invoke('remove');

        const hintSelector = getHintElementSelector(interactionType);
        cy.get(hintSelector).should('not.exist');
      });
    });
  });
}
