import { UnitDefinition } from '../../../projects/player/src/app/models/unit-definition';

export function firstAudioOptionsFeatures(interactionType: string) {
  describe(`First click layer Features for interactionType - ${interactionType}`, () => {
    let testData: UnitDefinition;

    it('should show and hide first click layer correctly when firstClickLayer: "TRANSPARENT"', () => {
      // Setup test data
      cy.setupTestData(`${interactionType}_firstClickLayer_transparent_test.json`, interactionType);

      // Click layer should exists
      cy.get('[data-cy="click-layer"]').should('exist');

      // Check that there is no backdrop-filter style in the .layer class
      cy.get('[data-cy="click-layer"]').should('have.css', 'backdrop-filter', 'none').and('not.have.class', 'blur').and('not.have.class', 'disabled');

      // Remove click layer to enable interactions
      cy.get('[data-cy="click-layer"]').click();

      // Click layer cannot be seen
      cy.get('[data-cy="click-layer"]').should('not.exist');

      // Interactions should be possible now
      cy.applyStandardScenarios(interactionType);
    });

    it('should show and hide first click layer correctly when firstClickLayer: "BLUR"', () => {
      // Setup test data
      cy.setupTestData(`${interactionType}_firstClickLayer_blur_test.json`, interactionType);

      // Click layer should exists
      cy.get('[data-cy="click-layer"]').should('exist');

      // in .layer.blur class has a backdrop-filter style
      cy.get('[data-cy="click-layer"]').should('have.class', 'blur').and('have.css', 'backdrop-filter');

      // Remove click layer to enable interactions
      cy.get('[data-cy="click-layer"]').click();

      // Click layer cannot be seen
      cy.get('[data-cy="click-layer"]').should('not.exist');

      // Interactions should be possible now
      cy.applyStandardScenarios(interactionType);
    });

    it('should show and hide first click layer correctly when firstClickLayer: "DISABLED"', () => {
      // Setup test data
      cy.setupTestData(`${interactionType}_firstClickLayer_disabled_test.json`, interactionType);

      // Click layer should exists
      cy.get('[data-cy="click-layer"]').should('exist');

      // .layer.disabled class has a backdrop-filter style
      cy.get('[data-cy="click-layer"]').should('have.class', 'disabled').and('have.css', 'backdrop-filter');

      // Remove click layer to enable interactions
      cy.get('[data-cy="click-layer"]').click();

      // Click layer cannot be seen
      cy.get('[data-cy="click-layer"]').should('not.exist');

      // Interactions should be possible now
      cy.applyStandardScenarios(interactionType);
    });

    it('should cover the audio button with the first click layer when firstClickLayer: "DISABLED"', () => {
      // Setup test data
      cy.setupTestData(`${interactionType}_firstClickLayer_disabled_test.json`, interactionType);

      // Click layer should exists
      cy.get('[data-cy="click-layer"]').should('exist');

      // Click layer sits above the audio button: clicking on the button hits the layer
      cy.get('[data-cy="custom-audio-button"]').then($button => {
        const rect = $button[0].getBoundingClientRect();
        cy.get('[data-cy="click-layer"]').click(rect.left + rect.width / 2, rect.top + rect.height / 2);
      });

      // Click layer cannot be seen and main audio is playing
      cy.get('[data-cy="click-layer"]').should('not.exist');
      cy.get('[data-cy="custom-audio-button"]').should('have.class', 'playing');
    });

    it('should show and hide first click layer correctly when firstClickLayer: "OFF"', () => {
      // Setup test data
      cy.setupTestData(`${interactionType}_firstClickLayer_off_test.json`, interactionType);

      // Click layer should not exists
      cy.get('[data-cy="click-layer"]').should('not.exist');

      // Interactions should be possible
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

    it('animates audio button when animateButton is KIND', () => {
      // The button starts moving after 5 seconds without interaction (setTimeout in AudioComponent),
      // the clock is faked so that the test does not have to wait for it
      cy.clock(Date.now(), ['setTimeout', 'clearTimeout']);

      // Set up test data
      cy.setupTestData(`${interactionType}_animateButton_kind_test.json`, interactionType);

      cy.get('@testData').then(data => {
        testData = data as unknown as UnitDefinition;

        if (testData.firstAudioOptions?.animateButton) {
          // The button should NOT be moving initially
          cy.get('[data-cy="custom-audio-button"]').should('exist').and('not.have.class', 'moving-button-kind');

          // Shortly before 5 seconds without interaction it is still not moving
          cy.tick(4900);
          cy.waitForRender();
          cy.get('[data-cy="custom-audio-button"]').should('not.have.class', 'moving-button-kind');

          // After 5 seconds without interaction (and before first interaction), it should start moving
          cy.tick(100);
          cy.get('[data-cy="custom-audio-button"]').should('have.class', 'moving-button-kind');
        }
      });
    });

    it('animates audio button when animateButton is BOLD', () => {
      // The button starts moving after 5 seconds without interaction (setTimeout in AudioComponent),
      // the clock is faked so that the test does not have to wait for it
      cy.clock(Date.now(), ['setTimeout', 'clearTimeout']);

      // Set up test data
      cy.setupTestData(`${interactionType}_animateButton_bold_test.json`, interactionType);

      cy.get('@testData').then(data => {
        testData = data as unknown as UnitDefinition;

        if (testData.firstAudioOptions?.animateButton) {
          // The button should NOT be moving initially
          cy.get('[data-cy="custom-audio-button"]').should('exist').and('not.have.class', 'moving-button-bold');

          // Shortly before 5 seconds without interaction it is still not moving
          cy.tick(4900);
          cy.waitForRender();
          cy.get('[data-cy="custom-audio-button"]').should('not.have.class', 'moving-button-bold');

          // After 5 seconds without interaction (and before first interaction), it should start moving
          cy.tick(100);
          cy.get('[data-cy="custom-audio-button"]').should('have.class', 'moving-button-bold');
        }
      });
    });
  });
}
