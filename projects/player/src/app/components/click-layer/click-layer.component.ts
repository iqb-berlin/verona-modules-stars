import { Component, output } from '@angular/core';

@Component({
  selector: 'stars-click-layer',
  template: `
    <div #starsClickLayer class="layer" data-cy="click-layer" (click)="handleClick()"></div>
  `,
  styles: `
    .layer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: transparent;
      cursor: pointer;
      z-index: 99;
      -webkit-tap-highlight-color: transparent;
    }
  `
})

export class ClickLayerComponent {
  click = output();

  handleClick() {
    this.click.emit();
  }
}
