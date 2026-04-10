import { testBaseFeatures } from '../shared/base-features.spec.cy';
import { testFormerStateFeatures } from '../shared/former-state.spec.cy';
import { testKeyboardInteractions } from '../shared/keyboard-interactions.spec.cy';
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
      const firstNumber = params.firstNumber!;
      const lastNumber = params.lastNumber!;

      cy.get('[data-cy="interaction-number-line"]').within(() => {
        // Check if all numbers are rendered (either as label or tick)
        cy.get('[data-cy="number-line-item"]').should('have.length', lastNumber - firstNumber + 1);

        // Check if empty number-box-wave exists (Default value for style is WAVE)
        cy.get('[data-cy="number-input-box-wave"]').should('exist');
        cy.get('[data-cy="number-input-text"]').invoke('text').then((text) => {
          expect(text.trim()).to.equal('');
        });
      });
    });
  });

  it('renders the correct UI based on style', () => {
    // 1. Check style: WAVE
    cy.setupTestData(defaultTestFile, interactionType);
    cy.get('[data-cy="interaction-number-line"]').within(() => {
      // In WAVE mode, we should have rects for labels
      cy.get('[data-cy="number-input-box-wave"]').should('exist');
      // And no special ruler markers
      cy.get('[data-cy="ruler-tick-mark"]').should('not.exist');
    });

    // 2. Check style: RULER
    cy.setupTestData('number_line_ruler_test', interactionType);
    cy.get('[data-cy="interaction-number-line"]').within(() => {
      // In RULER mode, we should have ruler tick marks
      cy.get('[data-cy="ruler-tick-mark"]').should('exist');
      // Should have small ticks for intermediate numbers
      cy.get('[data-cy="ruler-blue-input-line"]').should('exist');
    });

    // 2. Check style: BLOCK
    cy.setupTestData('number_line_block_test', interactionType);
    cy.get('[data-cy="interaction-number-line"]').within(() => {
      cy.get('@testData').then(data => {
        const testData = data as unknown as UnitDefinition;
        const params = testData.interactionParameters as InteractionNumberLineParams;
        const leadingCount = params.leadingNumbers?.length || 0;
        const trailingCount = params.trailingNumbers?.length || 0;
        const inputCount = 1; // Always 1 empty block in the middle for BLOCK style

        // check that leadingNumbers.length+trailingNumbers.length+1 of number-block exists
        cy.get('[data-cy="number-line-item-block"]').should('have.length', leadingCount + trailingCount + inputCount);

        // Check for specific block types
        cy.get('[data-cy="number-block"]').should('have.length', leadingCount + trailingCount);
        cy.get('[data-cy="number-input-box-block"]').should('exist');
      });
    });
  });

  it('renders descending ranges correctly', () => {
    const testFiles = [
      'number_line_wave_descending_test',
      'number_line_block_descending_test',
      'number_line_ruler_descending_test'
    ];

    testFiles.forEach((file) => {
      cy.log('Setting up the test data for', file);
      setupAndAssert(file);

      cy.get('@testData').then(data => {
        const testData = data as unknown as UnitDefinition;
        const params = testData.interactionParameters as InteractionNumberLineParams;

        if (params.style === 'BLOCK') {
          const leadingCount = params.leadingNumbers?.length || 0;
          const trailingCount = params.trailingNumbers?.length || 0;
          const inputCount = 1;
          cy.get('[data-cy="interaction-number-line"]').within(() => {
            cy.get('[data-cy="number-line-item-block"]').should('have.length', leadingCount + trailingCount + inputCount);
          });
        } else {
          const firstNumber = params.firstNumber!;
          const lastNumber = params.lastNumber!;
          const expectedCount = Math.abs(lastNumber - firstNumber) + 1;

          cy.get('[data-cy="interaction-number-line"]').within(() => {
            cy.get('[data-cy="number-line-item"]').should('have.length', expectedCount);
          });
        }
      });
    });
  });

  it('disables input when numberInput is missing in WAVE style', () => {
    setupAndAssert('number_line_no_input_test');

    cy.get('[data-cy="interaction-number-line"]').within(() => {
      // Input box should not exist if numberInput is missing
      cy.get('[data-cy="number-input-box-wave"]').should('not.exist');
    });

    // Keyboard buttons should be disabled.
    cy.get('[data-cy^="keyboard-button-"]').first().should('be.disabled');
  });

  it('renders WAVE style with leadingNumbers and trailingNumbers correctly', () => {
    setupAndAssert('number_line_wave_with_leadingNumbers_trailingNumbers_test');

    cy.get('@testData').then(data => {
      const testData = data as unknown as UnitDefinition;
      const params = testData.interactionParameters as InteractionNumberLineParams;
      const leadingCount = params.leadingNumbers?.length || 0;
      const trailingCount = params.trailingNumbers?.length || 0;
      const expectedTotalItems = leadingCount + trailingCount + 1; // +1 for the input field

      cy.get('[data-cy="interaction-number-line"]').within(() => {
        cy.get('[data-cy="number-line-item"]').should('have.length', expectedTotalItems);
        cy.get('[data-cy="number-input-box-wave"]').should('exist');
        cy.get('[data-cy="number-box"]').should('have.length', leadingCount + trailingCount);
      });
    });

    // Verify input works
    cy.get('[data-cy="keyboard-button-9"]').click();
    cy.get('[data-cy="number-input-text"]').should('contain', '9');
  });

  it('disables input when RULER style is used with leadingNumbers/trailingNumbers but no numberInput', () => {
    setupAndAssert('number_line_ruler_with_leading_trailing_test');

    cy.get('[data-cy="interaction-number-line"]').within(() => {
      // number-line-item should not exist because firstNumber/lastNumber are missing and it's RULER
      cy.get('[data-cy="number-line-item"]').should('not.exist');
    });

    // Keyboard buttons should be disabled.
    cy.get('[data-cy^="keyboard-button-"]').first().should('be.disabled');
  });

  // Test base features for the NUMBER_LINE interaction type
  testBaseFeatures(interactionType, defaultTestFile);
  // Test former state features for the NUMBER_LINE interaction type
  testFormerStateFeatures(interactionType, defaultTestFile);
  // Test keyboard interactions
  testKeyboardInteractions(interactionType, defaultTestFile);
});
