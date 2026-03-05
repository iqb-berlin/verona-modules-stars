import {
  UnitDefinition, InteractionPolygonButtonsParams
} from '../../../projects/player/src/app/models/unit-definition';
import { testBaseFeatures } from '../shared/base-features.spec.cy';
import { testFormerStateFeatures } from '../shared/former-state.spec.cy';

describe('Interaction POLYGON BUTTONS Component', () => {
  const interactionType = 'polygon_buttons';
  const defaultTestFile = 'polygon_buttons_test';

  beforeEach(() => {
    cy.clearUnitStates();
  });

  // Small helpers
  const assertPolygonExists = (index = 0) => {
    cy.get(`[data-cy="polygon-${index}"]`).should('exist');
  };

  const setupAndAssert = (file: string) => {
    cy.setupTestData(file, interactionType);
    assertPolygonExists();
  };

  describe('Rendering', () => {
    it('renders the correct number of polygon options', () => {
      setupAndAssert(defaultTestFile);

      cy.get('@testData').then(data => {
        const testData = data as unknown as UnitDefinition;
        const params = testData.interactionParameters as InteractionPolygonButtonsParams;
        const expected = params.options?.length ?? 0;
        // Ensure we only count polygons inside the current container instance
        cy.get('[data-cy="polygon-buttons-container"]').should('have.length', 1);
        cy.get('[data-cy="polygon-buttons-container"]').within(() => {
          cy.get('[data-cy^="polygon-"]').should('have.length', expected);
        });
      });
    });
  });

  describe('Selection behavior', () => {
    it('single-select: selects only the clicked polygon at a time', () => {
      // single-select fixture
      setupAndAssert(defaultTestFile);

      // Click first polygon
      cy.get('[data-cy="polygon-0"]').click();
      cy.get('[data-cy="polygon-0"]').should('have.class', 'clicked');

      // Click second polygon, first should unselect
      cy.get('[data-cy="polygon-1"]').click();
      cy.get('[data-cy="polygon-0"]').should('not.have.class', 'clicked');
      cy.get('[data-cy="polygon-1"]').should('have.class', 'clicked');
    });

    it('multi-select: toggles clicked polygons independently', () => {
      // multi-select fixture
      setupAndAssert('polygon_buttons_multiselect_test.json');

      // Click first and second polygons
      cy.get('[data-cy="polygon-0"]').click();
      cy.get('[data-cy="polygon-1"]').click();
      cy.get('[data-cy="polygon-0"]').should('have.class', 'clicked');
      cy.get('[data-cy="polygon-1"]').should('have.class', 'clicked');

      // Click first again to toggle off
      cy.get('[data-cy="polygon-0"]').click();
      cy.get('[data-cy="polygon-0"]').should('not.have.class', 'clicked');
      cy.get('[data-cy="polygon-1"]').should('have.class', 'clicked');
    });
  });

  // Test base features for the POLYGON_BUTTONS interaction type
  testBaseFeatures(interactionType, defaultTestFile);
  // Test former state features for the POLYGON_BUTTONS interaction type
  testFormerStateFeatures(interactionType, defaultTestFile);
});
