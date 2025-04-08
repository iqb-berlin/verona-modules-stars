import { ChangeDetectorRef, Component, OnDestroy, OnInit, output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  PlayerConfig,
  Progress, VeronaResponse,
  VopPlayerConfigChangedNotification,
  VopStartCommand
} from '../../models/verona';
import { VeronaSubscriptionService } from '../../services/verona-subscription.service';
import { VeronaPostService } from '../../services/verona-post.service';
import { MetaDataService } from '../../services/meta-data.service';
import { InstantiationError } from '../../errors';
import { Section } from "../../models/section";
import { Unit } from "../../models/unit";
import { LogService } from "../../services/log.service";


@Component({
  selector: 'stars-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss'],
  standalone: false
})

export class UnitComponent implements OnInit, OnDestroy {
  sections: Section[] = [];
  playerConfig: PlayerConfig = {};
  showUnitNavNext: boolean = false;
  valueChange= output<VeronaResponse>();

  presentationProgressStatus: BehaviorSubject<Progress> = new BehaviorSubject<Progress>('none');

  constructor(
          private metaDataService: MetaDataService,
          private veronaPostService: VeronaPostService,
          private veronaSubscriptionService: VeronaSubscriptionService,
          private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.veronaSubscriptionService.vopStartCommand
      .subscribe((message: VopStartCommand) => this.configureUnit(message));
    this.veronaSubscriptionService.vopPlayerConfigChangedNotification
      .subscribe((message: VopPlayerConfigChangedNotification) => this.setPlayerConfig(message.playerConfig || {}));
  }

  ngOnDestroy(): void {

  }

  private configureUnit(message: VopStartCommand): void {
    this.reset();
    setTimeout(() => {
      if (message.unitDefinition) {
        try {
          LogService.debug('player: unitDefinition', message.unitDefinition);
          const unitDefinition = JSON.parse(message.unitDefinition as string);
          LogService.debug('player: unitDefinition parsed', unitDefinition);
          this.checkUnitDefinitionVersion(unitDefinition);
          const unit: Unit = new Unit(unitDefinition);
          this.sections = unit.sections;
          LogService.debug('player: sections', this.sections);
          this.showUnitNavNext = unit.showUnitNavNext;
          this.setPlayerConfig(message.playerConfig || {});
          this.metaDataService.resourceURL = this.playerConfig.directDownloadUrl;
          this.veronaPostService.sessionID = message.sessionId;
          this.initElementCodes(message, unit);
          this.changeDetectorRef.detectChanges();
        } catch (e: unknown) {
          console.error(e);
          if (e instanceof InstantiationError) {
            console.error('Failing element blueprint: ', e.faultyBlueprint);
            this.showErrorDialog('unitDefinitionIsNotReadable');
          } else if (e instanceof Error) {
            this.showErrorDialog(e.message);
          } else {
            this.showErrorDialog('unitDefinitionIsNotReadable');
          }
        }
      } else {
        LogService.warn('player: message has no unitDefinition');
      }
    });
  }

  private setPlayerConfig(playerConfig: PlayerConfig): void {
    this.playerConfig = playerConfig;
  }

  private checkUnitDefinitionVersion(unitDefinition: Record<string, unknown>): void {
  }

  private initElementCodes(message: VopStartCommand, unitDefinition: Unit): void {
    // this.unitStateService
    //   .setElementCodes(message.unitState?.dataParts?.elementCodes ?
    //     JSON.parse(message.unitState.dataParts.elementCodes) : [],
    //   unitDefinition.getAllElements().map(element => element.getIdentifiers()).flat());
    //
    // this.stateVariableStateService
    //   .setElementCodes(message.unitState?.dataParts?.stateVariableCodes ?
    //     JSON.parse(message.unitState.dataParts.stateVariableCodes) : [],
    //   unitDefinition.stateVariables.map(stateVariable => ({ id: stateVariable.id, alias: stateVariable.alias })));
    //
    // unitDefinition.stateVariables
    //   .map(stateVariable => this.stateVariableStateService
    //     .registerElementCode(stateVariable.id, stateVariable.alias, stateVariable.value));
  }

  private showErrorDialog(text: string): void {
    // TODO: ErrorDialog
  }

  private reset(): void {
    this.presentationProgressStatus.next('none');
    this.sections = [];
    this.playerConfig = {};
    this.changeDetectorRef.detectChanges();
  }

  valueChanged(event: VeronaResponse): void {
    this.valueChange.emit(event);
  }
}
