import { testBaseFeatures } from '../shared/base-features.spec.cy';
import { testFormerStateFeatures } from '../shared/former-state.spec.cy';
import { testKeyboardInteractions } from '../shared/keyboard-interactions.spec.cy';
import {
  InteractionPyramidParams,
  UnitDefinition
} from '../../../projects/player/src/app/models/unit-definition';

describe('PYRAMID Interaction E2E Tests', () => {
  const interactionType = 'pyramid';
  const defaultTestFile = 'pyramid_test';

  beforeEach(() => {
    cy.clearUnitStates();
  });

  const setupAndAssert = (file: string) => {
    cy.setupTestData(file, interactionType);
    cy.get('[data-cy="interaction-pyramid"]').should('exist');
  };

  it('renders initial state correctly', () => {
    setupAndAssert(`${defaultTestFile}.json`);

    cy.get('@testData').then(data => {
      const testData = data as unknown as UnitDefinition;
      const params = testData.interactionParameters as InteractionPyramidParams;
      const topNumber = params.topNumber ?? 0;
      const example = params.example ?? {};

      cy.get('[data-cy="interaction-pyramid"]').within(() => {
        // Check if there is example object, if there is example object, it should display the parameters
      });
    });
  });

  it('renders the interactive pyramid in the middle if there is no example', () => {
  });

  // Test base features for the PYRAMID interaction type
  testBaseFeatures(interactionType, defaultTestFile);
  // Test former state features for the PYRAMID interaction type
  testFormerStateFeatures(interactionType, defaultTestFile);
  // Test keyboard interactions
  testKeyboardInteractions(interactionType, defaultTestFile);
});
