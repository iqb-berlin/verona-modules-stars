import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';

import {
  VopMessage,
  VopNavigationDeniedNotification,
  VopPageNavigationCommand,
  VopPlayerConfigChangedNotification,
  VopStartCommand
} from '../models/verona';
import { LogService } from "./log.service";


@Injectable({
  providedIn: 'root'
})

export class VeronaSubscriptionService {
  private _vopStartCommand = new Subject<VopStartCommand>();
  private _vopNavigationDeniedNotification = new Subject<VopNavigationDeniedNotification>();
  private _vopPageNavigationCommand = new Subject<VopPageNavigationCommand>();
  private _vopPlayerConfigChangedNotification = new Subject<VopPlayerConfigChangedNotification>();

  resourceURL: string | undefined;

  constructor() {
    fromEvent(window, 'message')
      .subscribe((event: Event): void => this.handleMessage((event as MessageEvent).data as VopMessage));
  }

  private handleMessage(messageData: VopMessage): void {
    switch (messageData.type) {
      case 'vopStartCommand':
        LogService.debug('player: _vopStartCommand ', messageData);
        this._vopStartCommand.next(messageData);
        break;
      case 'vopPlayerConfigChangedNotification':
        LogService.debug('player: vopPlayerConfigChangedNotification ', messageData);
        this._vopPlayerConfigChangedNotification.next(messageData);
        break;
      case 'vopNavigationDeniedNotification':
        LogService.info('player: _vopNavigationDeniedNotification ', messageData);
        this._vopNavigationDeniedNotification.next(messageData);
        break;
      case 'vopPageNavigationCommand':
        LogService.info('player: _vopPageNavigationCommand ', messageData);
        this._vopPageNavigationCommand.next(messageData);
        break;
      default:
        LogService.info(`player: got message of unknown type ${messageData.type}`);
    }
  }

  get vopStartCommand(): Observable<VopStartCommand> {
    return this._vopStartCommand.asObservable();
  }

  get vopPlayerConfigChangedNotification(): Observable<VopPlayerConfigChangedNotification> {
    return this._vopPlayerConfigChangedNotification.asObservable();
  }

  get vopNavigationDeniedNotification(): Observable<VopNavigationDeniedNotification> {
    return this._vopNavigationDeniedNotification.asObservable();
  }

  get vopPageNavigationCommand(): Observable<VopPageNavigationCommand> {
    return this._vopPageNavigationCommand.asObservable();
  }
}
