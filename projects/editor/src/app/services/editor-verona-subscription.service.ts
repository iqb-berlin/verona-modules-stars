import { Injectable, inject } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { VoeStartCommand, VoeMessage } from '../models/verona-editor';
import { EditorVeronaPostService } from './editor-verona-post.service';

@Injectable({ providedIn: 'root' })
export class EditorVeronaSubscriptionService {
  private veronaPostService = inject(EditorVeronaPostService);
  private _voeStartCommand = new Subject<VoeStartCommand>();

  constructor() {
    fromEvent(window, 'message')
      .subscribe((event: Event): void => this.handleMessage(event as MessageEvent));
  }

  private handleMessage(event: MessageEvent): void {
    const messageData = event.data as VoeMessage;
    if (messageData?.type === 'voeStartCommand') {
      if (event.source !== window.parent) {
        return;
      }
      this.veronaPostService.configureMessageContext(event.source, event.origin, messageData.sessionId);
      this._voeStartCommand.next(messageData as VoeStartCommand);
    }
  }

  get voeStartCommand(): Observable<VoeStartCommand> {
    return this._voeStartCommand.asObservable();
  }
}
