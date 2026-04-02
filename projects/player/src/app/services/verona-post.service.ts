import { Injectable } from '@angular/core';

import {
  LogData,
  NavigationTarget,
  PlayerState,
  UnitState,
  VopError,
  VopMessage,
  VopMetaData,
  VopStateChangedNotification
} from '../../../../shared/models/verona';

@Injectable({
  providedIn: 'root'
})

export class VeronaPostService {
  sessionID: string | undefined;
  postTarget: Window = window.parent;

  private sendMessage(message: VopMessage): void {
    this.postTarget.postMessage(message, '*');
  }

  sendVopStateChangedNotification(values: {
    unitState?: UnitState,
    playerState?: PlayerState,
    log?: LogData[]
  }): void {
    this.sendMessage(this.createVopStateChangedNotification(values));
  }

  private createVopStateChangedNotification(values: {
    unitState?: UnitState,
    playerState?: PlayerState,
    log?: LogData[]
  }): VopStateChangedNotification {
    return {
      type: 'vopStateChangedNotification',
      sessionId: this.sessionID as string,
      timeStamp: Date.now(),
      ...(values)
    };
  }

  sendReadyNotification(playerMetadata: VopMetaData): void {
    this.sendMessage({
      type: 'vopReadyNotification',
      metadata: playerMetadata
    });
  }

  sendVopRuntimeErrorNotification(error: VopError): void {
    this.sendMessage({
      type: 'vopRuntimeErrorNotification',
      sessionId: this.sessionID as string,
      code: error.code,
      message: error.message || ''
    });
  }

  sendVopUnitNavigationRequestedNotification(target: NavigationTarget): void {
    this.sendMessage({
      type: 'vopUnitNavigationRequestedNotification',
      sessionId: this.sessionID as string,
      target: target
    });
  }

  sendVopWindowFocusChangedNotification(focused: boolean): void {
    this.sendMessage({
      type: 'vopWindowFocusChangedNotification',
      timeStamp: Date.now(),
      hasFocus: focused
    });
  }
}
