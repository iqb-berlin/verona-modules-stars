import { UnitDefinition } from '../../projects/player/src/app/models/unit-definition';

describe('App component', () => {
  const configFile = 'buttons_test.json';
  const interactionType = 'buttons';

  type MockMessage = {
    data: {
      type: string;
      unitState?: {
        dataParts: {
          responses: string;
        };
        responseProgress: string;
      };
    },
    origin: string
  };

  type ResponseItem = {
    id?: string;
    status?: string;
    score?: number;
    code?: number;
    [key: string]: unknown;
  };

  /**
   * Parse `dataParts` and extract arrays of `ResponseItem` from JSON string values.
   * @param dataParts - Record of keyed parts where some values may be JSON strings containing response arrays
   * @returns Array of parsed `ResponseItem[]` (empty array if no valid response arrays found)
   */
  const parseDataPartsResponses = (dataParts: Record<string, unknown>): ResponseItem[][] => Object.values(dataParts)
    .filter((dataPart): dataPart is string => typeof dataPart === 'string')
    .map(rawPart => {
      try {
        const parsed = JSON.parse(rawPart) as unknown;
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'object' && item !== null)) {
          return parsed as ResponseItem[];
        }
      } catch {
        // ignore non-JSON strings
        console.warn(`Non-JSON string found in dataParts: ${rawPart}`);
      }
      return null;
    })
    .filter((parsed): parsed is ResponseItem[] => Array.isArray(parsed));

  beforeEach(() => {
    cy.setupTestDataWithPostMessageMock(configFile, interactionType);
  });

  it('1. Should send vopReadyNotification on initialization from child', () => {
    cy.get('@outgoingMessages').then(messages => {
      const outgoingArr = messages as unknown as MockMessage[];
      expect(outgoingArr.length, 'at least one outgoing message').to.be.greaterThan(0);
      const firstMessage = outgoingArr[0] ?? (() => { throw new Error('No messages found'); })();
      expect(firstMessage.data.type).to.equal('vopReadyNotification');
    });
  });

  it('2. Should respond to the child with vopStartCommand, UI is rendered and state is DISPLAYED', () => {
    // Respond to the child with vopStartCommand (Parent -> child)
    cy.get('@unitJson').then(unitJson => {
      cy.sendMessageFromParent({
        type: 'vopStartCommand',
        sessionId: 'test-session-123',
        unitDefinition: unitJson as unknown as string
      }, '*');
    });

    // Check if the UI is rendered
    cy.get('[data-cy=buttons-container]').should('exist');

    cy.get('@incomingMessages').then(msgs => {
      const incomingArr = msgs as unknown as MockMessage[];
      expect(incomingArr.length, 'at least one incoming message').to.be.greaterThan(0);
      const msgFromParent = incomingArr[incomingArr.length - 1]!.data;
      expect(msgFromParent.type).to.equal('vopStartCommand');
    });

    // outgoingMessages contains vopStateChangedNotification (child -> parent)
    // Check if the state is DISPLAYED
    cy.get('@outgoingMessages').then(messages => {
      const arr = messages as unknown as MockMessage[];
      const stateChangedMessages = arr.filter(msg => msg.data.type === 'vopStateChangedNotification');
      expect(stateChangedMessages.length).to.be.greaterThan(0);

      const latestMessage = stateChangedMessages[stateChangedMessages.length - 1];
      if (!latestMessage?.data?.unitState) {
        throw new Error('Latest message or unitState is undefined');
      }

      const parsedResponsesArrays = parseDataPartsResponses(latestMessage.data.unitState.dataParts);

      const hasDisplayedStatus =
        parsedResponsesArrays.some(responseArray => responseArray.some(response => response.status === 'DISPLAYED')
        );

      expect(hasDisplayedStatus, 'Should have DISPLAYED status').to.equal(true);
    });
  });

  it('3. Should send vopStateChangedNotification with VALUE_CHANGED on button click', () => {
    // Setup the app first
    cy.get('@unitJson').then(unitJson => {
      cy.sendMessageFromParent({
        type: 'vopStartCommand',
        sessionId: 'test-session-123',
        unitDefinition: unitJson as unknown as string
      }, '*');
    });

    cy.get('[data-cy=buttons-container]').should('exist');

    // Click first button and test VALUE_CHANGED
    cy.clickButtonAtIndexOne();

    cy.get('@outgoingMessages').then(messages => {
      const arr = messages as unknown as MockMessage[];
      const stateMessages = arr.filter(msg => msg.data.type === 'vopStateChangedNotification');

      const latestMessage = stateMessages[stateMessages.length - 1];
      if (!latestMessage?.data?.unitState) {
        throw new Error('Latest message or unitState is undefined');
      }

      const parsedResponsesArrays = parseDataPartsResponses(latestMessage.data.unitState.dataParts);

      const hasValueChanged =
        parsedResponsesArrays.some(responseArray => responseArray.some(response => response.status === 'VALUE_CHANGED')
        );

      expect(hasValueChanged, 'Should have VALUE_CHANGED status').to.equal(true);
    });
  });

  it('4. Should send vopStateChangedNotification with CODING_COMPLETE, score=1 and code=1', () => {
    // The example json has variableInfo with coding schemes
    cy.get('@unitJson').then(unitJson => {
      const unit: UnitDefinition =
        typeof unitJson === 'string' ? JSON.parse(unitJson) as UnitDefinition : (unitJson as unknown as UnitDefinition);

      cy.sendMessageFromParent({
        type: 'vopStartCommand',
        sessionId: 'test-session-123',
        unitDefinition: JSON.stringify(unit)
      }, '*');

      const parameter = unit.variableInfo?.[0]?.codes?.[0]?.parameter;
      cy.get('[data-cy=buttons-container]').should('exist');

      const paramStr = String(parameter ?? '').trim();
      const match = paramStr.match(/\d+$/);
      if (!match) {
        throw new Error(`No numeric index found in parameter: ${paramStr}`);
      }
      const originalNum: number = Number.parseInt(match[0], 10);
      if (Number.isNaN(originalNum) || originalNum <= 0) {
        throw new Error(`Invalid numeric parameter: ${match[0]}`);
      }
      const buttonToClick: number = originalNum - 1;
      cy.get(`[data-cy="button-${buttonToClick}"]`).click();
    });

    cy.get('@outgoingMessages').then(messages => {
      const arr = messages as unknown as MockMessage[];
      const stateMessages = arr.filter(msg => msg.data.type === 'vopStateChangedNotification');

      const latestMessage = stateMessages[stateMessages.length - 1];
      if (!latestMessage?.data?.unitState) {
        throw new Error('Latest message or unitState is undefined');
      }

      const parsedResponsesArrays = parseDataPartsResponses(latestMessage.data.unitState.dataParts);

      const hasCodingComplete =
        parsedResponsesArrays.some(responses => responses.some(response => response.id === 'BUTTONS' &&
          response.status === 'CODING_COMPLETE' &&
          response.score === 1 &&
          response.code === 1
        )
        );

      expect(hasCodingComplete, 'Should have CODING_COMPLETE for BUTTONS with score=1 and code=1').to.equal(true);
    });
  });
});
