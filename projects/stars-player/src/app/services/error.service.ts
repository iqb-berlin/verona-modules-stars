import { ErrorHandler, Injectable } from '@angular/core';
import { AspectError } from "../models/aspect-error";
import { VeronaPostService } from "./verona-post.service";


@Injectable({
  providedIn: 'root'
})

export class ErrorService implements ErrorHandler {
  constructor(private veronaPostService: VeronaPostService) {}

  handleError(error: AspectError): void {
    if (error.name === AspectError.name) {
      this.veronaPostService.sendVopRuntimeErrorNotification(error);
    }
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
