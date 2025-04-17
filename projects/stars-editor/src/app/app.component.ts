import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VeronaResponse } from "../../../common/models/verona";
import { VeronaSubscriptionService } from "../../../common/services/verona-subscription.service";
import { VeronaPostService } from "../../../common/services/verona-post.service";


@Component({
  selector: 'stars-editor',
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
              private veronaPostService: VeronaPostService,
              private veronaSubscriptionService: VeronaSubscriptionService) {
    this.isStandalone = window === window.parent;
  }

  ngOnInit(): void {
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
  }
}
