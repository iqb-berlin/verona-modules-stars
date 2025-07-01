import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { MultiChoiceImagesElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { ResponseStatus } from "../../../models/verona";
import { MultiChoiceService } from '../../../services/multi-choice.service';

@Component({
  selector: 'stars-multi-choice-images',
  templateUrl: 'multi-choice-images.component.html',
  styleUrls: ['multi-choice-images.component.scss'],
  standalone: false
})
export class MultiChoiceImagesComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<MultiChoiceImagesElement>();
  formId = Math.floor(Math.random() * 20000000 + 10000000).toString();
  MultiCheckboxFormGroup = new FormGroup({});
  sectionVariant = input<string>('row_layout');
  layoutClass: string = 'row-layout';
  private multiChoiceService = inject(MultiChoiceService);

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

  valueChanged(event: any) {
    const response = this.multiChoiceService.valueChanged({
      formGroup: this.MultiCheckboxFormGroup,
      options: this.elementModel().options,
      elementId: this.elementModel().id,
      elementAlias: this.elementModel().alias,
      elementValue: this.elementModel().value
    });

    this.elementModel().value = response.value;
    this.valueChange.emit(response);
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
