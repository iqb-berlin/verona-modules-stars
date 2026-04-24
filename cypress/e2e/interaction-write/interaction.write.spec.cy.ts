import { InteractionWriteParams, UnitDefinition } from '../../../projects/player/src/app/models/unit-definition';
import { testBaseFeatures } from '../shared/base-features.spec.cy';
import { testFormerStateFeatures } from '../shared/former-state.spec.cy';
import { testKeyboardInteractions } from '../shared/keyboard-interactions.spec.cy';

describe('Interaction WRITE Component', () => {
  const interactionType = 'write';
  const defaultTestFile = 'write_test';

  beforeEach(() => {
    cy.clearUnitStates();
  });

  it('shows the stimulus wrapper only if an imageSource is provided', () => {
    // 1. With image
    cy.setupTestData(defaultTestFile, interactionType);
    cy.get('[data-cy=stimulus-wrapper]')
      .find('[data-cy=stimulus-image]')
      .should('exist');

    // 2. Without image
    cy.setupTestData('write_numbersLine_without_imageSource_test', interactionType);
    cy.get('[data-cy=stimulus-wrapper]').should('not.exist');
  });

  it('has text-wrapper and text-display elements', () => {
    cy.setupTestData(defaultTestFile, interactionType);
    cy.get('[data-cy=text-wrapper]')
      .find('[data-cy=text-display]')
      .should('exist');
  });

  it('has keyboard wrapper', () => {
    cy.setupTestData(defaultTestFile, interactionType);
    cy.get('[data-cy=keyboard-wrapper]').should('exist');
  });

  it('displays the text written by keyboard', () => {
    cy.setupTestData(defaultTestFile, interactionType);

    const text = 'kopf';
    cy.writeTextOnKeyboard(text);
  });

  it('allows the text maxInputLength length', () => {
    cy.setupTestData(defaultTestFile, interactionType);
    let testData: UnitDefinition;
    cy.get('@testData').then(data => {
      testData = data as unknown as UnitDefinition;

      const writeParams = testData.interactionParameters as InteractionWriteParams;
      // Use default 10 when maxInputLength is missing (aligns with write component)
      const maxInputLength: number = writeParams.maxInputLength ?? 10;

      // Create an array of maxInputLength letters
      const letters = Array.from({ length: maxInputLength }, () => {
        const code = 97 + Math.floor(Math.random() * 26); // a-z
        return String.fromCharCode(code);
      });

      letters.forEach(letter => {
        cy.get(`[data-cy=character-button-${letter}]`).click();
      });

      // Check if the text is displayed correctly
      cy.get('[data-cy=text-span]')
        .invoke('text')
        .then(text => {
          expect(text.length).to.equal(maxInputLength);
        });

      // Check if I can type more characters
      cy.get('[data-cy=character-button-k]').should('be.disabled');
    });
  });

  it('shows a backspace key if addBackspaceKey param is true', () => {
    cy.setupTestData(defaultTestFile, interactionType);
    let testData: UnitDefinition;
    cy.get('@testData').then(data => {
      testData = data as unknown as UnitDefinition;

      const writeParams = testData.interactionParameters as InteractionWriteParams;
      const addBackspaceKey = writeParams.addBackspaceKey;

      if (addBackspaceKey) {
        cy.get('[data-cy=backspace-button]').should('exist');
        cy.log('Backspace button exists');
      }
    });
  });

  it('shows äöü if addUmlautKeys param is true', () => {
    cy.setupTestData(defaultTestFile, interactionType);
    let testData: UnitDefinition;
    const umlautKeys = ['ä', 'ö', 'ü'];
    cy.get('@testData').then(data => {
      testData = data as unknown as UnitDefinition;

      const writeParams = testData.interactionParameters as InteractionWriteParams;
      const addUmlautKeys = writeParams.addUmlautKeys;

      if (addUmlautKeys) {
        umlautKeys.forEach(key => {
          cy.get(`[data-cy=grapheme-button-${key}]`).should('exist');
          cy.log(`${key} grapheme key exists`);
        });
      }
    });
  });

  it('shows the buttons inside keysToAdd param', () => {
    cy.setupTestData(defaultTestFile, interactionType);
    let testData: UnitDefinition;

    cy.get('@testData').then(data => {
      testData = data as unknown as UnitDefinition;

      const writeParams = testData.interactionParameters as InteractionWriteParams;
      const extraKeyboardKeys: string[] = writeParams.keysToAdd ?? [];

      if (extraKeyboardKeys.length > 0) {
        extraKeyboardKeys.forEach((key: string) => {
          cy.get(`[data-cy=keyboard-button-${key}]`).should('exist');
          cy.log(`${key} extra keyboard key exists`);
        });
      }
    });
  });

  it('renders the correct UI based on keyboardMode', () => {
    // 1. Check default keyboardMode: CHARACTERS
    cy.setupTestData(defaultTestFile, interactionType);
    cy.get('[data-cy=write-container]').should('have.class', 'characters-type');
    cy.get('[data-cy=character-button-a]').should('exist');

    // 3. Check keyboardMode: NUMBERS_LINE
    cy.setupTestData('write_numbersLine_test', interactionType);
    cy.get('[data-cy=write-container]').should('have.class', 'numbers_line-type');
    cy.get('[data-cy=numbers-button-1]').should('exist');
  });

  // Test base features for the WRITE interaction type
  testBaseFeatures(interactionType, defaultTestFile);
  // Test former state features for the WRITE interaction type
  testFormerStateFeatures(interactionType, defaultTestFile);
  // Test keyboard interactions for NUMBERS_LINE mode
  testKeyboardInteractions(interactionType, 'write_numbersLine_test');
});
