import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitDefinition } from './models/unit-definition';
import { UnitFormService } from './services/unit-form.service';
import { GeneralSettingsComponent } from './components/general-settings.component';
import { InteractionButtonsFormComponent } from './components/interaction-buttons-form.component';
import { InteractionWriteFormComponent } from './components/interaction-write-form.component';
import { InteractionDropFormComponent } from './components/interaction-drop-form.component';
import { InteractionFindOnImageFormComponent } from './components/interaction-find-on-image-form.component';
import { InteractionVideoFormComponent } from './components/interaction-video-form.component';
import { InteractionPlaceValueFormComponent } from './components/interaction-place-value-form.component';
import { InteractionNumberLineFormComponent } from './components/interaction-number-line-form.component';
import { InteractionPyramidFormComponent } from './components/interaction-pyramid-form.component';
import { InteractionEquationFormComponent } from './components/interaction-equation-form.component';
import { InteractionPolygonButtonsFormComponent } from './components/interaction-polygon-buttons-form.component';
import { InteractionMetaFormComponent } from './components/interaction-meta-form.component';
import { VariableInfoFormComponent } from './components/variable-info-form.component';
import { AudioFeedbackFormComponent } from './components/audio-feedback-form.component';
import { ClosingMetaButtonsFormComponent } from './components/closing-meta-buttons-form.component';

@Component({
  selector: 'app-editor-root',
  standalone: true,
  imports: [
    CommonModule,
    GeneralSettingsComponent,
    InteractionButtonsFormComponent,
    InteractionWriteFormComponent,
    InteractionDropFormComponent,
    InteractionFindOnImageFormComponent,
    InteractionVideoFormComponent,
    InteractionPlaceValueFormComponent,
    InteractionNumberLineFormComponent,
    InteractionPyramidFormComponent,
    InteractionEquationFormComponent,
    InteractionPolygonButtonsFormComponent,
    InteractionMetaFormComponent,
    VariableInfoFormComponent,
    AudioFeedbackFormComponent,
    ClosingMetaButtonsFormComponent
  ],
  template: `
    <div class="editor-container">
      <h1>STARS Unit Definition Editor</h1>
      <div class="toolbar">
        <button (click)="loadSample()">Load Sample</button>
        <button (click)="downloadJson()">Download JSON</button>
        <input type="file" (change)="uploadJson($event)" style="display:none" #fileInput>
        <button (click)="fileInput.click()">Upload JSON</button>
      </div>

      <div class="editor-layout">
        <div class="form-section">
          <section>
            <h2>Unit Settings</h2>
            <app-general-settings></app-general-settings>
          </section>

          <hr>

          <section>
            <h2>Interaction Parameters</h2>
            <div [ngSwitch]="formService.unit().interactionType">
              <div *ngSwitchCase="'BUTTONS'">
                <h3>Button Interaction</h3>
                <app-interaction-buttons-form></app-interaction-buttons-form>
              </div>
              <div *ngSwitchCase="'POLYGON_BUTTONS'">
                <h3>Polygon Buttons Interaction</h3>
                <app-interaction-polygon-buttons-form></app-interaction-polygon-buttons-form>
              </div>
              <div *ngSwitchCase="'WRITE'">
                <h3>Write Interaction</h3>
                <app-interaction-write-form></app-interaction-write-form>
              </div>
              <div *ngSwitchCase="'DROP'">
                <h3>Drop Interaction</h3>
                <app-interaction-drop-form></app-interaction-drop-form>
              </div>
              <div *ngSwitchCase="'FIND_ON_IMAGE'">
                <h3>Find On Image Interaction</h3>
                <app-interaction-find-on-image-form></app-interaction-find-on-image-form>
              </div>
              <div *ngSwitchCase="'VIDEO'">
                <h3>Video Interaction</h3>
                <app-interaction-video-form></app-interaction-video-form>
              </div>
              <div *ngSwitchCase="'PLACE_VALUE'">
                <h3>Place Value Interaction</h3>
                <app-interaction-place-value-form></app-interaction-place-value-form>
              </div>
              <div *ngSwitchCase="'NUMBER_LINE'">
                <h3>Number Line Interaction</h3>
                <app-interaction-number-line-form></app-interaction-number-line-form>
              </div>
              <div *ngSwitchCase="'PYRAMID'">
                <h3>Pyramid Interaction</h3>
                <app-interaction-pyramid-form></app-interaction-pyramid-form>
              </div>
              <div *ngSwitchCase="'EQUATION'">
                <h3>Equation Interaction</h3>
                <app-interaction-equation-form></app-interaction-equation-form>
              </div>
              <div *ngSwitchCase="'META'">
                <h3>Meta Interaction</h3>
                <app-interaction-meta-form></app-interaction-meta-form>
              </div>
              <div *ngSwitchCase="'IMAGE_ONLY'">
                <p><strong>IMAGE_ONLY</strong> interaction type has no specific parameters.</p>
              </div>
              <div *ngSwitchCase="'NONE'">
                <p>No interaction selected.</p>
              </div>
              <div *ngSwitchDefault>
                <p>Interaction type <strong>{{formService.unit().interactionType}}</strong> form not yet implemented.</p>
              </div>
            </div>
          </section>

          <hr>

          <section>
            <app-variable-info-form></app-variable-info-form>
          </section>

          <hr>

          <section>
            <app-audio-feedback-form></app-audio-feedback-form>
          </section>

          <hr>

          <section>
            <app-closing-meta-buttons-form></app-closing-meta-buttons-form>
          </section>
        </div>

        <div class="preview-section">
          <h2>JSON Preview</h2>
          <pre>{{ formService.unit() | json }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .editor-container { padding: 20px; font-family: sans-serif; }
    .toolbar { margin-bottom: 20px; }
    .editor-layout { display: flex; gap: 20px; }
    .form-section { flex: 1; border: 1px solid #ccc; padding: 15px; }
    .preview-section { flex: 1; border: 1px solid #ccc; padding: 15px; background: #f9f9f9; }
    pre { background: #f4f4f4; padding: 10px; overflow: auto; max-height: 80vh; }
    hr { margin: 20px 0; border: 0; border-top: 1px solid #eee; }
  `]
})
export class EditorComponent {
  formService = inject(UnitFormService);

  loadSample() {
    this.formService.loadUnit({
      id: 'sample-unit',
      version: '1.1.0',
      interactionType: 'BUTTONS',
      interactionMaxTimeMS: 30000,
      interactionParameters: {
        variableId: 'v1',
        options: {
          buttons: [
            { text: 'Option 1' },
            { text: 'Option 2' }
          ]
        },
        buttonType: 'MEDIUM_SQUARE'
      } as any,
      variableInfo: [
        {
          variableId: 'v1',
          responseComplete: 'ALWAYS',
          codingSource: 'VALUE',
          codes: [{ method: 'EQUALS', parameter: '1', code: 1, score: 1 }]
        }
      ],
      closingMetaButtons: {
        variableIdReference: 'ref1'
      }
    });
  }

  downloadJson() {
    const data = JSON.stringify(this.formService.unit(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unit-definition-${this.formService.unit().id}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  uploadJson(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const unit = JSON.parse(e.target?.result as string);
          this.formService.loadUnit(unit);
        } catch (err) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  }
}
