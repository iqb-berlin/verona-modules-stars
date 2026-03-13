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

const unitStates: Record<string, any> = {};

Cypress.Commands.add('clearUnitStates', () => {
  Object.keys(unitStates).forEach(key => delete unitStates[key]);
});

Cypress.Commands.add('setupTestData', (configFile: string, interactionType: string) => {
  const fullPath = `interaction-${interactionType}/${configFile}`;
  cy.fixture(fullPath).as('testData');
  cy.visit('http://localhost:4200', {
    onBeforeLoad(win) {
      const mockParent = {
        postMessage: (data: any) => {
          if (data.type === 'vopStateChangedNotification' && data.unitState) {
            // Use the current test file as key for simplicity in this test context
            unitStates[configFile] = JSON.parse(JSON.stringify(data.unitState));
          }
        }
      };

      Object.defineProperty(win, 'parent', {
        value: mockParent,
        configurable: true
      });

      // Restore state if we have one for this file
      win.addEventListener('message', (event: MessageEvent) => {
        if (event.data.type === 'vopStartCommand' && unitStates[configFile]) {
          event.data.unitState = JSON.parse(JSON.stringify(unitStates[configFile]));
        }
      }, true);
    }
  });
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
  cy.get('[data-cy="custom-audio-button"]', { timeout: 60000 }) // wait up to 60s
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

Cypress.Commands.add('applyStandardScenarios', (interactionType: string, navigator?: unknown) => {
  const isCoordString = (val: string) => /^\s*\d+\s*,\s*\d+\s*$/.test(val);
  const parseCoords = (val: string): [number, number] => {
    const coords = val.split(',').map(v => Number.parseInt(v.trim(), 10));
    return [coords[0] || 0, coords[1] || 0];
  };

  if (interactionType === 'image_only') {
    cy.get('[data-cy="stimulus-image"]').should('exist').and('be.visible');
    cy.log('For interactionType: ', interactionType, 'stimulus-image exists and visible.');
    return;
  }

  if (interactionType === 'write') {
    if (navigator !== undefined) {
      if (typeof navigator === 'string') {
        // allow 'a' | 'A' or 'character-button-a'
        const letterMatch = navigator.match(/^[a-z]$/i);
        if (letterMatch && letterMatch[0]) {
          const letter = letterMatch[0].toLowerCase();
          cy.get(`[data-cy=character-button-${letter}]`).click();
          return;
        }
        const btnMatch = navigator.match(/^character-button-([a-z])$/i);
        if (btnMatch && btnMatch[1]) {
          const letter = btnMatch[1].toLowerCase();
          cy.get(`[data-cy=character-button-${letter}]`).click();
          return;
        }
        // if a raw selector is passed
        if (navigator.startsWith('[data-cy=')) {
          cy.get(navigator).click();
          return;
        }
      }
    }
    // Default behavior
    cy.get('[data-cy=character-button-a]').click();
    return;
  }

  if (interactionType === 'find_on_image') {
    if (navigator !== undefined) {
      if (Array.isArray(navigator) && navigator.length === 2 &&
        typeof navigator[0] === 'number' && typeof navigator[1] === 'number') {
        cy.get('[data-cy="image-element"]').click(navigator[0] as number, navigator[1] as number);
        return;
      }
      if (typeof navigator === 'string' && isCoordString(navigator)) {
        const [x, y] = parseCoords(navigator);
        cy.get('[data-cy="image-element"]').click(x, y);
        return;
      }
    }
    // Default behavior
    cy.get('[data-cy="image-element"]').click(100, 150);
    return;
  }

  if (interactionType === 'polygon_buttons') {
    if (navigator !== undefined) {
      if (typeof navigator === 'number') {
        cy.get(`[data-cy="polygon-${navigator}"]`).click();
        return;
      }
      if (typeof navigator === 'string') {
        const polyMatch = navigator.match(/^polygon-(\d+)$/);
        if (polyMatch && polyMatch[1]) {
          cy.get(`[data-cy="polygon-${polyMatch[1]}"]`).click();
          return;
        }
      }
    }
    // Default behavior
    cy.get('[data-cy="polygon-0"]').click();
    return;
  }

  if (interactionType === 'place_value') {
    if (navigator !== undefined) {
      let targetTens = 0;
      let targetOnes = 0;
      if (typeof navigator === 'string') {
        const parts = navigator.split(',');
        if (parts.length === 2) {
          targetTens = Number.parseInt(parts[0]!.trim(), 10);
          targetOnes = Number.parseInt(parts[1]!.trim(), 10);
        } else if (parts.length === 1) {
          targetOnes = Number.parseInt(parts[0]!.trim(), 10);
        }
      } else if (typeof navigator === 'number') {
        targetTens = Math.floor(navigator / 10);
        targetOnes = navigator % 10;
      }
      cy.movePlaceValueIcons(targetTens, targetOnes);
      return;
    }
    // Default behavior
    cy.get('[data-cy="icon-item-ones"]').first().click({ force: true });
    cy.wait(500); // Wait for debounce
    return;
  }

  // Default for BUTTONS, DROP and others
  if (navigator !== undefined) {
    if (typeof navigator === 'number') {
      const idx = navigator;
      const selector = `[data-cy="button-${idx}"]`;
      cy.get(selector).click();
      return;
    }
    if (typeof navigator === 'string') {
      const btnIdx = navigator.match(/^button-(\d+)$/);
      if (btnIdx && btnIdx[1]) {
        cy.get(`[data-cy="button-${btnIdx[1]}"]`).click();
        return;
      }
      if (navigator.startsWith('[data-cy=')) {
        cy.get(navigator).click();
        return;
      }
    }
  }
  // Fallback default: click the button index 1
  cy.clickButtonAtIndexOne();
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

Cypress.Commands.add('clickMultiselectButtons', (interactionType: string, unit: UnitDefinition, correct: boolean) => {
  const variableInfo = unit.variableInfo?.[0];
  if (!variableInfo || variableInfo.codingSource !== 'SUM_CHAR_MATCHES') {
    return;
  }
  const codingSourceParameter = variableInfo.codingSourceParameter;
  if (!codingSourceParameter) {
    return;
  }

  const codeToTarget = correct ? 1 : 2;
  const targetCode = variableInfo.codes.find(c => c.code === codeToTarget);

  if (!targetCode) {
    return;
  }

  const numberOfMatches = parseInt(targetCode.parameter, 10);

  // SUM_CHAR_MATCHES logic:
  // The 'codingSourceParameter' (e.g., "011") defines the correct state for each button
  //   '1' means the button should be selected (clicked)
  //   '0' means the button should not be selected (not clicked)
  //
  // A match at index 'i' occurs if the user's final selection at that index matches
  // the character at index 'i' in 'codingSourceParameter'
  //
  // The code/score is determined by the total number of matches across all buttons
  // To achieve a target 'numberOfMatches' (number of matches), we:
  //   1. Keep 'numberOfMatches' positions identical to 'codingSourceParameter'
  //   2. Flip the remaining positions (totalLength - numberOfMatches) to ensure they DON'T match

  const totalLength = codingSourceParameter.length;
  // Ensure the remaining position do not match the codingSourceParameter
  const numToFlip = totalLength - numberOfMatches;

  // Generate the target button states by flipping the first 'numToFlip' characters
  // Flipping ensures that these positions will definitely NOT match the codingSourceParameter,
  // while the remaining positions will match perfectly
  const buttonsToClick: boolean[] = [];
  for (let i = 0; i < totalLength; i++) {
    const originalChar = codingSourceParameter[i];
    let targetChar = originalChar;
    if (i < numToFlip) {
      // Flip the bit: '1' becomes '0', '0' becomes '1'.
      // This results in a mismatch at this index.
      targetChar = originalChar === '1' ? '0' : '1';
    }
    // If targetChar is '1', the button needs to be in a 'clicked' state.
    buttonsToClick.push(targetChar === '1');
  }

  // Iterate through the generated states and click the buttons that should be '1'
  // Since we start from an unselected state, clicking a button once sets it to '1'
  for (let i = 0; i < buttonsToClick.length; i++) {
    if (buttonsToClick[i]) {
      const buttonSelector = interactionType === 'polygon_buttons' ?
        `[data-cy="polygon-${i}"]` :
        `[data-cy="button-${i}"]`;
      cy.get(buttonSelector).click();
    }
  }
});

Cypress.Commands.add('assertInteractionComponentVisible', (interactionType: string) => {
  cy.log(`Waiting for interaction visibility: ${interactionType}`);
  if (interactionType === 'polygon_buttons') {
    cy.get('[data-cy="polygon-buttons-container"]', { timeout: 15000 }).should('be.visible');
  } else if (interactionType === 'write') {
    cy.get('[data-cy=write-container]', { timeout: 15000 }).should('be.visible');
  } else if (interactionType === 'place_value') {
    cy.get('[data-cy="interaction-place-value"]', { timeout: 15000 }).should('be.visible');
  } else if (interactionType === 'drop') {
    cy.get('[data-cy="drop-container"]', { timeout: 15000 }).should('be.visible');
  } else if (interactionType === 'find_on_image') {
    cy.get('[data-cy="image-element"]')
      .should('exist')
      .and('be.visible')
      .and('have.attr', 'src');
  } else {
    // Button interaction type
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="click-layer"]').length > 0) {
        cy.get('[data-cy="button-0"]', { timeout: 15000 }).should('exist');
      } else {
        cy.get('[data-cy="button-0"]', { timeout: 15000 }).should('be.visible');
      }
    });
  }
});

