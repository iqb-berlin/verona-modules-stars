import {
  Component,
  computed,
  HostListener,
  OnInit,
  ChangeDetectionStrategy,
  effect,
} from '@angular/core';

import { VeronaPostService } from './services/verona-post.service';
import { VeronaSubscriptionService } from './services/verona-subscription.service';
import { UnitService } from './services/unit.service';
import { MetadataService } from './services/metadata.service';
import { ResponsesService } from './services/responses.service';
import { VopStartCommand } from './models/verona';
import { environment } from '../environments/environment';

@Component({
  selector: 'stars-player',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AppComponent implements OnInit {
  isStandalone: boolean | undefined;
  private lastFeedbackHint = '';

  hasRibbonBars(): boolean {
    return this.unitService.ribbonBars();
  }

  getParametersWithFormerState = computed(() => {
    const params = this.unitService.parameters();
    const baseParams = (params as Record<string, any>) || {};
    return {
      ...baseParams,
      formerState: this.responsesService.formerStateResponses(),
    };
  });

  constructor(
    public unitService: UnitService,
    public responsesService: ResponsesService,
    public veronaPostService: VeronaPostService,
    private veronaSubscriptionService: VeronaSubscriptionService,
    private metadataService: MetadataService,
  ) {
    effect(() => {
      // WebKit (Safari/SEB) workaround:
      // feedback hints can update in state but miss an immediate paint,
      // especially for soft color/border-only hints on iPad Mini.
      // Trigger a repaint only when the feedback hint value actually changes.
      const hint = this.responsesService.feedbackHint();
      if (hint === this.lastFeedbackHint) {
        return;
      }
      this.lastFeedbackHint = hint;
      this.nudgeFeedbackRepaint();
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private nudgeFeedbackRepaint(): void {
    // Double rAF waits for hint class/style updates to settle before forcing layout.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const targets = document.querySelectorAll(
          '.interaction-body .hint, .interaction-body .has-hint, .interaction-body input.hint + label',
        );
        if (targets.length === 0) {
          const interactionBody = document.querySelector(
            '.interaction-body',
          ) as HTMLElement | null;
          if (interactionBody) {
            void interactionBody.offsetHeight;
          }
          return;
        }
        targets.forEach((el) => {
          void (el as HTMLElement).offsetHeight;
        });
      });
    });
  }

  ngOnInit(): void {
    this.veronaSubscriptionService.vopStartCommand.subscribe(
      (message: VopStartCommand) => {
        const unitDefinition = message.unitDefinition
          ? JSON.parse(message.unitDefinition)
          : {};
        this.veronaPostService.sessionID = message.sessionId;
        this.responsesService.setNewData(unitDefinition);
        this.responsesService.setFormerState(
          message.unitState ? message.unitState : null,
        );
        this.unitService.setNewData(unitDefinition);
      },
    );
    this.isStandalone = window === window.parent;
    this.veronaPostService.sendReadyNotification(
      this.metadataService.playerMetadata,
    );

    if (environment.production) {
      window.addEventListener('contextmenu', (e) => e.preventDefault());
      document.body.classList.add('disable-user-interaction');
    }
  }

  sendNavigationRequest($event: string) {
    if ($event === 'next') {
      this.veronaPostService.sendVopUnitNavigationRequestedNotification('next');
    }
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
