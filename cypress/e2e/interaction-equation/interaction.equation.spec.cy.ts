import { testBaseFeatures } from "../shared/base-features.spec.cy";
import { testFormerStateFeatures } from "../shared/former-state.spec.cy";
import { testKeyboardInteractions } from "../shared/keyboard-interactions.spec.cy";

describe('EQUATION Interaction E2E Tests', () => {
  const interactionType = 'equation';
  const defaultTestFile = 'equation_test';

  beforeEach(() => {
    cy.clearUnitStates();
  });

  const setupAndAssert = (file: string) => {
    cy.setupTestData(file, interactionType);
    cy.get('[data-cy="interaction-equation"]').should('exist');
  };

  it('renders initial state correctly', () => {
    setupAndAssert(`${defaultTestFile}.json`);

    cy.get('[data-cy="interaction-equation"]').within(() => {
      cy.get('[data-cy="operator"]').should('exist');
      cy.get('[data-cy="operand2"]').should('exist');
      cy.get('[data-cy="result"]').should('exist');

      cy.get('[data-cy="keyboard-wrapper"]').should('exist');
      cy.get('[data-cy="backspace-button"]').should('exist');
    });
  });

  it('renders the imageSource if there is imageSource param', () => {
    setupAndAssert('equation_with_imageSource_test.json');
    cy.get('[data-cy="stimulus-image"]').should('exist').and('have.attr', 'src').should('not.be.empty');
  });

  it('renders the emptyField if fixOperand1, fixOperand2 or fixResult properties not exists', () => {
    // case 1: fixOperand1 missing
    setupAndAssert('equation_test.json');
    cy.get('[data-cy="operand1"]').invoke('text').then(text => expect(text.trim()).to.equal(''));
    cy.get('[data-cy="operand2"]').invoke('text').then(text => expect(text.trim()).to.not.equal(''));
    cy.get('[data-cy="result"]').invoke('text').then(text => expect(text.trim()).to.not.equal(''));

    // case 2: fixOperand2 missing
    setupAndAssert('equation_without_fixOperand2_test.json');
    cy.get('[data-cy="operand2"]').invoke('text').then(text => expect(text.trim()).to.equal(''));
    cy.get('[data-cy="operand1"]').invoke('text').then(text => expect(text.trim()).to.not.equal(''));
    cy.get('[data-cy="result"]').invoke('text').then(text => expect(text.trim()).to.not.equal(''));

    // case 3: fixResult missing
    setupAndAssert('equation_without_fixResult_test.json');
    cy.get('[data-cy="result"]').invoke('text').then(text => expect(text.trim()).to.equal(''));
    cy.get('[data-cy="operand1"]').invoke('text').then(text => expect(text.trim()).to.not.equal(''));
    cy.get('[data-cy="operand2"]').invoke('text').then(text => expect(text.trim()).to.not.equal(''));
  });

  it('if there is only 1 empty input field, this field will initially be selected, entering input is possible', () => {
    setupAndAssert('equation_test.json'); // only operand1 is missing

    // initially selected
    cy.get('[data-cy="operand1"]').should('have.class', 'selected');

    // entering input
    cy.get('[data-cy="keyboard-button-5"]').click();
    cy.get('[data-cy="operand1"]').invoke('text').then(text => expect(text.trim()).to.equal('5'));

    cy.get('[data-cy="keyboard-button-9"]').click();
    cy.get('[data-cy="operand1"]').invoke('text').then(text => expect(text.trim()).to.equal('59'));
  });

  it('input to multiple empty fields is possible', () => {
    setupAndAssert('equation_without_fixOperand1_without_fixOperand2_test.json');

    // none initially selected
    cy.get('[data-cy="operand1"]').should('not.have.class', 'selected');
    cy.get('[data-cy="operand2"]').should('not.have.class', 'selected');

    // select and enter input to operand1
    cy.get('[data-cy="operand1"]').click();
    cy.get('[data-cy="operand1"]').should('have.class', 'selected');
    cy.get('[data-cy="keyboard-button-1"]').click();
    cy.get('[data-cy="operand1"]').invoke('text').then(text => expect(text.trim()).to.equal('1'));

    // select and enter input to operand2
    cy.get('[data-cy="operand2"]').click();
    cy.get('[data-cy="operand2"]').should('have.class', 'selected');
    cy.get('[data-cy="keyboard-button-2"]').click();
    cy.get('[data-cy="operand2"]').invoke('text').then(text => expect(text.trim()).to.equal('2'));
  });

  it('keyboard gets disabled when current field has 2 digits', () => {
    setupAndAssert('equation_test.json'); // only operand1 missing, initially selected

    cy.get('[data-cy="operand1"]').should('have.class', 'selected');
    cy.get('[data-cy="keyboard-button-1"]').click();
    cy.get('[data-cy="keyboard-button-2"]').click();

    cy.get('[data-cy="operand1"]').invoke('text').then(text => expect(text.trim()).to.equal('12'));

    // number buttons should be disabled
    cy.get('[data-cy="keyboard-button-3"]').should('be.disabled');
  });

  it('backspace button is disabled when field is empty and enabled when it has content', () => {
    setupAndAssert('equation_test.json'); // operand1 missing, initially selected

    cy.get('[data-cy="operand1"]').invoke('text').then(text => expect(text.trim()).to.equal(''));
    cy.get('[data-cy="backspace-button"]').should('be.disabled');

    cy.get('[data-cy="keyboard-button-5"]').click();
    cy.get('[data-cy="backspace-button"]').should('not.be.disabled');

    cy.get('[data-cy="backspace-button"]').click();
    cy.get('[data-cy="operand1"]').invoke('text').then(text => expect(text.trim()).to.equal(''));
    cy.get('[data-cy="backspace-button"]').should('be.disabled');
  });

  it('keyboard focus moves to next field after entering 2 digits if available', () => {
    setupAndAssert('equation_without_fixOperand1_without_fixOperand2_test.json');

    // select and enter 2 digits to operand1
    cy.get('[data-cy="operand1"]').click();
    cy.get('[data-cy="keyboard-button-1"]').click();
    cy.get('[data-cy="keyboard-button-2"]').click();

    // focus should move to operand2
    cy.get('[data-cy="operand1"]').should('not.have.class', 'selected');
    cy.get('[data-cy="operand2"]').should('have.class', 'selected');
  });

  it('hides number keyboard initially and toggles correctly between keyboards if operators length > 1', () => {
    setupAndAssert('equation_without_operator_without_fixOperand2_test.json');

    // none initially selected
    cy.get('[data-cy="operand1"]').should('not.have.class', 'selected');
    cy.get('[data-cy="operator"]').should('not.have.class', 'selected');
    cy.get('[data-cy="operand2"]').should('not.have.class', 'selected');

    // number keyboard should not be visible
    cy.get('[data-cy="keyboard-button-1"]').should('not.exist');

    // click on operand2 to open number keyboard
    cy.get('[data-cy="operand2"]').click();
    cy.get('[data-cy="operand2"]').should('have.class', 'selected');
    cy.get('[data-cy="keyboard-button-1"]').should('exist');
    cy.get('[data-cy="operator-button-+"]').should('not.exist');

    // click on operator to open operator keyboard
    cy.get('[data-cy="operator"]').click();
    cy.get('[data-cy="operator"]').should('have.class', 'selected');
    cy.get('[data-cy="keyboard-button-1"]').should('not.exist');
    cy.get('[data-cy="operator-button-+"]').should('exist');
    cy.get('[data-cy="operator-button--"]').should('exist');

    // select an operator and verify it doesn't move to operand2
    cy.get('[data-cy="operator-button-+"]').click();
    cy.get('[data-cy="operator"]').invoke('text').then(text => expect(text.trim()).to.equal('+'));
    cy.get('[data-cy="operator"]').should('have.class', 'selected');
    cy.get('[data-cy="operand2"]').should('not.have.class', 'selected');
  });

  it('deletes the selected operator when operator-delete-button is clicked', () => {
    setupAndAssert('equation_without_operator_without_fixOperand2_test.json');

    // click on operator to open operator keyboard
    cy.get('[data-cy="operator"]').click();
    cy.get('[data-cy="operator"]').should('have.class', 'selected');

    // select an operator
    cy.get('[data-cy="operator-button-+"]').click();
    cy.get('[data-cy="operator"]').invoke('text').then(text => expect(text.trim()).to.equal('+'));

    // click on delete button
    cy.get('[data-cy="operator-delete-button"]').first().click({ force: true });

    // verify operator is deleted
    cy.get('[data-cy="operator"]').invoke('text').then(text => expect(text.trim()).to.equal(''));
  });

  it('equation wrapper position should remain stable when opening keyboard', () => {
    setupAndAssert('equation_without_fixOperand1_without_fixOperand2_test.json');

    // Initially no field is selected, no keyboard visible.
    cy.get('[data-cy="keyboard-button-1"]').should('not.exist');

    // Get position of equation-wrapper
    cy.get('.equation-wrapper').then($wrapper => {
      const initialTop = $wrapper.offset()!.top;

      // Select a field to open the keyboard
      cy.get('[data-cy="operand1"]').click();
      cy.get('[data-cy="keyboard-button-1"]').should('exist');

      // Check position again
      cy.get('.equation-wrapper').should($wrapperAfter => {
        expect($wrapperAfter.offset()!.top).to.be.closeTo(initialTop, 1);
      });
    });
  });

  // Test base features for the EQUATION interaction type
  testBaseFeatures(interactionType, defaultTestFile);
  // Test former state features for the EQUATION interaction type
  testFormerStateFeatures(interactionType, defaultTestFile);
  // Test keyboard interactions
  testKeyboardInteractions(interactionType, defaultTestFile);
});
