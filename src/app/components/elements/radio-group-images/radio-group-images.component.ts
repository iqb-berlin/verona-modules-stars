import {Component, input, OnDestroy, OnInit} from '@angular/core';
import { FormControl } from "@angular/forms";

import { RadioGroupImagesElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";


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
    console.log($event);
    this.elementModel().value = $event.value;
    let option = this.elementModel().options[$event.value];
    // if (option && option.coding) {
    //   let code = option.coding.find(c => c!==undefined);
    // }
    console.log(option.coding || "Error");
  }
}
