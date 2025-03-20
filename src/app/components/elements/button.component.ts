import {
  Component, EventEmitter, Input, Output
} from '@angular/core';
import { ButtonElement, ButtonEvent } from 'common/models/elements/button/button';
import { ElementComponent } from '../../directives/element-component.directive';

@Component({
  selector: 'aspect-button',
  template: `
    <a *ngIf="!elementModel.imageSrc && elementModel.asLink"
       href="{{elementModel.action+'-'+elementModel.actionParam}}"
       [style.background-color]="elementModel.styling.backgroundColor"
       [style.color]="elementModel.styling.fontColor"
       [style.font-size.px]="elementModel.styling.fontSize"
       [style.font-weight]="elementModel.styling.bold ? 'bold' : ''"
       [style.font-style]="elementModel.styling.italic ? 'italic' : ''"
       [style.text-decoration]="elementModel.styling.underline ? 'underline' : ''"
       pointerEventTooltip
       [tooltipPosition]="elementModel.tooltipPosition"
       [tooltipText]="elementModel.tooltipText"
       (click)="$event.preventDefault();
                elementModel.action && elementModel.actionParam !== null ?
                buttonActionEvent.emit($any({ action: elementModel.action, param: elementModel.actionParam})) :
                false">
      {{elementModel.label}}
    </a>

    <button *ngIf="!elementModel.imageSrc && !elementModel.asLink" mat-button
            type='button'
            class="full-size"
            [style.background-color]="elementModel.styling.backgroundColor"
            [style.color]="elementModel.styling.fontColor"
            [style.font-size]="elementModel.labelAlignment !== 'baseline' ?
                                'smaller' :
                                elementModel.styling.fontSize + 'px'"
            [style.font-style]="elementModel.styling.italic ? 'italic' : ''"
            [style.text-decoration]="elementModel.styling.underline ? 'underline' : ''"
            [style.border-width.px]="elementModel.styling.borderWidth"
            [style.border-style]="elementModel.styling.borderStyle"
            [style.border-color]="elementModel.styling.borderColor"
            [style.border-radius.px]="elementModel.styling.borderRadius"
            [style.vertical-align]="elementModel.labelAlignment"
            [style.font-weight]="elementModel.styling.bold ? 'bold' :
                                  elementModel.labelAlignment !== 'baseline' ?
                                    400 : ''"
            pointerEventTooltip
            [tooltipPosition]="elementModel.tooltipPosition"
            [tooltipText]="elementModel.tooltipText"
            (click)="elementModel.action && elementModel.actionParam !== null ?
                     buttonActionEvent.emit($any({ action: elementModel.action, param: elementModel.actionParam })) :
                     false">
      {{elementModel.label}}
    </button>

    <input *ngIf="elementModel.imageSrc"
           type="image"
           class="full-size image"
           [src]="elementModel.imageSrc | safeResourceUrl"
           [alt]="'imageNotFound' | translate"
           pointerEventTooltip
           [tooltipPosition]="elementModel.tooltipPosition"
           [tooltipText]="elementModel.tooltipText"
           (click)="elementModel.action !== null && elementModel.actionParam !== null?
                    buttonActionEvent.emit($any({ action: elementModel.action, param: elementModel.actionParam })) :
                    false">
  `,
  styles: [
    ':host {display: flex; width: 100%; height: 100%;}',
    '.full-size {width: 100%; height: 100%;}',
    '.image {object-fit: contain;}',
    '.mdc-button {min-width: unset;}'
  ]
})
export class ButtonComponent extends ElementComponent {
  @Input() elementModel!: ButtonElement;
  @Output() buttonActionEvent = new EventEmitter<ButtonEvent>();
}
