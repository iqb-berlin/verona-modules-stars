import {
  AfterViewInit, Component, effect, ElementRef, signal, ViewChild
} from '@angular/core';
import {
  fromEvent, Subject, tap, throttleTime
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StarsResponse } from '../../services/responses.service';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';
import { InteractionVideoParams } from '../../models/unit-definition';

@Component({
  selector: 'stars-interaction-video',
  templateUrl: './interaction-video.component.html',
  styleUrls: ['./interaction-video.component.scss']
})

export class InteractionVideoComponent extends InteractionComponentDirective implements AfterViewInit {
  localParameters!: InteractionVideoParams;
  private _isPlaying = signal(false);
  isPlaying = this._isPlaying.asReadonly();

  playCount = 0;
  private currentTime = 0;
  private percentElapsed = 0;

  @ViewChild('videoPlayer', { static: false }) videoPlayerRef!: ElementRef<HTMLVideoElement>;
  private ngUnsubscribe = new Subject();

  constructor() {
    super();

    effect(() => {
      const parameters = this.parameters() as InteractionVideoParams;
      this.localParameters = this.createDefaultParameters();

      if (parameters) {
        this.localParameters.imageSource = parameters.imageSource || '';
        this.localParameters.videoSource = parameters.videoSource || '';
        this.localParameters.text = parameters.text || '';
        this.localParameters.variableId = parameters.variableId || 'VIDEO';
        this.responses.emit([{
          id: this.localParameters.variableId,
          status: 'DISPLAYED',
          value: '',
          relevantForResponsesProgress: false
        }]);

        this._isPlaying.set(false);
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
  }

  sendPlaybackTimeChanged(): void {
    let videoValue = this.percentElapsed || 0;
    videoValue += this.playCount;

    const response: StarsResponse = {
      id: 'videoPlayer',
      value: videoValue,
      status: 'VALUE_CHANGED',
      relevantForResponsesProgress: false
    };

    this.responses.emit([response]);
  }

  // eslint-disable-next-line class-methods-use-this
  private createDefaultParameters(): InteractionVideoParams {
    return {
      variableId: 'videoPlayer',
      imageSource: '',
      videoSource: '',
      text: ''
    };
  }
}
