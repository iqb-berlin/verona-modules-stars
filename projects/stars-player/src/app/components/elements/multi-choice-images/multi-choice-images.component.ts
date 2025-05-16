import { Component, input, OnDestroy, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

import { MultiChoiceImagesElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import {VeronaResponse} from "../../../models/verona";


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

  // New property to store section variant
  sectionVariant = input<string>('row_layout');

  ngOnInit() {
    this.elementModel().options.forEach(option => {
      const formControl = new FormControl();
      this.MultiCheckboxFormGroup.addControl(option.id, formControl, { emitEvent: false });
    })
    this.parentForm().addControl(this.formId, this.MultiCheckboxFormGroup);
  }

  ngOnDestroy() {
    this.parentForm().removeControl(this.formId);
  }

  valueChanged(event) {
    let value = "";

    for (const field in this.MultiCheckboxFormGroup.controls) {
      value += this.MultiCheckboxFormGroup.controls[field].value == true ? 1 : 0;
    }

    let response:VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || undefined,
      value: value,
      status: "VALUE_CHANGED"
    };

    this.valueChange.emit(response);
  }

  // New method to determine the layout class based on variant
  getLayoutClass(): string {
    switch (this.sectionVariant()) {
      case 'grid_layout':
        return 'grid-layout';
      case 'row_layout':
      default:
        return 'row-layout';
    }
  }
}
