import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractionEnum } from '@shared/models/unit-definition';
import { EditorStateService } from '../../services/editor-state.service';
import {
  INTERACTION_TYPE_DESCRIPTORS,
  InteractionTypeDescriptor
} from '../../services/interaction-type-registry';

@Component({
  selector: 'stars-interaction-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="editor-section">
      <h3 class="section-title">
        <span class="collapse-icon">▼</span>
        Interaktionstyp
      </h3>
      <div class="section-body">
        <div class="field">
          <label>Typ auswählen</label>
          <select [value]="state.interactionType()" (change)="onTypeChange($any($event.target).value)">
            @for (type of interactionTypes; track type.type) {
              <option [value]="type.type">{{ type.label }} — {{ type.description }}</option>
            }
          </select>
        </div>
      </div>
    </section>
  `
})
export class InteractionSelectorComponent {
  state = inject(EditorStateService);

  interactionTypes: InteractionTypeDescriptor[] = Object.values(INTERACTION_TYPE_DESCRIPTORS)
    .filter(descriptorValue => descriptorValue.visible);

  onTypeChange(newType: string): void {
    this.state.setInteractionType(newType as InteractionEnum);
  }
}
