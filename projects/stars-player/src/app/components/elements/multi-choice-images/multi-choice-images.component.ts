import { Component, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";

import { MultiChoiceImagesElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse } from "../../../models/verona";

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
  aspectRatio = input<'square' | 'wide' | 'portrait'>('square');

  ngOnInit() {
    this.elementModel().options.forEach(option => {
      const formControl = new FormControl(false); // Initialize as false
      this.MultiCheckboxFormGroup.addControl(option.id, formControl, { emitEvent: false });
    });
    this.parentForm().addControl(this.formId, this.MultiCheckboxFormGroup);
  }

  ngOnDestroy() {
    this.parentForm().removeControl(this.formId);
  }

  valueChanged(event: any) {
    let value = "";
    for (const field in this.MultiCheckboxFormGroup.controls) {
      value += this.MultiCheckboxFormGroup.controls[field].value === true ? "1" : "0";
    }

    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || undefined,
      value: value,
      status: "VALUE_CHANGED"
    };

    this.valueChange.emit(response);
  }

  getLayoutClass(): string {
    const baseClass = this.getBaseLayoutClass();
    const optionCountClass = this.getOptionCountClass();
    const aspectClass = this.getAspectRatioClass();

    return `${baseClass} ${optionCountClass} ${aspectClass}`.trim();
  }

  private getBaseLayoutClass(): string {
    switch (this.sectionVariant()) {
      case 'grid_layout':
        return 'grid-layout';
      case 'row_layout':
      default:
        return 'row-layout';
    }
  }

  private getOptionCountClass(): string {
    const count = this.elementModel().options.length;
    return `options-${count}`;
  }

  private getAspectRatioClass(): string {
    switch (this.aspectRatio()) {
      case 'wide':
        return 'aspect-wide';
      case 'portrait':
        return 'aspect-portrait';
      case 'square':
      default:
        return 'aspect-square';
    }
  }
}
