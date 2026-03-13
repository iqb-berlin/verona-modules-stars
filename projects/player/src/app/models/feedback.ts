export type FeedbackChain = 'NO_FEEDBACK' | 'FEEDBACK_PLAYING' | 'SHOW_ANSWER' | 'WAIT_FOR_AUDIO';

export interface FeedbackDefinition {
  variableId: string;
  source?: 'VALUE' | 'CODE' | 'SCORE';
  method?: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN';
  parameter: string;
  audioSource: string;
  showResponse?: ShowResponse;
}

export interface AudioFeedback {
  trigger: 'CONTINUE_BUTTON_CLICK' | 'ANY_RESPONSE';
  feedback: FeedbackDefinition[];
}

export interface ShowResponse {
  variableId: string;
  value: string;
  delayMS?: number;
}
