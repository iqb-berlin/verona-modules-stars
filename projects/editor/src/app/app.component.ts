import {
  Component, inject, OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorVeronaSubscriptionService } from './services/editor-verona-subscription.service';
import { EditorVeronaPostService } from './services/editor-verona-post.service';
import { EditorMetadataService } from './services/editor-metadata.service';
import { EditorStateService } from './services/editor-state.service';
import { GeneralSettingsComponent } from './components/general-settings/general-settings.component';
import { MainAudioSettingsComponent } from './components/main-audio-settings/main-audio-settings.component';
import { OpeningImageSettingsComponent } from './components/opening-image-settings/opening-image-settings.component';
import { InteractionSelectorComponent } from './components/interaction-selector/interaction-selector.component';
import { VariableInfoEditorComponent } from './components/variable-info-editor/variable-info-editor.component';
import { AudioFeedbackEditorComponent } from './components/audio-feedback-editor/audio-feedback-editor.component';
import { PreviewContainerComponent } from './components/preview-container/preview-container.component';
import { INTERACTION_TYPE_DESCRIPTORS } from './services/interaction-type-registry';

@Component({
  selector: 'stars-editor',
  standalone: true,
  imports: [
    CommonModule,
    GeneralSettingsComponent,
    MainAudioSettingsComponent,
    OpeningImageSettingsComponent,
    InteractionSelectorComponent,
    VariableInfoEditorComponent,
    AudioFeedbackEditorComponent,
    PreviewContainerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private veronaSubscriptionService = inject(EditorVeronaSubscriptionService);
  private veronaPostService = inject(EditorVeronaPostService);
  private metadataService = inject(EditorMetadataService);
  state = inject(EditorStateService);

  showPreview = true;

  get interactionEditorComponent() {
    return INTERACTION_TYPE_DESCRIPTORS[this.state.interactionType()]?.editorComponent || null;
  }

  ngOnInit(): void {
    this.veronaSubscriptionService.voeStartCommand.subscribe(command => {
      if (command.unitDefinition) {
        this.state.loadFromDefinition(command.unitDefinition);
      }
    });

    this.veronaPostService.sendReadyNotification(JSON.stringify(this.metadataService.editorMetadata));
  }

  togglePreview() {
    this.showPreview = !this.showPreview;
  }

}
