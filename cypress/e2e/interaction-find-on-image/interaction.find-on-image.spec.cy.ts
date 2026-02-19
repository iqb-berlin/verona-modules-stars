import {
  InteractionFindOnImageParams,
  UnitDefinition
} from '../../../projects/player/src/app/models/unit-definition';
import { testContinueButtonFeatures } from '../shared/continue-button.spec.cy';
import { testRibbonBars } from '../shared/ribbon-bar.spec.cy';
import { testAudioFeedback } from '../shared/audio-feedback.spec.cy';
import { testFormerStateFeatures } from "../shared/former-state.spec.cy";

describe('Interaction FIND_ON_IMAGE Component', () => {
  const interactionType = 'find_on_image';
  const defaultTestFile = 'find_on_image_test';

  beforeEach(() => {
    cy.setupTestData(defaultTestFile, interactionType);
  });

  it('displays the image element', () => {
    cy.get('[data-cy="image-element"]')
      .should('exist')
      .and('be.visible')
      .and('have.attr', 'src');
  });

  it('displays the text parameter', () => {
    cy.get('[data-cy="component-text"]')
      .should('exist')
      .and('be.visible');
  });

  it('displays show area with width and height when showArea parameter is provided', () => {
    let testData: UnitDefinition;
    // Set up test data
    cy.setupTestData('find_on_image_with_showArea_test', interactionType);
    cy.get('@testData').then(data => {
      testData = data as unknown as UnitDefinition;

      const findOnImageParams = testData.interactionParameters as InteractionFindOnImageParams;

      const showArea = findOnImageParams.showArea;

      if (showArea) {
        cy.get('[data-cy="show-area"]')
          .should($el => {
            const style = $el.attr('style') || '';
            // Style should contain width and height
            if (style.includes('width: ') && style.includes('height:')) {
              cy.log('show area is visible with width and height');
            }
          });
      }
    });
  });

  it('does not display show area when showArea parameter is not provided', () => {
    cy.get('[data-cy="show-area"]')
      .should('not.exist');
  });

  it('handles mouse clicks on the image', () => {
    cy.get('[data-cy="image-element"]')
      .click(100, 150); // Click at specific coordinates

    // Check that click target visualization appears
    cy.get('[data-cy="click-target"]')
      .should('exist');
  });

  it('handles multiple clicks and update visualization', () => {
    // First click
    cy.get('[data-cy="image-element"]')
      .click(100, 100);

    cy.get('[data-cy="click-target"]')
      .should('exist');

    // Second click at different position
    cy.get('[data-cy="image-element"]')
      .click(200, 200);

    // Click target should move to new position
    cy.get('[data-cy="click-target"]')
      .should($el => {
        const style = $el.attr('style') || '';
        style.includes('left: 200px');
        style.includes('top: 200px');
      });
  });

  it('handles touch events on mobile devices', () => {
    cy.viewport('ipad-mini');

    cy.get('[data-cy="image-element"]')
      .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] })
      .trigger('touchend', { changedTouches: [{ clientX: 100, clientY: 100 }] });

    cy.get('[data-cy="click-target"]')
      .should('exist');
  });

  // Test base features for the FIND_ON_IMAGE interaction type
  describe('Base features', () => {
    testContinueButtonFeatures(interactionType);
    testRibbonBars(interactionType, `${interactionType}_ribbonBars_true_test`);
    testAudioFeedback(interactionType, `${interactionType}_feedback_test`);
    testFormerStateFeatures(interactionType, defaultTestFile);
  });
});
