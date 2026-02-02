/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import {
  InteractionParameters,
  UnitDefinition
} from '../../projects/player/src/app/models/unit-definition';
import { getButtonOptions, getCorrectAnswerParam, getIndexByOneBasedInput } from './utils';

Cypress.Commands.add('loadUnit', (filename: string) => {
  cy.fixture(filename).as('unit').then(unit => {
    cy.window().then(window => {
      const postMessage = {
        type: 'vopStartCommand',
        sessionId: 'cypress-test-session',
        unitDefinition: JSON.stringify(unit)
      };
      window.postMessage(postMessage, '*');
    });
  });
});

Cypress.Commands.add('setupTestData', (configFile: string, interactionType: string) => {
  const fullPath = `interaction-${interactionType}/${configFile}`;
  cy.fixture(fullPath).as('testData');
  cy.visit('http://localhost:4200');
  cy.loadUnit(fullPath);
});

Cypress.Commands.add('removeClickLayer', () => {
  cy.get('[data-cy="click-layer"]').click();
});

// eslint-disable-next-line max-len
Cypress.Commands.add('setupTestDataWithPostMessageMock', (configFile: string, interactionType: string) => {
  // 1. FIRST load fixture data
  const fullPath = `interaction-${interactionType}/${configFile}`;
  return cy.fixture(fullPath).then(unit => {
    const unitJson = JSON.stringify(unit);
    cy.wrap(unit, { log: false }).as('testData');
    cy.wrap(unitJson, { log: false }).as('unitJson');

    // 2. THEN visit with mock setup
    cy.visit('http://localhost:4200', {
      onBeforeLoad(win) {
        // Capture messages from child to parent (outgoing)
        const outgoingMessages: Array<{
          data: any;
          origin: string;
        }> = [];

        const mockParent = {
          postMessage: (data: any, origin: string) => {
            console.log('Child → Parent message:', data);
            outgoingMessages.push({
              data,
              origin
            });
          }
        };

        Object.defineProperty(win, 'parent', {
          value: mockParent,
          configurable: true
        });

        // Capture messages sent from parent to child (incoming)
        const incomingMessages: Array<{
          data: any;
          origin: string;
        }> = [];

        // Listen for actual MessageEvents - only store vopStartCommand
        win.addEventListener('message', (event: MessageEvent) => {
          console.log('Parent → Child message event:', event.data);
          incomingMessages.push({
            data: event.data,
            origin: event.origin
          });
        }, true);

        // Store on window
        (win as any).incomingMockMessage = incomingMessages;
        (win as any).outgoingMockMessage = outgoingMessages;
      }
    });

    // 3. AFTER visit, expose aliases
    cy.window().then(win => {
      cy.wrap((win as any).incomingMockMessage).as('incomingMessages');
      cy.wrap((win as any).outgoingMockMessage).as('outgoingMessages');
    });
  });
});

Cypress.Commands.add('sendMessageFromParent', (data, origin = '*') => {
  cy.window().then(win => {
    cy.log('Sending message from parent', data);
    win.postMessage(data, origin);
    cy.log('postMessage sent');
  });
});

Cypress.Commands.add('assertContinueButtonExistsAndVisible', () => {
  cy.get('[data-cy="continue-button"]').should('exist').and('be.visible');
});

Cypress.Commands.add('assertContinueButtonNotExists', () => {
  cy.get('[data-cy="continue-button"]').should('not.exist');
});

Cypress.Commands.add('clickContinueButton', () => {
  cy.get('[data-cy="continue-button"]').click();
});

Cypress.Commands.add('clickButtonAtIndexOne', () => {
  cy.get('[data-cy="button-1"]').click();
});

Cypress.Commands.add('waitUntilAudioIsFinishedPlaying', () => {
  cy.get('[data-cy="audio-button-animation"]', { timeout: 60000 }) // wait up to 60s
    .should($el => {
      // check that the class 'playing' is not present
      expect($el).not.to.have.class('playing');
    });
});

Cypress.Commands.add('writeTextOnKeyboard', (text: string) => {
  const letters = text.toLowerCase().split('');

  letters.forEach(char => {
    cy.get(`[data-cy=character-button-${char}]`).click();
  });

  const capitalizedText =
    (text[0]?.toUpperCase() ?? '') + text.slice(1).toLowerCase();

  cy.get('[data-cy=text-span]').should('contain', capitalizedText);
});

