import {Component, input, OnDestroy, OnInit} from '@angular/core';
import { FormControl } from "@angular/forms";

import { RadioGroupImagesElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import {VeronaResponse} from "../../../models/verona";


@Component({
  selector: 'stars-radio-group-images',
  templateUrl: './radio-group-images.component.html',
  styleUrls: ['./radio-group-images.component.scss'],
  standalone: false
})

export class RadioGroupImagesComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<RadioGroupImagesElement>();
  RadioInputControl = new FormControl();
  position = input<string>("row");

  ngOnInit() {
    this.RadioInputControl.setValue(this.elementModel().value, { emitEvent: false });
    this.parentForm().addControl(this.elementModel().id, this.RadioInputControl);
  }

  ngOnDestroy() {
    this.parentForm().removeControl(this.elementModel().id);
  }

  valueChanged($event) {
    this.elementModel().value = $event.value;

    let response:VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || undefined,
      value: this.elementModel().value as string,
      status: "VALUE_CHANGED"
    };
    this.valueChange.emit(response);
  }
}
