import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { VoeStartCommand, VoeMessage } from '../models/verona-editor';

@Injectable({ providedIn: 'root' })
export class EditorVeronaSubscriptionService {
  private _voeStartCommand = new Subject<VoeStartCommand>();

  constructor() {
    fromEvent(window, 'message')
      .subscribe((event: Event): void => this.handleMessage((event as MessageEvent).data as VoeMessage));
  }

  private handleMessage(messageData: VoeMessage): void {
    if (messageData?.type === 'voeStartCommand') {
      this._voeStartCommand.next(messageData as VoeStartCommand);
    }
  }

  get voeStartCommand(): Observable<VoeStartCommand> {
    return this._voeStartCommand.asObservable();
  }
}
