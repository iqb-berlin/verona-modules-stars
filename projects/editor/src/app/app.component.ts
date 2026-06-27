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
import {
  InteractionButtonsEditorComponent
} from './components/interaction-buttons-editor/interaction-buttons-editor.component';
import {
  InteractionWriteEditorComponent
} from './components/interaction-write-editor/interaction-write-editor.component';
import { InteractionDropEditorComponent } from './components/interaction-drop-editor/interaction-drop-editor.component';
import {
  InteractionFindOnImageEditorComponent
} from './components/interaction-find-on-image-editor/interaction-find-on-image-editor.component';
import {
  InteractionVideoEditorComponent
} from './components/interaction-video-editor/interaction-video-editor.component';
import {
  InteractionPolygonButtonsEditorComponent
} from './components/interaction-polygon-buttons-editor/interaction-polygon-buttons-editor.component';
import {
  InteractionPlaceValueEditorComponent
} from './components/interaction-place-value-editor/interaction-place-value-editor.component';
import {
  InteractionNumberLineEditorComponent
} from './components/interaction-number-line-editor/interaction-number-line-editor.component';
import {
  InteractionPyramidEditorComponent
} from './components/interaction-pyramid-editor/interaction-pyramid-editor.component';
import {
  InteractionEquationEditorComponent
} from './components/interaction-equation-editor/interaction-equation-editor.component';
import { VariableInfoEditorComponent } from './components/variable-info-editor/variable-info-editor.component';
import { AudioFeedbackEditorComponent } from './components/audio-feedback-editor/audio-feedback-editor.component';
import { PreviewContainerComponent } from './components/preview-container/preview-container.component';

@Component({
  selector: 'stars-editor',
  standalone: true,
  imports: [
    CommonModule,
    GeneralSettingsComponent,
    MainAudioSettingsComponent,
    OpeningImageSettingsComponent,
    InteractionSelectorComponent,
    InteractionButtonsEditorComponent,
    InteractionWriteEditorComponent,
    InteractionDropEditorComponent,
    InteractionFindOnImageEditorComponent,
    InteractionVideoEditorComponent,
    InteractionPolygonButtonsEditorComponent,
    InteractionPlaceValueEditorComponent,
    InteractionNumberLineEditorComponent,
    InteractionPyramidEditorComponent,
    InteractionEquationEditorComponent,
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

  updateMetaButtonsVariableId(value: string): void {
    this.state.updateInteractionParams(params => ({
      ...(params as any),
      variableId: value
    }));
  }
}
