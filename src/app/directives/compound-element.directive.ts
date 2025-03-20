// import {
//   AfterViewInit,
//   Directive, EventEmitter, Input, Output, QueryList
// } from '@angular/core';
// import { UntypedFormGroup } from '@angular/forms';
// import { ElementComponent } from './element-component.directive';
// import { ClozeChildOverlay } from '../components/compound-elements/cloze/cloze-child-overlay.component';
// import { LikertRadioButtonGroupComponent } from
//   '../components/compound-elements/likert/likert-radio-button-group.component';
// import { TableChildOverlay } from 'common/components/compound-elements/table/table-child-overlay.component';
//
// @Directive()
// export abstract class CompoundElementComponent extends ElementComponent implements AfterViewInit {
//   @Output() childrenAdded = new EventEmitter<ElementComponent[]>();
//   @Input() parentForm!: UntypedFormGroup;
//   compoundChildren!: QueryList<ClozeChildOverlay | LikertRadioButtonGroupComponent | TableChildOverlay>;
//
//   ngAfterViewInit(): void {
//     this.childrenAdded.emit(this.getFormElementChildrenComponents());
//   }
//
//   abstract getFormElementChildrenComponents(): ElementComponent[];
// }
