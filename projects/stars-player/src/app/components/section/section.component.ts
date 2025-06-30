import { Component, input, output, inject } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { Section } from "../../models/section";
import { ResponseStatus, VeronaResponse } from "../../models/verona";
import { JSONObject } from "../../interfaces";
import { UnitStateService } from "../../services/unit-state.service";

@Component({
  selector: 'stars-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  standalone: false
})
export class SectionComponent {
  section = input.required<Section>();
  form = new FormGroup({});
  valueChange = output<VeronaResponse>();

  private unitStateService = inject(UnitStateService);

  valueChanged(event: VeronaResponse) {

    if (this.section().coding) {
      const coding = this.section().coding;
      let code = 0;
      let score = 0;
      let status = ResponseStatus.NO_CODING;

      if (coding.fullCredit) {
        if (coding.fullCredit == event.value) {
          code = 1;
          score = 1;
        }
        // no partial credits atm
        /*else if (code === 0 && coding.partialCredit) {
          let partialCredits: JSONObject[];

          if (Array.isArray(coding.partialCredit)) {
            partialCredits = coding.partialCredit;
          } else if (typeof coding.partialCredit === 'object') {
            partialCredits = [coding.partialCredit as JSONObject];
          } else {
            partialCredits = [];
          }

          const creditMatch = partialCredits.find((c: JSONObject) => c['partial'] == event.value);
          if (creditMatch) {
            score = typeof creditMatch['score'] === 'number' ? creditMatch['score'] : 0.5;
            code = typeof creditMatch['code'] === 'number' ? creditMatch['code'] : 2;
          }
        }*/

        event.code = code;
        event.score = score;
        event.status = status = ResponseStatus.CODING_COMPLETE;
      }

      this.unitStateService.changeElementCodeValue({
        id: event.id,
        value: event.value,
        status: status,
        code: code,
        score: score
      });
    }

    this.valueChange.emit(event);
  }
}
