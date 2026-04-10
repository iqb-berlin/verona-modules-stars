export function testKeyboardInteractions(interactionType: string, defaultTestFile: string) {
  describe(`Keyboard Interactions for interactionType - ${interactionType}`, () => {
    const setupAndAssert = (file: string) => {
      cy.setupTestData(file, interactionType);
      let containerSelector = '';
      if (interactionType === 'number_line') {
        containerSelector = '[data-cy="interaction-number-line"]';
      } else if (interactionType === 'pyramid') {
        containerSelector = '[data-cy="interaction-pyramid"]';
      } else if (interactionType === 'equation') {
        containerSelector = '[data-cy="interaction-equation"]';
      } else {
        containerSelector = '[data-cy="write-container"]';
      }
      cy.get(containerSelector).should('exist');
      if (interactionType === 'pyramid') {
        cy.get('.pyramid-container').should('exist');
      }
    };

    const getDisplayTextSelector = () => {
      if (interactionType === 'number_line') {
        return '[data-cy="number-input-text"]';
      }
      if (interactionType === 'pyramid') {
        return '[data-cy="interactive-pyramid-input-left"]';
      }
      if (interactionType === 'equation') {
        return '[data-cy="operand1"]';
      }
      return '[data-cy="text-span"]';
    };

    const getKeyboardButtonSelector = (button: string) => {
      if (interactionType === 'number_line' || interactionType === 'pyramid' || interactionType === 'equation') {
        return `[data-cy="keyboard-button-${button}"]`;
      }
      return `[data-cy="numbers-button-${button}"]`;
    };

    it('handles keyboard interactions correctly', () => {
      setupAndAssert(`${defaultTestFile}.json`);

      const displayTextSelector = getDisplayTextSelector();

      // Type "1"
      cy.get(getKeyboardButtonSelector('1')).click();
      cy.get(displayTextSelector).invoke('text').then(text => {
        expect(text.trim()).to.equal('1');
      });

      // Type "2"
      cy.get(getKeyboardButtonSelector('2')).click();
      cy.get(displayTextSelector).invoke('text').then(text => {
        expect(text.trim()).to.equal('12');
      });

      // Try to type "3" (max length is 2 for these test cases)
      cy.get(getKeyboardButtonSelector('3')).should('be.disabled');

      // Backspace
      cy.get('[data-cy="backspace-button"]').click();
      cy.get(displayTextSelector).invoke('text').then((text) => {
        expect(text.trim()).to.equal('1');
      });

      // Backspace again
      cy.get('[data-cy="backspace-button"]').click();
      if (interactionType === 'number_line' || interactionType === 'pyramid' || interactionType === 'equation') {
        cy.get(displayTextSelector).invoke('text').then((text) => {
          expect(text.trim()).to.equal('');
        });
      } else {
        // In write interaction, if currentText is empty, text-span might be removed from DOM
        cy.get(displayTextSelector).should('not.exist');
      }
    });
  });
}
