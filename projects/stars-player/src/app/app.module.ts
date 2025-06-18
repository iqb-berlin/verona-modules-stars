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
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatRadioButton, MatRadioGroup } from "@angular/material/radio";
import { UnitNavNextComponent} from "./components/unit-nav-next.component";
import {SyllableCounterComponent} from "./components/elements/syllable-counter/syllable-counter.component";
import { RadioGroupTextComponent} from "./components/elements/radio-group-text/radio-group-text.component";
import { AppComponent } from "./app.component";
import {
  UnitComponent,
  SectionComponent,
  PicPicLayoutComponent,
  PicTextLayoutComponent,
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
  MediaPlayerComponent,
  ReducedKeyboardComponent,
  BinaryChoiceComponent
} from "./components";
import { ErrorService } from "./services/error.service";
import { UnitStateService } from "./services/unit-state.service";
import { StateVariableStateService } from "./services/state-variable-state.service";
import { ValidationService } from "./services/validation.service";
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
    PicPicLayoutComponent,
    PicTextLayoutComponent,
    MediaPlayerComponent,
    UnitMenuComponent,
    AudioComponent,
    ReducedKeyboardComponent,
    SyllableCounterComponent,
    RadioGroupTextComponent,
    BinaryChoiceComponent
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
    ReactiveFormsModule,
    UnitNavNextComponent
  ],
  providers: [
    provideExperimentalZonelessChangeDetection(),
    { provide: ErrorHandler, useClass: ErrorService },
    UnitStateService,
    StateVariableStateService,
    ValidationService
  ],
  exports: [
    TextComponent,
    ImageComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
