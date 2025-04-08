import { Component, input } from '@angular/core';

import { ImageElement } from "../../models";
import { ElementComponent } from "../../directives/element-component.directive";
import {MediaPlayerService} from "../../services/media-player-service";


@Component({
  selector: 'stars-image',
  template: `
    @if (elementModel().imgSrc) {
      <img #image
           [src]="elementModel().imgSrc"
           [alt]="elementModel().altText"
           fill="">
    }
  `,
  styles: [
    'img { object-fit: contain; height: 100%; width: 100%; }',
  ],
  standalone: false
})

export class ImageComponent extends ElementComponent {
  elementModel = input.required<ImageElement>();

  constructor(private mediaPlayerService: MediaPlayerService) {
    super();
    mediaPlayerService.durationChange.subscribe(value => {
      console.log(value.currentDuration);
      if (value.currentDuration > 2) {

      }
    });
  }
}
