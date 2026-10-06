import {
  UnitDefinition
} from '../../../projects/player/src/app/models/unit-definition';

// Hint color from projects/player/src/styles/_colors.scss ($hint: #EE00FF)
const HINT_COLOR = 'rgb(238, 0, 255)';

interface HintField {
  selector: string;
  // CSS property that gets the hint color when the field is hinted
  colorProperty: string;
}

interface WrongFieldsHintConfig {
  // Feedback fixture with more than one editable field, the correct answer is shown via showResponse
  configFile: string;
  fields: Record<string, HintField>;
  correctAnswer: Record<string, string>;
  partiallyWrongAnswer: Record<string, string>;
  allWrongAnswer: Record<string, string>;
}

// Interaction types that show the hint only on the wrong fields
const wrongFieldsHintConfigs: Record<string, WrongFieldsHintConfig> = {
  // __ + __ = 22, correct answer 13 + 9
  equation: {
    configFile: 'equation_feedback_multiple_fields_test.json',
    fields: {
      operand1: { selector: '[data-cy="operand1"]', colorProperty: 'color' },
      operand2: { selector: '[data-cy="operand2"]', colorProperty: 'color' }
    },
    correctAnswer: { operand1: '13', operand2: '9' },
    partiallyWrongAnswer: { operand1: '13', operand2: '5' },
    allWrongAnswer: { operand1: '3', operand2: '5' }
  },
  // top 13, correct answer 10 and 3
  pyramid: {
    configFile: 'pyramid_feedback_test.json',
    fields: {
      left: { selector: '[data-cy="interactive-pyramid-input-left"]', colorProperty: 'border-top-color' },
      right: { selector: '[data-cy="interactive-pyramid-input-right"]', colorProperty: 'border-top-color' }
    },
    correctAnswer: { left: '10', right: '3' },
    partiallyWrongAnswer: { left: '10', right: '5' },
    allWrongAnswer: { left: '9', right: '5' }
  }
};

