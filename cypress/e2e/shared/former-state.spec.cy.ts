export function testFormerStateFeatures(interactionType: string, defaultTestFile: string) {
  describe('Former State Persistence (Back and Forth Navigation)', () => {
    it('preserves the answer when navigating away and coming back to multiple units', () => {
      const secondTestFile = `${interactionType}_ribbonBars_true_test`;
      const thirdTestFile = `${interactionType}_continueButtonShow_always_test`;
      const fourthTestFile = `${interactionType}_continueButtonShow_onAnyResponse_test`;

      const capturedStates: any = {};

      // Helper function to load a unit, interact, and capture its state
      const loadAndCaptureState = (testFile: string, label: string, variableId?: string, navigator?: unknown) => {
        cy.setupTestDataWithPostMessageMock(testFile, interactionType);
        cy.get('@unitJson').then((unitJson: any) => {
          const unitData = JSON.parse(unitJson);
          if (variableId) {
            unitData.interactionParameters.variableId = variableId;
          }
          cy.sendMessageFromParent({
            type: 'vopStartCommand',
            sessionId: 'cypress-test-session',
            unitDefinition: JSON.stringify(unitData)
          });
          cy.assertInteractionComponentVisible(interactionType);
          cy.applyStandardScenarios(interactionType, navigator);
          cy.wait(1000);
          cy.get('@outgoingMessages').then((messages: any) => {
            const stateChangedMessages = messages
              .filter((m: any) => m.data.type === 'vopStateChangedNotification' && m.data.unitState);
            const lastMessage = stateChangedMessages[stateChangedMessages.length - 1];
            capturedStates[label] = {
              unitDefinition: JSON.stringify(unitData),
              unitState: lastMessage.data.unitState
            };
            // Clear outgoing messages for next unit
            cy.get('@outgoingMessages').then(m => { m.length = 0; });
          });
        });
      };

      // 1. Capture states for 4 different units
      // Use different navigators to ensure different responses are captured and restored
      const navigators: Record<string, any[]> = {
        find_on_image: ['100,150', '200,250', '300,100', '50,50'],
        write: ['a', 'b', 'c', 'd'],
        polygon_buttons: [0, 1, 2, 3],
        buttons: [0, 1, 2, 3],
        drop: [0, 1, 2, 3],
        place_value: ['0,1', '1,1', '1,2', '2,1']
      };

      const getNav = (idx: number) => {
        const navs = navigators[interactionType];
        return navs ? navs[idx] : undefined;
      };

      loadAndCaptureState(defaultTestFile, 'UnitA', 'UNIT_A', getNav(0));
      loadAndCaptureState(secondTestFile, 'UnitB', 'UNIT_B', getNav(1));
      loadAndCaptureState(thirdTestFile, 'UnitC', 'UNIT_C', getNav(2));
      loadAndCaptureState(fourthTestFile, 'UnitD', 'UNIT_D', getNav(3));

      // 2. Successively reload each unit and verify its state is correctly restored
      const verifyRestoration = (label: string, idx: number) => {
        cy.then(() => {
          cy.log(`Verifying restoration for ${label}`);
          const { unitDefinition, unitState } = capturedStates[label];
          cy.sendMessageFromParent({
            type: 'vopStartCommand',
            sessionId: 'cypress-test-session',
            unitDefinition: unitDefinition,
            unitState: unitState
          });
          cy.assertInteractionComponentVisible(interactionType);
          cy.wait(1000);
          // Pass the same navigator we used when capturing, so assertions can be specific per unit
          cy.assertRestoredState(interactionType, getNav(idx));
        });
      };

      verifyRestoration('UnitA', 0);
      verifyRestoration('UnitB', 1);
      verifyRestoration('UnitC', 2);
      verifyRestoration('UnitD', 3);
    });
  });
}
