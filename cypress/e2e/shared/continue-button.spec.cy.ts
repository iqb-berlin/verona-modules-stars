import { UnitDefinition } from '../../../projects/player/src/app/models/unit-definition';

export function testContinueButtonFeatures(interactionType: string) {
  describe(`Continue Button Features for interactionType - ${interactionType}`, () => {
    const testSetup = (continueButtonShow: string, file: string) => {
      cy.setupTestData(file, interactionType);
      cy.get('@testData').then(data => {
        const dataToCheck = data as unknown as UnitDefinition;
        // Remove click layer if it exists
        if (dataToCheck.firstAudioOptions?.firstClickLayer && dataToCheck.firstAudioOptions.firstClickLayer !== 'OFF') {
          cy.removeClickLayer();
        }
      });
    };

    const assertContinueButtonClickTriggersNavigation = () => {
      // Spy on postMessage of the parent window (used by VeronaPostService)
      cy.window().then(window => {
        // In Cypress E2E, AUT runs in an iframe; Verona posts to win.parent
        const target = window.parent || window;
        cy.spy(target, 'postMessage').as('postMessage');
      });

      cy.clickContinueButton();

      cy.wait(600);

      cy.get('@postMessage').should('have.been.called');
      cy.get('@postMessage').should('have.been.calledWithMatch', Cypress.sinon.match({
        type: 'vopUnitNavigationRequestedNotification',
        target: 'next'
      }));
    };

    const continueButtonConfigs = [
      { continueButtonShow: 'NO', file: `${interactionType}_continueButtonShow_no_test.json` },
      { continueButtonShow: 'ALWAYS', file: `${interactionType}_continueButtonShow_always_test.json` }
    ];

    if (interactionType === 'video') {
      continueButtonConfigs.push({
        continueButtonShow: 'ON_VIDEO_COMPLETE',
        file: `${interactionType}_continueButtonShow_onVideoComplete_test.json`
      });
    }

    if (interactionType !== 'video') {
      continueButtonConfigs.push(
        { continueButtonShow: 'ON_ANY_RESPONSE', file: `${interactionType}_continueButtonShow_onAnyResponse_test.json` },
        {
          continueButtonShow: 'ON_RESPONSES_COMPLETE',
          file: `${interactionType}_continueButtonShow_onResponsesComplete_test.json`
        },
        {
          continueButtonShow: 'ON_MAIN_AUDIO_COMPLETE',
          file: `${interactionType}_continueButtonShow_onMainAudioComplete_test.json`
        }
      );
    }

    continueButtonConfigs.forEach(({ continueButtonShow, file }) => {
      if (continueButtonShow === 'ON_ANY_RESPONSE') {
        // eslint-disable-next-line max-len
        it('shows continue button after any response is clicked when continueButtonShow === ON_ANY_RESPONSE ', () => {
          testSetup(continueButtonShow, file);

          // Continue button should not exist initially
          cy.assertContinueButtonNotExists();

          cy.applyStandardScenarios(interactionType);

          // Continue button should appear
          cy.assertContinueButtonExistsAndVisible();

          assertContinueButtonClickTriggersNavigation();
        });
      }
      if (continueButtonShow === 'NO') {
        it('does not show continue button when continueButtonShow === NO', () => {
          testSetup(continueButtonShow, file);

          // Continue button should not exist initially
          cy.assertContinueButtonNotExists();

          cy.applyStandardScenarios(interactionType);

          // Continue button should not exist after clicking any button
          cy.assertContinueButtonNotExists();
        });
      }
      if (continueButtonShow === 'ON_RESPONSES_COMPLETE') {
        // eslint-disable-next-line max-len
        it('shows continue button after all responses are clicked when continueButtonShow === ON_RESPONSES_COMPLETE', () => {
          // Setup test data
          testSetup(continueButtonShow, file);

          // Continue button should not exist initially
          cy.assertContinueButtonNotExists();

          // Click wrong answers
          cy.applyStandardScenarios(interactionType);

          // Continue button should still not exist
          cy.assertContinueButtonNotExists();

          // Get the test data
          cy.get('@testData').then(data => {
            const dataToCheck = data as unknown as UnitDefinition;
            // Click correct answers
            cy.applyCorrectAnswerScenarios(interactionType, dataToCheck);
          });

          // Continue button should appear
          cy.assertContinueButtonExistsAndVisible();

          assertContinueButtonClickTriggersNavigation();
        });
      }
      if (continueButtonShow === 'ALWAYS') {
        it('shows continue button immediately when continueButtonShow === ALWAYS', () => {
          testSetup(continueButtonShow, file);
          // Default value: ALWAYS Continue button should be visible immediately
          cy.assertContinueButtonExistsAndVisible();

          assertContinueButtonClickTriggersNavigation();
        });
      }
      // Do not test ON_MAIN_AUDIO_COMPLETE for find_on_image as there is no audio for this interaction type
      if (continueButtonShow === 'ON_MAIN_AUDIO_COMPLETE' && interactionType !== 'find_on_image') {
        // eslint-disable-next-line max-len
        it('shows continue button after main audio is complete when continueButtonShow === ON_MAIN_AUDIO_COMPLETE', () => {
          testSetup(continueButtonShow, file);
          // Continue button should not exist initially
          cy.assertContinueButtonNotExists();

          // Click wrong answers
          cy.applyStandardScenarios(interactionType);

          // Continue button should not exist after clicking any button
          cy.assertContinueButtonNotExists();

          // Click audio button
          cy.get('[data-cy="speaker-icon"]').click();

          // Get the test data
          cy.get('@testData').then(data => {
            const dataToCheck = data as unknown as UnitDefinition;
            // Click correct answers
            cy.applyCorrectAnswerScenarios(interactionType, dataToCheck);
          });

          // Continue button still should not exist
          cy.assertContinueButtonNotExists();

          // Wait for audio to complete
          cy.waitUntilAudioIsFinishedPlaying();

          // Continue button should appear
          cy.assertContinueButtonExistsAndVisible();

          assertContinueButtonClickTriggersNavigation();
        });
      }
      if (continueButtonShow === 'ON_VIDEO_COMPLETE') {
        // eslint-disable-next-line max-len
        it('shows continue button after video is complete when continueButtonShow === ON_VIDEO_COMPLETE', () => {
          testSetup(continueButtonShow, file);
          // Continue button should not exist initially
          cy.assertContinueButtonNotExists();

          // Start the video
          cy.get('[data-cy="video-play-button"]').click({ force: true });

          // Continue button should not exist after clicking the video button
          cy.assertContinueButtonNotExists();

          // Play it faster for the test purposes
          cy.get('[data-cy="video-player"]').then($video => {
            const videoElement = $video[0] as HTMLVideoElement;
            // Skip to 0.1 seconds before the end
            videoElement.currentTime = videoElement.duration - 0.1;
          });

          // Continue button should appear
          cy.assertContinueButtonExistsAndVisible();

          assertContinueButtonClickTriggersNavigation();
        });
      }
    });
  });
}
