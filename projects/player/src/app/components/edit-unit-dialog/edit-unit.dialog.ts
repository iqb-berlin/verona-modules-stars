import {
  AfterViewInit, Component, ElementRef, inject, ViewChild
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  template: `<h1>Edit unit definition</h1>
  <div>
    <textarea cdkTextareaAutosize #unitDefinitionElement
              cdkAutosizeMinRows="30" cdkAutosizeMaxRows="30" cols="106"
              (input)="onValueChange($event)" placeholder="Enter unit definition"></textarea>
  </div>
  <div>
    <button (click)="dialogRef.close(newData)">OK</button>
    <button (click)="dialogRef.close()">Cancel</button>
  </div>
  `,
  imports: [
    CdkTextareaAutosize
  ],
  styles: [
    `:host {
      display: block;
      background: #fff;
      border-radius: 8px;
      padding: 8px 16px;
    }
    textarea {
      white-space: pre;
      overflow-wrap: normal;
      overflow-x: scroll;
      font-family: revert;
    }
    button {
      padding: 10px 20px;
      font-size: medium;
    }`
  ]
})

export class EditUnitDialog implements AfterViewInit {
  data = inject(DIALOG_DATA);
  dialogRef = inject<DialogRef<string>>(DialogRef<string>);
  newData: string = '';
  @ViewChild('unitDefinitionElement') unitDefinitionElement!: ElementRef | undefined;

  ngAfterViewInit() {
    if (this.unitDefinitionElement) {
      const textAreaElement: HTMLTextAreaElement = this.unitDefinitionElement.nativeElement;
      textAreaElement.value = this.data;
      textAreaElement.setSelectionRange(0, 0);
    }
  }

  protected onValueChange(event: Event) {
    this.newData = (event.target as any).value as string;
  }
}
