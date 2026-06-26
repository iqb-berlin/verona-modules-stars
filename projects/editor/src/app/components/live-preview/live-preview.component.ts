import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VopStartCommand } from '../../../../../shared/models/verona';
import { EditorStateService } from '../../services/editor-state.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'stars-live-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="live-preview-container">
      @if (previewWarning()) {
        <div class="preview-warning">{{ previewWarning() }}</div>
      }
      @if (playerSrcdoc) {
        <iframe
          #playerIframe
          [attr.srcdoc]="playerSrcdoc"
          (load)="onPlayerLoad()"
          frameborder="0"
          allow="autoplay; camera; microphone"
        ></iframe>
      } @else if (blobUrl) {
        <iframe
          #playerIframe
          [src]="blobUrl"
          (load)="onPlayerLoad()"
          frameborder="0"
          allow="autoplay; camera; microphone"
        ></iframe>
      } @else if (playerUrl) {
        <iframe
          #playerIframe
          [src]="playerSafeUrl"
          (load)="onPlayerLoad()"
          frameborder="0"
          allow="autoplay; camera; microphone"
        ></iframe>
      } @else {
        <div class="no-player-msg">
          <p>Player URL nicht konfiguriert oder erreichbar.</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .live-preview-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: white;
        position: relative;
      }
      iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
      .preview-warning {
        position: absolute;
        right: 16px;
        bottom: 16px;
        left: 16px;
        z-index: 1;
        padding: 12px 14px;
        border: 1px solid #f59e0b;
        border-radius: 10px;
        background: rgba(15, 23, 42, 0.92);
        color: #fde68a;
        font-size: 13px;
        line-height: 1.4;
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.28);
      }
      .no-player-msg {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: #64748b;
        font-style: italic;
      }
    `,
  ],
})
export class LivePreviewComponent implements OnInit, OnDestroy {
  private sanitizer = inject(DomSanitizer);
  private state = inject(EditorStateService);

  @ViewChild('playerIframe') playerIframe!: ElementRef<HTMLIFrameElement>;

  playerUrl = this.resolvePlayerUrl();
  playerSafeUrl: SafeResourceUrl;
  playerSrcdoc: string = '';
  blobUrl: string | null = null;
  previewWarning = signal<string | null>(null);
  private isPlayerReady = false;
  private readyTimeoutId: number | null = null;

  constructor() {
    this.playerSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.playerUrl,
    );

    const playerHtmlBase64 = (environment as any).playerHtmlBase64;
    if (playerHtmlBase64) {
      const decoded = atob(playerHtmlBase64);
      // Always use srcdoc for embedded players to avoid blob URL opaque origin issues
      // This is especially important when the packed editor is opened from file:// URLs
      this.playerSrcdoc = decoded;
    }

    // Watch for state changes and update the player
    effect(() => {
      const definition = this.state.buildUnitDefinition();
      this.updatePlayer(JSON.stringify(definition));
    });
  }

  ngOnInit(): void {
    window.addEventListener('message', this.handlePlayerMessage);
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.handlePlayerMessage);
    this.clearReadyTimeout();
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onPlayerLoad(): void {
    this.isPlayerReady = false;
    this.previewWarning.set(null);
    this.scheduleReadyTimeout();
  }

  private handlePlayerMessage = (event: MessageEvent): void => {
    if (
      this.playerIframe?.nativeElement?.contentWindow &&
      event.source !== this.playerIframe.nativeElement.contentWindow
    ) {
      return;
    }
    if (event.data?.type === 'vopReadyNotification') {
      this.isPlayerReady = true;
      this.clearReadyTimeout();
      this.previewWarning.set(null);
      const definition = this.state.buildUnitDefinition();
      this.updatePlayer(JSON.stringify(definition));
    }
  };

  private resolvePlayerUrl(): string {
    const override = new URLSearchParams(window.location.search)
      .get('playerUrl')
      ?.trim();
    return override || environment.playerUrl;
  }

  private scheduleReadyTimeout(): void {
    this.clearReadyTimeout();
    this.readyTimeoutId = window.setTimeout(() => {
      if (this.isPlayerReady) return;
      this.previewWarning.set(
        `Live-Vorschau hat unter ${this.playerUrl} keinen STARS-Player erkannt. ` +
          'Tipp: Editor mit ?playerUrl=http://localhost:4202 oeffnen.',
      );
    }, 2500);
  }

  private clearReadyTimeout(): void {
    if (this.readyTimeoutId !== null) {
      window.clearTimeout(this.readyTimeoutId);
      this.readyTimeoutId = null;
    }
  }

  private updatePlayer(unitDefinition: string): void {
    if (!this.isPlayerReady || !this.playerIframe) return;

    const startCommand: VopStartCommand = {
      type: 'vopStartCommand',
      sessionId: 'preview-session',
      unitDefinition: unitDefinition,
      playerConfig: {
        logPolicy: 'disabled',
        pagingMode: 'separate',
      },
    };

    this.playerIframe.nativeElement.contentWindow?.postMessage(
      startCommand,
      '*',
    );
  }
}
