export function testFormerStateFeatures(interactionType: string, defaultTestFile: string) {
  describe('Former State Persistence (Back and Forth Navigation)', () => {
    beforeEach(() => {
      cy.clearUnitStates();
    });

    it('preserves the answer when navigating away and coming back to multiple units', () => {
      const testFiles = [
        defaultTestFile,
        `${interactionType}_ribbonBars_true_test`,
        `${interactionType}_continueButtonShow_always_test`,
        `${interactionType}_continueButtonShow_onAnyResponse_test`
      ];

      const navigators: Record<string, any[]> = {
        find_on_image: ['100,150', '200,250', '300,100', '50,50'],
        write: ['a', 'b', 'c', 'd'],
        polygon_buttons: [0, 1, 2, 3],
        buttons: [0, 1, 2, 3],
        drop: [0, 1, 2, 3],
        // Response format: "{tens*10}_{ones}"
        place_value: ['0_1', '10_1', '10_2', '20_1'],
        equation: ['1', '2', '3', '4'],
        number_line: ['1', '2', '3', '4'],
        pyramid: ['1_2', '3_4', '5_6', '7_8'],
        meta: [0, 1, 2, 3],
      };

      const getNav = (idx: number) => {
        const navs = navigators[interactionType];
        return navs ? navs[idx] : undefined;
      };

      // 1. Load and interact with each unit sequentially
      testFiles.forEach((testFile, idx) => {
        cy.log('First load, setting up the test data for', testFile);
        cy.setupTestData(testFile, interactionType);
        cy.log('Checking if interaction component visible for', testFile);
        cy.assertInteractionComponentVisible(interactionType);
        cy.log('Applying standard scenerios for', testFile);
        cy.applyStandardScenarios(interactionType, getNav(idx));
      });

      // 2. Reload each unit and verify its state is correctly restored
      testFiles.forEach((testFile, idx) => {
        cy.log('Second load, setting up the test data for', testFile);
        cy.setupTestData(testFile, interactionType);
        cy.log('Asserting restored state for', testFile);
        cy.assertRestoredState(interactionType, getNav(idx));
      });
    });

    it('keeps the click layer hidden when coming back to a unit whose main audio was heard completely', () => {
      const firstTestFile = `${interactionType}_firstClickLayer_transparent_test`;
      const secondTestFile = `${interactionType}_firstClickLayer_transparent_second_test`;

      if (interactionType === 'find_on_image') {
        cy.log('Skipping test for find_on_image as it does not support firstClickLayer');
        return;
      }

      // 1. Load Unit A, click on the click layer and hear the main audio until the end
      cy.log('First load Unit A, click on click-layer and hear the main audio completely');
      cy.setupTestData(firstTestFile, interactionType);
      cy.get('[data-cy="click-layer"]').should('exist');
      cy.get('[data-cy="click-layer"]').click();
      cy.get('[data-cy="click-layer"]').should('not.exist');
      cy.assertInteractionComponentVisible(interactionType);
      // The click on the layer starts the main audio. The click layer stays hidden only once the main audio
      // was heard until the end (ResponsesService.setFormerState), a click alone is not enough.
      cy.waitUntilAudioIsFinishedPlaying();

      // 2. Load Unit B and DO NOT click on the click layer
      cy.log('First load Unit B and DO NOT click on click-layer');
      cy.setupTestData(secondTestFile, interactionType);
      cy.get('[data-cy="click-layer"]', { timeout: 10000 }).should('exist');

      // 3. Reload Unit A and verify that the click layer stays hidden
      cy.log('Second load Unit A and check click-layer DOES NOT exist');
      cy.setupTestData(firstTestFile, interactionType);
      // Wait until the unit is rendered, otherwise the click layer does not exist yet anyway.
      // (assertInteractionComponentVisible does not work here: Cypress considers the component not visible)
      cy.get('[data-cy="custom-audio-button"]').should('exist');
      cy.get('[data-cy="click-layer"]').should('not.exist');

      // 4. Reload Unit B and verify that the click layer is still shown
      cy.log('Second load Unit B and check that click-layer exists');
      cy.setupTestData(secondTestFile, interactionType);
      cy.get('[data-cy="click-layer"]', { timeout: 10000 }).should('exist');
    });
  });
}
