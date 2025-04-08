import { Component, input, output } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { Section } from "../../models/section";
import { ResponseStatus, VeronaResponse } from "../../models/verona";
import { JSONObject } from "../../interfaces";


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

  valueChanged(event: VeronaResponse) {
    if (this.section().coding) {
      if (this.section().coding.fullCredit) {
        let code = 0;
        let score = 0;
        const full = this.section().coding.fullCredit;

        if (full == event.value) {
          code = 1;
          score = 1;
        } else if (code == 0 && this.section().coding.partialCredit) {
          let partial = this.section().coding.partialCredit as [JSONObject];
          let credit = partial.find(c => c.partial == event.value);
          if (credit) {
            score = credit.score ? credit.score : 1;
            code = credit.code ? credit.code : 2;
          }
        }

        event.code = code;
        event.score = score;
        event.status = ResponseStatus.CODING_COMPLETE;
      }
    }

    this.valueChange.emit(event);
  }
}
