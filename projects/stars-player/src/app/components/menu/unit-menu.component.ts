import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FileService } from '../../services/file.service';
import {
  UnitState,
  VopPageNavigationCommand,
  VopPlayerConfigChangedNotification,
  VopStartCommand
} from '../../models/verona';


@Component({
  selector: 'stars-unit-menu',
  templateUrl: './unit-menu.component.html',
  styleUrls: ['./unit-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})

export class UnitMenuComponent {
  private postTarget: Window = window;

  private vopStartCommandMessage: VopStartCommand = {
    type: 'vopStartCommand',
    sessionId: 'load',
    unitDefinition: undefined,
    playerConfig: {
      pagingMode: undefined
    },
    unitState: undefined
  };

  async load(): Promise<void> {
    await FileService.loadFile(['.json', '.voud']).then(unitDefinition => {
      this.loadUnit(unitDefinition.content, {});
    });
  }

  private loadUnit(unitDefinition: string, unitSate: UnitState): void {
    this.vopStartCommandMessage.unitDefinition = unitDefinition;
    this.postMessage(this.vopStartCommandMessage);
  }

  private postMessage(message: VopStartCommand | VopPageNavigationCommand | VopPlayerConfigChangedNotification): void {
    this.postTarget.postMessage(message, '*');
  }
}
