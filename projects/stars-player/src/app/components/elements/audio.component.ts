import { Component, ElementRef, input, OnInit, output, viewChild } from '@angular/core';
import { takeUntil } from "rxjs/operators";
import { BehaviorSubject, fromEvent, Subject, tap, throttleTime } from "rxjs";

import { AudioElement } from "../../models";
import { ElementComponent } from "../../directives/element-component.directive";
import { MediaPlayerElementComponent } from "../../directives/media-player-element-component.directive";

@Component({
  selector: 'stars-audio',
  template: `
    @if (elementModel().audioSrc) {
      <stars-media-player [player]="player"
                          [playerId]="elementModel().id"
                          [isPlaying]="isPlaying"
                          (elementValueChanged)="valueChanged($event)"
                          [image]="elementModel().image">
        <audio #player
               [src]="elementModel().audioSrc | safeResourceUrl"
               (loadedmetadata)="isLoaded.next(true)"
               (play)="onPlay()"
               (pause)="onPause()"
               (ended)="onPause()"
               (error)="throwError('audio-not-loading', $event.message)">
        </audio>
        <label>
          Audio
        </label>
      </stars-media-player>
    }
  `,
  standalone: false
})
export class AudioComponent extends MediaPlayerElementComponent implements OnInit {
  elementModel = input.required<AudioElement>();

  // Track playing state
  isPlaying: boolean = false;

  ngOnInit() {
    // console.log(this.elementModel());
  }

  onPlay() {
    this.isPlaying = true;
  }

  onPause() {
    this.isPlaying = false;
  }

  valueChanged(event) {
    // console.log(event);
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
