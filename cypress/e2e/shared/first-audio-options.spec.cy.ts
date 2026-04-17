import { UnitDefinition } from '../../../projects/player/src/app/models/unit-definition';

export function firstAudioOptionsFeatures(interactionType: string) {
  describe(`First click layer Features for interactionType - ${interactionType}`, () => {
    let testData: UnitDefinition;

    it('should show and hide first click layer correctly when firstClickLayer: "TRANSPARENT"', () => {
      // Setup test data
      cy.setupTestData(`${interactionType}_firstClickLayer_transparent_test.json`, interactionType);

      // Click layer should exists
      cy.get('[data-cy="click-layer"]').should('exist');

      // Remove click layer to enable interactions
      cy.get('[data-cy="click-layer"]').click();

      // Click layer cannot be seen
      cy.get('[data-cy="click-layer"]').should('not.exist');

      // Interactions should be possible now
      cy.applyStandardScenarios(interactionType);
    });

    // Test case to check when both firstClickLayer: "TRANSPARENT" and disableInteractionUntilComplete: true are active
    it('should show and hide click layer correctly when firstClickLayer: "TRANSPARENT" and disableInteractionUntilComplete: true', () => {
      // Setup test data
      cy.setupTestData(`${interactionType}_firstClickLayer_transparent_disableInteractionUntilComplete_true_test.json`, interactionType);

      // Click layer should exists
      cy.get('[data-cy="click-layer"]').should('exist');

      // Remove click layer to enable interactions
      cy.get('[data-cy="click-layer"]').click();

      // interaction-disabled-overlay can be seen until the mainAudio is finished playing
      cy.get('[data-cy="interaction-disabled-overlay"]').should('exist');
      cy.waitUntilAudioIsFinishedPlaying();

      // interaction-disabled-overlay cannot be seen
      cy.get('[data-cy="interaction-disabled-overlay"]').should('not.exist');

      // Interactions should be possible now
      cy.applyStandardScenarios(interactionType);
    });


    it('animates audio button when animateButton is true', () => {
      // Set up test data
      cy.setupTestData(`${interactionType}_animateButton_true_test.json`, interactionType);

      cy.get('@testData').then(data => {
        testData = data as unknown as UnitDefinition;

        if (testData.firstAudioOptions?.animateButton) {
          // The button should NOT be moving initially
          cy.get('[data-cy="custom-audio-button"]').should('exist').and('not.have.class', 'moving-button');

          // Do not interact with the page; wait slightly over 10 seconds
          cy.wait(11000);

          // After 10s of inactivity (and before first interaction), it should start moving
          cy.get('[data-cy="custom-audio-button"]').should('have.class', 'moving-button');
        }
      });
    });
  });
}
