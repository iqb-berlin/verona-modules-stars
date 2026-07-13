import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitFormService } from '../services/unit-form.service';
import { InteractionEnum } from '../models/unit-definition';

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-grid">
      <div class="form-group">
        <label>Unit ID</label>
        <input [value]="formService.unit().id"
               (input)="update('id', $event)">
      </div>
      <div class="form-group">
        <label>Version</label>
        <input [value]="formService.unit().version || ''"
               (input)="update('version', $event)">
      </div>
      <div class="form-group">
        <label>Background Color</label>
        <input type="color" [value]="formService.unit().backgroundColor || '#ffffff'"
               (input)="update('backgroundColor', $event)">
      </div>
      <div class="form-group">
        <label>Interaction Type</label>
        <select [value]="formService.unit().interactionType"
                (change)="updateType($event)">
          <option *ngFor="let type of interactionTypes" [value]="type">{{type}}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Continue Button Show</label>
        <select [value]="formService.unit().continueButtonShow || 'ALWAYS'"
                (change)="update('continueButtonShow', $event)">
          <option value="ALWAYS">ALWAYS</option>
          <option value="NO">NO</option>
          <option value="ON_ANY_RESPONSE">ON_ANY_RESPONSE</option>
          <option value="ON_RESPONSES_COMPLETE">ON_RESPONSES_COMPLETE</option>
          <option value="ON_MAIN_AUDIO_COMPLETE">ON_MAIN_AUDIO_COMPLETE</option>
          <option value="ON_VIDEO_COMPLETE">ON_VIDEO_COMPLETE</option>
          <option value="ON_AUDIO_AND_RESPONSE">ON_AUDIO_AND_RESPONSE</option>
        </select>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" [checked]="formService.unit().ribbonBars"
                 (change)="updateCheck('ribbonBars', $event)">
          Show Ribbon Bars
        </label>
      </div>
      <div class="form-group">
        <label>Interaction Max Time (ms)</label>
        <input type="number" [value]="formService.unit().interactionMaxTimeMS"
               (input)="updateNumber('interactionMaxTimeMS', $event)">
      </div>
    </div>

    <div class="sub-section">
      <h3>First Audio Options</h3>
      <div class="form-group">
        <label>First Click Layer</label>
        <select [value]="formService.unit().firstAudioOptions?.firstClickLayer || 'OFF'"
                (change)="updateFirstAudio('firstClickLayer', $event)">
          <option value="OFF">OFF</option>
          <option value="TRANSPARENT">TRANSPARENT</option>
          <option value="BLUR">BLUR</option>
          <option value="DISABLED">DISABLED</option>
        </select>
      </div>
      <div class="form-group">
        <label>Animate Button</label>
        <select [value]="formService.unit().firstAudioOptions?.animateButton || 'OFF'"
                (change)="updateFirstAudio('animateButton', $event)">
          <option value="OFF">OFF</option>
          <option value="KIND">KIND</option>
          <option value="BOLD">BOLD</option>
        </select>
      </div>
    </div>

    <div class="sub-section">
      <h3>Main Audio</h3>
      <div class="form-group">
        <label>Audio Source</label>
        <input [value]="formService.unit().mainAudio?.audioSource || ''"
               (input)="updateMainAudio('audioSource', $event)">
      </div>
      <div class="form-group">
        <label>Max Plays</label>
        <input type="number" [value]="formService.unit().mainAudio?.maxPlay || 0"
               (input)="updateMainAudioNumber('maxPlay', $event)">
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" [checked]="formService.unit().mainAudio?.disableInteractionUntilComplete"
                 (change)="updateMainAudioCheck('disableInteractionUntilComplete', $event)">
          Disable Interaction Until Complete
        </label>
      </div>
    </div>
  `,
  styles: [`
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .form-group { margin-bottom: 10px; display: flex; flex-direction: column; }
    .sub-section { margin-top: 15px; padding: 10px; border: 1px solid #eee; border-radius: 4px; }
    h3 { margin-top: 0; font-size: 1.1em; }
    label { font-weight: bold; margin-bottom: 4px; }
    input, select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
  `]
})
export class GeneralSettingsComponent {
  formService = inject(UnitFormService);

  interactionTypes: InteractionEnum[] = [
    'NONE', 'BUTTONS', 'POLYGON_BUTTONS', 'DROP', 'WRITE',
    'FIND_ON_IMAGE', 'VIDEO', 'IMAGE_ONLY', 'PLACE_VALUE',
    'NUMBER_LINE', 'PYRAMID', 'EQUATION', 'META'
  ];

  update(field: string, event: Event) {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
    this.formService.updateUnit({ [field]: value });
  }

  updateNumber(field: string, event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.formService.updateUnit({ [field]: value });
  }

  updateCheck(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.formService.updateUnit({ [field]: value });
  }

  updateType(event: Event) {
    const value = (event.target as HTMLSelectElement).value as InteractionEnum;
    this.formService.setInteractionType(value);
  }

  updateFirstAudio(field: string, event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const firstAudioOptions = { ...(this.formService.unit().firstAudioOptions || {}), [field]: value };
    this.formService.updateUnit({ firstAudioOptions });
  }

  updateMainAudio(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const mainAudio = { ...(this.formService.unit().mainAudio || { audioSource: '' }), [field]: value };
    this.formService.updateUnit({ mainAudio });
  }

  updateMainAudioNumber(field: string, event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    const mainAudio = { ...(this.formService.unit().mainAudio || { audioSource: '' }), [field]: value };
    this.formService.updateUnit({ mainAudio });
  }

  updateMainAudioCheck(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    const mainAudio = { ...(this.formService.unit().mainAudio || { audioSource: '' }), [field]: value };
    this.formService.updateUnit({ mainAudio });
  }
}
