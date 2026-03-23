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
        place_value: ['0,1', '1,1', '1,2', '2,1']
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

    it('preserves the click-layer state when navigating between multiple units', () => {
      const firstTestFile = `${interactionType}_firstClickLayer_true_test`;
      const secondTestFile = `${interactionType}_firstClickLayer_true_second_test`;

      if (interactionType === 'find_on_image') {
        cy.log('Skipping test for find_on_image as it does not support firstClickLayer');
        return;
      }

      // 1. Load and resolve Unit A
      cy.log('First load Unit A and click on click-layer');
      cy.setupTestData(firstTestFile, interactionType);
      cy.get('[data-cy="click-layer"]').should('exist');
      cy.get('[data-cy="click-layer"]').click();
      cy.wait(1000);
      cy.get('[data-cy="click-layer"]').should('not.exist');
      cy.assertInteractionComponentVisible(interactionType);
      cy.wait(1000);

      // 2. Load and DO NOT resolve Unit B
      cy.log('First load Unit B and DO NOT click on click-layer');
      cy.setupTestData(secondTestFile, interactionType);
      cy.get('[data-cy="click-layer"]', { timeout: 10000 }).should('exist');

      // 3. Reload Unit A and verify it's still resolved
      cy.log('Second load Unit A and check click-layer DOES NOT exist');
      cy.setupTestData(firstTestFile, interactionType);
      cy.wait(1000);
      cy.get('[data-cy="click-layer"]').should('not.exist');
      // cy.assertInteractionComponentVisible(interactionType);

      // 4. Reload Unit B and verify it's still NOT resolved
      cy.log('Second load Unit B and check that click-layer exists');
      cy.setupTestData(secondTestFile, interactionType);
      cy.get('[data-cy="click-layer"]', { timeout: 10000 }).should('exist');
    });
  });
}