Cypress.Commands.add('assertRestoredState', (interactionType: string, expected?: unknown) => {
  cy.log(`Verifying restored state for interaction type: ${interactionType}`);
  if (interactionType === 'polygon_buttons') {
    let targetIndex = 0;
    if (expected !== undefined) {
      if (typeof expected === 'number') {
        targetIndex = expected;
      } else if (typeof expected === 'string') {
        const polyMatch = expected.match(/^polygon-(\d+)$/);
        if (polyMatch && polyMatch[1]) {
          targetIndex = Number.parseInt(polyMatch[1], 10);
        } else {
          targetIndex = Number.parseInt(expected, 10);
        }
      }
    }
    cy.get(`[data-cy="polygon-${targetIndex}"]`, { timeout: 15000 }).should('have.class', 'clicked');
    cy.log(`Approved: interactionType: ${interactionType} polygon-${targetIndex} has a clicked class`);
  } else if (interactionType === 'write') {
    let expectedText = 'A';
    if (expected !== undefined) {
      if (typeof expected === 'string') {
        // navigator could be 'a' or 'character-button-a'
        const letterMatch = expected.match(/^[a-z]$/i);
        if (letterMatch) {
          expectedText = expected.toUpperCase();
        } else {
          const btnMatch = expected.match(/^character-button-([a-z])$/i);
          if (btnMatch && btnMatch[1]) {
            expectedText = btnMatch[1].toUpperCase();
          }
        }
      }
    }
    cy.get('[data-cy=text-span]', { timeout: 15000 }).should('contain', expectedText);
    cy.log(`Approved: interactionType: ${interactionType} text-span containes expectedText ${expectedText}`);
  } else if (interactionType === 'place_value') {
    // If expected is provided, parse it to determine how many tens/ones should be moved
    let expectedTens = undefined as number | undefined;
    let expectedOnes = undefined as number | undefined;

    if (expected !== undefined) {
      if (typeof expected === 'string') {
        const parts = expected.split(',').map(p => p.trim());
        if (parts.length === 2) {
          expectedTens = Number.parseInt(parts[0]!, 10);
          expectedOnes = Number.parseInt(parts[1]!, 10);
        } else if (parts.length === 1) {
          expectedOnes = Number.parseInt(parts[0]!, 10);
        }
      } else if (typeof expected === 'number') {
        expectedTens = Math.floor(expected / 10);
        expectedOnes = expected % 10;
      }
    }

    // Default expectation: one ones icon moved if nothing provided
    if (expectedTens === undefined && expectedOnes === undefined) {
      expectedOnes = 1;
    }

    if (expectedTens !== undefined) {
      cy.get('[data-cy="icon-item-tens-moved"]', { timeout: 15000 }).should('have.length', expectedTens);
      cy.log(`Approved: interactionType: ${interactionType} icon-item-tens-moved have a length of ${expectedTens}`);
    }
    if (expectedOnes !== undefined) {
      cy.get('[data-cy="icon-item-ones-moved"]', { timeout: 15000 }).should('have.length', expectedOnes);
      cy.log(`Approved: interactionType: ${interactionType} icon-item-ones-moved have a length of ${expectedOnes}`);
    }
  } else if (interactionType === 'drop') {
    // Verifies the button at index 0 has been moved
    cy.get('[data-cy="drop-animate-wrapper-0"]', { timeout: 15000 })
      .should('have.css', 'transform');
    cy.log(`Approved: interactionType: ${interactionType} drop-animate-wrapper-0 have css transform`);
  } else if (interactionType === 'find_on_image') {
    cy.get('[data-cy="click-target"]')
      .should('exist');
    cy.log(`Approved: interactionType: ${interactionType} click-target exists`);
  } else if (interactionType === 'buttons') {
    let targetIndex = 1;
    if (expected !== undefined) {
      if (typeof expected === 'number') {
        targetIndex = expected;
      } else if (typeof expected === 'string') {
        const btnIdx = expected.match(/^button-(\d+)$/);
        if (btnIdx && btnIdx[1]) {
          targetIndex = Number.parseInt(btnIdx[1], 10);
        } else {
          targetIndex = Number.parseInt(expected, 10);
        }
      }
    }
    cy.get(`[data-cy="button-${targetIndex}"] input`, { timeout: 15000 }).should('have.attr', 'data-selected', 'true');
    cy.log(`Approved: interactionType: ${interactionType} button-${targetIndex} have attribute: data-selected`);
  } else {
    // Other interaction types, fallback or generic button verification
    cy.get('[data-cy="button-1"] input', { timeout: 15000 }).should('have.attr', 'data-selected', 'true');
    cy.log(`Approved: interactionType: ${interactionType} button-1 have attribute: data-selected`);
  }
});

Cypress.Commands.add('clickCorrectMultiselectButtons', (interactionType: string, unit: UnitDefinition) => {
  cy.clickMultiselectButtons(interactionType, unit, true);
});

Cypress.Commands.add('clickIncorrectMultiselectButtons', (interactionType: string, unit: UnitDefinition) => {
  cy.clickMultiselectButtons(interactionType, unit, false);
});
