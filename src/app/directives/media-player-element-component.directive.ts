import {
  Directive, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { ElementComponent } from "./element-component.directive";


@Directive()
export abstract class MediaPlayerElementComponent extends ElementComponent implements OnInit, OnDestroy {
  @Input() actualPlayingId!: Subject<string | null>;

  active: boolean = true;
  isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
