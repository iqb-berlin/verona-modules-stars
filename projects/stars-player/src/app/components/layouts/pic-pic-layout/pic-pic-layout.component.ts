import { Component, input, output } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { UIElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse } from "../../../../../../common/models/verona";

@Component({
  selector: 'pic-pic-layout',
  templateUrl: './pic-pic-layout.component.html',
  styleUrls: ['./pic-pic-layout.component.scss'],
  standalone: false
})
export class PicPicLayoutComponent extends ElementComponent {
  instructions = input<UIElement>();
  interaction = input<UIElement>();
  stimulus = input<UIElement>();
  parentForm = input.required<FormGroup>();
  variant = input<string>('row_layout');
  valueChange = output<VeronaResponse>();

  get hasTopStimulus(): boolean {
    return !!(this.stimulus() && this.stimulus()?.position === "top");
  }

  get hasBottomStimulus(): boolean {
    return !!(this.stimulus() && this.stimulus()?.position === "bottom");
  }

  get hasStimulus(): boolean {
    return !!this.stimulus();
  }

  get hasVerticalSyllableCounter(): boolean {
    return !!(this.interaction() &&
      this.interaction()?.type === 'syllable-counter' &&
      (this.interaction() as any).layout === 'vertical');
  }
}
