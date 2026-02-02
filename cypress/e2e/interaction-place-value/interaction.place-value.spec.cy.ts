import { testMainAudioFeatures } from '../shared/main-audio.spec.cy';
import { testContinueButtonFeatures } from '../shared/continue-button.spec.cy';
import { testRibbonBars } from '../shared/ribbon-bar.spec.cy';
import { testOpeningImageFeatures } from '../shared/opening-image.spec.cy';
import {
  InteractionPlaceValueParams,
  UnitDefinition
} from '../../../projects/player/src/app/models/unit-definition';
import { testAudioFeedback } from '../shared/audio-feedback.spec.cy';

describe('PLACE_VALUE Interaction E2E Tests', () => {
  const interactionType = 'place_value';
  const defaultTestFile = 'place_value_test';

  const setupAndAssert = (file: string) => {
    cy.setupTestData(file, interactionType);
    cy.get('[data-cy="interaction-place-value"]').should('exist');
  };

  it('renders initial state correctly', () => {
    setupAndAssert(`${defaultTestFile}.json`);

    cy.get('@testData').then(data => {
      const testData = data as unknown as UnitDefinition;
      const params = testData.interactionParameters as InteractionPlaceValueParams;
      const value = params.value;
      const maxNumberOfOnes = params.maxNumberOfOnes;
      const maxNumberOfTens = params.maxNumberOfTens;
      cy.get('[data-cy="interaction-place-value"]').within(() => {
        cy.get('[data-cy="place-value"]').should('contain', value);
        cy.get('[data-cy="icons-upper-panel"]').should('exist');
        cy.get('[data-cy="ones-wrapper"]').should('exist');
        cy.get('[data-cy="tens-wrapper"]').should('exist');

        // Check the number of ones
        // maxNumberOfOnes+1 because one icon is always stays visible in the container even after all items are moved up
        cy.get('[data-cy="icon-item-ones"]').should('have.length', (maxNumberOfOnes ?? 0) + 1);
        // Check the number of tens
        // maxNumberOfTens+1 because one icon is always stays visible in the container even after all items are moved up
        cy.get('[data-cy="icon-item-tens"]').should('have.length', (maxNumberOfTens ?? 0) + 1);
      });
    });
  });

  it('does not display value when value: 0', () => {
    setupAndAssert('place_value_value_0_test.json');
    // check that the value is not displayed as 0
    cy.get('[data-cy="interaction-place-value"]').within(() => {
      cy.get('[data-cy="place-value"]').should('exist').and('not.have.text', '0');
    });
  });

  it('moves icons to upper panel when clicked', () => {
    setupAndAssert(`${defaultTestFile}.json`);
    cy.removeClickLayer();

    // Click a "one" icon
    cy.get('[data-cy="icon-item-ones"]').last().click({ force: true });
    cy.get('[data-cy="icon-item-ones-moved"]').should('have.length', 1);
    cy.wait(500); // Wait for debounce

    // Click another "one" icon
    cy.get('[data-cy="icon-item-ones"]').last().click({ force: true });
    cy.get('[data-cy="icon-item-ones-moved"]').should('have.length', 2);
    cy.wait(500); // Wait for debounce

    // Click a "ten" icon
    cy.get('[data-cy="icon-item-tens"]').last().click({ force: true });
    cy.get('[data-cy="icon-item-tens-moved"]').should('have.length', 1);
  });

  it('moves icons back to lower panel when clicked', () => {
    setupAndAssert(`${defaultTestFile}.json`);
    cy.removeClickLayer();

    // Move some icons first
    cy.get('[data-cy="icon-item-ones"]').last().click({ force: true });
    cy.wait(500); // Wait for debounce
    cy.get('[data-cy="icon-item-tens"]').last().click({ force: true });
    cy.wait(500); // Wait for debounce
    cy.get('[data-cy="icon-item-ones-moved"]').should('have.length', 1);
    cy.get('[data-cy="icon-item-tens-moved"]').should('have.length', 1);

    // Click the moved icons again to move them back
    cy.get('[data-cy="icon-item-ones-moved"]').first().click({ force: true });
    cy.get('[data-cy="icon-item-ones-moved"]').should('not.exist');
    cy.wait(500); // Wait for debounce

    cy.get('[data-cy="icon-item-tens-moved"]').first().click({ force: true });
    cy.get('[data-cy="icon-item-tens-moved"]').should('not.exist');
  });

  it('prevents multiple moves on rapid double-click (debounce)', () => {
    setupAndAssert(`${defaultTestFile}.json`);
    cy.removeClickLayer();

    // Rapidly click a "one" icon twice
    cy.get('[data-cy="icon-item-ones"]').last().click({ force: true });
    cy.get('[data-cy="icon-item-ones"]').last().click({ force: true });

    // Only one should have moved due to the 500ms debounce
    cy.get('[data-cy="icon-item-ones-moved"]').should('have.length', 1);

    // Wait for debounce to expire
    cy.wait(500);

    // Click again, now it should work
    cy.get('[data-cy="icon-item-ones"]').last().click({ force: true });
    cy.get('[data-cy="icon-item-ones-moved"]').should('have.length', 2);
  });

  it('disables wrappers when max icons are moved to upper panel', () => {
    setupAndAssert(`${defaultTestFile}.json`);
    cy.removeClickLayer();

    cy.get('@testData').then(data => {
      const testData = data as unknown as UnitDefinition;
      const params = testData.interactionParameters as InteractionPlaceValueParams;
      const maxNumberOfOnes = params.maxNumberOfOnes ?? 0;
      const maxNumberOfTens = params.maxNumberOfTens ?? 0;

      // Move max number of tens and ones
      cy.movePlaceValueIcons(maxNumberOfTens, maxNumberOfOnes);

      cy.get('[data-cy="tens-wrapper"]').should('have.class', 'disabled');
      cy.get('[data-cy="ones-wrapper"]').should('have.class', 'disabled');

      // Move one ten back and check if it is enabled again
      cy.get('[data-cy="icon-item-tens-moved"]').first().click({ force: true });
      cy.wait(500); // Wait for debounce
      cy.get('[data-cy="tens-wrapper"]').should('not.have.class', 'disabled');

      // Move one one back and check if it is enabled again
      cy.get('[data-cy="icon-item-ones-moved"]').first().click({ force: true });
      cy.wait(500); // Wait for debounce
      cy.get('[data-cy="ones-wrapper"]').should('not.have.class', 'disabled');
    });
  });

  it('handles drag and drop to upper panel', () => {
    setupAndAssert(`${defaultTestFile}.json`);
    cy.removeClickLayer();

    // Drag a "ten" icon to the upper panel
    cy.get('[data-cy="icon-item-tens"]').last()
      .trigger('mousedown', { button: 0, bubbles: true, force: true })
      .trigger('mousemove', { pageX: 10, pageY: 0, force: true });

    cy.get('[data-cy="icons-upper-panel"]')
      .trigger('mousemove', { position: 'center', force: true })
      .trigger('mouseup', { button: 0, bubbles: true, force: true });

    cy.get('[data-cy="icon-item-tens-moved"]').should('have.length', 1);

    // Drag a "one" icon to the upper panel
    cy.get('[data-cy="icon-item-ones"]').last()
      .trigger('mousedown', { button: 0, bubbles: true, force: true })
      .trigger('mousemove', { pageX: 10, pageY: 0, force: true });

    cy.get('[data-cy="icons-upper-panel"]')
      .trigger('mousemove', { position: 'center', force: true })
      .trigger('mouseup', { button: 0, bubbles: true, force: true });

    cy.get('[data-cy="icon-item-ones-moved"]').should('have.length', 1);
  });

  it('handles drag and drop back to wrapper', () => {
    setupAndAssert(`${defaultTestFile}.json`);
    cy.removeClickLayer();

    // Move a "ten" icon to the upper panel first
    cy.get('[data-cy="icon-item-tens"]').last().click({ force: true });
    cy.wait(500); // Wait for debounce
    cy.get('[data-cy="icon-item-tens-moved"]').should('have.length', 1);

    // Drag the moved "ten" icon back to its wrapper
    cy.get('[data-cy="icon-item-tens-moved"]').first()
      .trigger('mousedown', { button: 0, bubbles: true, force: true })
      .trigger('mousemove', { pageX: 10, pageY: 0, force: true });

    cy.get('[data-cy="tens-wrapper"]')
      .trigger('mousemove', { position: 'center', force: true })
      .trigger('mouseup', { button: 0, bubbles: true, force: true });

    cy.get('[data-cy="icon-item-tens-moved"]').should('not.exist');
    cy.wait(500); // Wait for debounce

    // Move a "one" icon to the upper panel first
    cy.get('[data-cy="icon-item-ones"]').last().click({ force: true });
    cy.wait(500); // Wait for debounce
    cy.get('[data-cy="icon-item-ones-moved"]').should('have.length', 1);

    // Drag the moved "one" icon back to its wrapper
    cy.get('[data-cy="icon-item-ones-moved"]').first()
      .trigger('mousedown', { button: 0, bubbles: true, force: true })
      .trigger('mousemove', { pageX: 10, pageY: 0, force: true });

    cy.get('[data-cy="ones-wrapper"]')
      .trigger('mousemove', { position: 'center', force: true })
      .trigger('mouseup', { button: 0, bubbles: true, force: true });

    cy.get('[data-cy="icon-item-ones-moved"]').should('not.exist');
  });

  // Shared tests for the PLACE_VALUE interaction type
  describe('Shared Features', () => {
    testMainAudioFeatures(interactionType, defaultTestFile);
    testContinueButtonFeatures(interactionType);
    testRibbonBars(interactionType, `${interactionType}_ribbonBars_true_test`);
    testAudioFeedback(interactionType, `${interactionType}_feedback_test`);
    testOpeningImageFeatures(interactionType, `${interactionType}_with_openingImage_test`);
  });
});
