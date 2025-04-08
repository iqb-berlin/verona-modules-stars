import { Inject, Injectable } from '@angular/core';
import {
  from, fromEvent, Observable, Subject
} from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { mergeMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class NativeEventService {
  private _focus = new Subject<boolean>();
  private _mouseUp = new Subject<MouseEvent>();
  private _pointerDown = new Subject<PointerEvent>();
  private _pointerUp = new Subject<PointerEvent>();
  private _resize = new Subject<number>();

  constructor(@Inject(DOCUMENT) private document: Document) {
    from(['blur', 'focus'])
      .pipe(
        mergeMap(event => fromEvent(window, event))
      )
      .subscribe(
        () => this._focus.next(document.hasFocus())// Do something with the event here
      );

    fromEvent(window, 'mouseup')
      .subscribe(event => this._mouseUp.next(event as MouseEvent));

    fromEvent(window, 'pointerup')
      .subscribe(event => this._pointerUp.next(event as PointerEvent));

    fromEvent(window, 'pointerdown')
      .subscribe(event => this._pointerDown.next(event as PointerEvent));

    fromEvent(window, 'resize')
      .subscribe(() => this._resize.next(window.innerWidth));
  }

  get focus(): Observable<boolean> {
    return this._focus.asObservable();
  }

  get mouseUp(): Observable<MouseEvent> {
    return this._mouseUp.asObservable();
  }

  get pointerUp(): Observable<PointerEvent> {
    return this._pointerUp.asObservable();
  }

  get pointerDown(): Observable<PointerEvent> {
    return this._pointerDown.asObservable();
  }

  get resize(): Observable<number> {
    return this._resize.asObservable();
  }
}
