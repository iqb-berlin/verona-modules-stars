import {
  Component, computed, HostListener, OnInit
} from '@angular/core';

import { VeronaPostService } from './services/verona-post.service';
import { VeronaSubscriptionService } from './services/verona-subscription.service';
import { UnitService } from './services/unit.service';
import { MetadataService } from './services/metadata.service';
import { ResponsesService } from './services/responses.service';
import { VopStartCommand } from './models/verona';
import { StateService } from './services/state.service';

@Component({
  selector: 'stars-player',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})

export class AppComponent implements OnInit {
  isStandalone: boolean | undefined;

  hasRibbonBars(): boolean {
    return this.unitService.ribbonBars();
  }

  getParametersWithFormerState = computed(() => {
    const params = this.unitService.parameters();
    const baseParams = params as Record<string, any> || {};
    return {
      ...baseParams,
      formerState: this.responsesService.formerStateResponses()
    };
  });

  constructor(
    public unitService: UnitService,
    public stateService: StateService,
    public responsesService: ResponsesService,
    public veronaPostService: VeronaPostService,
    private veronaSubscriptionService: VeronaSubscriptionService,
    private metadataService: MetadataService
  ) { }

  ngOnInit(): void {
    this.veronaSubscriptionService.vopStartCommand
      .subscribe((message: VopStartCommand) => {
        const unitDefinition = message.unitDefinition ? JSON.parse(message.unitDefinition) : {};
        this.veronaPostService.sessionID = message.sessionId;
        this.responsesService.setNewData(unitDefinition);
        this.responsesService.setFormerState(message.unitState ? message.unitState : null);
        this.unitService.setNewData(unitDefinition);
      });
    this.isStandalone = window === window.parent;
    this.veronaPostService.sendReadyNotification(this.metadataService.playerMetadata);
  }

  // eslint-disable-next-line class-methods-use-this
  disabledOverlay(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('window:blur')
  onBlur(): void {
    this.veronaPostService.sendVopWindowFocusChangedNotification(false);
  }

  @HostListener('window:focus')
  onFocus(): void {
    this.veronaPostService.sendVopWindowFocusChangedNotification(true);
  }

  protected readonly UnitService = UnitService;
}
