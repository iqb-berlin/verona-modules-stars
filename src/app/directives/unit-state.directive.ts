// import {
//   Directive, HostListener, Input, OnDestroy, OnInit
// } from '@angular/core';
// import {
//   BehaviorSubject, debounceTime, merge, Subject
// } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { Progress, UnitState } from 'player/modules/verona/models/verona';
// import { VeronaSubscriptionService } from 'player/modules/verona/services/verona-subscription.service';
// import { VeronaPostService } from 'player/modules/verona/services/verona-post.service';
// import { LogService } from 'player/modules/logging/services/log.service';
// import { StateVariableStateService } from 'player/src/app/services/state-variable-state.service';
// import { MediaPlayerService } from '../services/media-player.service';
// import { ValidationService } from '../services/validation.service';
//
// @Directive({
//   selector: '[aspectUnitState]'
// })
// export class UnitStateDirective implements OnInit, OnDestroy {
//   @HostListener('window:unload')
//   onUnload(): void {
//     this.sendVopStateChangedNotification();
//   }
//
//   private ngUnsubscribe = new Subject<void>();
//   @Input() presentationProgressStatus!: BehaviorSubject<Progress>;
//
//   constructor(
//     private unitStateService: UnitStateService,
//     private stateVariableStateService: StateVariableStateService,
//     private mediaPlayerService: MediaPlayerService,
//     private veronaSubscriptionService: VeronaSubscriptionService,
//     private veronaPostService: VeronaPostService,
//     private validatorService: ValidationService
//   ) {}
//
//   ngOnInit(): void {
//     merge(
//       this.mediaPlayerService.mediaStatusChanged,
//       this.unitStateService.pagePresented,
//       this.unitStateService.elementCodeChanged,
//       this.stateVariableStateService.elementCodeChanged
//     )
//       .pipe(
//         debounceTime(100),
//         takeUntil(this.ngUnsubscribe)
//       )
//       .subscribe((): void => this.sendVopStateChangedNotification());
//   }
//
//   private get presentationProgress(): Progress {
//     if (this.presentationProgressStatus.value === 'complete') return 'complete';
//     if (this.mediaPlayerService.areMediaElementsRegistered()) {
//       const mediaStatus = this.mediaPlayerService.mediaStatus;
//       this.presentationProgressStatus
//         .next(mediaStatus === this.unitStateService.presentedPagesProgress ? mediaStatus : 'some');
//     } else {
//       this.presentationProgressStatus
//         .next(this.unitStateService.presentedPagesProgress);
//     }
//     return this.presentationProgressStatus.value;
//   }
//
//   private sendVopStateChangedNotification(): void {
//     LogService.debug('player: this.unitStateService.getResponses',
//       this.unitStateService.getResponses());
//     LogService.debug('player: this.stateVariableStateService.getResponses',
//       this.stateVariableStateService.getResponses());
//     const unitState: UnitState = {
//       dataParts: {
//         stateVariableCodes: JSON.stringify(this.stateVariableStateService.getResponses()),
//         elementCodes: JSON.stringify(this.unitStateService.getResponses())
//       },
//       presentationProgress: this.presentationProgress,
//       responseProgress: this.validatorService.responseProgress,
//       unitStateDataType: 'iqb-standard@1.0'
//     };
//     LogService.debug('player: unitState sendVopStateChangedNotification', unitState);
//     this.veronaPostService.sendVopStateChangedNotification({ unitState });
//   }
//
//   ngOnDestroy(): void {
//     this.sendVopStateChangedNotification();
//     this.unitStateService.reset();
//     this.stateVariableStateService.reset();
//     this.mediaPlayerService.reset();
//     this.validatorService.reset();
//     this.ngUnsubscribe.next();
//     this.ngUnsubscribe.complete();
//   }
// }
