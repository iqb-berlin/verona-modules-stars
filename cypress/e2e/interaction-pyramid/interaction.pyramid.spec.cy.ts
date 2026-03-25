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
      const interactivePyramidTopNumber = params.topNumber ?? 0
      const example = params.example;
      const exampleTopValue = example?.topNumber;
      const exampleBottomLeftValue = example?.bottomLeftNumber;
      const exampleBottomRightValue = example?.bottomRightNumber;

      cy.get('[data-cy="interaction-pyramid"]').within(() => {
        // Example pyramid
        if (example) {
          cy.get('[data-cy="example-pyramid"]').should('be.visible');
          cy.get('[data-cy="example-pyramid-top-value"]').should('contain', exampleTopValue);
          cy.get('[data-cy="example-pyramid-bottom-left-value"]').should('contain', exampleBottomLeftValue);
          cy.get('[data-cy="example-pyramid-bottom-right-value"]').should('contain', exampleBottomRightValue);
        } else {
          cy.get('[data-cy="example-pyramid"]').should('not.exist');
        }

        // Interactive pyramid
        cy.get('[data-cy="interactive-pyramid"]').should('be.visible');
        cy.get('[data-cy="interactive-pyramid-top-value"]').should('contain', interactivePyramidTopNumber);
        cy.get('[data-cy="interactive-pyramid-input-left"]').should('be.visible');
        cy.get('[data-cy="interactive-pyramid-input-right"]').should('be.visible');

        // Keyboard
        cy.get('[data-cy="keyboard-wrapper"]').should('be.visible');
        for (let i = 0; i <= 9; i++) {
          cy.get(`[data-cy="keyboard-button-${i}"]`).should('be.visible');
        }
        cy.get('[data-cy="backspace-button"]').should('be.visible');
      });
    });
  });

  it('renders the interactive pyramid if there is no example', () => {
    setupAndAssert('pyramid_without_example_test.json');
    cy.wait(500);
    cy.get('[data-cy="example-pyramid"]').should('not.exist');
    cy.get('[data-cy="interactive-pyramid"]').should('be.visible');
  });

  it('allows entering numbers into both input fields', () => {
    setupAndAssert(`${defaultTestFile}.json`);

    // Initially LEFT is selected by default in interaction-pyramid.component.ts
    cy.get('[data-cy="interactive-pyramid-input-left"]').click().should('have.class', 'selected');

    cy.get('[data-cy="keyboard-button-1"]').click();
    cy.get('[data-cy="keyboard-button-2"]').click();
    cy.get('[data-cy="interactive-pyramid-input-left"]').invoke('text').then(text => expect(text.trim()).to.equal('12'));

    cy.get('[data-cy="interactive-pyramid-input-right"]').click().should('have.class', 'selected');
    cy.get('[data-cy="keyboard-button-3"]').click();
    cy.get('[data-cy="keyboard-button-4"]').click();
    cy.get('[data-cy="interactive-pyramid-input-right"]').invoke('text').then(text => expect(text.trim()).to.equal('34'));
  });

  it('handles backspace correctly', () => {
    setupAndAssert(`${defaultTestFile}.json`);

    cy.get('[data-cy="interactive-pyramid-input-left"]').click();
    cy.get('[data-cy="keyboard-button-5"]').click();
    cy.get('[data-cy="keyboard-button-6"]').click();
    cy.get('[data-cy="interactive-pyramid-input-left"]').invoke('text').then(text => expect(text.trim()).to.equal('56'));

    cy.get('[data-cy="backspace-button"]').click();
    cy.get('[data-cy="interactive-pyramid-input-left"]').invoke('text').then(text => expect(text.trim()).to.equal('5'));

    cy.get('[data-cy="backspace-button"]').click();
    cy.get('[data-cy="interactive-pyramid-input-left"]').invoke('text').then(text => expect(text.trim()).to.equal(''));
  });

  it('limits input to 2 digits per field', () => {
    setupAndAssert(`${defaultTestFile}.json`);

    cy.get('[data-cy="interactive-pyramid-input-left"]').click();
    cy.get('[data-cy="keyboard-button-1"]').click();
    cy.get('[data-cy="keyboard-button-2"]').click();
    cy.get('[data-cy="interactive-pyramid-input-left"]').invoke('text').then(text => expect(text.trim()).to.equal('12'));

    // Button should be disabled now
    cy.get('[data-cy="keyboard-button-3"]').should('be.disabled');

    // Trying to click a button that is disabled might not add anything
    // Even if we force it, it should still be '12' because of logic in component.ts
    cy.get('[data-cy="keyboard-button-3"]').click({ force: true });
    cy.get('[data-cy="interactive-pyramid-input-left"]').invoke('text').then(text => expect(text.trim()).to.equal('12'));
  });

  // Test base features for the PYRAMID interaction type
  testBaseFeatures(interactionType, defaultTestFile);
  // Test former state features for the PYRAMID interaction type
  testFormerStateFeatures(interactionType, defaultTestFile);
  // Test keyboard interactions
  testKeyboardInteractions(interactionType, defaultTestFile);
});
