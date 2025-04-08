import { Component, Input } from '@angular/core';

@Component({
  selector: 'aspect-text-field',
  template: `
    <ng-container *ngIf="!tableMode">
      <mat-form-field [class.small-input]="elementModel.label === ''"
                      [style.width.%]="100"
                      [style.height.%]="100"
                      [style.line-height.%]="elementModel.styling.lineHeight"
                      [style.color]="elementModel.styling.fontColor"
                      [style.font-size.px]="elementModel.styling.fontSize"
                      [style.font-weight]="elementModel.styling.bold ? 'bold' : ''"
                      [style.font-style]="elementModel.styling.italic ? 'italic' : ''"
                      [style.text-decoration]="elementModel.styling.underline ? 'underline' : ''"
                      [style.--backgroundColor]="elementModel.styling.backgroundColor"
                      [appearance]="$any(elementModel.appearance)">
        <mat-label>{{elementModel.label}}</mat-label>
        <input matInput #input
               autocomplete="off"
               autocapitalize="none"
               autocorrect="off"
               spellcheck="false"
               value="{{elementModel.value}}"
               [attr.inputmode]="elementModel.showSoftwareKeyboard || elementModel.hideNativeKeyboard ? 'none' : 'text'"
               [formControl]="elementFormControl"
               [pattern]="$any(elementModel.pattern)"
               [readonly]="elementModel.readOnly"
               (paste)="elementModel.isLimitedToMaxLength && elementModel.maxLength ? $event.preventDefault() : null"
               (keydown)="onKeyDown.emit({keyboardEvent: $event, inputElement: input})"
               (focus)="focusChanged.emit({ inputElement: input, focused: true })"
               (blur)="focusChanged.emit({ inputElement: input, focused: false })">
        <div matSuffix
             class="fx-row-center-baseline">
  <!--        TODO nicht zu sehen-->
          <mat-icon *ngIf="!elementFormControl.touched && elementModel.hasKeyboardIcon">keyboard_outline</mat-icon>
          <button *ngIf="elementModel.clearable"
                  type="button"
                  mat-icon-button aria-label="Clear"
                  (click)="elementFormControl.setValue('')">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <mat-error *ngIf="elementFormControl.errors">
          {{elementFormControl.errors | errorTransform: elementModel}}
        </mat-error>
      </mat-form-field>
    </ng-container>

    <ng-container *ngIf="tableMode">
      <aspect-cloze-child-error-message *ngIf="elementFormControl.errors && elementFormControl.touched"
                                        [elementModel]="elementModel"
                                        [elementFormControl]="elementFormControl">
      </aspect-cloze-child-error-message>
      <input #input
             class="table-child"
             autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false"
             [class.errors]="elementFormControl.errors && elementFormControl.touched"
             [attr.inputmode]="elementModel.showSoftwareKeyboard || elementModel.hideNativeKeyboard ? 'none' : 'text'"
             [style.line-height.%]="elementModel.styling.lineHeight"
             [style.color]="elementModel.styling.fontColor"
             [style.font-size.px]="elementModel.styling.fontSize"
             [style.font-weight]="elementModel.styling.bold ? 'bold' : ''"
             [style.font-style]="elementModel.styling.italic ? 'italic' : ''"
             [style.text-decoration]="elementModel.styling.underline ? 'underline' : ''"
             [style.background-color]="elementModel.styling.backgroundColor"
             [readonly]="elementModel.readOnly"
             [formControl]="elementFormControl"
             [value]="elementModel.value"
             (paste)="elementModel.isLimitedToMaxLength && elementModel.maxLength ? $event.preventDefault() : null"
             (keydown)="onKeyDown.emit({keyboardEvent: $event, inputElement: input})"
             (focus)="focusChanged.emit({ inputElement: input, focused: true })"
             (blur)="focusChanged.emit({ inputElement: input, focused: false })">
    </ng-container>
  `,
  styles: [`
    :host ::ng-deep .small-input div.mdc-notched-outline {
        top: 0.45em;
        bottom: 0.45em;
        height: unset;
    }
    :host ::ng-deep .small-input .mdc-notched-outline__notch {
      display: none;
    }
    :host ::ng-deep .mat-mdc-form-field-infix  {
      z-index: 1;
    }
    :host ::ng-deep .mat-mdc-text-field-wrapper .mdc-notched-outline * {
      background-color: var(--backgroundColor) !important;
    }
    :host ::ng-deep .mat-mdc-text-field-wrapper.mdc-text-field--filled {
      background-color: var(--backgroundColor) !important;
    }
    .fx-row-center-baseline {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: baseline;
    }
    .table-child {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: none;
      padding: 0 10px;
      font-family: inherit;
    }
  `]
})
export class TextFieldComponent extends TextInputComponent {
  @Input() elementModel!: TextFieldElement;
  tableMode: boolean = false;
}
