import { Component, input, OnDestroy, OnInit, output } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ImageElement } from "../../../models";
import { fromEvent, Subject, tap, throttleTime } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MediaChangeItem, MediaPlayerService } from '../../../services/media-player-service';

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
  disabled = input<boolean>(false);
  elementValueChanged = output();

  currentTime = 0;
  private ngUnsubscribe = new Subject<void>();


  private staticSvg = `
    <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect class="white-circle" x="5" y="5" width="78" height="78" rx="68" fill="white"/>
            <g clip-path="url(#clip0_12_188)">
                <path d="M27.6744 25.0836C28.301 24.2986 28.3101 23.1534 27.601 22.4421C26.8888 21.7278 25.7247 21.723 25.0803 22.4989C22.1911 25.9773 20.4541 30.4532 20.4541 35.3399C20.4541 40.2266 22.1911 44.7024 25.0803 48.1808C25.7247 48.9567 26.8888 48.9518 27.6009 48.2376C28.3101 47.5263 28.3009 46.381 27.6743 45.5961C25.4301 42.7848 24.0915 39.2193 24.0915 35.34C24.0915 31.4606 25.4303 27.8949 27.6744 25.0836Z" fill="#101C61"/>
                <path d="M45.9163 55.4059C45.398 55.4059 44.8887 55.2965 44.525 55.1322C43.2428 54.4481 42.3152 53.5179 41.4149 50.7815C40.4783 47.945 38.7414 46.6042 37.059 45.2999C35.6223 44.1871 34.1309 43.0378 32.8487 40.6937C31.8938 38.9426 31.3665 37.0361 31.3665 35.3398C31.3665 30.2229 35.3586 26.2188 40.4601 26.2188C44.9426 26.2188 48.5687 29.3101 49.3826 33.5314C49.5728 34.5177 50.3681 35.3398 51.3726 35.3398C52.377 35.3398 53.2047 34.521 53.0693 33.5257C52.2158 27.2546 46.9835 22.5704 40.4602 22.5704C33.3217 22.5704 27.729 28.1798 27.729 35.3398C27.729 37.6475 28.4201 40.1739 29.6659 42.4541C31.321 45.4731 33.2762 46.9781 34.8493 48.2002C36.3225 49.3404 37.3864 50.1614 37.9684 51.9307C39.0596 55.2418 40.4691 57.1113 42.9245 58.4065C43.8702 58.8352 44.8705 59.0543 45.9163 59.0543C49.3074 59.0543 52.1653 56.7128 52.967 53.5578C53.2144 52.5843 52.3769 51.7574 51.3725 51.7574C50.368 51.7574 49.5916 52.62 49.1118 53.5025C48.4951 54.6367 47.2957 55.4059 45.9163 55.4059Z" fill="#101C61"/>
                <path d="M46.013 35.3879C39.3769 36.1719 41.499 45.5537 47.7555 44.6763" stroke="#101C61" stroke-width="3.12851" stroke-linecap="round"/>
            </g>
        <defs>
            <clipPath id="clip0_12_188">
                <rect width="38.3243" height="39.1064" fill="white" transform="translate(20.3418 20.4966)"/>
            </clipPath>
        </defs>
    </svg>`;

  private animatedSvg = `
    <svg class="animated-audio-button" width="316" height="88" viewBox="0 0 316 88" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="scale(1)">
            <rect x="5" y="5" width="78" height="78" rx="39" fill="#0050E5"/>
            <g clip-path="url(#clip0_12_154)">
                <path d="M27.8936 24.9789C28.5201 24.194 28.5292 23.0489 27.8202 22.3377C27.1081 21.6235 25.9441 21.6187 25.2997 22.3945C22.4109 25.8725 20.6741 30.3479 20.6741 35.234C20.6741 40.1202 22.4109 44.5955 25.2997 48.0735C25.9441 48.8493 27.1081 48.8445 27.8201 48.1303C28.5292 47.4191 28.52 46.2739 27.8935 45.4891C25.6495 42.6782 24.3111 39.1131 24.3111 35.2341C24.3111 31.3552 25.6497 27.7899 27.8936 24.9789Z" fill="white"/>
                <path d="M46.1333 55.2977C45.615 55.2977 45.1058 55.1882 44.7421 55.0239C43.4601 54.3399 42.5326 53.4098 41.6324 50.6737C40.6958 47.8375 38.9592 46.4969 37.277 45.1928C35.8404 44.0801 34.3491 42.9309 33.0671 40.587C32.1124 38.8362 31.5851 36.9299 31.5851 35.2337C31.5851 30.1174 35.5767 26.1137 40.6777 26.1137C45.1597 26.1137 48.7853 29.2048 49.5992 33.4256C49.7894 34.4118 50.5846 35.2337 51.5889 35.2337C52.5933 35.2337 53.4209 34.415 53.2855 33.4198C52.4321 27.1494 47.2004 22.4658 40.6778 22.4658C33.54 22.4658 27.948 28.0745 27.948 35.2337C27.948 37.5412 28.639 40.0673 29.8847 42.3472C31.5396 45.3659 33.4945 46.8707 35.0675 48.0927C36.5405 49.2328 37.6044 50.0537 38.1863 51.8228C39.2774 55.1335 40.6867 57.0029 43.1418 58.2979C44.0874 58.7266 45.0876 58.9456 46.1333 58.9456C49.524 58.9456 52.3816 56.6044 53.1832 53.4497C53.4305 52.4763 52.5932 51.6495 51.5888 51.6495C50.5845 51.6495 49.8082 52.512 49.3284 53.3944C48.7118 54.5285 47.5125 55.2977 46.1333 55.2977Z" fill="white"/>
                <path d="M46.2302 35.2816C39.5948 36.0656 41.7167 45.4464 47.9725 44.5691" stroke="white" stroke-width="4" stroke-linecap="round"/>
            </g>
        </g>
        <g>
            <path d="M99.0703 37.5693L99.0703 42.3166" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
            <path d="M273.876 31.8408L273.876 48.0443" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
            <path d="M137.916 37.5303L137.916 42.3556" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
            <path d="M176.762 37.5303L176.762 42.3556" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
            <path d="M312.721 34.8242L312.721 45.0613" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
            <path d="M196.185 31.8418L196.185 48.0439" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
            <path d="M215.607 16.9946L215.607 62.891" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
            <path d="M254.453 20.2134L254.453 59.6721" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
            <path d="M235.03 20.2139L235.03 59.6719" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
            <path d="M118.493 26.1523L118.493 53.7336" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
            <path d="M157.339 28.9502L157.339 50.9358" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
            <path d="M186.473 34.8242L186.473 45.0611" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
            <path d="M225.319 10.0479L225.319 69.8379" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
            <path d="M264.165 34.4463L264.165 45.4391" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
            <path d="M108.782 37.5308L108.782 42.3545" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
            <path d="M283.587 27.6274L283.587 52.2579" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
            <path d="M128.205 34.8247L128.205 45.061" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
            <path d="M167.05 20.4678L167.05 59.4181" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
            <path d="M303.01 31.8413L303.01 48.0442" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
            <path d="M147.627 34.8252L147.627 45.0608" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
            <path d="M205.896 25.4404L205.896 54.4455" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
            <path d="M244.742 33.4287L244.742 46.4569" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
            <path d="M293.298 34.8247L293.298 45.061" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
        </g>
        <defs>
            <clipPath id="clip0_12_154">
            <rect width="38.32" height="39.102" fill="white" transform="translate(20.5618 20.3923)"/>
            </clipPath>
        </defs>
    </svg>
  `;

  constructor(
    private mediaPlayerService: MediaPlayerService,
    private sanitizer: DomSanitizer
  ) {
  }

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
    const baseSvg = this.isPlaying() ? this.animatedSvg : this.staticSvg;
    //const baseSvg = this.animatedSvg;
    let svg = baseSvg;
    if (this.isPlaying()) {
      svg = svg.replace('class="animated-audio-button"', 'class="animated-audio-button playing"');
    }
    return this.sanitizer.bypassSecurityTrustHtml(svg);
    //return this.sanitizer.bypassSecurityTrustHtml(this.animatedSvg);
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
