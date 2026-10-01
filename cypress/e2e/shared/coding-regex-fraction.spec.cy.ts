import { MockMessage } from '../../support/utils';

// Answers per interaction type, matching the {interactionType}_with_codingSource_regexFraction_test.json fixtures.
// REGEX_FRACTION drops the last "_<number>" part of the value, so that part never affects the code.
const answers: Record<string, { matching: () => void; notMatching: () => void }> = {
  // value: operand1_operator_operand2_result, coded part: operand1_operator_operand2, expected: ^3_\+_2$
  equation: {
    matching: () => enterEquation('3', '+', '2', '9'), // wrong result is ignored
    notMatching: () => enterEquation('3', '-', '2', '1')
  },
  // value: left_right, coded part: left, expected: ^10$
  pyramid: {
    matching: () => enterPyramid('10', '5'), // wrong right value is ignored
    notMatching: () => enterPyramid('9', '4')
  }
};

function typeDigits(digits: string) {
  digits.split('').forEach(digit => cy.get(`[data-cy="keyboard-button-${digit}"]`).click());
}

function enterEquation(operand1: string, operator: string, operand2: string, result: string) {
  cy.get('[data-cy="operand1"]').click();
  typeDigits(operand1);
  cy.get('[data-cy="operator"]').click();
  cy.get(`[data-cy="operator-button-${operator}"]`).click();
  cy.get('[data-cy="operand2"]').click();
  typeDigits(operand2);
  cy.get('[data-cy="result"]').click();
  typeDigits(result);
}

function enterPyramid(left: string, right: string) {
  cy.get('[data-cy="interactive-pyramid-input-left"]').click();
  typeDigits(left);
  cy.get('[data-cy="interactive-pyramid-input-right"]').click();
  typeDigits(right);
}

export function testCodingRegexFraction(configFile: string, interactionType: string) {
  describe(`Check coding REGEX_FRACTION with REGEX_MATCH for ${interactionType.toUpperCase()}`, () => {
    const assertLatestCoding = (expectedScore: number, expectedCode: number) => {
      cy.get('@outgoingMessages')
        .then(messages => {
          const arr = messages as unknown as MockMessage[];
          const stateMessages = arr.filter(msg => msg.data.type === 'vopStateChangedNotification');

          const latestMessage = stateMessages[stateMessages.length - 1];
          if (!latestMessage?.data?.unitState) {
            throw new Error('Latest message or unitState is undefined');
          }

          cy.parseDataPartsResponses(latestMessage.data.unitState.dataParts as Record<string, unknown>)
            .then(parsedResponsesArrays => {
              const hasCodingComplete =
                // eslint-disable-next-line max-len
                parsedResponsesArrays.some(responses => responses.some(response => (response.id === interactionType.toUpperCase()) &&
                  response.status === 'CODING_COMPLETE' &&
                  response.score === expectedScore &&
                  response.code === expectedCode
                )
                );

              // eslint-disable-next-line max-len
              expect(hasCodingComplete, `Should have CODING_COMPLETE for ${interactionType} with score=${expectedScore} and code=${expectedCode}`)
                .to
                .equal(true);
            });
        });
    };

    beforeEach(() => {
      cy.setupTestDataWithPostMessageMock(configFile, interactionType);
      cy.get('@unitJson')
        .then(unitJson => {
          cy.sendMessageFromParent({
            type: 'vopStartCommand',
            sessionId: 'test-session-123',
            unitDefinition: unitJson as unknown as string
          }, '*');

          // Check if the UI is rendered
          cy.assertInteractionComponentVisible(interactionType);
        });
    });

    // eslint-disable-next-line max-len
    it('when the extracted part matches the regex, sends vopStateChangedNotification with CODING_COMPLETE, score=1 and code=1', () => {
      answers[interactionType].matching();
      assertLatestCoding(1, 1);
    });

    // eslint-disable-next-line max-len
    it('when the extracted part does not match the regex, sends vopStateChangedNotification with CODING_COMPLETE, score=0 and code=0', () => {
      answers[interactionType].notMatching();
      assertLatestCoding(0, 0);
    });
  });
}
