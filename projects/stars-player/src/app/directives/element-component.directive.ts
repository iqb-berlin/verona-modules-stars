import { Directive, input, output } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { AspectError } from "../models/aspect-error";
import { VeronaResponse } from "../models/verona";


@Directive()

export abstract class ElementComponent {
  parentForm = input<FormGroup>();
  valueChange = output<VeronaResponse>();

  throwError(code: string, message: string) {
    throw new AspectError(code, message);
  }
}
