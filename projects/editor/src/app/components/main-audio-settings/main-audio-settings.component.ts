import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorStateService } from '../../services/editor-state.service';
import { MediaUploadComponent } from '../media-upload/media-upload.component';

@Component({
  selector: 'stars-main-audio-settings',
  standalone: true,
  imports: [CommonModule, MediaUploadComponent],
  templateUrl: './main-audio-settings.component.html',
  styleUrl: './main-audio-settings.component.scss'
})
export class MainAudioSettingsComponent {
  state = inject(EditorStateService);
  collapsed = true;

  toggleMainAudio(enabled: boolean): void {
    this.state.setMainAudioEnabled(enabled);
  }

  updateFirstClickLayer(value: string): void {
    this.state.setFirstClickLayerFromSelection(value);
  }

  updateAnimateButton(value: string): void {
    this.state.setAnimateButtonFromSelection(value);
  }
}
