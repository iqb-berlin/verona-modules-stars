import {
  Component, input, output, computed
} from '@angular/core';

import { ButtonTypeEnum } from '../../models/unit-definition';
import { StandardIconComponent } from '../standard-icon/standard-icon.component';

@Component({
  selector: 'stars-standard-button',
  templateUrl: './standard-button.component.html',
  styleUrls: ['./standard-button.component.scss'],
  imports: [
    StandardIconComponent
  ],
  standalone: true
})

export class StandardButtonComponent {
  id = input.required<string>();
  value = input.required<number>();
  inputType = input<'radio' | 'checkbox'>('radio');
  image = input<string>();
  text = input<string>();
  icon = input<string>();
  selected = input<boolean>();
  hintSelect = input<boolean>(false);
  isSmallText = input<boolean>(false);
  type = input<ButtonTypeEnum>();
  repeatButtons = input<boolean>(false);
  buttonClick = output<void>();

  textMode = computed(() => {
    return !!this.text() && !this.icon() && !this.image();
  });

  onClick(): void {
    this.buttonClick.emit();
  }
}
