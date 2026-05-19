import { Component, inject, OnDestroy } from '@angular/core';
import {
  CdkMenu, CdkMenuBar, CdkMenuItem, CdkMenuTrigger
} from '@angular/cdk/menu';
import { Dialog } from '@angular/cdk/dialog';
import { Subject, takeUntil } from 'rxjs';
import { FileService } from '../../services/file.service';
import { UnitService } from '../../services/unit.service';
import { ResponsesService } from '../../services/responses.service';
import { ResponsesDialogComponent } from './responses-dialog.component';
import {EditUnitDialog} from "../edit-unit-dialog/edit-unit.dialog";

@Component({
  selector: 'stars-standalone-menu',
  standalone: true,
  imports: [
    CdkMenuTrigger,
    CdkMenuItem,
    CdkMenuBar,
    CdkMenu
  ],
  template: `
    <div class="stars-standalone-menu">
      <div cdkMenuBar>
        <button class="menu-bar-item" cdkMenuItem [cdkMenuTriggerFor]="file">load</button>
      </div>
      <ng-template #file>
        <div class="menu" cdkMenu>
          <button class="menu-item" cdkMenuItem (cdkMenuItemTriggered)="load()">from file</button>
          <button class="menu-item" cdkMenuItem (cdkMenuItemTriggered)="openDialog()">edit</button>
          <button class="menu-item" cdkMenuItem (cdkMenuItemTriggered)="showResponses()">view responses</button>
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: 'standalone-menu.component.css'
})

export class StandaloneMenuComponent implements OnDestroy {
  dialog = inject(Dialog);
  unitDefinitionAsString = '';

  private ngUnsubscribe = new Subject<void>();

  constructor(
    public unitService: UnitService,
    public responsesService: ResponsesService
  ) { }

  async load(): Promise<void> {
    await FileService.loadFile(['.json', '.voud']).then(fileObject => {
      this.unitDefinitionAsString = fileObject.content;
      this.setNewUnitDefinition();
    });
  }

  private setNewUnitDefinition() {
    const unitDefinition = JSON.parse(this.unitDefinitionAsString);
    this.unitService.setNewData(unitDefinition);
    this.responsesService.setNewData(unitDefinition);
  }

  openDialog() {
    const dialogRef = this.dialog.open(EditUnitDialog, {
      width: '800px',
      height: '600px',
      data: this.unitDefinitionAsString
    });
    dialogRef.closed
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.unitDefinitionAsString = result as string;
          this.setNewUnitDefinition();
        }
      });
  }

  showResponses() {
    this.dialog.open<string>(ResponsesDialogComponent, {
      width: '800px',
      data: this.responsesService.allResponses
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
