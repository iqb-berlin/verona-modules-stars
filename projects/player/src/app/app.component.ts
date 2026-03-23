import {
  Component, computed, HostListener, inject, OnInit
} from '@angular/core';

import { VeronaPostService } from './services/verona-post.service';
import { VeronaSubscriptionService } from './services/verona-subscription.service';
import { UnitService } from './services/unit.service';
import { MetadataService } from './services/metadata.service';
import { ResponsesService } from './services/responses.service';
import { StateService } from './services/state.service';
import { FeedbackService } from "./services/feedback.service";
import { VopStartCommand } from './models/verona';

@Component({
  selector: 'stars-player',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})

export class AppComponent implements OnInit {
  public unitService = inject(UnitService);
  public stateService = inject(StateService);
  public responsesService = inject(ResponsesService);
  public feedbackService = inject(FeedbackService);
  private veronaPostService = inject(VeronaPostService);
  private veronaSubscriptionService = inject(VeronaSubscriptionService);
  private metadataService = inject(MetadataService);

  isStandalone: boolean | undefined;

  /**
   * put formerState to Unit parameters if available
   */
  getParametersWithFormerState = computed(() => {
    return {
      ...this.unitService.parameters(),
      formerState: this.responsesService.formerStateResponses()
    };
  });

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
  preventClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  continueButtonClicked(): void {
    this.stateService.continueButtonClicked();
  }

  @HostListener('window:blur')
  onBlur(): void {
    this.veronaPostService.sendVopWindowFocusChangedNotification(false);
  }

  @HostListener('window:focus')
  onFocus(): void {
    this.veronaPostService.sendVopWindowFocusChangedNotification(true);
  }
}
