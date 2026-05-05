import { testBaseFeatures } from "../shared/base-features.spec.cy";
import { testFormerStateFeatures } from "../shared/former-state.spec.cy";

describe('Interaction META Component', () => {
  const interactionType = 'meta';
  const defaultTestFile = 'meta_test';

  beforeEach(() => {
    cy.clearUnitStates();
  });

  it('renders 4 star icons when used alone as a component', () => {
    cy.setupTestData('meta_test.json', interactionType);
    cy.get('[data-cy="interaction-meta"]').should('exist');
    cy.get('[data-cy="continue-button"]').should('not.exist');
    cy.get('[data-cy^="button-wrapper-"]').should('have.length', 4);
    cy.get('[data-cy="button-wrapper-0"]').should('exist');
    cy.get('[data-cy="button-wrapper-1"]').should('exist');
    cy.get('[data-cy="button-wrapper-2"]').should('exist');
    cy.get('[data-cy="button-wrapper-3"]').should('exist');
  });

  // Test base features for the META interaction type
  testBaseFeatures(interactionType, defaultTestFile);
  // Test former state features for the META interaction type
  testFormerStateFeatures(interactionType, defaultTestFile);
});
