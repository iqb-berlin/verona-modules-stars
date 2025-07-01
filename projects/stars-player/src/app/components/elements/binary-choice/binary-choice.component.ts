import { Component, input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

import { BinaryChoiceElement } from "../../../models/elements/binary-choice";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse, ResponseStatus } from "../../../../../../common/models/verona";
import { UnitStateService } from "../../../services/unit-state.service";
import { ValidationService } from "../../../services/validation.service";

@Component({
  selector: 'stars-binary-choice',
  templateUrl: './binary-choice.component.html',
  styleUrls: ['./binary-choice.component.scss'],
  standalone: false
})
export class BinaryChoiceComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<BinaryChoiceElement>();
  RadioInputControl = new FormControl();

  option1Icon: SafeHtml;
  option2Icon: SafeHtml;

  private unitStateService = inject(UnitStateService);
  private validationService = inject(ValidationService);
  private sanitizer = inject(DomSanitizer);

  private readonly option1Svg = `
<svg width="210" height="210" viewBox="0 0 210 210" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_12_227)">
<rect x="0.623047" y="0.0239258" width="200" height="200" rx="20.1601" fill="white"/>
</g>
<path d="M62.623 106.239L84.8237 130.214C85.2302 130.653 85.9285 130.639 86.3174 130.185L138.623 69.0386" stroke="#4A7611" stroke-width="16" stroke-linecap="round"/>
<defs>
<filter id="filter0_d_12_227" x="0.623047" y="0.0239258" width="209.072" height="209.072" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feMorphology radius="4.03202" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_12_227"/>
<feOffset dx="5.04003" dy="5.04003"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.109804 0 0 0 0 0.380392 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_12_227"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_12_227" result="shape"/>
</filter>
</defs>
</svg>
`;
  private readonly option2Svg = `
<svg width="210" height="210" viewBox="0 0 210 210" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_12_235)">
<rect x="0.623047" y="0.0239258" width="200" height="200" rx="20.1601" fill="white"/>
</g>
<path d="M66.623 67.139L134.623 132.91" stroke="#B83A1E" stroke-width="16" stroke-linecap="round"/>
<path d="M133.508 66.0238L67.7376 134.024" stroke="#B83A1E" stroke-width="16" stroke-linecap="round"/>
<defs>
<filter id="filter0_d_12_235" x="0.623047" y="0.0239258" width="209" height="209" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feMorphology radius="4" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_12_235"/>
<feOffset dx="5" dy="5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.109804 0 0 0 0 0.380392 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_12_235"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_12_235" result="shape"/>
</filter>
</defs>
</svg>
`;

  constructor() {
    super();
    this.option1Icon = this.sanitizer.bypassSecurityTrustHtml(this.option1Svg);
    this.option2Icon = this.sanitizer.bypassSecurityTrustHtml(this.option2Svg);
  }

  ngOnInit() {
    const restoredValue = this.unitStateService.registerElementWithRestore(
      this.elementModel().id,
      this.elementModel().alias || this.elementModel().id,
      this.elementModel().value // value is now null, 1 or 0
    );

    this.elementModel().value = restoredValue;
    this.RadioInputControl.setValue(restoredValue, { emitEvent: false });
    this.parentForm()?.addControl(this.elementModel().id, this.RadioInputControl);
    if (this.elementModel().required) {
      this.validationService.registerFormControl(this.RadioInputControl);
    }
    this.updateElementStatus(ResponseStatus.DISPLAYED);
  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.elementModel().id);
  }

  valueChanged($event: any) {
    const value = $event.value; // This will be 1 or 0
    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: value,
      status: ResponseStatus.VALUE_CHANGED
    });

    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || this.elementModel().id,
      value: value.toString(),
      status: ResponseStatus.VALUE_CHANGED
    };

    this.valueChange.emit(response);
  }

  private updateElementStatus(status: ResponseStatus) {
    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: this.elementModel().value,
      status: status
    });
  }
}
