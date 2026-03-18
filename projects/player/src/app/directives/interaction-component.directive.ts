import {
  Directive, input, output
} from '@angular/core';

import { StarsResponse } from "../services/responses.service";

export interface OnShowHint {
  showHint(value: string): void;
}

@Directive({
  standalone: true
})
export abstract class InteractionComponentDirective {
  parameters = input.required<unknown>();
  showHint = input<string>('');
  responses = output<StarsResponse[]>();
}
