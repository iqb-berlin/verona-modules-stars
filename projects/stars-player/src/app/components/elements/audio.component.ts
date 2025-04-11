import { Component, ElementRef, input, OnInit, output, viewChild } from '@angular/core';
import { takeUntil } from "rxjs/operators";
import { BehaviorSubject, fromEvent, Subject, tap, throttleTime } from "rxjs";

import { AudioElement } from "../../models";

import {MediaPlayerElementComponent} from "../../directives/media-player-element-component.directive";


@Component({
  selector: 'stars-audio',
  template: `
    @if (elementModel().audioSrc) {
      <stars-media-player [player]="player"
                          [playerId]="elementModel().id"
                          (elementValueChanged)="valueChange.emit($event)"
                          [image]="elementModel().image">
        <audio #player
               [src]="elementModel().audioSrc | safeResourceUrl"
               (loadedmetadata)="isLoaded.next(true)"
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
}
