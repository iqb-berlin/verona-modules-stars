import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractionEnum } from '@shared/models/unit-definition';
import { EditorStateService } from '../../services/editor-state.service';

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
            @for (type of interactionTypes; track type.value) {
              <option [value]="type.value">{{ type.label }}</option>
            }
          </select>
        </div>
      </div>
    </section>
  `
})
export class InteractionSelectorComponent {
  state = inject(EditorStateService);

  interactionTypes: { value: InteractionEnum; label: string }[] = [
    { value: 'BUTTONS', label: 'Buttons (Auswahl)' },
    { value: 'IMAGE_ONLY', label: 'Nur Bild (statisch)' },
    { value: 'WRITE', label: 'Schreiben / Tastatur' },
    { value: 'DROP', label: 'Drag & Drop' },
    { value: 'FIND_ON_IMAGE', label: 'Auf Bild finden' },
    { value: 'VIDEO', label: 'Video Player' },
    { value: 'POLYGON_BUTTONS', label: 'Polygon-Regionen' },
    { value: 'PLACE_VALUE', label: 'Stellenwerttafel' },
    { value: 'NUMBER_LINE', label: 'Zahlenstrahl' },
    { value: 'PYRAMID', label: 'Rechenpyramide' },
    { value: 'EQUATION', label: 'Gleichung / Term' }
  ];

  onTypeChange(newType: string): void {
    this.state.interactionType.set(newType as InteractionEnum);
    this.state.resetInteractionParams(newType as InteractionEnum);
    this.state.notifyChange();
  }
}