Cypress.Commands.add('waitUntilFeedbackIsFinishedPlaying', () => {
  // First, wait for the audio to start playing (indicated by the is-playing class)
  cy.get('[data-cy="continue-button"]', { timeout: 10000 })
    .should('have.class', 'is-playing')
    .then(() => {
      cy.log('Feedback audio started playing, waiting for it to finish...');

      // Then wait for it to stop playing
      cy.get('[data-cy="continue-button"]', { timeout: 60000 })
        .should('not.have.class', 'is-playing')
        .then(() => {
          cy.log('Feedback audio finished playing');
        });
    });
});

/**
 * Helper function to parse position range string into coordinates
 * @param positionRange - string like "42,35-55,87"
 * @returns object with x1, y1, x2, y2 values
 */
const parsePositionRange = (positionRange: string): { x1: number, y1: number, x2: number, y2: number } => {
  const parts = positionRange.split('-');
  if (parts.length !== 2) {
    throw new Error(`Invalid position range format: ${positionRange}. Expected format: "x1,y1-x2,y2"`);
  }

  // Ensure parts[0] and parts[1] exist and can be split
  if (!parts[0] || !parts[1]) {
    throw new Error(`Invalid position range format: ${positionRange}. Expected format: "x1,y1-x2,y2"`);
  }

  const startCoords = parts[0].split(',').map(Number);
  const endCoords = parts[1].split(',').map(Number);

  if (startCoords.length !== 2 || endCoords.length !== 2) {
    throw new Error(`Invalid position range coordinates: ${positionRange}. Expected format: "x1,y1-x2,y2"`);
  }

  // Convert to numbers with explicit validation
  const x1 = Number(startCoords[0]);
  const y1 = Number(startCoords[1]);
  const x2 = Number(endCoords[0]);
  const y2 = Number(endCoords[1]);

  // Check if any conversion resulted in NaN
  if (Number.isNaN(x1) || Number.isNaN(y1) || Number.isNaN(x2) || Number.isNaN(y2)) {
    throw new Error(`Invalid numeric values in position range: ${positionRange}`);
  }

  return {
    x1, y1, x2, y2
  };
};

Cypress.Commands.add('clickInPositionRange', (positionRange: string) => {
  // Parse the position range
  const {
    x1, y1, x2, y2
  } = parsePositionRange(positionRange);

  // Calculate the center point of the range
  const centerX = Math.floor((x1 + x2) / 2);
  const centerY = Math.floor((y1 + y2) / 2);

  cy.log(`Clicking in position range: ${positionRange}, center point: ${centerX},${centerY}`);

  // Get the image element and click at the calculated position
  cy.get('[data-cy="image-element"]')
    .then($img => {
      const img = $img[0] as HTMLImageElement;

      // Get actual rendered size + position
      const rect = img.getBoundingClientRect();

      // Convert percentage to actual pixel coordinates
      const clickX = rect.left + (rect.width * centerX) / 100;
      const clickY = rect.top + (rect.height * centerY) / 100;

      // Click using client coordinates relative to the image
      cy.wrap($img)
        .click(clickX - rect.left, clickY - rect.top);

      cy.log(`Clicked at coordinates: ${clickX - rect.left}, ${clickY - rect.top} (relative to image)`);
    });
});

Cypress.Commands.add('clearTextInput', (testData?: UnitDefinition) => {
  // Extract maxInputLength from testData or use default value as a max limit
  const defaultMaxLength = 10;
  let maxLimit = defaultMaxLength;

  if (testData?.interactionParameters && 'maxInputLength' in testData.interactionParameters) {
    const { maxInputLength } = testData.interactionParameters as { maxInputLength?: number };
    if (maxInputLength && !Number.isNaN(maxInputLength)) {
      maxLimit = maxInputLength;
    }
  }

  let safetyCounter = 0;

  const performBackspace = () => {
    // Check if the safety limit is hot
    if (safetyCounter >= maxLimit) {
      cy.log('Safety limit reached while clearing text');
      return;
    }

    // Increment safety counter
    // eslint-disable-next-line no-plusplus
    safetyCounter++;

    // Check if the text span exists
    cy.document().then(doc => {
      const textSpan = doc.querySelector('[data-cy=text-span]');

      if (!textSpan) {
        // Text span doesn't exist (fully cleared)
        cy.log('Text fully cleared - text-span element no longer exists');
        return;
      }

      // Text span exists, check if it has content
      const currentText = textSpan.textContent?.trim() || '';

      if (!currentText) {
        // Text span exists but is empty
        cy.log('Text span exists but is empty - clearing complete');
        return;
      }

      // Text span has content, click backspace and continue
      cy.log(`Clearing character from: "${currentText}"`);
      cy.get('[data-cy=backspace-button]').click();

      // Continue clearing
      performBackspace();
    });
  };

  // Start the clearing process
  performBackspace();
});

