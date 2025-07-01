import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { ElementComponent } from "../../../directives/element-component.directive";
import { MultiChoiceCirclesElement } from "../../../models";
import { ResponseStatus } from "../../../models/verona";
import { MultiChoiceService } from '../../../services/multi-choice.service';
import { CircleOption } from "../../../interfaces";

@Component({
  selector: 'stars-multi-choice-circles',
  templateUrl: 'multi-choice-circles.component.html',
  styleUrls: ['multi-choice-circles.component.scss'],
  standalone: false
})
export class MultiChoiceCirclesComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<MultiChoiceCirclesElement>();

  options = signal([]);
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

  get defaultColor(): string {
    return this.elementModel().defaultColor;
  }

  get defaultSize(): number {
    return this.elementModel().defaultSize;
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
}
