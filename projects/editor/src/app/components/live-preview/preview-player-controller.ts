import { signal } from '@angular/core';
import { ValidationIssue } from '../../services/editor-definition-builder.service';

export type PreviewState =
  'booting' |
  'waiting-for-ready' |
  'ready' |
  'invalid-definition' |
  'unavailable' |
  'player-error';

export class PreviewPlayerController {
  readonly state = signal<PreviewState>('booting');
  readonly message = signal('Player wird gestartet …');
  readonly validationIssues = signal<ValidationIssue[]>([]);

  private iframeLoaded = false;
  private playerReady = false;
  private latestValidDefinition: string | undefined;
  private lastSentDefinition: string | undefined;

  begin(sourceDescription: string): void {
    this.iframeLoaded = false;
    this.playerReady = false;
    this.lastSentDefinition = undefined;
    this.state.set('waiting-for-ready');
    this.message.set(`Warte auf den STARS-Player unter ${sourceDescription}.`);
  }

  updateDefinition(definition: string | undefined, issues: ValidationIssue[]): string | undefined {
    this.validationIssues.set(issues);
    if (!definition) {
      this.state.set('invalid-definition');
      this.message.set('Die Vorschau bleibt bei der letzten gültigen Definition.');
      return undefined;
    }
    this.latestValidDefinition = definition;
    if (!this.iframeLoaded || !this.playerReady) return undefined;
    this.state.set('ready');
    this.message.set('');
    return this.definitionToSend();
  }

  markIframeLoaded(): string | undefined {
    const isReload = this.iframeLoaded;
    if (isReload) {
      this.playerReady = false;
      this.lastSentDefinition = undefined;
      this.state.set('waiting-for-ready');
      this.message.set('Der Player wurde neu geladen. Warte auf Bereitschaft …');
    }
    this.iframeLoaded = true;
    return this.readyPayload();
  }

  markPlayerReady(): string | undefined {
    this.playerReady = true;
    return this.readyPayload();
  }

  markUnavailable(message: string): void {
    if (this.playerReady) return;
    this.state.set('unavailable');
    this.message.set(message);
  }

  markPlayerError(message: string): void {
    this.state.set('player-error');
    this.message.set(message);
  }

  private readyPayload(): string | undefined {
    if (!this.iframeLoaded || !this.playerReady) return undefined;
    if (this.validationIssues().some(issue => issue.severity === 'error')) {
      this.state.set('invalid-definition');
      this.message.set('Die Vorschau bleibt bei der letzten gültigen Definition.');
      return this.definitionToSend();
    }
    this.state.set('ready');
    this.message.set('');
    return this.definitionToSend();
  }

  private definitionToSend(): string | undefined {
    if (!this.latestValidDefinition || this.latestValidDefinition === this.lastSentDefinition) return undefined;
    this.lastSentDefinition = this.latestValidDefinition;
    return this.latestValidDefinition;
  }
}
