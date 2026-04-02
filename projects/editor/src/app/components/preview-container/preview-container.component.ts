import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonPreviewComponent } from '../json-preview/json-preview.component';
import { LivePreviewComponent } from '../live-preview/live-preview.component';

@Component({
  selector: 'stars-preview-container',
  standalone: true,
  imports: [CommonModule, JsonPreviewComponent, LivePreviewComponent],
  template: `
    <div class="preview-container">
      <nav class="preview-tabs">
        <button
          [class.active]="activeTab() === 'LIVE'"
          (click)="activeTab.set('LIVE')"
        >
          <span class="tab-icon">▶</span> Live-Vorschau
        </button>
        <button
          [class.active]="activeTab() === 'JSON'"
          (click)="activeTab.set('JSON')"
        >
          <span class="tab-icon">{{ '{' }} {{ '}' }}</span> JSON-Definition
        </button>
      </nav>

      <main class="preview-content">
        @if (activeTab() === 'LIVE') {
          <stars-live-preview></stars-live-preview>
        } @else {
          <stars-json-preview></stars-json-preview>
        }
      </main>
    </div>
  `,
  styles: [
    `
      .preview-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: #1e293b;
        border-left: 1px solid #334155;
      }

      .preview-tabs {
        display: flex;
        background: #0f172a;
        border-bottom: 1px solid #334155;
        padding: 0 12px;
      }

      .preview-tabs button {
        background: transparent;
        border: none;
        color: #94a3b8;
        padding: 12px 16px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
      }

      .preview-tabs button:hover {
        color: #e2e8f0;
        background: rgba(255, 255, 255, 0.05);
      }

      .preview-tabs button.active {
        color: #38bdf8;
        border-bottom-color: #38bdf8;
        background: rgba(56, 189, 248, 0.1);
      }

      .tab-icon {
        font-size: 14px;
        opacity: 0.8;
      }

      .preview-content {
        flex: 1;
        overflow: hidden;
        position: relative;
      }
    `
  ]
})
export class PreviewContainerComponent {
  activeTab = signal<'LIVE' | 'JSON'>('LIVE');
}
