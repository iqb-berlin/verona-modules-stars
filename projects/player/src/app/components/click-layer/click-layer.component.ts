import {
  Component, inject
} from '@angular/core';
import { UnitService } from '../../services/unit.service';

@Component({
  selector: 'stars-click-layer',
  templateUrl: './click-layer.component.html',
  styleUrls: ['./click-layer.component.scss']
})

export class ClickLayerComponent {
  unitService = inject(UnitService);

  handleClick() {
    this.unitService.setFirstClickLayerClicked();
  }
}
