import {Component, input, OnInit, signal} from '@angular/core';

import { GraphemeKeyboardElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import {VeronaResponse} from "../../../models/verona";


@Component({
  selector: 'stars-grapheme-keyboard',
  templateUrl: './grapheme-keyboard.component.html',
  styleUrls: ['./grapheme-keyboard.component.scss'],
  standalone: false
})

export class GraphemeKeyboardComponent extends ElementComponent implements OnInit {
  elementModel = input.required<GraphemeKeyboardElement>();
  position = input<string>("row");
  inputField = signal<string>("");
  value:string[] = [];

  ngOnInit() {
    this.value = this.elementModel().value ? this.elementModel().value as Array<string> : [];
    this.inputField.set(this.value.join(''));
  }

  valueChanged($event) {
    this.value.push($event);
    this.elementModel().value = this.value;
    this.inputField.set(this.value.join(''));

    let response:VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || undefined,
      value: this.elementModel().value as string[],
      status: "VALUE_CHANGED"
    };

    this.valueChange.emit(response);
  }

  valueBack() {
    this.value.pop();
    this.elementModel().value = this.value;
    this.inputField.set(this.value.join(''));
  }
}
