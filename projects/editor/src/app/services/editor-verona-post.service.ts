import { Injectable } from '@angular/core';
import {
  VoeDefinitionChangedNotification,
  VoeMessage,
  VeronaVariableInfo
} from '../models/verona-editor';

type VeronaPostTarget = Window | MessagePort | ServiceWorker;

@Injectable({ providedIn: 'root' })
export class EditorVeronaPostService {
  sessionId: string | undefined;
  private postTarget: VeronaPostTarget = window.parent;
  private targetOrigin = '*';

  private sendMessage(message: VoeMessage): void {
    if (this.isWindowTarget(this.postTarget)) {
      this.postTarget.postMessage(message, this.targetOrigin);
      return;
    }
    this.postTarget.postMessage(message);
  }

  configureMessageContext(source: MessageEventSource | null, origin: string, sessionId?: string): void {
    if (source && typeof (source as Window).postMessage === 'function') {
      this.postTarget = source as VeronaPostTarget;
    }
    this.targetOrigin = origin && origin !== 'null' ? origin : '*';
    if (sessionId) {
      this.sessionId = sessionId;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private isWindowTarget(target: VeronaPostTarget): target is Window {
    return 'closed' in target;
  }

  sendReadyNotification(metadataString: string): void {
    this.sendMessage({
      type: 'voeReadyNotification',
      metadata: metadataString
    });
  }

  sendDefinitionChangedNotification(
    unitDefinition: string,
    unitDefinitionType: string,
    variables: VeronaVariableInfo[]
  ): void {
    if (!this.sessionId) return;
    const message: VoeDefinitionChangedNotification = {
      type: 'voeDefinitionChangedNotification',
      sessionId: this.sessionId,
      timeStamp: new Date().toISOString(),
      unitDefinition,
      unitDefinitionType,
      variables
    };
    this.sendMessage(message);
  }
}
