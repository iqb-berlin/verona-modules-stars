import {
  Component, computed, inject
} from '@angular/core';
import { UnitService } from '../../services/unit.service';

@Component({
  selector: 'stars-ribbon-bar',
  template: `
    <div [class]="ribbonClass()" data-cy="ribbon-bar">
    </div>
  `,
  styleUrls: ['./ribbon-bar.component.scss']
})
export class RibbonBarComponent {
  private unitService = inject(UnitService);

  // Get background color from the service instead of input
  backgroundColor = computed(() => this.unitService.backgroundColor());

  ribbonClass = computed(() => {
    const bgColorUpper = this.backgroundColor().toUpperCase();
    return ['#FFF', '#FFFFFF', '#EEE', '#EEEEEE', 'WHITE'].includes(bgColorUpper) ? 'ribbon-bar' : 'ribbon-bar-white';
  });
}
