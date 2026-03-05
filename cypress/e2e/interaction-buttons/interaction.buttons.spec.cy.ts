import {
  InteractionButtonParams,
  UnitDefinition
} from '../../../projects/player/src/app/models/unit-definition';
import { testBaseFeatures } from '../shared/base-features.spec.cy';
import { testResponsiveImageFeatures } from '../shared/responsive-image.spec.cy';
import { testFormerStateFeatures } from '../shared/former-state.spec.cy';

describe('Interaction BUTTONS Component', () => {
  const interactionType = 'buttons';
  const defaultTestFile = 'buttons_test';

  beforeEach(() => {
    cy.clearUnitStates();
  });

  // Small helpers local to this spec
  const assertButtonExists = () => {
    cy.get('[data-cy="button-0"]').should('exist');
  };
  const setupAndAssert = (file: string) => {
    cy.setupTestData(file, interactionType);
  };
  const assertRowHasButtons = (rowIndex: number, expected: number) => {
    cy.get(`[data-cy="button-row-${rowIndex}"]`).should('exist').within(() => {
      cy.get('stars-standard-button[data-cy^="button-"]').should('have.length', expected);
    });
  };

  describe('Selection behavior', () => {
    it('selects a single button when multiSelect is false', () => {
      setupAndAssert(`${defaultTestFile}.json`);
      assertButtonExists();

      cy.clickButtonAtIndexOne();
      cy.get('[data-cy="button-1"] input').should('have.attr', 'data-selected', 'true');

      cy.get('[data-cy="button-2"]').click();
      cy.get('[data-cy="button-1"] input').should('have.attr', 'data-selected', 'false');
      cy.get('[data-cy="button-2"] input').should('have.attr', 'data-selected', 'true');
    });

    it('allows multi-selection when enabled', () => {
      cy.setupTestData('buttons_multiselect_true_test', interactionType);
      assertButtonExists();

      cy.clickButtonAtIndexOne();
      cy.get('[data-cy="button-2"]').click();

      cy.get('[data-cy="button-1"] input').should('have.attr', 'data-selected', 'true');
      cy.get('[data-cy="button-2"] input').should('have.attr', 'data-selected', 'true');
    });
  });

  describe('Layout', () => {
    it('respects button layout (numberOfRows)', () => {
      const layoutConfigs = [
        // 1 Row layouts
        { rows: 1, layout: [2], file: 'buttons_1Row_2_test.json' },
        { rows: 1, layout: [3], file: 'buttons_1Row_3_test.json' },
        { rows: 1, layout: [4], file: 'buttons_1Row_4_test.json' },
        { rows: 1, layout: [5], file: 'buttons_1Row_5_test.json' },

        // 2 Row layouts
        { rows: 2, layout: [1, 1], file: 'buttons_2Rows_1-1_test.json' },
        { rows: 2, layout: [2, 2], file: 'buttons_2Rows_2-2_test.json' },
        { rows: 2, layout: [3, 3], file: 'buttons_2Rows_3-3_test.json' },
        { rows: 2, layout: [4, 3], file: 'buttons_2Rows_4-3_test.json' },
        { rows: 2, layout: [4, 4], file: 'buttons_2Rows_4-4_test.json' },
        { rows: 2, layout: [5, 4], file: 'buttons_2Rows_5-4_test.json' },
        { rows: 2, layout: [5, 5], file: 'buttons_2Rows_5-5_test.json' },

        // 3 Row layouts
        { rows: 3, layout: [2, 2, 2], file: 'buttons_3Rows_2-2-2_test.json' },
        { rows: 3, layout: [5, 5, 1], file: 'buttons_3Rows_5-5-1_test.json' }
      ];

      cy.wrap(layoutConfigs).each(({ rows, layout, file }: any) => {
        cy.log(`Testing layout: ${rows} rows with ${layout.join('-')} buttons`);

        cy.setupTestData(file, interactionType);

        cy.get('[data-cy^="button-row-"]').should('have.length', rows);

        cy.wrap(layout).each((expectedButtonsInRow: number, rowIndex: number) => {
          cy.log(`Row ${rowIndex}: expecting ${expectedButtonsInRow} buttons`);
          assertRowHasButtons(rowIndex, expectedButtonsInRow);
        });

        const totalButtons = (layout as number[]).reduce((sum, count) => sum + count, 0);
        cy.get('stars-standard-button[data-cy^="button-"]').should('have.length', totalButtons);
      });
    });
  });

  describe('Styling & Types', () => {
    it('handles different button types (BIG_SQUARE, TEXT, etc.)', () => {
      const buttonTypeConfigs = [
        { buttonType: 'MEDIUM_SQUARE', file: 'buttons_buttonType_mediumSquare_test.json' },
        { buttonType: 'BIG_SQUARE', file: 'buttons_buttonType_bigSquare_test.json' },
        { buttonType: 'SMALL_SQUARE', file: 'buttons_buttonType_smallSquare_test.json' },
        { buttonType: 'TEXT', file: 'buttons_buttonType_text_test.json' },
        { buttonType: 'CIRCLE', file: 'buttons_buttonType_circle_test.json' },
        { buttonType: 'EXTRA_LARGE_SQUARE', file: 'buttons_buttonType_extraLargeSquare_test.json' },
        { buttonType: 'LONG_RECTANGLE', file: 'buttons_buttonType_longRectangle_test.json' },
        { buttonType: 'TALL_RECTANGLE', file: 'buttons_buttonType_tallRectangle_test.json' }
      ];

      cy.wrap(buttonTypeConfigs).each(({ buttonType, file }: any) => {
        cy.log(`Testing buttonType: ${buttonType}`);
        cy.setupTestData(file, interactionType);
        assertButtonExists();

        const expectedClass = `${(buttonType as string).toLowerCase()}-type`;
        cy.get('[data-cy="button-0"]').find('[data-cy="input-wrapper"]').should('have.class', expectedClass);
      });
    });

    it('handles special gap cases', () => {
      const buttonTypeConfigs = [
        {
          buttonType: 'SMALL_SQUARE',
          file: 'buttons_1Row_2_test.json',
          className: 'two-buttons',
          gap: 106
        },
        {
          buttonType: 'EXTRA_LARGE_SQUARE',
          file: 'buttons_buttonType_extraLargeSquare_test.json',
          className: 'two-extra-large-buttons',
          gap: 50
        },
        {
          buttonType: 'LONG_RECTANGLE',
          file: 'buttons_buttonType_longRectangle_test.json',
          className: 'long-rectangle-buttons',
          gap: 50
        }
      ];
      cy.wrap(buttonTypeConfigs).each(({ buttonType, file, className, gap }: any) => {
        cy.log(`Testing buttonType: ${buttonType}`);
        cy.setupTestData(file, interactionType);
        assertButtonExists();

        cy.get('[data-cy="button-row-0"]').should('have.class', className as string);
        if (className === 'long-rectangle-buttons') {
          cy.get('[data-cy="button-row-0"]').should('have.css', 'row-gap', `${gap}px`);
        } else {
          cy.get('[data-cy="button-row-0"]').should('have.css', 'column-gap', `${gap}px`);
        }
      });
    });
  });

  describe('Stimulus image', () => {
    it('renders an image to the LEFT when imageSource is provided', () => {
      // Use a fixture known to have an image and LEFT position (default file does)
      cy.setupTestData(defaultTestFile, interactionType);
      cy.get('[data-cy="stimulus-image"]').should('exist').and('be.visible');
      cy.get('[data-cy="buttons-container"]').should('have.css', 'flex-direction', 'row');
    });

    it('handles margins when imageUseFullArea parameter is set', () => {
      // eslint-disable-next-line max-len
      // Keep below variable in sync with projects/player/src/app/components/interaction-buttons/interaction-buttons.component.html
      const paddingZero = 0;
      const defaultOffset = 90;

      const imageConfigs = [
        {
          imageUseFullArea: true,
          file: 'buttons_useFullArea_true_test.json'
        },
        {
          imageUseFullArea: false,
          file: 'buttons_useFullArea_false_test.json'
        }
      ];

      cy.wrap(imageConfigs).each(({ imageUseFullArea, file }: any) => {
        cy.setupTestData(file, interactionType);
        assertButtonExists();
        cy.get('[data-cy="stimulus-image"]').should('exist').and('be.visible');

        if (imageUseFullArea) {
          cy.get('[data-cy="buttons-container"]').should('have.css', 'padding-bottom', '60px');
          cy.get('[data-cy="buttons-container"]').should('have.css', 'padding-top', `${paddingZero}px`);
          cy.get('[data-cy="buttons-container"]').should('have.css', 'padding-left', `${paddingZero}px`);
          cy.get('[data-cy="buttons-container"]').should('have.css', 'padding-right', `${paddingZero}px`);
        } else {
          cy.get('[data-cy="buttons-container"]')
            .should('have.css', 'padding-bottom', `${defaultOffset}px`);
          cy.get('[data-cy="buttons-container"]').should('have.css', 'padding-top', `${paddingZero}px`);
          cy.get('[data-cy="buttons-container"]').should('have.css', 'padding-left', `${defaultOffset}px`);
          cy.get('[data-cy="buttons-container"]').should('have.css', 'padding-right', `${defaultOffset}px`);
        }
      });
    });

    it('does not render an image when imageSource is empty', () => {
      cy.setupTestData('buttons_imageSource_empty_test', interactionType);
      cy.get('[data-cy="stimulus-image"]').should('not.exist');
    });
  });

  describe('Instruction text', () => {
    it('renders instruction text when provided', () => {
      cy.setupTestData(defaultTestFile, interactionType);
      cy.get('@testData').then(data => {
        const testData = data as unknown as UnitDefinition;
        const buttonParams = testData.interactionParameters as InteractionButtonParams;
        const instructionText = buttonParams.text!;
        cy.get('[data-cy="instruction-text"]').should('exist').and('contain', instructionText);
      });
    });

    it('does not render instruction text when text parameter is empty string', () => {
      cy.setupTestData('buttons_text_empty_test', interactionType);
      assertButtonExists();
      cy.get('[data-cy="instruction-text"]').should('not.exist');
    });
  });

  describe('Button content options', () => {
    it('renders a button with imageSource content', () => {
      cy.setupTestData(`${defaultTestFile}.json`, interactionType);
      cy.get('[data-cy=button-with-imageSource]').should('exist');
    });

    it('renders a button with icon content', () => {
      cy.setupTestData('buttons_option_icon_test.json', interactionType);
      cy.get('[data-cy=button-with-icon]').should('exist');
    });

    it('renders a button with text content', () => {
      cy.setupTestData('buttons_option_text_test.json', interactionType);
      cy.get('[data-cy=button-with-text]').should('exist');
    });

    it('renders buttons with audioSource and verifies speaker-icons functionality', () => {
      cy.setupTestData('buttons_option_with_audioSource_test.json', interactionType);
      cy.get('@testData').then(data => {
        const testData = data as unknown as UnitDefinition;
        const buttonParams = testData.interactionParameters as InteractionButtonParams;
        const buttons = buttonParams.options.buttons!;

        buttons.forEach((button, index) => {
          if (button.audioSource) {
            cy.get(`[data-cy=button-with-audioSource-${index}]`).should('exist');
            cy.get(`[data-cy=button-wrapper-${index}]`).find('[data-cy=speaker-icon]')
              .should('exist')
              .click({ force: true });
          }
        });
      });
    });
  });

  describe('Navigation on triggerNavigationOnSelect', () => {
    it('requests navigation to next unit when triggerNavigationOnSelect is true', () => {
      cy.setupTestData(
        'buttons_buttonType_circle_option_icon_triggerNavigationOnSelect_true_test.json',
        interactionType
      );
      assertButtonExists();

      // Spy on postMessage of the parent window (used by VeronaPostService)
      // We do this AFTER setupTestData so we are spying on the mockParent created there
      cy.window().then(window => {
        // In Cypress E2E, AUT runs in an iframe; Verona posts to win.parent
        const target = window.parent || window;
        cy.spy(target, 'postMessage').as('postMessage');
      });

      // Click any button should trigger navigation after a small delay in the component
      cy.get('[data-cy="button-0"]').click();

      cy.wait(600);

      cy.get('@postMessage').should('have.been.called');
      cy.get('@postMessage').should('have.been.calledWithMatch', Cypress.sinon.match({
        type: 'vopUnitNavigationRequestedNotification',
        target: 'next'
      }));
    });
  });

  // Test base features for the BUTTONS interaction type
  testBaseFeatures(interactionType, defaultTestFile);
  // Test former state features for the BUTTONS interaction type
  testFormerStateFeatures(interactionType, defaultTestFile);
  // Test responsive image features for the BUTTONS interaction type
  testResponsiveImageFeatures(interactionType, `${interactionType}_imagePosition_top_test`, '[data-cy="stimulus-image"]');
});
