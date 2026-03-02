import {
  Directive, input, output
} from '@angular/core';

import { Response } from '@iqbspecs/response/response.interface';

export interface OnShowHint {
  showHint(value: string): void;
}

@Directive()
export abstract class InteractionComponentDirective {
  parameters = input.required<unknown>();
  showHint = input<string>('');
  responses = output<Response[]>();
}
