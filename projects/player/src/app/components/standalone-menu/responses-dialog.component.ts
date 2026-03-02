// eslint-disable-next-line max-classes-per-file
import { Component, inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Response } from '@iqbspecs/response/response.interface';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow, CdkHeaderRowDef, CdkRow, CdkRowDef,
  CdkTable
} from '@angular/cdk/table';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

export class ResponsesDataSource extends DataSource<Response> {
  data = new BehaviorSubject<Response[]>([]);

  constructor(newData: Response[]) {
    super();
    this.data.next(newData);
  }

  connect(): Observable<Response[]> {
    return this.data;
  }

  // eslint-disable-next-line class-methods-use-this
  disconnect() {}
}

@Component({
  standalone: true,
  template: `
    <div class="table-host">
      <table cdk-table [dataSource]="data">
        <ng-container cdkColumnDef="id">
          <th cdk-header-cell *cdkHeaderCellDef> Variable Id</th>
          <td cdk-cell *cdkCellDef="let element"> {{ element.id }}</td>
        </ng-container>
        <ng-container cdkColumnDef="status">
          <th cdk-header-cell *cdkHeaderCellDef> Status</th>
          <td cdk-cell *cdkCellDef="let element"> {{ element.status }}</td>
        </ng-container>
        <ng-container cdkColumnDef="value">
          <th cdk-header-cell *cdkHeaderCellDef> Value</th>
          <td cdk-cell *cdkCellDef="let element"> {{ element.value }}</td>
        </ng-container>
        <ng-container cdkColumnDef="code">
          <th cdk-header-cell *cdkHeaderCellDef> Code</th>
          <td cdk-cell *cdkCellDef="let element"> {{ element.code }}</td>
        </ng-container>
        <ng-container cdkColumnDef="score">
          <th cdk-header-cell *cdkHeaderCellDef> Score</th>
          <td cdk-cell *cdkCellDef="let element"> {{ element.score }}</td>
        </ng-container>

        <tr cdk-header-row *cdkHeaderRowDef="displayedColumns"></tr>
        <tr cdk-row *cdkRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
    <div class="buttons">
      <button (click)="dialogRef.close()" [style.min-width]="'150px'">Schließen</button>
    </div>
  `,
  imports: [
    CdkTable,
    CdkColumnDef,
    CdkHeaderCell,
    CdkCell,
    CdkHeaderCellDef,
    CdkCellDef,
    CdkHeaderRow,
    CdkHeaderRowDef,
    CdkRow,
    CdkRowDef
  ],
  styles: [`
    :host {
      display: block;
      background: #fff;
      border-radius: 8px;
      padding: 16px;
      font-family: Courier New,monospace;
      font-size: small;
    }
    .table-host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
    }
    .buttons {
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-top: grey 2px solid;
      align-items: center;
      padding: 8px;
    }
  `]
})

export class ResponsesDialogComponent {
  dialogRef = inject<DialogRef<string>>(DialogRef<string>);
  data: Response[] = inject(DIALOG_DATA);
  dataSource: DataSource<Response>;
  displayedColumns: string[] = ['id', 'status', 'value', 'code', 'score'];

  constructor() {
    this.dataSource = new ResponsesDataSource(this.data);
  }
}
