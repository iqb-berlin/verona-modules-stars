import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, Subject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VeronaPostService } from './services/verona-post.service';
import { NativeEventService } from './services/native-event.service';
import { MetaDataService } from './services/meta-data.service';
import { VeronaSubscriptionService } from "./services/verona-subscription.service";
import { UnitStateService } from './services/unit-state.service';
import { StateVariableStateService } from './services/state-variable-state.service';
import { ValidationService } from './services/validation.service';
import { UnitState, UnitStateDataType, VeronaResponse, Progress } from "./models/verona";
import { LogService } from './services/log.service';

@Component({
  selector: 'stars-player',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  isStandalone: boolean;
  private ngUnsubscribe = new Subject<void>();
  valueChanged = new Subject<VeronaResponse>();
  form = new FormGroup({});
  unit: {} = {};

  // Presentation progress tracking
  presentationProgressStatus: Subject<Progress> = new Subject<Progress>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private nativeEventService: NativeEventService,
    private veronaPostService: VeronaPostService,
    private veronaSubscriptionService: VeronaSubscriptionService,
    private metaDataService: MetaDataService,
    private unitStateService: UnitStateService,
    private stateVariableStateService: StateVariableStateService,
    private validationService: ValidationService
  ) {
    this.isStandalone = window === window.parent;
  }

  ngOnInit(): void {
    this.veronaPostService.sendReadyNotification(this.metaDataService.playerMetadata);

    this.nativeEventService.focus
      .subscribe((isFocused: boolean) => this.veronaPostService
        .sendVopWindowFocusChangedNotification(isFocused));

    merge(
      this.unitStateService.elementCodeChanged,
      this.stateVariableStateService.elementCodeChanged,
      this.unitStateService.pagePresented
    )
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(100)
      )
      .subscribe(() => {
        this.sendVopStateChangedNotification();
      });

    this.valueChanged
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(50)
      )
      .subscribe(($event) => {
        LogService.debug('Value changed:', $event);
      });
  }

  ngOnDestroy(): void {
    this.sendVopStateChangedNotification();
    this.unitStateService.reset();
    this.stateVariableStateService.reset();
    this.validationService.reset();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private sendVopStateChangedNotification(): void {
    if (this.isStandalone) {
      console.log('🔄 State update (standalone mode)');
      console.log('📊 Unit State Responses:', this.unitStateService.getResponses());
      console.log('🔧 State Variable Responses:', this.stateVariableStateService.getResponses());
      return;
    }

    const unitState: UnitState = {
      unitStateDataType: UnitStateDataType,
      dataParts: {
        elementCodes: JSON.stringify(this.unitStateService.getResponses()),
        stateVariableCodes: JSON.stringify(this.stateVariableStateService.getResponses())
      },
      // presentationProgress: this.getPresentationProgress(),
      responseProgress: this.validationService.responseProgress
    };

    LogService.debug('📤 Sending state notification:', unitState);
    this.veronaPostService.sendVopStateChangedNotification({ unitState });
  }

  /* private getPresentationProgress(): Progress {
    return this.unitStateService.presentedPagesProgress;
  } */

  @HostListener('window:blur')
  onBlur(): void {
    this.veronaPostService.sendVopWindowFocusChangedNotification(false);
  }

  @HostListener('window:focus')
  onFocus(): void {
    this.veronaPostService.sendVopWindowFocusChangedNotification(true);
  }

  @HostListener('window:unload')
  onUnload(): void {
    this.sendVopStateChangedNotification();
  }

  sendValueChanged(): void {
    this.sendVopStateChangedNotification();
  }
}
