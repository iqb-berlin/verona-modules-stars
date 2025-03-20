import { Component, input, OnDestroy, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

import { MultiChoiceImagesElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";


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

  valueChanged($event) {
    console.log($event);
  }
}
