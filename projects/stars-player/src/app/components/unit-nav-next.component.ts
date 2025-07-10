import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'stars-unit-nav-next',
  standalone: true,
  imports: [],
  template: `
    <div class="unit-nav-next fx-row-end-center">
      <span class="svg-container" (click)="handleClick()">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.932617" y="0.621094" width="70" height="70" rx="35" fill="#0050E5"/>
          <path d="M50.1328 35.621L20.1328 35.621" stroke="white" stroke-width="5" stroke-linecap="round"/>
          <path d="M38.7324 22.621L51.7325 35.6211L38.7324 48.6212" stroke="white" stroke-width="5"
                stroke-linecap="round"/>
        </svg>
      </span>
    </div>
  `,

  styles: `
    .unit-nav-next {
      font-size: 20px;
      position: absolute;
      bottom: 20px;
      right: 20px;
      z-index: 100;
    }

    .svg-container {
      display: inline-block;
      filter: drop-shadow(5px 5px 0 rgba(0, 0, 0, 0.2));
      vertical-align: middle;
      margin: 5px;
      transition: filter 0.2s ease, transform 0.2s ease;
    }

    .svg-container:hover {
      filter: drop-shadow(5px 5px 0 rgba(0, 0, 0, 0.2)) brightness(90%);
    }

    .svg-container.clicked {
      filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0.2));
      transform: translate(5px, 5px);
    }

    @media (max-width: 900px) {
      .svg-container {
        filter: drop-shadow(4px 4px 0 rgba(0, 0, 0, 0.2));
      }

      .svg-container.clicked {
        transform: translate(4px, 4px);
      }
    }

    @media (max-width: 768px) {
      .svg-container {
        filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, 0.2));
      }

      .svg-container.clicked {
        transform: translate(3px, 3px);
      }
    }
  `
})
export class UnitNavNextComponent {
  @Output() navigate = new EventEmitter();

  handleClick() {
    const container = document.querySelector('.svg-container');
    container?.classList.add('clicked');

    /* Remove the class after the animation completes */
    setTimeout(() => {
      container?.classList.remove('clicked');
      this.navigate.emit();
    }, 200);
  }
}
