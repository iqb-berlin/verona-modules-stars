import { Component, input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { ElementComponent } from "../../../directives/element-component.directive";
import { MultiChoiceCirclesElement } from "../../../models";
import { MultiChoiceService } from "../../../services/multi-choice.service";
import { UnitStateService } from "../../../services/unit-state.service";
import { ResponseStatus, VeronaResponse } from "../../../../../../common/models/verona";


@Component({
  selector: 'stars-multi-choice-circles',
  templateUrl: 'multi-choice-circles.component.html',
  styleUrls: ['multi-choice-circles.component.scss'],
  standalone: false
})

export class MultiChoiceCirclesComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<MultiChoiceCirclesElement>();
  options = signal<CircleOption[]>([]);
  formId = `mc-circles-` + Math.floor(Math.random() * 20000000 + 10000000).toString();
  MultiCheckboxFormGroup = new FormGroup({});

  constructor(
    private multiChoiceService: MultiChoiceService,
    private unitStateService: UnitStateService
  ) {
    super();
  }

  private getInitParams() {
    return {
      elementId: this.elementModel().id,
      elementAlias: this.elementModel().alias ?? this.elementModel().id,
      elementValue: this.elementModel().value ?? '',
      options: this.elementModel().options ?? [],
      formGroup: this.MultiCheckboxFormGroup,
      formId: this.formId,
      parentForm: () => this.parentForm() ?? null,
      required: !!this.elementModel().required
    };
  }

  ngOnInit() {
    const circleOptions: CircleOption[] = Array.from(
      { length: this.elementModel().optionsCount },
      (_, index) => ({
        id: `circle_${index}`,
        text: `Circle ${index + 1}`
      })
    );

    this.options.set(circleOptions);
    this.elementModel().options = circleOptions;

    this.elementModel().value = this.multiChoiceService.initializeFormControls(this.getInitParams());

    this.updateElementStatus(ResponseStatus.DISPLAYED);
  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.formId);
  }

  valueChanged(event: any): VeronaResponse {
    const selectedCount = this.countSelectedCircles();
    const value = selectedCount.toString();

    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: value,
      status: ResponseStatus.VALUE_CHANGED
    });

    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || this.elementModel().id,
      value: value,
      status: ResponseStatus.VALUE_CHANGED
    };

    this.valueChange.emit(response);
    return response;
  }

  private countSelectedCircles(): number {
    return this.elementModel().options.reduce((count, option) => {
      const control = this.MultiCheckboxFormGroup.controls[option.id];
      return control?.value === true ? count + 1 : count;
    }, 0);
  }

  private updateElementStatus(status: ResponseStatus) {
    this.multiChoiceService.updateElementStatus({
      elementId: this.elementModel().id,
      elementValue: this.elementModel().value,
      status: status
    });
  }
}

export interface CircleOption {
  id: string;
  text: string;
}
