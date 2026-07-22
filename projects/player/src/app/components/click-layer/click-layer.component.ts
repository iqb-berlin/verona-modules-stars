import {
  Component,
  inject,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';

import { UnitService } from '../../services/unit.service';
import { FirstAudioOptionsParams } from '../../models/unit-definition';

@Component({
  selector: 'stars-click-layer',
  templateUrl: './click-layer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./click-layer.component.scss'],
})
export class ClickLayerComponent {
  unitService = inject(UnitService);

  FirstAudioOptionsParams = input<FirstAudioOptionsParams>();

  handleClick() {
    this.unitService.setFirstClickLayerClicked();
  }
}
