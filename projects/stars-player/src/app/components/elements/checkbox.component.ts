import { Component, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";

import { CheckboxElement } from "../../models";
import { ElementComponent } from "../../directives/element-component.directive";


@Component({
  selector: 'aspect-checkbox',
  template: `
    @if (elementModel) {
      <mat-form-field>
        <mat-checkbox #checkbox class="example-margin"
                      [checked]="$any(elementModel().value)"
                      (change)="valueChanged($event)">
          <div [innerHTML]="elementModel().label"></div>
        </mat-checkbox>
      </mat-form-field>
    }
  `,
  standalone: false
})

export class CheckboxComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<CheckboxElement>();

  ngOnInit() {
    // this.elementFormControl = new FormControl(this.elementModel().value);
    // this.parentForm().addControl(this.elementModel().id, this.elementFormControl, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this.parentForm().removeControl(this.elementModel().id);
  }

  valueChanged($event) {
    // this.valueChange.emit($event);
  }
}
