import { Component } from '@angular/core';
import { InteractionComponentDirective } from '../../directives/interaction-component.directive';

@Component({
  selector: 'stars-interaction-pyramid',
  templateUrl: './interaction-pyramid.component.html',
  styleUrls: ['./interaction-pyramid.component.scss'],
  standalone: true
})
export class InteractionPyramidComponent extends InteractionComponentDirective {
  /** Numbers to be shown in the keyboard */
  numbersList: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  constructor() {
    super();
  }

  handleKeyboardClick(button: string) {
    console.log('keyboard click',button);
  }

  handleBackButtonClick() {
    console.log('Back button clicked');
  }
}
