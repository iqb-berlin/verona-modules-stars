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
    'img { object-fit: contain; width: clamp(100px, 30vw, 400px); max-width: 100%; max-height: 100%; }'
  ],
  standalone: false
})

export class ImageComponent extends ElementComponent {
  elementModel = input.required<ImageElement>();

  constructor(private mediaPlayerService: MediaPlayerService) {
    super();
    mediaPlayerService.durationChange.subscribe(value => {
      if (value.currentDuration > 2) {

      }
    });
  }
}
