import {
  InteractionDropParams,
  UnitDefinition
} from '../../../projects/player/src/app/models/unit-definition';
import { testMainAudioFeatures } from '../shared/main-audio.spec.cy';
import { testContinueButtonFeatures } from '../shared/continue-button.spec.cy';
import { testRibbonBars } from '../shared/ribbon-bar.spec.cy';
import { testAudioFeedback } from '../shared/audio-feedback.spec.cy';
import {
  formatPxValue,
  getDropLandingArgs,
  getDropLandingTranslate
} from '../../../projects/player/src/app/shared/utils/interaction-drop.util';
import { testOpeningImageFeatures } from "../shared/opening-image.spec.cy";

describe('Interaction DROP Component', () => {
  const interactionType = 'drop';
  const defaultTestFile = 'drop_4_option_test';
  const testFileWithImageLandingXY = `${interactionType}_imagePosition_top_rectangle_with_imageLandingXY_100-100_test`;
  /** Ref from the value on interaction-drop.component.ts calculateButtonTransformValues function. */
  const yValueToBottom = 280;
  /** Ref from the value on interaction-drop.component.ts calculateButtonTransformValues function. */
  const yValueToTop = -280;
  const dropImage = '[data-cy="drop-image"]';
  const buttonIndex = 1;

  /**
  * Function to extract transform translate values
   * @param {string} styleValue - The style attribute value to parse
   * @returns {{xValue: string, yValue: string}} - An object containing the extracted x and y values
  * */
  type TranslateValues = { xValue: string; yValue: string };
  const getTransformTranslateValues = (styleValue: string | null | undefined): TranslateValues => {
    // Return empty when nothing to parse
    if (styleValue == null) return { xValue: '', yValue: '' };

    const raw = String(styleValue).replace(/\s+/g, ' ').trim();

    // If a full style attribute was provided, extract the transform declaration value (right side of the colon)
    // Example: 'transform: translate(10px, 20px); opacity: 1' -> 'translate(10px, 20px)'
    const transformMatch = /(?:^|;\s*)transform\s*:\s*([^;]+)/i.exec(raw);
    const transformOnly: string = transformMatch?.[1]?.trim() ?? raw;

    // Prefer the last translate/translate3d occurrence if multiple are present.
    const findLast = (re: RegExp): RegExpExecArray | null => {
      let match: RegExpExecArray | null = null;
      const global = new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`);
      let m: RegExpExecArray | null;
      // eslint-disable-next-line no-cond-assign
      while ((m = global.exec(transformOnly)) != null) {
        match = m;
      }
      return match;
    };

    // translate3d(xpx, ypx, zpx)
    const t3 = findLast(/translate3d\(\s*([-\d.]+)px?\s*,\s*([-\d.]+)px?\s*,\s*([-\d.]+)px?\s*\)/i);
    if (t3) {
      return { xValue: formatPxValue(`${t3[1]}px`), yValue: formatPxValue(`${t3[2]}px`) };
    }

    // translate(xpx, ypx)
    const t2 = findLast(/translate\(\s*([-\d.]+)px?\s*,\s*([-\d.]+)px?\s*\)/i);
    if (t2) {
      return { xValue: formatPxValue(`${t2[1]}px`), yValue: formatPxValue(`${t2[2]}px`) };
    }

    // matrix(a, b, c, d, tx, ty) -> tx is group 5, ty is group 6
    const m2 =
      findLast(/matrix\(\s*([-\d.e]+)\s*,\s*([-\d.e]+)\s*,\s*([-\d.e]+)\s*,\s*([-\d.e]+)\s*,\s*([-\d.e]+)\s*,\s*([-\d.e]+)\s*\)/i);
    if (m2) {
      const tx = `${parseFloat(m2[5] ?? '0')}px`;
      const ty = `${parseFloat(m2[6] ?? '0')}px`;
      return { xValue: formatPxValue(tx), yValue: formatPxValue(ty) };
    }

    // matrix3d(...) -> tx is element 13 (index 12), ty is element 14 (index 13)
    const m3 = findLast(/matrix3d\(\s*([-\d.e,\s]+)\)/i);
    if (m3) {
      const parts = (m3[1] ?? '').split(',').map((s: string) => parseFloat((s || '').trim() || '0'));
      const tx = Number.isFinite(parts[12]) ? `${parts[12]}px` : '';
      const ty = Number.isFinite(parts[13]) ? `${parts[13]}px` : '';
      return { xValue: formatPxValue(tx), yValue: formatPxValue(ty) };
    }

    return { xValue: '', yValue: '' };
  };

  /**
   * Sets up test data with imageLandingXY and retrieves DOM elements needed for drop interaction tests.
   * Calculates landing coordinates and transform values for the drop animation.
   *
   * @returns {Cypress.Chainable<any>} - Chainable resolving to calculated test values and DOM elements.
   */
  const getTestSetupWithImageLandingXY = (
  ): Cypress.Chainable<any> => {
    cy.setupTestData(testFileWithImageLandingXY, interactionType);

    return cy.get('@testData').then(data => {
      const testData = data as unknown as UnitDefinition;
      const dropParams = testData.interactionParameters as InteractionDropParams;
      const imageLandingXY = dropParams.imageLandingXY;

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

              let xPx = '';
              let yPx = '';
              if (typeof imageLandingXY === 'string' && imageLandingXY.trim() !== '') {
                const translate = getDropLandingTranslate(
                  imageLandingXY,
                  buttonCenterX,
                  imgWidth,
                  imgHeight,
                  imageLeft,
                  imageTop,
                  buttonCenterY
                );
                xPx = translate.xPx;
                yPx = translate.yPx;
              }

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
  describe('Image position', () => {
    describe('BOTTOM', () => {
      beforeEach(() => {
        cy.setupTestData(defaultTestFile, interactionType);
      });

      it('applies correct styles and downward movement', () => {
        let testData: UnitDefinition;
        cy.get('@testData').then(data => {
          testData = data as unknown as UnitDefinition;

          const dropParams = testData.interactionParameters as InteractionDropParams;
          const imagePosition = dropParams.imagePosition;
          if (imagePosition === 'BOTTOM') {
            cy.get('[data-cy="drop-container"]').should('have.css', 'flex-direction', 'column-reverse');
            assertStartAnimation();
            cy.get(`[data-cy="drop-animate-wrapper-${buttonIndex}"]`)
              .should($el => {
                const style = $el.attr('style') || '';
                const { yValue } = getTransformTranslateValues(style);
                expect(yValue.trim()).to.equal(`${yValueToBottom}px`);
              });
          }
        });
      });
    });

    describe('TOP', () => {
      beforeEach(() => {
        cy.setupTestData(`${interactionType}_imagePosition_top_test`, interactionType);
      });

      it('applies correct styles and upward movement', () => {
        let testData: UnitDefinition;
        cy.get('@testData').then(data => {
          testData = data as unknown as UnitDefinition;

          const dropParams = testData.interactionParameters as InteractionDropParams;
          const imagePosition = dropParams.imagePosition;
          if (imagePosition === 'TOP') {
            cy.get('[data-cy="drop-container"]').should('have.css', 'flex-direction', 'column');
            assertStartAnimation();
            cy.get(`[data-cy="drop-animate-wrapper-${buttonIndex}"]`)
              .should($el => {
                const style = $el.attr('style') || '';
                const { yValue } = getTransformTranslateValues(style);
                expect(yValue.trim()).to.equal(`${yValueToTop}px`);
              });
          }
        });
      });
    });
  });

  // Landing coordinates
  describe('Landing coordinates', () => {
    it('applies correct transform values when imageLandingXY exists', () => {
      getTestSetupWithImageLandingXY().then(result => {
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
      getTestSetupWithImageLandingXY().then(result => {
        const { imageLandingXY, xPx, yPx } = result as {
          imageLandingXY: string;
          xPx: string;
          yPx: string;
        };
        if (imageLandingXY !== '') {
          // Triggers the drag event
          cy.get(`[data-cy="drop-animate-wrapper-${buttonIndex}"]`)
            .trigger('mousedown', { button: 0, bubbles: true, force: true })
            .trigger('mousemove', { pageX: 10, pageY: 0, force: true });

          cy.get(dropImage) // droppable
            .trigger('mousemove', { position: 'center', force: true })
            .trigger('mouseup', { button: 0, bubbles: true, force: true });
          // Wait for animation to complete
          cy.wait(1000);
          assertTransformTranslate(xPx, yPx);
        }
      });
    });
  });

  // Shared tests for the DROP interaction type
  describe('Shared behaviors', () => {
    testContinueButtonFeatures(interactionType);
    testMainAudioFeatures(interactionType, defaultTestFile);
    testRibbonBars(interactionType, `${interactionType}_ribbonBars_true_test`);
    testAudioFeedback(interactionType, `${interactionType}_feedback_test`);
    testOpeningImageFeatures(interactionType, `${interactionType}_with_openingImage_test`);
  });
});