Cypress.Commands.add('movePlaceValueIcons', (targetTens: number, targetOnes: number) => {
  // Check how many are already moved
  cy.get('body').then($body => {
    const initialTensMoved = $body.find('[data-cy="icon-item-tens-moved"]').length;
    const initialOnesMoved = $body.find('[data-cy="icon-item-ones-moved"]').length;

    // Move tens
    for (let i = initialTensMoved; i < targetTens; i++) {
      cy.get('[data-cy="icon-item-tens"]').first().click({ force: true });
      cy.get('[data-cy="icon-item-tens-moved"]').should('have.length', i + 1);
      cy.wait(500); // Wait for debounce
    }

    // Move ones
    for (let i = initialOnesMoved; i < targetOnes; i++) {
      cy.get('[data-cy="icon-item-ones"]').first().click({ force: true });
      cy.get('[data-cy="icon-item-ones-moved"]').should('have.length', i + 1);
      cy.wait(500); // Wait for debounce
    }
  });
});

Cypress.Commands.add('applyStandardScenarios', (interactionType: string) => {
  cy.log('first apply standard scenarios that are wrong:');
  if (interactionType === 'write') {
    // Click any letter
    cy.get('[data-cy=character-button-a]').click();
  } else if (interactionType === 'find_on_image') {
    // Click a specific place on image
    cy.get('[data-cy="image-element"]')
      .click(100, 150);
  } else if (interactionType === 'polygon_buttons') {
    cy.get('[data-cy="polygon-1"]').click();
  } else if (interactionType === 'place_value') {
    cy.get('[data-cy="icon-item-ones"]').first().click({ force: true });
    cy.wait(500); // Wait for debounce
  } else {
    // InteractionType: BUTTONS, DROP
    // Click the button index 1
    cy.clickButtonAtIndexOne();
  }
});

Cypress.Commands.add('applyCorrectAnswerScenarios', (interactionType: string, dataToCheck: UnitDefinition) => {
  const correctAnswerParam = getCorrectAnswerParam(dataToCheck);
  // Click correct answer based on interaction type
  if (interactionType === 'write') {
    // Delete text that was written previously
    cy.clearTextInput(dataToCheck);
    // Write the correct answer on the keyboard
    cy.writeTextOnKeyboard(correctAnswerParam);
  } else if (interactionType === 'find_on_image') {
    // For find_on_image, the correctAnswerParam is in the format "x1,y1-x2,y2"
    cy.clickInPositionRange(correctAnswerParam);
  } else if (interactionType === 'place_value') {
    // For place_value, the correctAnswerParam is in the format "tens-ones"
    const targetValue = Number.parseInt(correctAnswerParam, 10);
    const targetTens = Math.floor(targetValue / 10);
    const targetOnes = targetValue % 10;
    cy.movePlaceValueIcons(targetTens, targetOnes);
  } else {
    // For other interaction types (buttons, drop, polygon_buttons),
    // find the button containing the correct answer
    const buttonOptions = getButtonOptions(
      dataToCheck.interactionParameters as unknown as InteractionParameters
    );
    const buttonIndex = getIndexByOneBasedInput(buttonOptions, correctAnswerParam);

    if (buttonIndex !== undefined) {
      const buttonSelector = interactionType === 'polygon_buttons' ?
        `[data-cy="polygon-${buttonIndex}"]` :
        `[data-cy="button-${buttonIndex}"]`;
      cy.get(buttonSelector).click();
    }
  }
});
