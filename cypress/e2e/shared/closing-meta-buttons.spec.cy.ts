import { UnitDefinition } from "../../../projects/player/src/app/models/unit-definition";

export function testClosingMetaButtons(interactionType: string) {

  describe(`Closing Meta Buttons Features for interactionType - ${interactionType}`, () => {
    beforeEach(() => {
      cy.clearUnitStates();
    });

    // const loadDefaultTestFile = () => {
    //   cy.setupTestData(configFile, interactionType);
    //   return cy.get('@testData') as unknown as Cypress.Chainable<UnitDefinition>;
    // };

    it('hides the continue button when triggerNavigationOnSelect is true and triggers navigation on select', () => {
      const configFile = `${interactionType}_with_closingMetaButtons_triggerNavigationOnSelect_true_test`;
      cy.setupTestDataWithPostMessageMock(configFile, interactionType);
      cy.loadUnit(configFile);
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

    it('shows the continue button when triggerNavigationOnSelect is false', () => {
      const configFile = `${interactionType}_with_closingMetaButtons_triggerNavigationOnSelect_false_test`;
      // cy.setupTestDataWithPostMessageMock(configFile, interactionType);
      cy.loadUnit(configFile);
      cy.get('[data-cy="continue-button"]').should('exist').and('be.visible');
      cy.get('[data-cy="continue-button"]').click();
      cy.get('[data-cy="interaction-meta"]').should('exist');
      cy.get('[data-cy="continue-button"]').should('exist').and('be.visible');
    });
  });
}
