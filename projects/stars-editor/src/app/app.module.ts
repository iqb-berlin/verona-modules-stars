import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { ErrorService } from "../../../common/services/error.service";
import { JsonEditor } from "./components/editor";
import { JsonEditorComponent } from "ang-jsoneditor";


@NgModule({
  declarations: [
    AppComponent,
    JsonEditor
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    JsonEditorComponent
  ],
  providers: [
    provideExperimentalZonelessChangeDetection(),
    {provide: ErrorHandler, useClass: ErrorService}
  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
