import { ChangeDetectorRef, Component, OnDestroy, OnInit, output, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  PlayerConfig,
  Progress,
  VeronaResponse,
  VopPlayerConfigChangedNotification,
  VopStartCommand
} from '../../../../../common/models/verona';
import { VeronaSubscriptionService } from '../../../../../common/services/verona-subscription.service';
import { VeronaPostService } from '../../../../../common/services/verona-post.service';
import { MetaDataService } from '../../services/meta-data.service';
import { UnitStateService } from '../../services/unit-state.service';
import { StateVariableStateService } from '../../services/state-variable-state.service';
import { InstantiationError } from '../../errors';
import { Section } from "../../models";
import { Unit, UnitNavNextButtonMode } from "../../models/unit";
import { LogService } from "../../services/log.service";
import { AudioComponent } from "../elements/audio.component";

@Component({
  selector: 'stars-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss'],
  standalone: false
})
export class UnitComponent implements OnInit, OnDestroy {
  sections: Section[] = [];
  playerConfig: PlayerConfig = {};
  navNextButtonMode: UnitNavNextButtonMode = 'always'
  valueChange = output<VeronaResponse>();

  presentationProgressStatus: BehaviorSubject<Progress> = new BehaviorSubject<Progress>('none');

  constructor(
    private metaDataService: MetaDataService,
    private veronaPostService: VeronaPostService,
    private veronaSubscriptionService: VeronaSubscriptionService,
    private changeDetectorRef: ChangeDetectorRef,
    private unitStateService: UnitStateService,
    private stateVariableStateService: StateVariableStateService,
    private elementRef: ElementRef,
    private renderer: Renderer2
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
          const unitDefinition = JSON.parse(message.unitDefinition as string);

          this.checkUnitDefinitionVersion(unitDefinition);
          const unit: Unit = new Unit(unitDefinition);

          this.initElementCodes(message, unit);
          this.applyBackgroundColor(unit.backgroundColor);

          this.sections = unit.sections;
          this.navNextButtonMode = unit.navNextButtonMode;
          this.setPlayerConfig(message.playerConfig || {});
          this.metaDataService.resourceURL = this.playerConfig.directDownloadUrl;
          this.veronaPostService.sessionID = message.sessionId;

          this.presentationProgressStatus.next('some');

          this.changeDetectorRef.detectChanges();
        } catch (e: unknown) {
          console.error('Unit configuration error:', e);
          if (e instanceof InstantiationError) {
            console.error('Failing element blueprint:', e.faultyBlueprint);
            this.showErrorDialog('unitDefinitionIsNotReadable');
          } else if (e instanceof Error) {
            this.showErrorDialog(e.message);
          } else {
            this.showErrorDialog('unitDefinitionIsNotReadable');
          }
        }
      } else {
        LogService.warn('No unit definition in message');
      }
    });
  }

  get showUnitNavNext(): boolean {
    switch (this.navNextButtonMode) {
      case 'always':
        return true;
      case 'onInteraction':
        return this.hasUserProvidedInput();
      default:
        return false;
    }
  }

  private applyBackgroundColor(backgroundColor?: string): void {
    if (backgroundColor) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', backgroundColor);
      this.renderer.setStyle(document.body, 'background-color', backgroundColor);
    } else {
      this.renderer.removeStyle(this.elementRef.nativeElement, 'background-color');
      this.renderer.removeStyle(document.body, 'background-color');
    }
  }

  private setPlayerConfig(playerConfig: PlayerConfig): void {
    this.playerConfig = playerConfig;
  }

  private checkUnitDefinitionVersion(unitDefinition: Record<string, unknown>): void {
    // Implement version checking if needed
  }

  private initElementCodes(message: VopStartCommand, unit: Unit): void {
    const existingElementCodes = message.unitState?.dataParts?.elementCodes ?
      JSON.parse(message.unitState.dataParts.elementCodes) : [];

    const elementIdentifiers = unit.getAllElements().map(element => ({
      id: element.id,
      alias: element.alias || element.id
    }));

    this.unitStateService.setElementCodes(existingElementCodes, elementIdentifiers);

    const existingStateVariableCodes = message.unitState?.dataParts?.stateVariableCodes ?
      JSON.parse(message.unitState.dataParts.stateVariableCodes) : [];

    const stateVariableIdentifiers = unit.stateVariables.map(stateVariable => ({
      id: stateVariable.id,
      alias: stateVariable.alias
    }));

    this.stateVariableStateService.setElementCodes(existingStateVariableCodes, stateVariableIdentifiers);

    unit.stateVariables.forEach(stateVariable => {
      this.stateVariableStateService.registerElementCode(
        stateVariable.id,
        stateVariable.alias,
        stateVariable.value
      );
    });
  }

  private hasUserProvidedInput(): boolean {
    const responses = this.unitStateService.getResponses();
    return responses.some(response => {
      return response.value !== null &&
        response.value !== undefined &&
        response.value !== '' &&
        response.status !== 'UNSET';
    });
  }

  private showErrorDialog(text: string): void {
    console.error('🚨 Error:', text);
    // TODO: Implement proper error dialog
  }

  navigateToNext(): void {
    this.veronaPostService.sendVopUnitNavigationRequestedNotification('next');
  }

  private reset(): void {
    this.presentationProgressStatus.next('none');
    this.sections = [];
    this.playerConfig = {};
    this.navNextButtonMode = 'always'
    this.unitStateService.reset();
    this.stateVariableStateService.reset();

    this.applyBackgroundColor();
    AudioComponent.reset()

    this.changeDetectorRef.detectChanges();
  }

  valueChanged(event: VeronaResponse): void {
    this.valueChange.emit(event);
  }
}
