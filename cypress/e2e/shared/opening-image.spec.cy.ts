export function testOpeningImageFeatures(interactionType: string, configFile: string) {
  describe(`Opening Image Features for interactionType - ${interactionType}`, () => {

    beforeEach(() => {
      // The opening image stays presentationDurationMS (setTimeout in OpeningImageComponent),
      // the clock is faked so that the test does not have to wait for it
      cy.fakeTimers();
      cy.setupTestData(configFile, interactionType);
    });

    it('should show and hide opening image correctly', () => {
      // Remove click layer to enable interactions
      cy.removeClickLayer();

      // In the beginning, data-cy="opening-image" cannot be seen
      cy.get('[data-cy="opening-image"]').should('not.exist');

      // But the data-cy="speaker-icon" can be seen.
      cy.get('[data-cy="speaker-icon"]').should('be.visible');

      // After the audio is played
      cy.get('[data-cy="speaker-icon"]').click();
      // The player only listens for the end of the audio 50ms after it started (AudioService.getPlayFinished)
      cy.get('[data-cy="custom-audio-button"]').should('have.class', 'playing');
      cy.tick(50);
      cy.skipToEndOfAudio();

      // data-cy="opening-image" can be seen
      cy.get('[data-cy="opening-image"]').should('be.visible');

      // speaker-icon and continue-button can not be seen as long as opening-image can be seen
      cy.get('[data-cy="speaker-icon"]').should('not.exist');
      cy.get('[data-cy="continue-button"]').should('not.exist');

      // and stays presentationDurationMS milliseconds
      cy.get('@testData').then((data: any) => {
        const duration = data.openingImage?.presentationDurationMS || 0;
        // Without a duration the player ends the opening image right away (no timer)
        if (duration > 0) {
          cy.tick(duration - 1);
          cy.get('[data-cy="opening-image"]').should('be.visible');
          cy.tick(1);
        }
      });

      // then it can not be seen anymore
      cy.get('[data-cy="opening-image"]').should('not.exist');

      // after the opening-image is gone, it automatically plays the audioSource inside the mainAudio
      cy.get('[data-cy="custom-audio-button"]').should('have.class', 'playing');
    });
  });
}
