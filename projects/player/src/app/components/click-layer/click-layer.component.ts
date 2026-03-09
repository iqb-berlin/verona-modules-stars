import {
  Component, inject
} from '@angular/core';

import { StateService } from "../../services/state.service";

@Component({
  selector: 'stars-click-layer',
  templateUrl: './click-layer.component.html',
  styleUrls: ['./click-layer.component.scss']
})

export class ClickLayerComponent {
  stateService = inject(StateService);
}