export function testAudioFeedback(interactionType: string, configFile: string) {
  describe(`Audio Feedback Features for interactionType - ${interactionType}`, () => {

    beforeEach(() => {
      cy.clearUnitStates();
    });

    const loadDefaultTestFile = () => {
      cy.setupTestData(configFile, interactionType);
      return cy.get('@testData') as unknown as Cypress.Chainable<UnitDefinition>;
    };

    const getHintElementSelector = (intType: string) => {
      switch (intType.toUpperCase()) {
        case 'WRITE':
        case 'EQUATION':
        case 'PYRAMID':
        case 'FIND_ON_IMAGE':
        case 'PLACE_VALUE':
          return 'div.hint';
        case 'BUTTON':
        case 'DROP':
        case 'META':
          return 'input.hint';
        case 'NUMBER_LINE':
          return 'text.hint';
        case 'POLYGON_BUTTONS':
          return 'path.hint';
        default:
          return '.hint';
      }
    };

    it('shows the hint class after feedback, if answer is wrong', () => {

      cy.log('Checking wrong answer scenario');

      // Load the file
      loadDefaultTestFile().then(testData => {
        // Perform interaction with wrong answer
        cy.applyStandardScenarios(interactionType, testData);

        // Click on the continue button
        cy.clickContinueButton();

        // Wait until the feedback is played until the end
        cy.waitUntilFeedbackIsFinishedPlaying();

        // First check that the overlay is visible and then remove it to inspect hint class
        cy.get('[data-cy=interaction-disabled-overlay]').should('be.visible').invoke('remove');

        const hintSelector = getHintElementSelector(interactionType);
        cy.get(hintSelector).should('exist');
      });
    });

    it('does not show the hint class after feedback, if the answer is correct', () => {
      // Load the file again for correct answer scenario
      loadDefaultTestFile().then(testData => {

        // Perform the interaction with correct answer
        cy.applyCorrectAnswerScenarios(interactionType, testData);

        // Click on the continue button
        cy.clickContinueButton();

        // Wait until the feedback is played until the end
        cy.waitUntilFeedbackIsFinishedPlaying();

        // The overlay should still be there to make the interaction not possible
        // First check that the overlay is visible and then remove it to inspect hint class
        cy.get('[data-cy=interaction-disabled-overlay]').should('be.visible').invoke('remove');

        const hintSelector = getHintElementSelector(interactionType);
        cy.get(hintSelector).should('not.exist');
      });
    });

    // The following tests only run for the interactionTypes EQUATION and PYRAMID (see wrongFieldsHintConfigs),
    // because only these show the hint on the wrong fields and not on the fields that are already correct.
    // All other interactionTypes skip them.
    const wrongFieldsHintConfig = wrongFieldsHintConfigs[interactionType];
    if (wrongFieldsHintConfig) {
      const answerAndWaitForFeedback = (answer: Record<string, string>) => {
        cy.setupTestData(wrongFieldsHintConfig.configFile, interactionType);
        cy.assertInteractionComponentVisible(interactionType);

        Object.entries(answer).forEach(([field, value]) => {
          cy.get(wrongFieldsHintConfig.fields[field].selector).click();
          value.split('').forEach(digit => cy.get(`[data-cy="keyboard-button-${digit}"]`).click());
        });

        cy.clickContinueButton();
        cy.waitUntilFeedbackIsFinishedPlaying();

        // First check that the overlay is visible and then remove it to inspect the fields
        cy.get('[data-cy=interaction-disabled-overlay]').should('be.visible').invoke('remove');

        // The correct answer is shown in all fields
        Object.entries(wrongFieldsHintConfig.correctAnswer).forEach(([field, value]) => {
          cy.get(wrongFieldsHintConfig.fields[field].selector)
            .invoke('text')
            .then(text => expect(text.trim()).to.equal(value));
        });
      };

      const assertHinted = (field: string, hinted: boolean) => {
        const { selector, colorProperty } = wrongFieldsHintConfig.fields[field];
        cy.get(selector).should(hinted ? 'have.class' : 'not.have.class', 'hint');
        cy.get(selector).should(hinted ? 'have.css' : 'not.have.css', colorProperty, HINT_COLOR);
      };

      it('shows the hint color only on the wrong fields after feedback, if the answer is partially wrong', () => {
        const { partiallyWrongAnswer, correctAnswer, fields } = wrongFieldsHintConfig;
        answerAndWaitForFeedback(partiallyWrongAnswer);

        Object.keys(fields).forEach(field => assertHinted(field, partiallyWrongAnswer[field] !== correctAnswer[field]));
      });

      it('shows the hint color on all fields after feedback, if all fields are wrong', () => {
        answerAndWaitForFeedback(wrongFieldsHintConfig.allWrongAnswer);

        Object.keys(wrongFieldsHintConfig.fields).forEach(field => assertHinted(field, true));
      });
    }

    it('does not requests navigation to next unit when triggerNavigationOnEnd is false and feedback audio ends', () => {

      cy.setupTestDataWithPostMessageMock(configFile, interactionType);

      cy.loadUnit(`interaction-${interactionType}/${configFile}`);

      cy.applyStandardScenarios(interactionType);

      cy.clickContinueButton();

      cy.waitUntilFeedbackIsFinishedPlaying();

      cy.wait(600);

      cy.get('@outgoingMessages').should('not.contain.deep', {
        data: {
          type: 'vopUnitNavigationRequestedNotification',
          sessionId: 'cypress-test-session',
          target: 'next'
        },
        origin: '*'
      });
    });

    it('requests navigation to next unit when triggerNavigationOnEnd is true and feedback audio ends', () => {

      const configFile = `${interactionType}_feedback_triggerNavigationOnEnd_true_test.json`;

      cy.setupTestDataWithPostMessageMock(configFile, interactionType);

      cy.loadUnit(`interaction-${interactionType}/${configFile}`);

      cy.applyStandardScenarios(interactionType);

      cy.clickContinueButton();

      cy.waitUntilFeedbackIsFinishedPlaying();

      cy.wait(600);

      cy.get('@outgoingMessages').should('contain.deep', {
        data: {
          type: 'vopUnitNavigationRequestedNotification',
          sessionId: 'cypress-test-session',
          target: 'next'
        },
        origin: '*'
      });
    });

    // eslint-disable-next-line max-len
    it('adds continueButton response only after the second continue button click when triggerNavigationOnEnd is false', () => {
      cy.setupTestDataWithPostMessageMock(configFile, interactionType);
      cy.loadUnit(`interaction-${interactionType}/${configFile}`);

      cy.applyStandardScenarios(interactionType);

      // First click plays the feedback and does not navigate
      cy.clickContinueButton();
      cy.waitUntilFeedbackIsFinishedPlaying();
      cy.assertNoContinueButtonResponse();

      // Second click navigates to the next unit
      cy.clickContinueButton();
      cy.assertContinueButtonResponseSentBeforeNavigation();
    });
  });
}
