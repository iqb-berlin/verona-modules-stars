import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
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

  playerUrl = environment.playerUrl;
  playerSafeUrl: SafeResourceUrl;
  playerSrcdoc: string = '';
  blobUrl: string | null = null;
  private isPlayerReady = false;

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
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onPlayerLoad(): void {
    // Player iframe loaded
  }

  private handlePlayerMessage = (event: MessageEvent): void => {
    if (event.data?.type === 'vopReadyNotification') {
      this.isPlayerReady = true;
      const definition = this.state.buildUnitDefinition();
      this.updatePlayer(JSON.stringify(definition));
    }
  };

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
