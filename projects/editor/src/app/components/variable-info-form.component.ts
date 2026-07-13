import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitFormService } from '../services/unit-form.service';
import { VariableInfo, Code } from '../models/responses';

@Component({
  selector: 'app-variable-info-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>Variable Info</h3>
    <div *ngFor="let info of formService.unit().variableInfo || []; let i = index" class="info-block">
      <div class="form-grid">
        <div class="form-group">
          <label>Variable ID</label>
          <input [value]="info.variableId" (input)="updateInfo(i, 'variableId', $event)">
        </div>
        <div class="form-group">
          <label>Response Complete</label>
          <select [value]="info.responseComplete" (change)="updateInfo(i, 'responseComplete', $event)">
            <option value="ALWAYS">ALWAYS</option>
            <option value="ON_ANY_RESPONSE">ON_ANY_RESPONSE</option>
            <option value="ON_FULL_CREDIT">ON_FULL_CREDIT</option>
            <option value="ON_ALL_SUB_VALUES">ON_ALL_SUB_VALUES</option>
          </select>
        </div>
        <div class="form-group">
          <label>Coding Source</label>
          <select [value]="info.codingSource" (change)="updateInfo(i, 'codingSource', $event)">
            <option value="VALUE">VALUE</option>
            <option value="VALUE_TO_UPPER">VALUE_TO_UPPER</option>
            <option value="SUM">SUM</option>
            <option value="SUM_CHAR_MATCHES">SUM_CHAR_MATCHES</option>
          </select>
        </div>
        <div class="form-group">
          <label>Coding Source Parameter</label>
          <input [value]="info.codingSourceParameter || ''" (input)="updateInfo(i, 'codingSourceParameter', $event)">
        </div>
      </div>
      <button class="remove-btn" (click)="removeInfo(i)">Remove Variable</button>

      <div class="codes-section">
        <h4>Codes</h4>
        <div *ngFor="let code of info.codes; let ci = index" class="code-block">
          <select [value]="code.method" (change)="updateCode(i, ci, 'method', $event)">
            <option value="EQUALS">EQUALS</option>
            <option value="GREATER_THAN">GREATER_THAN</option>
            <option value="LESS_THAN">LESS_THAN</option>
            <option value="IN_POSITION_RANGE">IN_POSITION_RANGE</option>
          </select>
          <input [value]="code.parameter" placeholder="Parameter" (input)="updateCode(i, ci, 'parameter', $event)">
          <input type="number" [value]="code.code" placeholder="Code" (input)="updateCodeNumber(i, ci, 'code', $event)">
          <input type="number" [value]="code.score" placeholder="Score" (input)="updateCodeNumber(i, ci, 'score', $event)">
          <button (click)="removeCode(i, ci)">x</button>
        </div>
        <button (click)="addCode(i)">Add Code</button>
      </div>
    </div>
    <button (click)="addInfo()">Add Variable Info</button>
  `,
  styles: [`
    .info-block { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
    .codes-section { margin-top: 15px; padding-left: 15px; border-left: 3px solid #eee; }
    .code-block { display: flex; gap: 5px; margin-bottom: 8px; flex-wrap: wrap; }
    .form-group { margin-bottom: 5px; display: flex; flex-direction: column; }
    .remove-btn { background: #fee; color: #c00; border: 1px solid #c00; padding: 4px 8px; cursor: pointer; }
    label { font-size: 0.9em; font-weight: bold; }
    input, select { padding: 6px; border: 1px solid #ccc; border-radius: 3px; }
  `]
})
export class VariableInfoFormComponent {
  formService = inject(UnitFormService);

  addInfo() {
    const infos = [...(this.formService.unit().variableInfo || [])];
    infos.push({
      variableId: 'new_var',
      responseComplete: 'ALWAYS',
      codingSource: 'VALUE',
      codes: []
    });
    this.formService.updateUnit({ variableInfo: infos });
  }

  removeInfo(index: number) {
    const infos = [...(this.formService.unit().variableInfo || [])];
    infos.splice(index, 1);
    this.formService.updateUnit({ variableInfo: infos });
  }

  updateInfo(index: number, field: string, event: Event) {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
    const infos = JSON.parse(JSON.stringify(this.formService.unit().variableInfo));
    infos[index][field] = value;
    this.formService.updateUnit({ variableInfo: infos });
  }

  addCode(index: number) {
    const infos = JSON.parse(JSON.stringify(this.formService.unit().variableInfo));
    infos[index].codes.push({ method: 'EQUALS', parameter: '', code: 0, score: 0 });
    this.formService.updateUnit({ variableInfo: infos });
  }

  removeCode(infoIndex: number, codeIndex: number) {
    const infos = JSON.parse(JSON.stringify(this.formService.unit().variableInfo));
    infos[infoIndex].codes.splice(codeIndex, 1);
    this.formService.updateUnit({ variableInfo: infos });
  }

  updateCode(infoIndex: number, codeIndex: number, field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const infos = JSON.parse(JSON.stringify(this.formService.unit().variableInfo));
    infos[infoIndex].codes[codeIndex][field] = value;
    this.formService.updateUnit({ variableInfo: infos });
  }

  updateCodeNumber(infoIndex: number, codeIndex: number, field: string, event: Event) {
    const value = parseFloat((event.target as HTMLInputElement).value);
    const infos = JSON.parse(JSON.stringify(this.formService.unit().variableInfo));
    infos[infoIndex].codes[codeIndex][field] = value;
    this.formService.updateUnit({ variableInfo: infos });
  }
}
