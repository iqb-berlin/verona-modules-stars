// Alternative: Inline SVG approach
// src/app/components/elements/media-player/media-player.component.ts

import {Component, input, OnDestroy, OnInit, output} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ImageElement} from "../../../models";
import {fromEvent, Subject, tap, throttleTime} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {MediaChangeItem, MediaPlayerService} from '../../../services/media-player-service';

@Component({
  selector: 'stars-media-player',
  template: `
    @if (image()) {
      <div class="custom-audio-button" (click)="play()">
        <div [innerHTML]="audioIconSvg" class="speaker-icon"></div>
      </div>
    } @else {
      <div class="custom-audio-button" (click)="play()">
        <div [innerHTML]="audioIconSvg" class="speaker-icon"></div>
      </div>
    }
  `,
  styleUrls: ['./media-player.component.scss'],
  standalone: false
})
export class MediaPlayerComponent implements OnInit, OnDestroy {
  player = input.required<HTMLAudioElement>();
  playerId = input<string>();
  image = input<ImageElement>();
  isPlaying = input<boolean>(false);
  elementValueChanged = output();

  currentTime = 0;
  private ngUnsubscribe = new Subject<void>();

  private staticSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 75" style="width: 100%; height: 100%;">
      <path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
            style="stroke:#111;stroke-width:5;stroke-linejoin:round;fill:#111;" />
      <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4"
            style="fill:none;stroke:#111;stroke-width:5;stroke-linecap:round"/>
      <path d="M55.1,20.5a30,30 0 0 1 0,35.6"
            style="fill:none;stroke:#111;stroke-width:5;stroke-linecap:round"/>
      <path d="M61.6,14a38.8,38.8 0 0 1 0,48.6"
            style="fill:none;stroke:#111;stroke-width:5;stroke-linecap:round"/>
    </svg>
  `;

  private animatedSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 75" style="width: 100%; height: 100%;">
      <path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
            style="stroke:slategray;stroke-width:5;stroke-linejoin:round;fill:slategray;" />
      <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4"
            style="fill:none;stroke:slategray;stroke-width:5;stroke-linecap:round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite"/>
      </path>
      <path d="M55.1,20.5a30,30 0 0 1 0,35.6"
            style="fill:none;stroke:slategray;stroke-width:5;stroke-linecap:round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="0.2s" repeatCount="indefinite"/>
      </path>
      <path d="M61.6,14a38.8,38.8 0 0 1 0,48.6"
            style="fill:none;stroke:slategray;stroke-width:5;stroke-linecap:round">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="0.4s" repeatCount="indefinite"/>
      </path>
      <g opacity="0.6">
        <animateTransform attributeName="transform" type="scale" values="1;1.02;1" dur="1.2s" repeatCount="indefinite" transform-origin="55 38"/>
        <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4" style="fill:none;stroke:slategray;stroke-width:3;stroke-linecap:round"/>
        <path d="M55.1,20.5a30,30 0 0 1 0,35.6" style="fill:none;stroke:slategray;stroke-width:3;stroke-linecap:round"/>
        <path d="M61.6,14a38.8,38.8 0 0 1 0,48.6" style="fill:none;stroke:slategray;stroke-width:3;stroke-linecap:round"/>
      </g>
    </svg>
  `;

  constructor(
    private mediaPlayerService: MediaPlayerService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    fromEvent(this.player(), 'timeupdate')
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(() => {
          this.currentTime = this.player().currentTime / 60;
        }),
        throttleTime(100)
      )
      .subscribe(() => this.sendPlaybackTimeChanged());
  }

  ngOnDestroy() {
    this.pause();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  get audioIconSvg(): SafeHtml {
    const svgContent = this.isPlaying() ? this.animatedSvg : this.staticSvg;
    return this.sanitizer.bypassSecurityTrustHtml(svgContent);
  }

  play(): void {
    this.player()
      .play()
      .then(() => this.sendPlaybackTimeChanged());
  }

  pause(): void {
    this.sendPlaybackTimeChanged();
    this.player().pause();
  }

  sendPlaybackTimeChanged(): void {
    this.mediaPlayerService.changeDuration(
      new MediaChangeItem(this.player().currentTime)
    );
  }
}
