import {
  InteractionDropParams,
  UnitDefinition
} from '../../../projects/player/src/app/models/unit-definition';
import { testBaseFeatures } from '../shared/base-features.spec.cy';
import { testResponsiveImageFeatures } from '../shared/responsive-image.spec.cy';
import {
  formatPxValue,
  getDropLandingArgs,
  getDropLandingTranslate
} from '../../../projects/player/src/app/shared/utils/interaction-drop.util';

describe('Interaction DROP Component', () => {
  const interactionType = 'drop';
  const defaultTestFile = 'drop_4_option_test';

  const testFileWithImageLandingXY = `${interactionType}_imagePosition_top_imageLandingXY_100-100_test`;
  const dropImage = '[data-cy="drop-image"]';
  const buttonIndex = 1;

  /**
  * Function to extract transform translate values
   * @param {string} styleValue - The style attribute value to parse
   * @returns {{xValue: string, yValue: string}} - An object containing the extracted x and y values
  * */
  type TranslateValues = { xValue: string; yValue: string };
  const getTransformTranslateValues = (styleValue: string | null | undefined): TranslateValues => {
    if (!styleValue) return { xValue: '', yValue: '' };

    const raw = String(styleValue).replace(/\s+/g, ' ').trim();
    // Extract the last 'transform' declaration's value from a style string or use the whole string
    const transformMatch = /(?:^|;\s*)transform\s*:\s*([^;]+)(?!.*;\s*transform\s*:)/i.exec(raw);
    const transformOnly = transformMatch?.[1]?.trim() ?? (raw.includes('transform:') ? '' : raw);

    // Regex to match translate and translate3d transform functions
    const transformRegex = /translate(3d)?\(\s*([^)]+)\s*\)/gi;
    let lastMatch;
    let m;
    // eslint-disable-next-line no-cond-assign
    while ((m = transformRegex.exec(transformOnly)) !== null) {
      lastMatch = m;
    }

    if (!lastMatch) return { xValue: '', yValue: '' };

    const [, , params] = lastMatch as RegExpExecArray;
    const parts = (params ?? '').split(',').map((p: string) => p.trim());

    const tx = parts[0] || '0';
    const ty = parts[1] || '0';

    return {
      xValue: formatPxValue(tx.endsWith('px') ? tx : `${parseFloat(tx)}px`),
      yValue: formatPxValue(ty.endsWith('px') ? ty : `${parseFloat(ty)}px`)
    };
  };

  /**
   * Sets up test data and retrieves DOM elements needed for drop interaction tests.
   * Calculates landing coordinates and transform values for the drop animation.
   *
   * @param {string} [testFile] - Optional test file name. If not provided, uses testFileWithImageLandingXY.
   * @returns {Cypress.Chainable<any>} - Chainable resolving to calculated test values and DOM elements.
   */
  const getTestSetup = (
    testFile?: string
  ): Cypress.Chainable<any> => {
    const fileToUse = testFile || testFileWithImageLandingXY;
    cy.setupTestData(fileToUse, interactionType);

    return cy.get('@testData').then(data => {
      const testData = data as unknown as UnitDefinition;
      const dropParams = testData.interactionParameters as InteractionDropParams;
      const imageLandingXY = dropParams.imageLandingXY || '50, 50';

      return cy.get(dropImage)
        .should('be.visible')
        .and($img => {
          expect(($img[0] as HTMLImageElement).naturalWidth).to.be.greaterThan(0);
        })
        .then($img => cy.get(`[data-cy="button-${buttonIndex}"]`)
          .then($button => cy.get('[data-cy="drop-container"]')
            .then($container => {
              const imgElement = $img.get(0) as HTMLImageElement;
              const buttonElement = $button.get(0) as HTMLElement;
              const containerElement = $container.get(0) as HTMLElement;

              const {
                buttonCenterX, imgWidth, imgHeight, imageTop, imageLeft, buttonCenterY
              } = getDropLandingArgs(imgElement, buttonElement, containerElement);

              const translate = getDropLandingTranslate(
                imageLandingXY,
                buttonCenterX,
                imgWidth,
                imgHeight,
                imageLeft,
                imageTop,
                buttonCenterY
              );
              const xPx = translate.xPx;
              const yPx = translate.yPx;

              return {
                testData,
                dropParams,
                imageLandingXY,
                imgElement,
                buttonElement,
                containerElement,
                buttonCenterX,
                imgWidth,
                imgHeight,
                imageTop,
                imageLeft,
                buttonCenterY,
                xPx,
                yPx
              };
            })));
    });
  };

  /**
   * Asserts that the drop-animate-wrapper-{buttonIndex} element has the expected transform translate values.
   *
   * @param {string} xPx - The expected X translation value.
   * @param {string} yPx - The expected Y translation value.
   */
  const assertTransformTranslate = (xPx: string, yPx: string): void => {
    cy.get(`[data-cy="drop-animate-wrapper-${buttonIndex}"]`)
      .should($el => {
        const style = $el.attr('style') || '';
        expect(style).to.contain('transform');
        const { xValue, yValue } = getTransformTranslateValues(style);
        expect(xValue).to.equal(xPx);
        expect(yValue).to.equal(yPx);
      });
  };

  const assertStartAnimation = (): void => {
    // Click button to start animation
    cy.get(`[data-cy="button-${buttonIndex}"]`).click();
  };

  // Rendering
  describe('Rendering', () => {
    beforeEach(() => {
      cy.setupTestData(defaultTestFile, interactionType);
    });

    it('renders the correct number of options', () => {
      let testData: UnitDefinition;
      cy.get('@testData').then(data => {
        testData = data as unknown as UnitDefinition;

        const dropParams = testData.interactionParameters as InteractionDropParams;
        const optionsLength = dropParams.options?.length;
        cy.get('stars-standard-button[data-cy^="button-"]').should('have.length', optionsLength).then(() => {
          cy.log(`Total options: ${optionsLength}`);
        });
      });
    });
  });

  // Image position
  describe('Default imageLandingXY', () => {
    it('applies default "50, 50" transform values when imageLandingXY is an empty string', () => {
      getTestSetup('drop_imageLandingXY_empty_test').then(result => {
        const { xPx, yPx } = result as {
          xPx: string;
          yPx: string;
        };
        assertStartAnimation();
        assertTransformTranslate(xPx, yPx);
      });
    });

    it('applies default "50, 50" transform values when imageLandingXY property is missing', () => {
      getTestSetup('drop_no_imageLandingXY_property_test').then(result => {
        const { xPx, yPx } = result as {
          xPx: string;
          yPx: string;
        };
        assertStartAnimation();
        assertTransformTranslate(xPx, yPx);
      });
    });
  });

  // Landing coordinates
  describe('Landing coordinates', () => {
    it('applies correct transform values when imageLandingXY exists', () => {
      getTestSetup().then(result => {
        const { imageLandingXY, xPx, yPx } = result as {
          imageLandingXY: string;
          xPx: string;
          yPx: string;
        };
        if (imageLandingXY !== '') {
          assertStartAnimation();
          assertTransformTranslate(xPx, yPx);
        }
      });
    });
  });

  // Click behavior
  describe('Click behavior', () => {
    beforeEach(() => {
      cy.setupTestData(defaultTestFile, interactionType);
    });

    it('toggles option back to initial position when clicked again', () => {
      // First click - button should move down
      cy.get(`[data-cy="button-${buttonIndex}"]`).click();

      // Wait for animation to complete
      cy.wait(3000);

      // Second click - should return to original position
      cy.get(`[data-cy="button-${buttonIndex}"]`).click();
      cy.get(`[data-cy="drop-animate-wrapper-${buttonIndex}"]`)
        .should($el => {
          const style = $el.attr('style') || '';
          // Expect the element to be explicitly reset to translate3d(0px, 0px, 0px)
          expect(style.replace(/\s+/g, ' ').trim()).to.include('transform: translate3d(0px, 0px, 0px)');
        });
    });
  });

  // Drag and drop
  describe('Drag and drop', () => {
    it('handles drag events correctly', () => {
      getTestSetup().then(result => {
        const { imageLandingXY, xPx, yPx } = result as {
          imageLandingXY: string;
          xPx: string;
          yPx: string;
        };
        if (imageLandingXY !== '') {
          // Triggers the drag event
          cy.get(`[data-cy="button-${buttonIndex}"]`)
            .trigger('mousedown', { button: 0, bubbles: true, force: true })
            .trigger('mousemove', { pageX: 10, pageY: 10, force: true });

          cy.get(dropImage) // droppable
            .trigger('mousemove', { force: true })
            .trigger('mouseup', { force: true });

          // Wait for animation to complete
          cy.wait(2000);

          assertTransformTranslate(xPx, yPx);
        }
      });
    });
  });

  // Test base features for the DROP interaction type
  testBaseFeatures(interactionType, defaultTestFile);
  testResponsiveImageFeatures(interactionType, `${interactionType}_imagePosition_top_test`, '[data-cy="drop-image"]');
});
