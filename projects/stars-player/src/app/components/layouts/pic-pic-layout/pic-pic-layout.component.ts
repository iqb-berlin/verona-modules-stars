import { Component, computed, input, output } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { UIElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse } from "../../../../../../common/models/verona";

/**
 * PicPicLayoutComponent is a specialized layout component that manages the arrangement
 * of three main content areas: instructions, stimulus, and interaction elements.
 * The component supports different layout configurations based on:
 * - Presence/absence of stimulus
 * - Position of stimulus (top/bottom/side)
 * - Special handling for vertical syllable counter
 * - Different variants (row/grid layouts)
 */

@Component({
  selector: 'pic-pic-layout',
  templateUrl: './pic-pic-layout.component.html',
  styleUrls: ['./pic-pic-layout.component.scss'],
  standalone: false
})
export class PicPicLayoutComponent extends ElementComponent {
  // Input signals
  instructions = input<UIElement>();
  interaction = input<UIElement>();
  stimulus = input<UIElement>();
  parentForm = input.required<FormGroup>();
  variant = input<string>('row_layout');

  // Output signal
  valueChange = output<VeronaResponse>();

  // Computed signals for derived state
  readonly hasTopStimulus = computed(() =>
    !!(this.stimulus() && this.stimulus()?.position === "top")
  );

  readonly hasBottomStimulus = computed(() =>
    !!(this.stimulus() && this.stimulus()?.position === "bottom")
  );

  readonly hasStimulus = computed(() =>
    !!this.stimulus()
  );

  readonly hasVerticalSyllableCounter = computed(() =>
    !!(this.interaction() &&
      this.interaction()?.type === 'syllable-counter' &&
      (this.interaction() as any).layout === 'vertical')
  );

  readonly layoutClasses = computed(() => ({
    'no-stimulus': !this.hasStimulus(),
    'top-stimulus': this.hasTopStimulus() && !this.hasVerticalSyllableCounter(),
    'bottom-stimulus': this.hasBottomStimulus() && !this.hasVerticalSyllableCounter(),
    'syllable-vertical': this.hasVerticalSyllableCounter(),
    'large-interaction': !this.hasStimulus()
  }));

  // Event handler
  onValueChange(event: VeronaResponse): void {
    this.valueChange.emit(event);
  }
}
