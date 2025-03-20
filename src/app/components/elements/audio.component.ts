import {Component, ElementRef, input, OnInit, output, viewChild} from '@angular/core';
import {BehaviorSubject, fromEvent, Subject, tap, throttleTime} from "rxjs";

import { AudioElement } from "../../models";
import { ElementComponent } from "../../directives/element-component.directive";
import { takeUntil } from "rxjs/operators";
import {MediaPlayerElementComponent} from "../../directives/media-player-element-component.directive";


@Component({
  selector: 'stars-audio',
  template: `
    @if (elementModel().audioSrc) {
      <stars-media-player [player]="player"
                          [playerId]="elementModel().id"
                          (elementValueChanged)="valueChanged($event)">
        <audio #player
               [src]="elementModel().audioSrc | safeResourceUrl"
               (loadedmetadata)="isLoaded.next(true)"
               (error)="throwError('audio-not-loading', $event.message)"
               (playing)="mediaPlayerStatusChanged.emit(elementModel().id)"
               (pause)="mediaPlayerStatusChanged.emit(null)">
        </audio>
      </stars-media-player>
      <label>
        Audio
      </label>
    }
  `,
  standalone: false
})

export class AudioComponent extends MediaPlayerElementComponent {
  elementModel = input.required<AudioElement>();

  // ngOnInit() {
    // fromEvent(this.player()?.nativeElement, 'timeupdate')
    //   .pipe(
    //     takeUntil(this.ngUnsubscribe),
    //     tap(() => {
    //       this.currentTime =this.player()?.nativeElement.currentTime / 60;
    //     }),
    //     throttleTime(500)
    //   )
    //   .subscribe(() => this.sendPlaybackTimeChanged());
  // }

  valueChanged(event) {
    console.log(event);
  }


  private sendPlaybackTimeChanged() {
    // if (this.currentTime > 0) {
      // this.valueChange.emit({
      //   id: this.elementModel().id,
      //   value: this.currentTime.toString(),
      //   status: "VALUE_CHANGED"
      // });
    // }
  }
}
