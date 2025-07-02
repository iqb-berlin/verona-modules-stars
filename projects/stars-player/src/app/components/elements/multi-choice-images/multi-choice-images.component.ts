import { Component, input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { MultiChoiceImagesElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { ResponseStatus, VeronaResponse } from "../../../../../../common/models/verona";
import { MultiChoiceService } from '../../../services/multi-choice.service';
import { UnitStateService } from "../../../services/unit-state.service";

@Component({
  selector: 'stars-multi-choice-images',
  templateUrl: 'multi-choice-images.component.html',
  styleUrls: ['multi-choice-images.component.scss'],
  standalone: false
})
export class MultiChoiceImagesComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<MultiChoiceImagesElement>();
  formId = `mc-images-${crypto.randomUUID()}`;
  MultiCheckboxFormGroup = new FormGroup({});
  sectionVariant = input<string>('row_layout');
  layoutClass: string = 'row-layout';

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
    this.layoutClass = this.getLayoutClass();
    this.elementModel().value = this.multiChoiceService.initializeFormControls(this.getInitParams());

    this.updateElementStatus(ResponseStatus.DISPLAYED);
  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.formId);
  }

  valueChanged(event: any): VeronaResponse {
    let value = "";
    for (let i = 0; i < this.elementModel().options.length; i++) {
      const option = this.elementModel().options[i];
      const formControl = this.MultiCheckboxFormGroup.controls[option.id];
      value += formControl.value === true ? '1' : '0';
    }
    this.elementModel().value = value;

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


  private updateElementStatus(status: ResponseStatus) {
    this.multiChoiceService.updateElementStatus({
      elementId: this.elementModel().id,
      elementValue: this.elementModel().value,
      status: status
    });
  }

  getLayoutClass(): string {
    const variant = this.sectionVariant();
    console.log(`Section variant for multi-choice: ${variant}`);

    switch (variant) {
      case 'grid_layout':
        return 'grid-layout';
      case 'row_layout':
      default:
        return 'row-layout';
    }
  }
}
