import { testBaseFeatures } from '../shared/base-features.spec.cy';
import { testFormerStateFeatures } from '../shared/former-state.spec.cy';
import {
  InteractionNumberLineParams,
  UnitDefinition
} from '../../../projects/player/src/app/models/unit-definition';

describe('NUMBER_LINE Interaction E2E Tests', () => {
  const interactionType = 'number_line';
  const defaultTestFile = 'number_line_test';

  beforeEach(() => {
    cy.clearUnitStates();
  });

  const setupAndAssert = (file: string) => {
    cy.setupTestData(file, interactionType);
    cy.get('[data-cy="interaction-number-line"]').should('exist');
  };

  it('renders initial state correctly', () => {
    setupAndAssert(`${defaultTestFile}.json`);

    cy.get('@testData').then(data => {
      const testData = data as unknown as UnitDefinition;
      const params = testData.interactionParameters as InteractionNumberLineParams;
      const firstNumber = params.firstNumber;
      const lastNumber = params.lastNumber;
      const emptyNumber = params.emptyNumber;

      cy.get('[data-cy="interaction-number-line"]').within(() => {
        // Check if all numbers are rendered (either as label or tick)
        cy.get('[data-cy="number-line-item"]').should('have.length', lastNumber - firstNumber + 1);

        // Check if empty number box exists
        cy.get('[data-cy="empty-number-box"]').should('exist');
        cy.get('[data-cy="empty-number-text"]').invoke('text').then((text) => {
          expect(text.trim()).to.equal('');
        });
      });
    });
  });

  it('handles keyboard interactions correctly', () => {
    setupAndAssert(`${defaultTestFile}.json`);

    // Type "1"
    cy.get('[data-cy="keyboard-button-1"]').click();
    cy.get('[data-cy="empty-number-text"]').invoke('text').then((text) => {
      expect(text.trim()).to.equal('1');
    });

    // Type "2"
    cy.get('[data-cy="keyboard-button-2"]').click();
    cy.get('[data-cy="empty-number-text"]').invoke('text').then((text) => {
      expect(text.trim()).to.equal('12');
    });

    // Try to type "3" (max length is 2)
    cy.get('[data-cy="keyboard-button-3"]').should('be.disabled');

    // Backspace
    cy.get('[data-cy="backspace-button"]').click();
    cy.get('[data-cy="empty-number-text"]').invoke('text').then((text) => {
      expect(text.trim()).to.equal('1');
    });

    // Backspace again
    cy.get('[data-cy="backspace-button"]').click();
    cy.get('[data-cy="empty-number-text"]').invoke('text').then((text) => {
      expect(text.trim()).to.equal('');
    });
  });

  it('renders the correct UI based on style', () => {
    // 1. Check style: WAVE
    cy.setupTestData(defaultTestFile, interactionType);
    cy.get('[data-cy="interaction-number-line"]').within(() => {
        // In WAVE mode, we should have rects for labels
        cy.get('[data-cy="number-box"]').should('exist');
        // And no special ruler markers
        cy.get('[data-cy="ruler-tick-mark"]').should('not.exist');
    });

    // 2. Check style: RULER
    cy.setupTestData('number_line_ruler_test', interactionType);
    cy.get('[data-cy="interaction-number-line"]').within(() => {
        // In RULER mode, we should have ruler tick marks
        cy.get('[data-cy="ruler-tick-mark"]').should('exist');
        // And no standard boxes for labels (except maybe the empty one)
        cy.get('[data-cy="number-box"]').should('not.exist');
        // Should have small ticks for intermediate numbers
        cy.get('[data-cy="tick-mark"]').should('exist');
    });
  });

  // Test base features for the NUMBER_LINE interaction type
  testBaseFeatures(interactionType, defaultTestFile);
  // Test former state features for the NUMBER_LINE interaction type
  testFormerStateFeatures(interactionType, defaultTestFile);
});
