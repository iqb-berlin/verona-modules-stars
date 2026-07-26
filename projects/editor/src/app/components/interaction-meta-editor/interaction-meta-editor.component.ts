import { Component, inject } from '@angular/core';
import { EditorStateService } from '../../services/editor-state.service';

@Component({
  selector: 'stars-interaction-meta-editor',
  standalone: true,
  template: `
    <div class="interaction-editor">
      <div class="field">
        <label>Variablen-ID</label>
        <input
          type="text"
          [value]="$any(state.interactionParams()).variableId || ''"
          (input)="updateVariableId($any($event.target).value)"
        />
      </div>
      <div class="no-interaction">
        Die Meta-Interaktion wird im Player über die Closing-Meta-Konfiguration
        und die Variable-ID gesteuert.
      </div>
    </div>
  `
})
export class InteractionMetaEditorComponent {
  state = inject(EditorStateService);

  updateVariableId(value: string): void {
    this.state.updateInteractionParams(params => ({ ...params, variableId: value }));
  }
}
