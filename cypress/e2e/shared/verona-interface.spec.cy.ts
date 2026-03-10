import { UnitDefinition } from '../../../projects/player/src/app/models/unit-definition';

export function veronaInterfaceFeatures(interactionType: string) {
  describe('Verona Interface Features', () => {
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

    describe(`Testing interaction: ${interactionType}`, () => {
      const configFile = `${interactionType}_test.json`;
      // const containerSelector = `[data-cy=${interactionType.replace(/_/g, '-')}-container]`;

      beforeEach(() => {
        cy.setupTestDataWithPostMessageMock(configFile, interactionType);
      });

      it('sends vopReadyNotification on initialization from child', () => {
        cy.get('@outgoingMessages')
          .then(messages => {
            const outgoingArr = messages as unknown as MockMessage[];
            expect(outgoingArr.length, 'at least one outgoing message')
              .to
              .be
              .greaterThan(0);
            const firstMessage = outgoingArr[0] ?? (() => {
              throw new Error('No messages found');
            })();
            expect(firstMessage.data.type)
              .to
              .equal('vopReadyNotification');
          });
      });

      it('responds to the child with vopStartCommand, UI is rendered and state is DISPLAYED', () => {
        // Respond to the child with vopStartCommand (Parent -> child)
        cy.get('@unitJson')
          .then(unitJson => {
            cy.sendMessageFromParent({
              type: 'vopStartCommand',
              sessionId: 'test-session-123',
              unitDefinition: unitJson as unknown as string
            }, '*');
          });

        // Check if the UI is rendered
        // cy.get(containerSelector)
        //   .should('exist');

        // Check if the UI is rendered
        cy.assertInteractionComponentVisible(interactionType);

        cy.get('@incomingMessages')
          .then(msgs => {
            const incomingArr = msgs as unknown as MockMessage[];
            expect(incomingArr.length, 'at least one incoming message')
              .to
              .be
              .greaterThan(0);
            const msgFromParent = incomingArr[incomingArr.length - 1]!.data;
            expect(msgFromParent.type)
              .to
              .equal('vopStartCommand');
          });

        // outgoingMessages contains vopStateChangedNotification (child -> parent)
        // Check if the state is DISPLAYED
        cy.get('@outgoingMessages')
          .then(messages => {
            const arr = messages as unknown as MockMessage[];
            const stateChangedMessages = arr.filter(msg => msg.data.type === 'vopStateChangedNotification');
            expect(stateChangedMessages.length)
              .to
              .be
              .greaterThan(0);

            const latestMessage = stateChangedMessages[stateChangedMessages.length - 1];
            if (!latestMessage?.data?.unitState) {
              throw new Error('Latest message or unitState is undefined');
            }

            const parsedResponsesArrays = parseDataPartsResponses(latestMessage.data.unitState.dataParts);

            const hasDisplayedStatus =
            // eslint-disable-next-line max-len
                parsedResponsesArrays.some(responseArray => responseArray.some(response => response.id === interactionType.toUpperCase() && response.status === 'DISPLAYED')
                );

            expect(hasDisplayedStatus, 'Should have DISPLAYED status')
              .to
              .equal(true);
          });
      });

      it('on button click, sends vopStateChangedNotification with VALUE_CHANGED', () => {
        const configFileWithoutVariableInfo = `${interactionType}_without_variableInfo_test.json`;
        cy.setupTestDataWithPostMessageMock(configFileWithoutVariableInfo, interactionType);

        // Setup the app first
        cy.get('@unitJson')
          .then(unitJson => {
            cy.sendMessageFromParent({
              type: 'vopStartCommand',
              sessionId: 'test-session-123',
              unitDefinition: unitJson as unknown as string
            }, '*');
          });

        // Check if the UI is rendered
        cy.assertInteractionComponentVisible(interactionType);

        // Perform interaction to trigger VALUE_CHANGED status
        cy.applyStandardScenarios(interactionType);

        cy.get('@outgoingMessages')
          .then(messages => {
            const arr = messages as unknown as MockMessage[];
            const stateMessages = arr.filter(msg => msg.data.type === 'vopStateChangedNotification');

            const latestMessage = stateMessages[stateMessages.length - 1];
            if (!latestMessage?.data?.unitState) {
              throw new Error('Latest message or unitState is undefined');
            }

            const parsedResponsesArrays = parseDataPartsResponses(latestMessage.data.unitState.dataParts);

            const hasValueChanged =
            // eslint-disable-next-line max-len
                parsedResponsesArrays.some(responseArray => responseArray.some(response => response.id === interactionType.toUpperCase() && response.status === 'VALUE_CHANGED')
                );

            expect(hasValueChanged, 'Should have VALUE_CHANGED status')
              .to
              .equal(true);
          });
      });

      // eslint-disable-next-line max-len
      it('when the correct answer is selected, sends vopStateChangedNotification with CODING_COMPLETE, score=1 and code=1', () => {
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
            cy.applyCorrectAnswerScenarios(interactionType, unit);
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
    });
  });
}
