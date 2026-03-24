import { testMainAudioFeatures } from '../shared/main-audio.spec.cy';
import { testRibbonBars } from '../shared/ribbon-bar.spec.cy';
import { firstAudioOptionsFeatures } from '../shared/first-audio-options.spec.cy';

describe('Interaction IMAGE_ONLY Component', () => {
  const interactionType = 'image_only';
  const defaultTestFile = 'image_only_test';

  beforeEach(() => {
    cy.clearUnitStates();
    // Set up test data
    cy.setupTestData(defaultTestFile, interactionType);
  });

  it('displays imageSource', () => {
    // Check if the imageSource is displayed
    cy.get('[data-cy="stimulus-image"]')
      .should('have.attr', 'src')
      .and($src => expect($src).to.not.be.empty);
  });

  it('shows the continue button after the main audio is complete', () => {
    // Continue button should NOT exist initially
    cy.assertContinueButtonNotExists();

    // Start the audio
    cy.get('[data-cy="speaker-icon"]').click();

    // Continue button should NOT exist after clicking the video button
    cy.assertContinueButtonNotExists();

    // Wait for the audio to finish
    cy.waitUntilAudioIsFinishedPlaying();

    // Continue button should appear
    cy.assertContinueButtonExistsAndVisible();
  });

  // Test base features for the IMAGE_ONLY interaction type
  describe('Shared behaviors', () => {
    firstAudioOptionsFeatures(interactionType, `${interactionType}_firstClickLayer_true_test`);
    testMainAudioFeatures(interactionType, defaultTestFile);
    testRibbonBars(interactionType, `${interactionType}_ribbonBars_true_test`);
  });
});
