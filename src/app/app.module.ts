import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { SharedModule, APIService } from 'common/shared.module';

import { AppComponent } from "./app.component";
import {
  UnitComponent,
  SectionComponent,
  PicPicBlueprintComponent
} from "./components";
import { UnitMenuModule } from "../../modules/unit-menu/unit-menu.module";
import { KeyInputModule } from "../../modules/key-input/key-input.module";
import { MetaDataService } from "./services/meta-data.service";
import { ErrorService } from "./services/error.service";


@NgModule({
  declarations: [
    AppComponent,
    UnitComponent,
    SectionComponent,
    UnitComponent,
    PicPicBlueprintComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    SharedModule,
    KeyInputModule,
    UnitMenuModule
  ],
  providers: [
    provideExperimentalZonelessChangeDetection(),
    { provide: APIService, useExisting: MetaDataService },
    { provide: ErrorHandler, useClass: ErrorService }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
