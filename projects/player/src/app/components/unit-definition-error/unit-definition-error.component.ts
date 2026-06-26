import { Component, input } from '@angular/core';

@Component({
  selector: 'stars-unit-definition-error',
  standalone: true,
  templateUrl: './unit-definition-error.component.html',
  styleUrls: ['./unit-definition-error.component.scss']
})
export class UnitDefinitionErrorComponent {
  message = input.required<string>();
}
