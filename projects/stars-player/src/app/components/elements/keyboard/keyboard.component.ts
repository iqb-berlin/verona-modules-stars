import {Component, input, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";

import {KeyboardElement} from "../../../models";
import {ElementComponent} from "../../../directives/element-component.directive";
import {ResponseStatus, VeronaResponse} from "../../../../../../common/models/verona";
import {UnitStateService} from "../../../services/unit-state.service";


@Component({
  selector: 'stars-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: [ './keyboard.component.scss' ],
  standalone: false
})

export class KeyboardComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<KeyboardElement>();
  KeyboardInputControl = new FormControl('');
  currentText: string = '';

  characterList: String[] = [ ...'abcdefghijklmnopqrstuvwxyz' ];
  graphemeList = [ 'ch', 'sch', 'ng', 'ei', 'au', 'eu', 'le', 'pf', 'chs' ];

  constructor(private unitStateService: UnitStateService) {
    super();
  }

  ngOnInit() {
    const restoredValue = this.unitStateService.registerElementWithRestore(
        this.elementModel().id,
        this.elementModel().alias || this.elementModel().id,
        this.elementModel().value || ""
    );

    this.currentText = typeof restoredValue === 'string' ? restoredValue : '';
    if (this.elementModel().graphemeList) this.graphemeList = this.elementModel().graphemeList;
    this.elementModel().value = this.currentText;
    this.KeyboardInputControl.setValue(this.currentText, { emitEvent: false });

    this.parentForm()?.addControl(this.elementModel().id, this.KeyboardInputControl);

    this.valueChanged(ResponseStatus.DISPLAYED);
  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.elementModel().id);
  }

  get textIsEmpty(): boolean {
    return this.currentText.length === 0;
  }

  capitalize(s: String) {
    return String(s[0]).toUpperCase() + String(s).slice(1);
  }

  addChar(button: String) {
    if (this.elementModel().maxLength !== null &&
        this.currentText.length >= this.elementModel().maxLength) {
      return;
    }

    const charToAdd = this.textIsEmpty ? button.toUpperCase() : button;
    this.currentText += charToAdd;
    this.valueChanged();
  }

  deleteChar() {
    if (this.currentText.length > 0) {
      this.currentText = this.currentText.slice(0, -1);
      this.valueChanged();
    }
  }

  private valueChanged(status?: ResponseStatus | ResponseStatus.VALUE_CHANGED) {
    this.elementModel().value = this.currentText;
    this.KeyboardInputControl.setValue(this.currentText);

    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: this.currentText,
      status: status
    });

    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || this.elementModel().id,
      value: this.currentText,
      status: status
    };

    this.valueChange.emit(response);
  }
}
