import { UnitDefinition } from '../../../projects/player/src/app/models/unit-definition';
import { MockMessage } from '../../support/utils';

export function testClosingMetaButtons(interactionType: string) {

  describe(`Closing Meta Buttons Features for interactionType - ${interactionType}`, () => {
    beforeEach(() => {
      cy.clearUnitStates();
    });

    it('hides the continue button when triggerNavigationOnSelect is true and triggers navigation on select', () => {
      const configFile = `${interactionType}_with_closingMetaButtons_triggerNavigationOnSelect_true_test.json`;
      cy.setupTestDataWithPostMessageMock(configFile, interactionType);
      cy.loadUnit(`interaction-${interactionType}/${configFile}`);
      // Interact with the component
      cy.applyStandardScenarios(interactionType);
      cy.get('[data-cy="continue-button"]').should('exist');
      cy.get('[data-cy="continue-button"]').click();
      cy.get('[data-cy="interaction-meta"]').should('exist');
      cy.get('[data-cy="continue-button"]').should('not.exist');

      // Click on a star (e.g., the 3rd one)
      cy.get('[data-cy="button-2"]').click();

      // Check if navigation request was sent
      cy.get('@outgoingMessages').should('contain.deep', {
        data: {
          type: 'vopUnitNavigationRequestedNotification',
          sessionId: 'cypress-test-session',
          target: 'next'
        },
        origin: '*'
      });
    });

    it('shows the continue button after a meta button is selected when triggerNavigationOnSelect is false', () => {
      const configFile = `${interactionType}_with_closingMetaButtons_triggerNavigationOnSelect_false_test.json`;
      cy.setupTestDataWithPostMessageMock(configFile, interactionType);
      cy.loadUnit(`interaction-${interactionType}/${configFile}`);
      // Interact with the component
      cy.applyStandardScenarios(interactionType);
      cy.get('[data-cy="continue-button"]').should('exist').and('be.visible');
      cy.get('[data-cy="continue-button"]').click();
      cy.get('[data-cy="interaction-meta"]').should('exist');
      // Continue button should be hidden initially
      cy.get('[data-cy="continue-button"]').should('not.exist');

      // Click on a meta button
      cy.get('[data-cy="button-2"]').click();

      // Now continue button should be visible
      cy.get('[data-cy="continue-button"]').should('exist').and('be.visible');
    });

    it('should not show the speaker icon when closing meta buttons has no audio source', () => {
      const configFile = `${interactionType}_with_closingMetaButtons_without_audioSource_test.json`;
      cy.setupTestDataWithPostMessageMock(configFile, interactionType);
      cy.loadUnit(`interaction-${interactionType}/${configFile}`);
      cy.applyStandardScenarios(interactionType);

      cy.get('[data-cy="continue-button"]').click();
      cy.get('[data-cy="interaction-meta"]').should('exist');
      cy.get('[data-cy="speaker-icon"]').should('not.exist');
    });

    it('should play the audio automatically when autoPlay is true', () => {
      const configFile = `${interactionType}_with_closingMetaButtons_with_audioSource_autoPlay_true_test.json`;
      cy.setupTestDataWithPostMessageMock(configFile, interactionType);
      cy.loadUnit(`interaction-${interactionType}/${configFile}`);
      cy.applyStandardScenarios(interactionType);

      cy.get('[data-cy="continue-button"]').click();
      cy.get('[data-cy="interaction-meta"]').should('exist');

      // The speaker icon should indicate playing state
      cy.get('[data-cy="custom-audio-button"]').should('have.class', 'playing');
    });

    it('should not start the audio automatically and should start only when clicked on the speaker icon when autoPlay is false', () => {
      const configFile = `${interactionType}_with_closingMetaButtons_with_audioSource_autoPlay_false_test.json`;
      cy.setupTestDataWithPostMessageMock(configFile, interactionType);
      cy.loadUnit(`interaction-${interactionType}/${configFile}`);
      cy.applyStandardScenarios(interactionType);

      cy.get('[data-cy="continue-button"]').click();
      cy.get('[data-cy="interaction-meta"]').should('exist');

      // Speaker icon should be visible but not playing
      cy.get('[data-cy="speaker-icon"]').should('exist');
      cy.get('[data-cy="custom-audio-button"]').should('not.have.class', 'playing');

      // Click to play
      cy.get('[data-cy="custom-audio-button"]').click();
      cy.get('[data-cy="custom-audio-button"]').should('have.class', 'playing');
    });

    it('derives and codes variableIdMetaOutcome from reference score and selected meta button', () => {
      const configFile = `${interactionType}_with_closingMetaButtons_with_variableInfo_test.json`;

      cy.setupTestDataWithPostMessageMock(configFile, interactionType);
      cy.loadUnit(`interaction-${interactionType}/${configFile}`);

      cy.get('@testData').then(data => {
        const dataToCheck = data as unknown as UnitDefinition;
        const metaOutcomeRule = dataToCheck.variableInfo?.find(v => v.variableId === 'META_OUTCOME')
          ?.codes?.find(c => c.code === 1 && c.score === 1);
        if (!metaOutcomeRule) {
          throw new Error(`No META_OUTCOME success rule in ${configFile}`);
        }

        const expectedValue = metaOutcomeRule.parameter;
        const metaSelectionParam = expectedValue.split('_')[1] ?? '4';
        const metaButtonIndex = Number(metaSelectionParam) - 1;

        cy.applyCorrectAnswerScenarios(interactionType, dataToCheck);
        cy.get('[data-cy="continue-button"]').should('exist').click();
        cy.get('[data-cy="interaction-meta"]').should('exist');
        cy.get(`[data-cy="button-${metaButtonIndex}"]`).click();

        cy.get('@outgoingMessages')
          .then(messages => {
            const arr = messages as unknown as MockMessage[];
            const stateMessages = arr.filter(msg => msg.data.type === 'vopStateChangedNotification');

            const latestMessage = stateMessages[stateMessages.length - 1];
            if (!latestMessage?.data?.unitState) {
              throw new Error('Latest message or unitState is undefined');
            }

            cy.parseDataPartsResponses(latestMessage.data.unitState.dataParts as Record<string, unknown>)
              .then(parsedResponsesArrays => {
                const hasMetaOutcome = parsedResponsesArrays.some(responses =>
                  responses.some(response =>
                    response.id === 'META_OUTCOME' &&
                    response.status === 'CODING_COMPLETE' &&
                    response.value === expectedValue &&
                    response.code === 1 &&
                    response.score === 1
                  )
                );

                expect(
                  hasMetaOutcome,
                  `META_OUTCOME should be CODING_COMPLETE with value ${expectedValue}, code 1, score 1`
                )
                  .to
                  .equal(true);
              });
          });
      });
    });
  });
}
