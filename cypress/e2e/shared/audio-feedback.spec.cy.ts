import {
  UnitDefinition
} from '../../../projects/player/src/app/models/unit-definition';

export function testAudioFeedback(interactionType: string, configFile: string) {
  describe(`Audio Feedback Features for interactionType - ${interactionType}`, () => {
    const loadDefaultTestFile = () => {
      cy.setupTestData(configFile, interactionType);
      return cy.get('@testData') as unknown as Cypress.Chainable<UnitDefinition>;
    };

    it('plays the right feedback according to the selected answer', () => {
      // // Load the file
      // loadDefaultTestFile().then(testData => {
      //   // Click on wrong answer
      //   cy.applyStandardScenarios(interactionType, testData);
      //
      //   // Click on the continue button
      //   cy.clickContinueButton();
      //
      //   // Wait until the feedback is played until the end
      //   cy.waitUntilFeedbackIsFinishedPlaying();
      //
      //   // interaction-disabled-overlay should be shown
      //   // hint class should be shown
      // });
      //
      // // Load the file
      // loadDefaultTestFile().then(testData => {
      //
      //   // Perform the interaction with correct answer
      //   cy.applyCorrectAnswerScenarios(interactionType, testData);
      //
      //   // Click on the continue button
      //   cy.clickContinueButton();
      //
      //   // Wait until the feedback is played until the end
      //   cy.waitUntilFeedbackIsFinishedPlaying();
      //
      //   // interaction-disabled-overlay should NOT be shown
      // });
    });
  });
}
