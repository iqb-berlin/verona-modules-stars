import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VeronaPostService } from './services/verona-post.service';
import { NativeEventService } from './services/native-event.service';
import { MetaDataService } from './services/meta-data.service';
import { VeronaSubscriptionService } from "./services/verona-subscription.service";
import { UnitState, UnitStateDataType, VeronaResponse } from "./models/verona";


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

  constructor(private cdRef: ChangeDetectorRef,
              private nativeEventService: NativeEventService,
              private veronaPostService: VeronaPostService,
              private veronaSubscriptionService: VeronaSubscriptionService,
              private metaDataService: MetaDataService) {
    this.isStandalone = window === window.parent;
  }

  ngOnInit(): void {
    this.veronaPostService.sendReadyNotification(this.metaDataService.playerMetadata);
    this.nativeEventService.focus
      .subscribe((isFocused: boolean) => this.veronaPostService
        .sendVopWindowFocusChangedNotification(isFocused));
    this.valueChanged
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(200)
      )
    .subscribe(($event) => {
      this.sendValueChanged($event);
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  sendValueChanged(event: VeronaResponse) {
    if (window === window.parent) {
      console.log('vopStateChangedNotification sent');
      console.log(event);
    } else {
      let stateData: UnitState = {};
      stateData.unitStateDataType = UnitStateDataType;
      stateData.dataParts = {};
      stateData.dataParts[0] = JSON.stringify(event);
      stateData.presentationProgress = "complete";
      stateData.responseProgress = "complete";
      this.veronaPostService.sendVopStateChangedNotification({unitState: stateData});
    }
  }
}
