import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorStateService } from '../../services/editor-state.service';

@Component({
  selector: 'stars-json-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="json-preview">
      <h3>Live-Vorschau (JSON)</h3>
      <pre>{{ jsonString }}</pre>
    </div>
  `,
  styles: [`
    .json-preview { background-color: #1e293b; color: #e2e8f0; height: 100%; border-left: 1px solid #334155; padding: 1rem; overflow: auto; }
    h3 { margin-top: 0; color: #94a3b8; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #334155; padding-bottom: 8px; margin-bottom: 8px; }
    pre { font-family: 'Fira Code', 'Monaco', 'Courier New', monospace; font-size: 12px; line-height: 1.5; color: #38bdf8; }
  `]
})
export class JsonPreviewComponent {
  state = inject(EditorStateService);

  get jsonString(): string {
    return JSON.stringify(this.state.buildUnitDefinition(), null, 2);
  }
}
