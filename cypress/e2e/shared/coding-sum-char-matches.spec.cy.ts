import {
  UnitDefinition
} from '../../../projects/player/src/app/models/unit-definition';

export function testCodingSumCharMatches(configFile: string, interactionType: string) {
  describe(`Check coding SUM_CHAR_MATCHES for ${interactionType.toUpperCase()} with multiselect: true`, () => {

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

    // eslint-disable-next-line max-len
    it('when full true answers selected, sends vopStateChangedNotification with CODING_COMPLETE, score=1 and code=1', () => {
      // The example json has variableInfo with coding schemes
      cy.get('@unitJson')
        .then(unitJson => {
          const unit: UnitDefinition =
            typeof unitJson === 'string' ? JSON.parse(unitJson) as UnitDefinition :
              (unitJson as unknown as UnitDefinition);

          cy.sendMessageFromParent({
            type: 'vopStartCommand',
            sessionId: 'test-session-123',
            unitDefinition: JSON.stringify(unit)
          }, '*');

          // Check if the UI is rendered
          cy.assertInteractionComponentVisible(interactionType);

          // Click correct answers
          cy.clickMultiselectButtons(interactionType, unit, true);
        });

      cy.get('@outgoingMessages')
        .then(messages => {
          const arr = messages as unknown as MockMessage[];
          const stateMessages = arr.filter(msg => msg.data.type === 'vopStateChangedNotification');

          const latestMessage = stateMessages[stateMessages.length - 1];
          if (!latestMessage?.data?.unitState) {
            throw new Error('Latest message or unitState is undefined');
          }

          const parsedResponsesArrays = parseDataPartsResponses(latestMessage.data.unitState.dataParts);

          const hasCodingComplete =
            // eslint-disable-next-line max-len
            parsedResponsesArrays.some(responses => responses.some(response => (response.id === interactionType.toUpperCase()) &&
                response.status === 'CODING_COMPLETE' &&
                response.score === 1 &&
                response.code === 1
            )
            );

          expect(hasCodingComplete, `Should have CODING_COMPLETE for ${interactionType} with score=1 and code=1`)
            .to
            .equal(true);
        });
    });

    // eslint-disable-next-line max-len
    it('when some true answers selected, sends vopStateChangedNotification with CODING_COMPLETE, score=1 and code=2', () => {
      // The example json has variableInfo with coding schemes
      cy.get('@unitJson')
        .then(unitJson => {
          const unit: UnitDefinition =
            typeof unitJson === 'string' ? JSON.parse(unitJson) as UnitDefinition :
              (unitJson as unknown as UnitDefinition);

          cy.sendMessageFromParent({
            type: 'vopStartCommand',
            sessionId: 'test-session-123',
            unitDefinition: JSON.stringify(unit)
          }, '*');

          // Check if the UI is rendered
          cy.assertInteractionComponentVisible(interactionType);

          // Click some correct answers
          cy.clickMultiselectButtons(interactionType, unit, false);
        });

      cy.get('@outgoingMessages')
        .then(messages => {
          const arr = messages as unknown as MockMessage[];
          const stateMessages = arr.filter(msg => msg.data.type === 'vopStateChangedNotification');

          const latestMessage = stateMessages[stateMessages.length - 1];
          if (!latestMessage?.data?.unitState) {
            throw new Error('Latest message or unitState is undefined');
          }

          const parsedResponsesArrays = parseDataPartsResponses(latestMessage.data.unitState.dataParts);

          const hasCodingComplete =
            // eslint-disable-next-line max-len
            parsedResponsesArrays.some(responses => responses.some(response => (response.id === interactionType.toUpperCase()) &&
                response.status === 'CODING_COMPLETE' &&
                response.score === 1 &&
                response.code === 2
            )
            );

          expect(hasCodingComplete, `Should have CODING_COMPLETE for ${interactionType} with score=1 and code=2`)
            .to
            .equal(true);
        });
    });
  });
}

