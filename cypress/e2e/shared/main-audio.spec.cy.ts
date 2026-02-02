import { UnitDefinition } from '../../../projects/player/src/app/models/unit-definition';

export function testMainAudioFeatures(interactionType: string, configFile: string) {
  describe(`Main Audio Features for interactionType - ${interactionType}`, () => {
    let testData: UnitDefinition;

    beforeEach(() => {
      cy.setupTestData(configFile, interactionType);
      cy.get('@testData').then(data => {
        testData = data as unknown as UnitDefinition;
      });
    });

    it('has audio button', () => {
      // Check if the speaker icon exists
      cy.get('[data-cy="speaker-icon"]').should('exist');
    });

    it('waits for audio completion when disableInteractionUntilComplete is true', () => {
      // Set up test data
      cy.setupTestData(`${interactionType}_disableInteractionUntilComplete_true_test.json`, `${interactionType}`);

      // Initially, the interaction should be disabled with overlay visible
      cy.get('[data-cy="interaction-disabled-overlay"]').should('exist');

      // Click the audio button to start playing
      cy.get('[data-cy="speaker-icon"]').click();

      // Wait for audio to finish playing
      cy.waitUntilAudioIsFinishedPlaying();

      // After audio completion, the overlay should disappear
      cy.get('[data-cy="interaction-disabled-overlay"]').should('not.exist');

      // Interactions should be possible now
      cy.applyStandardScenarios(interactionType);
    });

    it('is consistent with maxPlay time', () => {
      const maxPlayTime = testData.mainAudio?.maxPlay ?? 1;

      // Initially audio button container should be enabled
      cy.get('[data-cy="audio-button-container"]').should('exist');
      if (maxPlayTime > 0) {
        // Click the audio button exactly maxPlayTime times
        for (let i = 0; i < maxPlayTime; i++) {
          cy.get('[data-cy="speaker-icon"]').click();
          // Wait for audio to finish playing
          cy.waitUntilAudioIsFinishedPlaying();
        }

        // Ensure it doesn't flip to playing
        cy.get('[data-cy="custom-audio-button"]').should('not.have.class', 'playing');
        // Ensure that it is disabled
        cy.get('[data-cy="audio-button-container-disabled"]').should('exist');
      }
    });

    it('is limitless clickable when maxPlay is 0', () => {
      // Set up test data
      cy.setupTestData(`${interactionType}_maxPlay_0_test.json`, `${interactionType}`);

      // A number to test it is more times clickable
      const clickTime = 5;

      // Initially audio button container should be enabled
      cy.get('[data-cy="audio-button-container"]').should('exist');

      // Click the audio button maxPLayTime times
      for (let i = 0; i < clickTime; i++) {
        cy.get('[data-cy="speaker-icon"]').click();
        // Wait for audio to finish playing
        cy.waitUntilAudioIsFinishedPlaying();
      }
      // After many times clicked, the container should still exist
      cy.get('[data-cy="audio-button-container"]').should('exist');
    });
  });
}
