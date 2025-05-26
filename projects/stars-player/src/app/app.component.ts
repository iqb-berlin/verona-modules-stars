import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VeronaPostService } from './services/verona-post.service';
import { NativeEventService } from './services/native-event.service';
import { MetaDataService } from './services/meta-data.service';
import { VeronaSubscriptionService } from "./services/verona-subscription.service";
import { UnitState, UnitStateDataType, VeronaResponse } from "./models/verona";
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

  private responses: VeronaResponse[] = [];

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
        debounceTime(100)
      )
      .subscribe(($event) => {
        this.updateResponses($event);
        this.sendValueChanged();
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  updateResponses(response: VeronaResponse): void {
    const index = this.responses.findIndex(r => r.id === response.id);
    if (index !== -1) {
      this.responses[index] = response;
    } else {
      this.responses.push(response);
    }

    LogService.debug('Responses updated:', this.responses);
  }

  sendValueChanged() {
    if (window === window.parent) {
      console.log('vopStateChangedNotification sent');
      console.log(this.responses);
    } else {
      let stateData: UnitState = {};
      stateData.unitStateDataType = UnitStateDataType;
      stateData.dataParts = {};
      stateData.dataParts['responses'] = JSON.stringify(this.responses);
      stateData.presentationProgress = "complete";
      stateData.responseProgress = "complete";
      this.veronaPostService.sendVopStateChangedNotification({unitState: stateData});
    }
  }
}
