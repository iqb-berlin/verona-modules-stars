import {Component, input, OnDestroy, OnInit, output} from "@angular/core";
import {ImageElement} from "../../../models";
import {fromEvent, onErrorResumeNextWith, Subject, tap, throttleTime} from "rxjs";
import {takeUntil} from "rxjs/operators";

import {MediaChangeItem, MediaPlayerService} from '../../../services/media-player-service';


@Component({
  selector: 'stars-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss'],
  standalone: false
})

export class MediaPlayerComponent implements OnInit, OnDestroy {
  player = input.required<HTMLAudioElement>();
  playerId = input<string>();
  image = input<ImageElement>();
  elementValueChanged = output();

  currentTime = 0;

  private ngUnsubscribe = new Subject<void>();

  constructor(private mediaPlayerService: MediaPlayerService) {
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
