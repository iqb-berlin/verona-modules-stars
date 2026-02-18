import { UnitDefinition } from '../../../projects/player/src/app/models/unit-definition';

export function testFormerStateFeatures(interactionType: string, defaultTestFile: string) {
  describe('Former State Persistence (Back and Forth Navigation)', () => {
    it('preserves the answer when navigating away and coming back to the unit', () => {
      const otherTestFile = `interaction-${interactionType}/${interactionType}_ribbonBars_true_test`;

      // 1. Setup initial unit definition (Unit definition A)
      cy.setupTestDataWithPostMessageMock(defaultTestFile, interactionType);

      // Explicitly start Unit definition A
      cy.get('@unitJson').then((unitJson: any) => {
        cy.sendMessageFromParent({
          type: 'vopStartCommand',
          sessionId: 'cypress-test-session',
          unitDefinition: unitJson
        });
      });

      // Wait for Unit definition A to be ready
      cy.assertInteractionComponentVisible(interactionType);

      // 2. Perform interaction on Unit definition A
      cy.applyStandardScenarios(interactionType);
      cy.wait(1000); // Give some time for the response to be processed and message to be sent

      // 3. Capture the state from outgoing messages
      cy.get('@outgoingMessages').should('have.length.at.least', 1).then((messages: any) => {
        const stateChangedMessages = messages
          .filter((m: any) => m.data.type === 'vopStateChangedNotification' && m.data.unitState);
        const lastMessage = stateChangedMessages[stateChangedMessages.length - 1];
        const capturedUnitState = lastMessage.data.unitState;

        // 4. "Navigate away" by loading a completely different unit (Unit definition B)
        cy.fixture(otherTestFile).then(otherFile => {
          cy.sendMessageFromParent({
            type: 'vopStartCommand',
            sessionId: 'cypress-test-session',
            unitDefinition: JSON.stringify(otherFile)
          });
        });

        // Verify Unit definition B is loaded
        cy.assertInteractionComponentVisible(interactionType);
        cy.wait(1000);

        // 5. "Navigate back" to Unit definition A with the captured former state
        cy.get('@testData').then(data => {
          const testData = data as unknown as UnitDefinition;
          cy.sendMessageFromParent({
            type: 'vopStartCommand',
            sessionId: 'cypress-test-session',
            unitDefinition: JSON.stringify(testData),
            unitState: capturedUnitState
          });
        });

        // Debug: Log the captured state
        cy.log('Captured Unit State:', JSON.stringify(capturedUnitState));

        // Wait for Unit definition A to reload and be visible
        cy.assertInteractionComponentVisible(interactionType);

        // 6. Verify that the interaction in Unit definition A is restored correctly
        cy.assertRestoredState(interactionType);
      });
    });
  });
}
