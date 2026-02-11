import {
  Directive, input, output
} from '@angular/core';
import { StarsResponse } from '../services/responses.service';

@Directive()

export abstract class InteractionComponentDirective {
  parameters = input.required<unknown>();
  responses = output<StarsResponse[]>();
}
