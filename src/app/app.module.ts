import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import {
  MatMenu,
  MatMenuItem,
  MatMenuTrigger
} from "@angular/material/menu";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { MatButton } from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatRadioButton, MatRadioGroup } from "@angular/material/radio";

import { AppComponent } from "./app.component";
import {
  UnitComponent,
  SectionComponent,
  PicPicBlueprintComponent,
  PicTextBlueprintComponent,
  ImageComponent,
  CheckboxComponent,
  TextComponent,
  AudioComponent,
  RadioGroupImagesComponent,
  MultiChoiceImagesComponent,
  StimulusSelectionComponent,
  InstructionsSelectionComponent,
  InteractionSelectionComponent,
  UnitMenuComponent,
  MediaPlayerComponent
} from "./components";
import { ErrorService } from "./services/error.service";
import { SafeResourceHTMLPipe } from "./pipes/safe-resource-html.pipe";
import { SafeResourceUrlPipe } from "./pipes/safe-resource-url.pipe";


@NgModule({
  declarations: [
    AppComponent,
    UnitComponent,
    SectionComponent,
    UnitComponent,
    TextComponent,
    ImageComponent,
    AudioComponent,
    CheckboxComponent,
    RadioGroupImagesComponent,
    MultiChoiceImagesComponent,
    StimulusSelectionComponent,
    InteractionSelectionComponent,
    InstructionsSelectionComponent,
    PicPicBlueprintComponent,
    PicTextBlueprintComponent,
    MediaPlayerComponent,
    UnitMenuComponent,
    AudioComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    MatMenu,
    MatIcon,
    MatMenuTrigger,
    MatIconButton,
    MatMenuItem,
    MatFormField,
    NgOptimizedImage,
    MatCheckbox,
    SafeResourceHTMLPipe,
    SafeResourceUrlPipe,
    MatRadioGroup,
    MatRadioButton,
    MatButton,
    MatLabel,
    ReactiveFormsModule
  ],
  providers: [
    provideExperimentalZonelessChangeDetection(),
    {provide: ErrorHandler, useClass: ErrorService}
  ],
  exports: [
    TextComponent,
    ImageComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
