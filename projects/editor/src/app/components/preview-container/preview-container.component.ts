import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonPreviewComponent } from '../json-preview/json-preview.component';
import { LivePreviewComponent } from '../live-preview/live-preview.component';

@Component({
  selector: 'stars-preview-container',
  standalone: true,
  imports: [CommonModule, JsonPreviewComponent, LivePreviewComponent],
  templateUrl: './preview-container.component.html',
  styleUrl: './preview-container.component.scss'
})
export class PreviewContainerComponent {
  activeTab = signal<'LIVE' | 'JSON'>('LIVE');
}
