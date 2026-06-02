import {
  AfterViewInit, Component, effect, ElementRef, signal, ViewChild, inject, OnDestroy
} from '@angular/core';
import {
  fromEvent, Subject, tap, throttleTime
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Response } from '@iqbspecs/response/response.interface';
import { StarsResponse } from '../../services/responses.service';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { InteractionVideoParams } from '../../models/unit-definition';
import { VeronaPostService } from '../../services/verona-post.service';

@Component({
  selector: 'stars-interaction-video',
  templateUrl: './interaction-video.component.html',
  styleUrls: ['./interaction-video.component.scss']
})

export class InteractionVideoComponent extends InteractionComponentDirective implements AfterViewInit, OnDestroy {
  localParameters!: InteractionVideoParams;
  private _isPlaying = signal(false);
  isPlaying = this._isPlaying.asReadonly();
  private _showPlayButton = signal(true);
  showPlayButton = this._showPlayButton.asReadonly();

  playCount = 0;
  private currentTime = 0;
  private percentElapsed = 0;

  @ViewChild('videoPlayer', { static: false }) videoPlayerRef!: ElementRef<HTMLVideoElement>;
  private ngUnsubscribe = new Subject();

  veronaPostService = inject(VeronaPostService);

  constructor() {
    super();

    effect(() => {
      const parameters = this.parameters() as InteractionVideoParams;
      this.localParameters = this.createDefaultParameters();

      if (parameters) {
        // Stop any currently playing video
        if (this.videoPlayerRef) {
          this.videoPlayerRef.nativeElement.pause();
          this.videoPlayerRef.nativeElement.currentTime = 0;
        }

        // Reset internal playback state for new unit
        this.playCount = 0;
        this.currentTime = 0;
        this.percentElapsed = 0;
        this._showPlayButton.set(true);

        this.localParameters.imageSource = parameters.imageSource || '';
        this.localParameters.videoSource = parameters.videoSource || '';
        this.localParameters.text = parameters.text || '';
        this.localParameters.triggerNavigationOnEnd = parameters.triggerNavigationOnEnd || false;
        this.localParameters.variableId = parameters.variableId || 'VIDEO';

        const formerStateResponses: Response[] = (parameters as any).formerState || [];

        if (Array.isArray(formerStateResponses) && formerStateResponses.length > 0) {
          const found = formerStateResponses.find(r => r.id === this.localParameters.variableId);

          if (found && typeof found.value === 'number') {
            this.restoreFromFormerState(found);
            this._isPlaying.set(false);
            if (this.videoPlayerRef) {
              this.videoPlayerRef.nativeElement.load();
            }
            return;
          }
        }

        // No valid former state - initialize with DISPLAYED
        this.responses.emit([{
          id: this.localParameters.variableId,
          status: 'DISPLAYED',
          value: '',
          relevantForResponsesProgress: false
        }]);

        this._isPlaying.set(false);

        if (this.videoPlayerRef) {
          this.videoPlayerRef.nativeElement.load();
        }
      }
    });
  }

  ngAfterViewInit() {
    if (this.videoPlayerRef) {
      fromEvent(this.videoPlayerRef?.nativeElement, 'timeupdate')
        .pipe(
          takeUntil(this.ngUnsubscribe),
          tap(() => {
            this.calculateTime();
          }),
          throttleTime(100)
        )
        .subscribe(() => this.sendPlaybackTimeChanged());
    }
  }

  ngOnDestroy() {
    if (this.videoPlayerRef) {
      this.videoPlayerRef.nativeElement.pause();
    }
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  private calculateTime() {
    if (this.videoPlayerRef) {
      this.currentTime = this.videoPlayerRef.nativeElement.currentTime;
      this.setPercentElapsed(this.videoPlayerRef.nativeElement.duration, this.currentTime);
      this.sendPlaybackTimeChanged();
    }
  }

  private setPercentElapsed(d: number, ct: number) {
    if (d === 0) return;
    this.percentElapsed = (ct / d);
  }

  play() {
    this.videoPlayerRef.nativeElement
      .play()
      .then(() => {
        this._isPlaying.set(true);
      });
  }

  ended() {
    this._isPlaying.set(false);
    this.percentElapsed = 0;
    this.playCount += 1;

    this.sendPlaybackTimeChanged();

    // Reset the video to show the poster again
    this.currentTime = 0;
    this.videoPlayerRef.nativeElement.currentTime = 0;
    this.videoPlayerRef.nativeElement.load();

    // Check if triggerNavigationOnEnd is enabled
    if (this.localParameters.triggerNavigationOnEnd === true) {
      // Don't show the play button at the end when triggerNavigationOnEnd is true
      this._showPlayButton.set(false);
      this.localParameters.triggerNavigationOnEnd = false;
      setTimeout(() => {
        this.veronaPostService.sendVopUnitNavigationRequestedNotification('next');
      }, 500);
    }
  }

  sendPlaybackTimeChanged(): void {
    let videoValue = this.percentElapsed || 0;
    videoValue += this.playCount;

    // Only send VALUE_CHANGED if there's actual progress (not initial 0)
    if (videoValue > 0) {
      const response: StarsResponse = {
        id: 'VIDEO',
        value: videoValue,
        status: 'VALUE_CHANGED',
        relevantForResponsesProgress: false
      };

      this.responses.emit([response]);
    }
  }

  /**
   * Restores the video playback state from former state.
   * @param {Response} response - The response object containing the video progress value
   */
  private restoreFromFormerState(response: Response): void {
    if (typeof response.value !== 'number') return;

    const videoValue = response.value;
    this.playCount = Math.floor(videoValue);
    this.percentElapsed = videoValue - this.playCount;

    const restoreResponse: StarsResponse = {
      id: this.localParameters.variableId || 'VIDEO',
      status: 'VALUE_CHANGED',
      value: videoValue,
      relevantForResponsesProgress: false
    };

    this.responses.emit([restoreResponse]);
  }

  // eslint-disable-next-line class-methods-use-this
  private createDefaultParameters(): InteractionVideoParams {
    return {
      variableId: 'VIDEO',
      imageSource: '',
      videoSource: '',
      text: '',
      triggerNavigationOnEnd: false
    };
  }
}
