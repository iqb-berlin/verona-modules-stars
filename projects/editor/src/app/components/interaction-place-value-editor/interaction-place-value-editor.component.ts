import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorStateService } from '../../services/editor-state.service';
import { InteractionPlaceValueParams } from '@shared/models/unit-definition';

@Component({
  selector: 'stars-interaction-place-value-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="interaction-editor">
      <div class="field">
        <label>Variablen-ID</label>
        <input type="text" [value]="params.variableId" (input)="updateField('variableId', $any($event.target).value)">
      </div>
      <div class="field">
        <label>Wert</label>
        <input type="number" [value]="params.value" (input)="updateField('value', +$any($event.target).value)" min="0">
      </div>
      <div class="field">
        <label>Zeilen</label>
        <input type="number" [value]="params.numberOfRows" (input)="updateField('numberOfRows', +$any($event.target).value)" min="1" max="5">
      </div>
      <div class="field">
        <label>Max. Zehner</label>
        <input type="number" [value]="params.maxNumberOfTens" (input)="updateField('maxNumberOfTens', +$any($event.target).value)" min="0" max="20">
      </div>
      <div class="field">
        <label>Max. Einer</label>
        <input type="number" [value]="params.maxNumberOfOnes" (input)="updateField('maxNumberOfOnes', +$any($event.target).value)" min="0" max="20">
      </div>
    </div>
  `
})
export class InteractionPlaceValueEditorComponent {
  state = inject(EditorStateService);

  get params(): InteractionPlaceValueParams {
    return this.state.interactionParams() as InteractionPlaceValueParams;
  }

  updateField(field: string, value: any): void {
    const current = { ...this.params };
    (current as any)[field] = value;
    this.state.interactionParams.set(current);
    this.state.notifyChange();
  }
}
