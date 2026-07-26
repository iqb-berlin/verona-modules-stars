import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorStateService } from '../../services/editor-state.service';
import { MediaUploadComponent } from '../media-upload/media-upload.component';

@Component({
  selector: 'stars-opening-image-settings',
  standalone: true,
  imports: [CommonModule, MediaUploadComponent],
  templateUrl: './opening-image-settings.component.html',
  styleUrl: './opening-image-settings.component.scss'
})
export class OpeningImageSettingsComponent {
  state = inject(EditorStateService);
  collapsed = true;

  toggleOpeningImage(enabled: boolean): void {
    this.state.setOpeningImageEnabled(enabled);
  }
}
