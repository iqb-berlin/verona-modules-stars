import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'stars-unit-nav-next',
  standalone: true,
  imports: [],
  template: `
    <div class="unit-nav-next fx-row-end-center">
      <span class="svg-container" (click)="navigate.emit()">
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 100 100">
          <circle cx="50%" cy="50%" r="50" fill="#b3fe5b"/>
          <path d="M 45 35 L 60 50 L 45 65" stroke="black" stroke-width="5" fill="none" />
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
    .button-text {
      margin-bottom: 6px;
      margin-right: 15px;
    }
    .unit-nav-next .svg-container {
      vertical-align: middle;
      margin: 5px;
    }
    .unit-nav-next .svg-container:hover {
      filter: brightness(90%);
    }
  `
})
export class UnitNavNextComponent {
  @Output() navigate = new EventEmitter();
}
