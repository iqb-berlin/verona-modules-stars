import { Injectable } from '@angular/core';
import {
  VoeDefinitionChangedNotification,
  VoeMessage,
  VeronaVariableInfo
} from '../models/verona-editor';

@Injectable({ providedIn: 'root' })
export class EditorVeronaPostService {
  sessionId: string | undefined;
  private postTarget: Window = window.parent;

  private sendMessage(message: VoeMessage): void {
    this.postTarget.postMessage(message, '*');
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
