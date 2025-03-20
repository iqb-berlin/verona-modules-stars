// import {
//   Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges
// } from '@angular/core';
// import { BehaviorSubject, debounceTime, Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import {VeronaPostService} from "../services/verona-post.service";
// import {LogService} from "../services/log.service";
// import {PlayerState, ValidPage} from "../models/verona";
//
//
//
// @Directive({
//   selector: '[aspectPlayerState]'
// })
// export class PlayerStateDirective implements OnChanges, OnInit, OnDestroy {
//   @Input() isVisibleIndexPages!: BehaviorSubject<IsVisibleIndex[]>;
//   @Input() currentPageIndex!: number;
//
//   private validPages: Record<string, string> = {};
//   private ngUnsubscribe = new Subject<void>();
//   constructor(
//     private veronaPostService: VeronaPostService,
//     private navigationService: NavigationService
//   ) {}
//
//   ngOnInit(): void {
//     this.isVisibleIndexPages
//       .pipe(
//         debounceTime(50),
//         takeUntil(this.ngUnsubscribe)
//       )
//       .subscribe(isVisibleIndexPages => {
//         this.validPages = this.getValidPages(isVisibleIndexPages);
//         this.sendVopStateChangedNotification();
//       });
//   }
//
//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes.currentPageIndex) {
//       this.navigationService.currentPageIndexChanged.emit(this.currentPageIndex);
//       this.sendVopStateChangedNotification();
//     }
//   }
//
//   private getValidPages(isVisibleIndexPages: IsVisibleIndex[]): Record<string, string> {
//   //   return isVisibleIndexPages
//   //     .reduce(
//   //       (validPages: Record<string, string>, indexPage: IsVisibleIndex) => ({
//   //         ...validPages,
//   //         ...(indexPage.isVisible && {
//   //           [indexPage.index.toString(10)]:
//   //             `${this.translateService.instant('pageIndication', { index: indexPage.index + 1 })}`
//   //         })
//   //       }), {}
//   //     );
//   }
//
//   private sendVopStateChangedNotification(): void {
//     const playerState: PlayerState = {
//       currentPage: this.currentPageIndex.toString(10),
//       validPages: this.mapValidPagesToArray()
//     };
//     LogService.debug('player: sendVopStateChangedNotification', playerState);
//     this.veronaPostService.sendVopStateChangedNotification({ playerState });
//   }
//
//   private mapValidPagesToArray(): ValidPage[] {
//     return Object.keys(this.validPages).map(key => ({ id: key, label: this.validPages[key] }));
//   }
//
//   ngOnDestroy(): void {
//     this.ngUnsubscribe.next();
//     this.ngUnsubscribe.complete();
//   }
// }
