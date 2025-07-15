import { Component, input, OnDestroy, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

import { ElementComponent } from "../../../directives/element-component.directive";
import { ResponseStatus, VeronaResponse } from "../../../../../../common/models/verona";
import { UnitStateService } from "../../../services/unit-state.service";
import { DropListElement } from "../../../models/elements/drop-list";

@Component({
  selector: 'stars-drop-list',
  templateUrl: 'drop-list.component.html',
  styleUrls: ['drop-list.component.scss'],
  standalone: false
})
export class DropListComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<DropListElement>();
  DropListFormControl = new FormControl();

  constructor(private unitStateService: UnitStateService) {
    super();
  }

  private getInitParams() {
    return {
      elementId: this.elementModel().id,
      elementAlias: this.elementModel().alias ?? this.elementModel().id,
      elementValue: this.elementModel().value ?? '',
      options: this.elementModel().options ?? [],
      formGroup: this.DropListFormControl,
      parentForm: () => this.parentForm() ?? null,
      required: !!this.elementModel().required
    };
  }

  ngOnInit() {
    this.updateElementStatus(ResponseStatus.DISPLAYED);
  }

  ngOnDestroy() {
  }

  valueChanged($event: any) {

    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: $event.value + 1,
      status: ResponseStatus.VALUE_CHANGED
    });

    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || this.elementModel().id,
      value: $event.value + 1,
      status: ResponseStatus.VALUE_CHANGED
    };

    this.valueChange.emit(response);
  }

  private updateElementStatus(status: ResponseStatus) {
  }
}
