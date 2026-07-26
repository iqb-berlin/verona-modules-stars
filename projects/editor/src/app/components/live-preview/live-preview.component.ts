import {
  Component,
  effect,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  signal,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VopStartCommand } from '@shared/models/verona';
import { EditorStateService } from '../../services/editor-state.service';
import { environment } from '../../../environments/environment';
import { PreviewPlayerController } from './preview-player-controller';

@Component({
  selector: 'stars-live-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-preview.component.html',
  styleUrl: './live-preview.component.scss'
})
export class LivePreviewComponent implements OnInit, OnChanges, OnDestroy {
  private sanitizer = inject(DomSanitizer);
  private state = inject(EditorStateService);
  private hostElement = inject<ElementRef<HTMLElement>>(ElementRef);

  @ViewChild('playerIframe') playerIframe?: ElementRef<HTMLIFrameElement>;
  @Input() active = true;

  readonly controller = new PreviewPlayerController();
  readonly iframeVisible = signal(true);
  readonly playerUrl = this.resolvePlayerUrl();
  readonly sourceDescription: string;
  playerSafeUrl: SafeResourceUrl;

  private blobUrl: string | null = null;
  private embeddedPlayer = false;
  private readyTimeoutId: number | null = null;
  private retryTimeoutId: number | null = null;

  constructor() {
    const playerHtmlBase64 = (environment as { playerHtmlBase64?: string }).playerHtmlBase64;
    if (playerHtmlBase64) {
      const decodedPlayer = Uint8Array.from(
        atob(playerHtmlBase64),
        character => character.charCodeAt(0)
      );
      this.blobUrl = URL.createObjectURL(new Blob([decodedPlayer], { type: 'text/html' }));
      this.embeddedPlayer = true;
    }
    const source = this.blobUrl || this.playerUrl;
    this.sourceDescription = this.embeddedPlayer ? 'der eingebetteten Vorschau' : this.playerUrl;
    this.playerSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(source);
    this.controller.begin(this.sourceDescription);

    effect(() => {
      const result = this.state.definitionResult();
      const runtimeJson = result.runtimeDefinition ? JSON.stringify(result.runtimeDefinition) : undefined;
      this.sendDefinition(this.controller.updateDefinition(runtimeJson, result.issues));
    });
    // Register before Angular creates the iframe. A bundled or cached player can
    // announce readiness while the component view is still being initialized.
    window.addEventListener('message', this.handlePlayerMessage);
  }

  ngOnInit(): void {
    if (this.active) this.scheduleReadyTimeout();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const activeChange = changes.active;
    if (!activeChange || activeChange.firstChange) return;

    this.clearReadyTimeout();
    this.clearRetryTimeout();
    if (!this.active) {
      this.iframeVisible.set(false);
      return;
    }

    this.controller.begin(this.sourceDescription);
    this.iframeVisible.set(true);
    this.scheduleReadyTimeout();
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.handlePlayerMessage);
    this.clearReadyTimeout();
    this.clearRetryTimeout();
    if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
  }

  onPlayerLoad(): void {
    let loadedUrl: string | undefined;
    try {
      loadedUrl = this.getIframeElement()?.contentWindow?.location.href;
    } catch {
      // Cross-origin local players and opaque file:// Blob origins do not expose location.
    }
    // Browsers may emit an initial load for about:blank before navigating to src.
    if (loadedUrl === 'about:blank') return;
    if (this.embeddedPlayer && this.blobUrl && loadedUrl && loadedUrl !== this.blobUrl) return;
    const definition = this.controller.markIframeLoaded();
    if (this.controller.state() === 'waiting-for-ready') this.scheduleReadyTimeout();
    this.sendDefinition(definition);
  }

  retry(): void {
    if (!this.active) return;
    this.clearReadyTimeout();
    this.controller.begin(this.sourceDescription);
    this.iframeVisible.set(false);
    this.retryTimeoutId = window.setTimeout(() => {
      this.retryTimeoutId = null;
      this.iframeVisible.set(true);
      this.scheduleReadyTimeout();
    }, 50);
  }

  private handlePlayerMessage = (event: MessageEvent): void => {
    if (!this.isExpectedMessage(event)) return;
    if (event.data?.type === 'vopReadyNotification') {
      this.clearReadyTimeout();
      this.sendDefinition(this.controller.markPlayerReady());
    } else if (event.data?.type === 'vopRuntimeErrorNotification') {
      this.controller.markPlayerError(event.data.message || 'Der Player hat einen Laufzeitfehler gemeldet.');
    }
  };

  private isExpectedMessage(event: MessageEvent): boolean {
    const iframe = this.getIframeElement();
    if (!iframe?.contentWindow || event.source !== iframe.contentWindow) return false;
    if (this.embeddedPlayer) {
      return event.origin === window.location.origin || event.origin === 'null';
    }
    return event.origin === new URL(this.playerUrl).origin;
  }

  // eslint-disable-next-line class-methods-use-this
  private resolvePlayerUrl(): string {
    const configuredPlayerUrl = new URL(environment.playerUrl, window.location.href).href;
    const override = new URLSearchParams(window.location.search).get('playerUrl')?.trim();
    if (!override || environment.production) return configuredPlayerUrl;

    try {
      const overrideUrl = new URL(override, window.location.href);
      if (overrideUrl.protocol !== 'http:' || !this.isLoopbackHost(overrideUrl.hostname)) {
        return configuredPlayerUrl;
      }
      return overrideUrl.href;
    } catch {
      return configuredPlayerUrl;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private isLoopbackHost(hostname: string): boolean {
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
  }

  private scheduleReadyTimeout(): void {
    this.clearReadyTimeout();
    this.readyTimeoutId = window.setTimeout(() => {
      this.controller.markUnavailable(
        `Kein STARS-Player unter ${this.sourceDescription} erkannt. ` +
        'Für die lokale Entwicklung beide Anwendungen mit „npm run start:all“ starten (Player: Port 4200).'
      );
    }, 2500);
  }

  private clearReadyTimeout(): void {
    if (this.readyTimeoutId === null) return;
    window.clearTimeout(this.readyTimeoutId);
    this.readyTimeoutId = null;
  }

  private clearRetryTimeout(): void {
    if (this.retryTimeoutId === null) return;
    window.clearTimeout(this.retryTimeoutId);
    this.retryTimeoutId = null;
  }

  private sendDefinition(unitDefinition: string | undefined): void {
    const iframeWindow = this.getIframeElement()?.contentWindow;
    if (!unitDefinition || !iframeWindow) return;
    const startCommand: VopStartCommand = {
      type: 'vopStartCommand',
      sessionId: 'preview-session',
      unitDefinition,
      playerConfig: {
        logPolicy: 'disabled',
        pagingMode: 'separate'
      }
    };
    const targetOrigin = this.embeddedPlayer ? '*' : new URL(this.playerUrl).origin;
    iframeWindow.postMessage(startCommand, targetOrigin);
  }

  private getIframeElement(): HTMLIFrameElement | null {
    return this.playerIframe?.nativeElement ||
      this.hostElement.nativeElement.querySelector('iframe[title="Eingebettete STARS-Player-Vorschau"]');
  }
}
