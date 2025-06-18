# Full Codebase Extraction

## File: ./tsconfig.app.json

```json
/* To learn more about this file see: https://angular.io/config/tsconfig. */
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts",
    "src/polyfills.ts"
  ],
  "include": [
    "src/**/*.d.ts"
  ],
  "exclude": [
    "docs/**/*.html"
  ]
}
```

## File: ./src/styles.css

```css
/* You can add global styles to this file, and also import other style files */

@import url("https://fonts.googleapis.com/icon?family=Material+Icons");

@font-face {
  font-family: 'Quicksand';
  src: url('/assets/fonts/Quicksand-Light.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Quicksand';
  src: url('/assets/fonts/Quicksand-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Quicksand';
  src: url('/assets/fonts/Quicksand-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Quicksand';
  src: url('/assets/fonts/Quicksand-SemiBold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Quicksand';
  src: url('/assets/fonts/Quicksand-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

html { height: 100%; }
body { margin: 0; font-family: 'Quicksand', sans-serif; }


player-sub-form {
  display: block;
  padding-bottom: 1em;
}

.fx-row-space-between-center {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
.fx-row-space-between-start {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
}
.fx-row-space-around-center {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}
.fx-row-start-center {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.fx-row-start-start {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
}
.fx-row-center-center {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.fx-row-stretch-stretch {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: stretch;
  align-items: stretch;
}

.fx-column-center-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.fx-column-start-stretch {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}

mat-form-field {
  .mat-mdc-form-field-hint-wrapper,  .mat-mdc-form-field-error-wrapper {
    position: relative;
  }
  .mat-mdc-form-field-bottom-align::before {
    content: none;
  }
}


/* Add these to your existing styles.css */

/* Prevent scrolling on the entire app */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Ensure the app component fills the viewport */
stars-player {
  display: block;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* Unit component should fill available space */
stars-unit {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Section component should fill available space */
stars-section {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Ensure all layout components respect viewport bounds */
pic-pic-layout,
pic-text-layout {
  display: block;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* Fix for unit nav button positioning */
.unit-nav-next {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

/* Responsive font sizing */
@media (max-height: 600px) {
  body {
    font-size: 14px;
  }
}

@media (max-height: 480px) {
  body {
    font-size: 12px;
  }
}
```

## File: ./src/polyfills.ts

```ts
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run `npm install --save classlist.js`.

/**
 * Web Animations `@angular/platform-browser/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 */
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.

/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 * because those flags need to be set before `zone.js` being loaded, and webpack
 * will put import in the top of bundle, so user need to create a separate file
 * in this directory (for example: zone-flags.ts), and put the following flags
 * into that file, and then add the following code before importing zone.js.
 * import './zone-flags';
 *
 * The flags allowed in zone-flags.ts are listed here.
 *
 * The following flags will work for all browsers.
 *
 * (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
 * (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
 * (window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
 *
 *  in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
 *  with the following flag, it will bypass `zone.js` patch for IE/Edge
 *
 *  (window as any).__Zone_enable_cross_context_check = true;
 *
 */

/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
// import 'zone.js';  // Included with Angular CLI.


/***************************************************************************************************
 * APPLICATION IMPORTS
 */
```

## File: ./src/index.html

```html
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>Player</title>
  <script id="meta_data" type="application/ld+json">
    {
      "$schema": "https://raw.githubusercontent.com/verona-interfaces/metadata/master/verona-module-metadata.json",
      "name": [
        {
          "lang": "de",
          "value": "IQB-Player für Stars"
        }
      ],
      "description": [
        {
          "lang": "de",
          "value": "Todo"
        }
      ],
      "notSupportedFeatures": ["log-policy"],
      "maintainer": {
        "name": [
          {
            "lang": "de",
            "value": "IQB - Institut zur Qualitätsentwicklung im Bildungswesen"
          }
        ],
        "url": "https://www.iqb.hu-berlin.de",
        "email": "iqb-tbadev@hu-berlin.de"
      },
      "code": {
        "repositoryType": "git",
        "licenseType": "MIT",
        "licenseUrl": "https://opensource.org/licenses/MIT",
        "repositoryUrl": "https://github.com/iqb-berlin/verona-modules-stars"
      },
      "type": "player",
      "id": "iqb-player-stars",
      "version": "0.1.2-beta",
      "specVersion": "6.0",
      "metadataVersion": "2.0"
    }
  </script>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    .mdc-checkbox {left: 50% !important;}
    .mdc-radio {left: 50% !important;}
  </style>
</head>
<body>
<stars-player></stars-player>
</body>
</html>
```

## File: ./src/app/app.module.ts

```ts
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
```

## File: ./src/app/models/verona.ts

```ts
import { ResponseStatusType } from '@iqb/responses';

export type NavigationTarget = 'first' | 'last' | 'previous' | 'next' | 'end';
export type Progress = 'none' | 'some' | 'complete';
export type PagingMode = 'separate' | 'buttons' | 'concat-scroll' | 'concat-scroll-snap';
export enum ElementCodeStatusValue {
  UNSET = 0, NOT_REACHED = 1, DISPLAYED = 2, VALUE_CHANGED = 3, INVALID = 4,
  DERIVE_ERROR = 5, CODING_COMPLETE = 6, NO_CODING = 7, CODING_INCOMPLETE = 8,
  CODING_ERROR = 9, PARTLY_DISPLAYED = 10, DERIVE_PENDING = 11
}

export enum ResponseStatus {
  UNSET = 'UNSET',
  NOT_REACHED = 'NOT_REACHED',
  DISPLAYED = 'DISPLAYED',
  VALUE_CHANGED = 'VALUE_CHANGED',
  INVALID = 'INVALID',
  DERIVE_ERROR = 'DERIVE_ERROR',
  CODING_COMPLETE = 'CODING_COMPLETE',
  NO_CODING = 'NO_CODING',
  CODING_INCOMPLETE = 'CODING_INCOMPLETE',
  CODING_ERROR = 'CODING_ERROR',
  PARTLY_DISPLAYED = 'PARTLY_DISPLAYED',
  DERIVE_PENDING = 'DERIVE_PENDING'
}

export const UnitStateDataType = 'iqb-standard@1.1';

export interface StatusChangeElement {
  id: string;
  status: ResponseStatusType;
}

export interface VeronaResponse {
  id: string;
  alias?: string;
  value: string;
  status: ResponseStatusType;
  subform?: string;
  code?: number;
  score?: number;
  timeStamp?: number;
}

export interface PlayerConfig {
  printMode?: 'off' | 'on' | 'on-with-ids';
  unitNumber?: number;
  unitTitle?: number;
  unitId?: number;
  pagingMode?: PagingMode;
  logPolicy?: 'lean' | 'rich' | 'debug' | 'disabled';
  startPage?: string;
  enabledNavigationTargets?: NavigationTarget[];
  directDownloadUrl?: string;
}

export interface UnitState {
  dataParts?: Record<string, string>;
  presentationProgress?: Progress;
  responseProgress?: Progress;
  unitStateDataType?: string;
}

export interface PlayerState {
  validPages?: ValidPage[];
  currentPage?: string;
}

export interface ValidPage {
  id: string;
  label?: string;
}

export interface LogData {
  timeStamp: number,
  key: string,
  content?: string
}

export interface VopStartCommand {
  type: 'vopStartCommand';
  sessionId: string;
  unitDefinition?: string;
  unitDefinitionType?: string;
  unitState?: UnitState;
  playerConfig?: PlayerConfig;
}

export interface VopRuntimeErrorNotification {
  type: 'vopRuntimeErrorNotification';
  sessionId: string;
  code: string;
  message?: string;
}

export interface VopNavigationDeniedNotification {
  type: 'vopNavigationDeniedNotification';
  sessionId: string;
  reason?: Array<'presentationIncomplete' | 'responsesIncomplete'>
}

export interface VopPlayerConfigChangedNotification {
  type: 'vopPlayerConfigChangedNotification'
  sessionId: string;
  playerConfig: PlayerConfig;
}

export interface VopPageNavigationCommand {
  type: 'vopPageNavigationCommand';
  sessionId: string;
  target: string;
}

export interface VopReadyNotification {
  type: 'vopReadyNotification';
  metadata: VopMetaData;
}

export interface VopError {
  code: string;
  message?: string;
}

export interface VopMetaData {
  $schema: string,
  id: string;
  type: string;
  version: string;
  specVersion: string;
  metadataVersion: string
  name: {
    lang: string;
    value: string;
  }[];
  description: {
    lang: string;
    value: string;
  }[];
  maintainer: {
    name: Record<string, string>[];
    email: string;
    url: string;
  }
  code: {
    repositoryType: string;
    licenseType: string;
    licenseUrl: string;
    repositoryUrl: string;
  }
  notSupportedFeatures: string[];
}

export interface VopStateChangedNotification {
  type: 'vopStateChangedNotification';
  sessionId: string;
  timeStamp: number;
  unitState?: UnitState;
  playerState?: PlayerState;
  log?: LogData[];
}

export interface VopUnitNavigationRequestedNotification {
  type: 'vopUnitNavigationRequestedNotification';
  sessionId: string;
  target: 'first' | 'last' | 'previous' | 'next' | 'end';
}

export interface VopWindowFocusChangedNotification {
  type: 'vopWindowFocusChangedNotification';
  timeStamp: number;
  hasFocus: boolean;
}

export type VopMessage =
  VopStartCommand |
  VopPlayerConfigChangedNotification |
  VopRuntimeErrorNotification |
  VopNavigationDeniedNotification |
  VopPageNavigationCommand |
  VopReadyNotification |
  VopStateChangedNotification |
  VopWindowFocusChangedNotification |
  VopUnitNavigationRequestedNotification;
```

## File: ./src/app/models/state-variable.ts

```ts
import { VariableInfo } from '@iqb/responses';

export class StateVariable {
  id: string;
  alias: string;
  value: string;

  constructor(id: string, alias: string, value: string) {
    this.id = id;
    this.alias = alias;
    this.value = value;
  }

  getVariableInfo(): VariableInfo {
    return {
      id: this.id,
      alias: this.alias,
      type: 'no-value',
      format: '',
      multiple: false,
      nullable: false,
      values: [],
      valuePositionLabels: [],
      page: '',
      valuesComplete: false
    };
  }
}
```

## File: ./src/app/models/unit.ts

```ts
import { Section, SectionProperties } from './section';
import { UIElement } from './elements/ui-element';
import { StateVariable } from './state-variable';
import { environment } from '../environments/environment';
import { AbstractIDService } from '../interfaces';
import { InstantiationError } from '../errors';

export type UnitNavNextButtonMode = 'always' | 'onInteraction';

export class Unit implements UnitProperties {
  type = 'stars-unit-definition';
  version: string;
  stateVariables: StateVariable[] = [];
  sections: Section[] = [];
  navNextButtonMode?: UnitNavNextButtonMode;
  backgroundColor?: string;

  layoutId: string;
  variant?: string;
  instructions?: UIElement;
  interaction?: UIElement;
  stimulus?: UIElement;

  constructor(unit?: UnitProperties, idService?: AbstractIDService) {
    if (unit && isValid(unit)) {
      this.version = unit.version;
      this.backgroundColor = unit.backgroundColor;
      this.stateVariables = unit.stateVariables
        .map(variable => new StateVariable(variable.id, variable.alias ?? variable.id, variable.value));
      this.sections = unit.sections
        .map(section => new Section(section, idService));
      this.navNextButtonMode = unit.navNextButtonMode || 'always';
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at unit instantiation');
      }
      if (unit?.backgroundColor !== undefined) this.backgroundColor = unit.backgroundColor;
      if (unit?.stateVariables !== undefined) {
        this.stateVariables = unit.stateVariables
          .map(variable => new StateVariable(variable.id, variable.alias ?? variable.id, variable.value));
      }
      this.sections = unit?.sections
        .map(section => new Section(section, idService)) || [new Section(undefined, idService)];
      if (unit?.navNextButtonMode !== undefined) this.navNextButtonMode = unit.navNextButtonMode;
    }
  }

  getAllElements(elementType?: string): UIElement[] {
    return this.sections.map(section => section.getAllElements(elementType)).flat();
  }
}

function isValid(blueprint?: UnitProperties): boolean {
  if (!blueprint) return false;
  if (blueprint.stateVariables !== undefined &&
    blueprint.stateVariables.length > 0 &&
    blueprint.stateVariables[0].alias === undefined) {
    return false;
  }
  return blueprint.version !== undefined &&
    blueprint.stateVariables !== undefined &&
    blueprint.type !== undefined &&
    blueprint.sections !== undefined &&
    blueprint.navNextButtonMode !== undefined;
}

export interface UnitProperties {
  type: string;
  version: string;
  stateVariables: StateVariable[];
  sections: SectionProperties[];
  navNextButtonMode?: UnitNavNextButtonMode;
  backgroundColor?: string;
}
```

## File: ./src/app/models/instructions.ts

```ts
import {
  AbstractIDService,
  UIElementProperties,
  UIElementType
} from "../interfaces";
import { UIElement } from "./elements/ui-element";


export class InstructionsElement extends UIElement {
  type: UIElementType = "instructions";

  constructor(element?: Partial<UIElementProperties>, idService?: AbstractIDService) {
    super({ type: 'instructions', ...element }, idService);
  }
}
```

## File: ./src/app/models/elements/binary-choice.ts

```ts
import {
  AbstractIDService,
  InputElementProperties,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";

export class BinaryChoiceElement extends InputElement {
  type: UIElementType = 'binary-choice';

  static title: string = 'Binärauswahl';
  static icon: string = 'check_box';

  constructor(element?: Partial<BinaryChoiceProperties>, idService?: AbstractIDService) {
    super({ type: 'binary-choice', ...element }, idService);
  }
}

export interface BinaryChoiceProperties extends InputElementProperties {}

function isBinaryChoiceProperties(blueprint?: Partial<BinaryChoiceProperties>)
  : blueprint is BinaryChoiceProperties {
  return !!blueprint;
}
```

## File: ./src/app/models/elements/syllable-counter.ts

```ts
import {
  AbstractIDService,
  InputElementProperties,
  TextImageLabel,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";

export type SyllableCounterLayout = 'vertical' | 'row';

export class SyllableCounterElement extends InputElement {
  type: UIElementType = 'syllable-counter';
  maxSyllables: number = 0;
  imgSrc: string = 'assets/images/hands/clapping-hand.png';
  layout: SyllableCounterLayout = 'vertical'; // New layout property
  options: TextImageLabel[] = [];

  static title: string = 'Silbenzähler';
  static icon: string = 'pan_tool';

  constructor(element?: Partial<SyllableCounterProperties>, idService?: AbstractIDService) {
    super({ type: 'syllable-counter', ...element }, idService);

    if (isSyllableCounterProperties(element)) {
      this.maxSyllables = element.maxSyllables;
      this.imgSrc = element.imgSrc || this.imgSrc;
      this.layout = element.layout || 'vertical';
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at SyllableCounterElement instantiation', element);
      }
      if (element?.maxSyllables !== undefined) this.maxSyllables = element.maxSyllables;
      if (element?.imgSrc !== undefined) this.imgSrc = element.imgSrc;
      if (element?.layout !== undefined) this.layout = element.layout;
    }

    // Generate options based on layout and maxSyllables
    this.generateSyllableOptions();
  }

  private generateSyllableOptions(): void {
    this.options = [];

    if (this.layout === 'vertical') {
      // Vertical layout: each option shows multiple hands (1, 2, 3, 4 hands)
      for (let i = 1; i <= this.maxSyllables; i++) {
        const option: TextImageLabel = {
          id: `syllable_${i}`,
          text: `${i} Silbe${i > 1 ? 'n' : ''}`,
          imgSrc: this.imgSrc,
          imgFileName: this.isBase64Image(this.imgSrc) ? `hand_${i}.png` : 'clapping-hand.png',
          altText: `${i} ${i === 1 ? 'Hand klatscht' : 'Hände klatschen'} - ${i} Silbe${i > 1 ? 'n' : ''}`
        };
        this.options.push(option);
      }
    } else {
      // Row layout: each option shows one hand, user selects multiple
      for (let i = 1; i <= this.maxSyllables; i++) {
        const option: TextImageLabel = {
          id: `hand_${i}`,
          text: `Hand ${i}`,
          imgSrc: this.imgSrc,
          imgFileName: this.isBase64Image(this.imgSrc) ? `single_hand_${i}.png` : 'clapping-hand.png',
          altText: `Hand ${i} - klicken zum Auswählen`
        };
        this.options.push(option);
      }
    }
  }

  private isBase64Image(src: string): boolean {
    return src.startsWith('data:image/');
  }

  updateMaxSyllables(newMax: number): void {
    this.maxSyllables = Math.max(1, Math.min(newMax, 5));
    this.generateSyllableOptions();
  }

  updateHandImage(newImageSrc: string): void {
    this.imgSrc = newImageSrc;
    this.generateSyllableOptions();
  }

  updateLayout(newLayout: SyllableCounterLayout): void {
    this.layout = newLayout;
    this.generateSyllableOptions();
  }

  // Helper method to convert multi-choice binary string to syllable count
  static binaryStringToSyllableCount(binaryString: string): number {
    if (!binaryString) return 0;
    return binaryString.split('').filter(bit => bit === '1').length;
  }

  // Helper method to convert syllable count to binary string for multi-choice
  static syllableCountToBinaryString(count: number, maxSyllables: number): string {
    if (count <= 0) return '0'.repeat(maxSyllables);
    if (count > maxSyllables) count = maxSyllables;

    // Create binary string: first 'count' positions are '1', rest are '0'
    const selected = '1'.repeat(count);
    const unselected = '0'.repeat(maxSyllables - count);
    return selected + unselected;
  }
}

export interface SyllableCounterProperties extends InputElementProperties {
  maxSyllables: number;
  imgSrc?: string;
  layout?: SyllableCounterLayout; // New layout property
}

function isSyllableCounterProperties(blueprint?: Partial<SyllableCounterProperties>)
  : blueprint is SyllableCounterProperties {
  if (!blueprint) return false;
  return blueprint.maxSyllables !== undefined;
}
```

## File: ./src/app/models/elements/text-input.ts

```ts
// import {InputElement} from "./input-element";
// import {
//   AbstractIDService,
//   InputAssistancePreset,
//   KeyInputElementProperties,
//   TextInputElementProperties
// } from "../../interfaces";
// import {environment} from "../../environments/environment";
//
// export abstract class TextInputElement extends InputElement implements TextInputElementProperties {
//
//   protected constructor(element: { type: string } & Partial<TextInputElementProperties>, idService?: AbstractIDService) {
//     super(element, idService);
//     if (isTextInputElementProperties(element)) {
//       this.inputAssistancePreset = element.inputAssistancePreset;
//       this.inputAssistanceCustomKeys = element.inputAssistanceCustomKeys;
//       this.inputAssistancePosition = element.inputAssistancePosition;
//       this.inputAssistanceFloatingStartPosition = element.inputAssistanceFloatingStartPosition;
//       this.restrictedToInputAssistanceChars = element.restrictedToInputAssistanceChars;
//       this.hasArrowKeys = element.hasArrowKeys;
//       this.hasBackspaceKey = element.hasBackspaceKey;
//       this.showSoftwareKeyboard = element.showSoftwareKeyboard;
//       this.hideNativeKeyboard = element.hideNativeKeyboard;
//       this.addInputAssistanceToKeyboard = element.addInputAssistanceToKeyboard;
//     } else {
//       if (environment.strictInstantiation) {
//         throw Error('Error at TextInputElement instantiation');
//       }
//       if (element?.inputAssistancePreset) this.inputAssistancePreset = element.inputAssistancePreset;
//       if (element?.inputAssistanceCustomKeys) this.inputAssistanceCustomKeys = element.inputAssistanceCustomKeys;
//       if (element?.inputAssistancePosition) this.inputAssistancePosition = element.inputAssistancePosition;
//       if (element?.inputAssistanceFloatingStartPosition)
//         this.inputAssistanceFloatingStartPosition = element.inputAssistanceFloatingStartPosition;
//       if (element?.restrictedToInputAssistanceChars)
//         this.restrictedToInputAssistanceChars = element.restrictedToInputAssistanceChars;
//       if (element?.hasArrowKeys) this.hasArrowKeys = element.hasArrowKeys;
//       if (element?.hasBackspaceKey) this.hasBackspaceKey = element.hasBackspaceKey;
//       if (element?.showSoftwareKeyboard) this.showSoftwareKeyboard = element.showSoftwareKeyboard;
//       if (element?.addInputAssistanceToKeyboard)
//         this.addInputAssistanceToKeyboard = element.addInputAssistanceToKeyboard;
//       if (element?.hideNativeKeyboard) this.hideNativeKeyboard = element.hideNativeKeyboard;
//     }
//   }
// }
//
// function isValidKeyInputProperties(blueprint: Partial<KeyInputElementProperties>): boolean {
//   return blueprint.inputAssistancePreset !== undefined &&
//     blueprint.inputAssistancePosition !== undefined &&
//     blueprint.inputAssistanceFloatingStartPosition !== undefined &&
//     blueprint.showSoftwareKeyboard !== undefined &&
//     blueprint.addInputAssistanceToKeyboard !== undefined &&
//     blueprint.hideNativeKeyboard !== undefined &&
//     blueprint.hasArrowKeys !== undefined;
// }
//
// function isTextInputElementProperties(properties: Partial<TextInputElementProperties>)
//   : properties is TextInputElementProperties {
//   return properties.restrictedToInputAssistanceChars !== undefined &&
//     properties.inputAssistanceCustomKeys !== undefined &&
//     properties.hasBackspaceKey !== undefined &&
//     isValidKeyInputProperties(properties);
// }
```

## File: ./src/app/models/elements/checkbox.ts

```ts
import {
  AbstractIDService,
  InputElementProperties,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";


export class CheckboxElement extends InputElement implements CheckboxProperties {
  type: UIElementType = 'checkbox';
  label: string = undefined;
  imgSrc: string | null = null;
  value: boolean = false;
  altText: string = undefined;

  static title: string = 'Kontrollkästchen';
  static icon: string = 'check_box';

  constructor(element?: Partial<CheckboxProperties>, idService?: AbstractIDService) {
    super({ type: 'checkbox', ...element }, idService);
    if (isCheckboxProperties(element)) {
      this.label = element.label;
      this.imgSrc = element.imgSrc;
      this.value = element.value;
      this.altText = element.altText;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at Checkbox instantiation', element);
      }
      if (element?.label !== undefined) this.label = element.label;
      if (element?.imgSrc !== undefined) this.imgSrc = element.imgSrc;
      if (element?.value !== undefined) this.value = element.value;
      if (element?.altText !== undefined) this.altText = element.altText;
    }
  }
}

export interface CheckboxProperties extends InputElementProperties {
  label: string;
  imgSrc: string | null;
  altText: string;
  value: boolean;
}

function isCheckboxProperties(properties?: Partial<CheckboxProperties>): properties is CheckboxProperties {
  if (!properties) return false;
  return properties.label !== undefined &&
    properties.imgSrc !== undefined &&
    properties.altText !== undefined;
}
```

## File: ./src/app/models/elements/radio-group-text.ts

```ts
import {
  AbstractIDService,
  InputElementProperties,
  TextLabel,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";

export class RadioGroupTextElement extends InputElement {
  type: UIElementType = 'radio-group-text';
  label: string = '';
  options: TextLabel[] = [];

  static title: string = 'Optionsfelder (Text)';
  static icon: string = 'radio_button_checked';

  constructor(element?: Partial<RadioGroupTextProperties>, idService?: AbstractIDService) {
    super({ type: 'radio-group-text', ...element }, idService);
    if (isRadioGroupTextProperties(element)) {
      this.label = element.label;
      this.options = [...element.options];
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at RadioGroupTextElement instantiation', element);
      }
      if (element?.label !== undefined) this.label = element.label;
      if (element?.options) this.options = [...element.options];
    }
  }
}

export interface RadioGroupTextProperties extends InputElementProperties {
  label: string;
  options: TextLabel[];
}

function isRadioGroupTextProperties(blueprint?: Partial<RadioGroupTextProperties>)
  : blueprint is RadioGroupTextProperties {
  if (!blueprint) return false;
  return blueprint.label !== undefined &&
    blueprint.options !== undefined;
}
```

## File: ./src/app/models/elements/input-element.ts

```ts
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";
import { UIElement } from "./ui-element";
import {
  AbstractIDService,
  InputElementProperties,
  InputElementValue
} from "../../interfaces";


export abstract class InputElement extends UIElement implements InputElementProperties {
  label?: string = '';
  value: InputElementValue = null;
  required: boolean = false;
  requiredWarnMessage: string = 'Eingabe erforderlich';
  readOnly: boolean = false;

  protected constructor(element: { type: string } & Partial<InputElementProperties>, idService?: AbstractIDService) {
    super(element, idService);
    if (isInputElementProperties(element)) {
      if (element.label !== undefined) this.label = element.label;
      this.value = element.value;
      this.required = element.required;
      this.requiredWarnMessage = element.requiredWarnMessage;
      this.readOnly = element.readOnly;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at InputElement instantiation', element);
      }
      if (element?.label !== undefined) this.label = element.label;
      if (element?.value !== undefined) this.value = element.value;
      if (element?.required !== undefined) this.required = element.required;
      if (element?.requiredWarnMessage !== undefined) this.requiredWarnMessage = element.requiredWarnMessage;
      if (element?.readOnly !== undefined) this.readOnly = element.readOnly;
    }
  }
  static stripHTML(htmlString: string): string {
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(htmlString, 'text/html');
    return htmlDocument.documentElement.textContent || '';
  }
}

export function isInputElement(el: UIElement): el is InputElement {
  return el.value !== undefined &&
    el.required !== undefined &&
    el.requiredWarnMessage !== undefined &&
    el.readOnly !== undefined;
}

function isInputElementProperties(properties: Partial<InputElementProperties>): properties is InputElementProperties {
  if (!properties) return false;
  return properties?.value !== undefined &&
    properties?.required !== undefined &&
    properties?.requiredWarnMessage !== undefined &&
    properties?.readOnly !== undefined;
}
```

## File: ./src/app/models/elements/ui-element.ts

```ts
import {
  AbstractIDService,
  UIElementType
} from '../../interfaces';
import { VeronaResponse } from '../verona';
import { UIElementProperties } from "../../interfaces";
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";

export abstract class UIElement implements UIElementProperties {
  [index: string]: unknown;
  id: string;
  alias: string;
  type: UIElementType;
  idService?: AbstractIDService;
  hidden: boolean = false;
  position?: string;
  helpText = '';

  constructor(element: { type: UIElementType } & Partial<UIElementProperties>, idService?: AbstractIDService) {
    this.idService = idService;
    if (isUIElementProperties(element)) {
      this.id = element.id;
      this.alias = element.alias || element.id;
      this.position = element.position || undefined;
      if (idService) {
        // Only register after the child constructior has run. ID-registration needs the type and possibly values.
        setTimeout(() => this.registerIDs());
      }
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at UIElement instantiation', element);
      }
      this.id = element.id ??
        idService?.getAndRegisterNewID(element.type) ??
        (() => { throw new Error(`No ID or IDService given: ${this.type}`); })();
      this.alias = element.alias ??
        idService?.getAndRegisterNewID(element.type, true) ??
        (() => { throw new Error(`No Alias or IDService given: ${this.type}`); })();
    }
  }

  registerIDs(): void {
    if (!this.idService) throw new Error(`IDService not available: ${this.type} ${this.id}`);
    this.idService.register(this.id, this.type, true, false);
    this.idService.register(this.alias, this.type, false, true);
  }

  unregisterIDs(): void {
    if (!this.idService) throw new Error(`IDService not available: ${this.type} ${this.id}`);
    this.idService.unregister(this.id, this.type, true, false);
    this.idService.unregister(this.alias, this.type, false, true);
  }

  hide(): void {
    this.hidden = true;
  }

  getValues(): VeronaResponse[] {
    return [{
      id: this.id,
      alias: this.alias,
      value: null,
      status: "UNSET",
      subform: undefined
    }];
  }
}

function isUIElementProperties(blueprint: Partial<UIElementProperties>): blueprint is UIElementProperties {
  return blueprint.id !== undefined &&
    blueprint.position !== undefined;
}
```

## File: ./src/app/models/elements/multi-choice-images.ts

```ts
import {
  AbstractIDService,
  InputElementProperties,
  TextImageLabel,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";

export class MultiChoiceImagesElement extends InputElement {
  type: UIElementType = 'multi-choice-images';
  label: string = '';
  options: TextImageLabel[] = [];

  static title: string = 'MultipleChoice';
  static icon: string = 'radio_button_checked';

  constructor(element?: Partial<MultiChoiceImagesProperties>, idService?: AbstractIDService) {
    super({ type: 'radio', ...element }, idService);
    if (isMultiChoiceImagesProperties(element)) {
      this.label = element.label;
      this.options = [...element.options];
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at RadioButtonGroupElement instantiation', element);
      }
      if (element?.label !== undefined) this.label = element.label;
      if (element?.options) this.options = [...element.options];
    }
  }
}

export interface MultiChoiceImagesProperties extends InputElementProperties {
  label: string;
  options: TextImageLabel[];
}

function isMultiChoiceImagesProperties(blueprint?: Partial<MultiChoiceImagesProperties>)
  : blueprint is MultiChoiceImagesProperties {
  if (!blueprint) return false;
  return blueprint.label !== undefined &&
    blueprint.options !== undefined;
}
```

## File: ./src/app/models/elements/audio.ts

```ts
import { UIElement } from "./ui-element";
import {
  AbstractIDService,
  UIElementProperties,
  UIElementType
} from "../../interfaces";
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";
import {ImageElement} from "./image";


export class AudioElement extends UIElement implements AudioProperties {
  type: UIElementType = 'audio';
  audioSrc: string | null = null;
  fileName: string = '';
  text?: string = '';
  image?: ImageElement | null = null;

  static title: string = 'Audio';
  static icon: string = 'volume_up';

  constructor(element?: Partial<AudioProperties>, idService?: AbstractIDService) {
    super({ type: 'audio', ...element }, idService);
    if (isAudioProperties(element)) {
      this.audioSrc = element.audioSrc;
      this.fileName = element.fileName;
      this.text = element.text;
      this.image =  element.image;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at Audio instantiation', element);
      }
      if (element?.audioSrc !== undefined) this.src = element.audioSrc;
      if (element?.fileName !== undefined) this.fileName = element.fileName;
      if (element?.text !== undefined) this.text = element.text;
    }
  }
}

export interface AudioProperties extends UIElementProperties {
  audioSrc: string | null;
  fileName: string;
  text?: string;
  image?: ImageElement;
}

function isAudioProperties(blueprint?: Partial<AudioProperties>): blueprint is AudioProperties {
  if (!blueprint) return false;
  return blueprint.audioSrc !== undefined &&
    blueprint.image !== undefined;
}
```

## File: ./src/app/models/elements/text-field.ts

```ts
// import { Type } from '@angular/core';
// import {TextInputElement} from "../index";
// import {AbstractIDService, TextInputElementProperties, UIElementType} from "../../interfaces";
// import {environment} from "../../environments/environment";
// import {InstantiationError} from "../../errors";
// import {VariableInfo} from "@iqb/responses";
// import {ElementComponent} from "../../components/elements/element.component";
// import {TextFieldComponent} from "../../components/elements/text-field.component";
//
//
// export class TextFieldElement extends TextInputElement implements TextFieldProperties {
//   type: UIElementType = 'text-field';
//   minLength: number | null = null;
//   minLengthWarnMessage: string = 'Eingabe zu kurz';
//   maxLength: number | null = null;
//   maxLengthWarnMessage: string = 'Eingabe zu lang';
//   isLimitedToMaxLength: boolean = false;
//   pattern: string | null = null;
//   patternWarnMessage: string = 'Eingabe entspricht nicht der Vorgabe';
//   hasKeyboardIcon: boolean = false;
//   clearable: boolean = false;
//
//   static title: string = 'Eingabefeld';
//   static icon: string = 'edit';
//
//   constructor(element?: Partial<TextFieldProperties>, idService?: AbstractIDService) {
//     super({ type: 'text-field', ...element }, idService);
//     if (isTextFieldProperties(element)) {
//       this.minLength = element.minLength;
//       this.minLengthWarnMessage = element.minLengthWarnMessage;
//       this.maxLength = element.maxLength;
//       this.maxLengthWarnMessage = element.maxLengthWarnMessage;
//       this.isLimitedToMaxLength = element.isLimitedToMaxLength;
//       this.pattern = element.pattern;
//       this.patternWarnMessage = element.patternWarnMessage;
//       this.clearable = element.clearable;
//       this.hasKeyboardIcon = element.hasKeyboardIcon;
//     } else {
//       if (environment.strictInstantiation) {
//         throw new InstantiationError('Error at TextField instantiation', element);
//       }
//       if (element?.minLength) this.minLength = element.minLength;
//       if (element?.minLengthWarnMessage) this.minLengthWarnMessage = element.minLengthWarnMessage;
//       if (element?.maxLength) this.maxLength = element.maxLength;
//       if (element?.maxLengthWarnMessage) this.maxLengthWarnMessage = element.maxLengthWarnMessage;
//       if (element?.isLimitedToMaxLength) this.isLimitedToMaxLength = element.isLimitedToMaxLength;
//       if (element?.pattern) this.pattern = element.pattern;
//       if (element?.patternWarnMessage) this.patternWarnMessage = element.patternWarnMessage;
//       if (element?.clearable) this.clearable = element.clearable;
//       if (element?.hasKeyboardIcon) this.hasKeyboardIcon = element.hasKeyboardIcon;
//     }
//   }
//
//   getVariableInfos(): VariableInfo[] {
//     return [{
//       id: this.id,
//       alias: this.alias,
//       type: 'string',
//       format: '',
//       multiple: false,
//       nullable: false,
//       values: [],
//       valuePositionLabels: [],
//       page: '',
//       valuesComplete: false
//     }];
//   }
//
// }
//
// export interface TextFieldProperties extends TextInputElementProperties {
//   appearance?: 'fill' | 'outline';
//   minLength: number | null;
//   minLengthWarnMessage: string;
//   maxLength: number | null;
//   maxLengthWarnMessage: string;
//   isLimitedToMaxLength: boolean;
//   pattern: string | null;
//   patternWarnMessage: string;
//   hasKeyboardIcon: boolean;
//   clearable: boolean;
// }
//
// function isTextFieldProperties(properties?: Partial<TextFieldProperties>): properties is TextFieldProperties {
//   if (!properties) return false;
//   return properties.minLength !== undefined &&
//     properties.minLengthWarnMessage !== undefined &&
//     properties.maxLength !== undefined &&
//     properties.maxLengthWarnMessage !== undefined &&
//     properties.isLimitedToMaxLength !== undefined &&
//     properties.pattern !== undefined &&
//     properties.patternWarnMessage !== undefined &&
//     properties.hasKeyboardIcon !== undefined &&
//     properties.clearable !== undefined;
// }
```

## File: ./src/app/models/elements/text.ts

```ts
import { UIElementType } from '../../interfaces';
import { UIElement } from './ui-element';
import { VeronaResponse } from '../verona';
import {
  AbstractIDService,
  UIElementProperties
} from "../../interfaces";
import { InstantiationError } from "../../errors";
import { environment } from "../../environments/environment";

export class TextElement extends UIElement implements TextProperties {
  type: UIElementType = "text";
  text: string = '';

  constructor(element?: Partial<TextProperties>, idService?: AbstractIDService) {
    super({ type: 'text', ...element }, idService);
    if (isTextProperties(element)) {
      this.text = element.text;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at Text instantiation', element);
      }
      if (element?.text !== undefined) this.text = element.text;
    }
  }

  getValues(): VeronaResponse[] {
    return [];
  }

  check(values: VeronaResponse[]): void { }
}

export interface TextProperties extends UIElementProperties {
  text: string;
}

function isTextProperties(properties?: Partial<TextProperties>): properties is TextProperties {
  if (!properties) return false;
  return properties.text !== undefined;
}
```

## File: ./src/app/models/elements/image.ts

```ts
import { UIElement } from "./ui-element";
import {
  AbstractIDService,
  UIElementProperties,
  UIElementType
} from "../../interfaces";
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";

export class ImageElement extends UIElement implements ImageProperties {
  type: UIElementType = 'image';
  imgSrc: string | null = null;
  altText: string = 'Bild nicht gefunden';
  fileName?: string = '';

  static title: string = 'Bild';
  static icon: string = 'image';

  constructor(element?: Partial<ImageProperties>, idService?: AbstractIDService) {
    super({ type: 'image', ...element }, idService);
    if (isImageProperties(element)) {
      this.imgSrc = element.imgSrc;
      this.altText = element.altText;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at Image instantiation', element);
      }
      if (element?.imgSrc !== undefined) this.imgSrc = element.imgSrc;
      if (element?.altText !== undefined) this.altText = element.altText;
    }
  }
}

export interface ImageProperties extends UIElementProperties {
  imgSrc: string | null;
  altText: string;
  fileName?: string;
}

function isImageProperties(blueprint?: Partial<ImageProperties>): blueprint is ImageProperties {
  if (!blueprint) return false;
  return blueprint.imgSrc !== undefined &&
    blueprint.altText !== undefined &&
    blueprint.fileName !== undefined;
}
```

## File: ./src/app/models/elements/radio-group-images.ts

```ts
import {
  AbstractIDService,
  InputElementProperties,
  TextImageLabel,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";

export class RadioGroupImagesElement extends InputElement {
  type: UIElementType = 'radio-group-images';
  label: string = '';
  options: TextImageLabel[] = [];

  static title: string = 'Optionsfelder';
  static icon: string = 'radio_button_checked';

  constructor(element?: Partial<RadioGroupImagesProperties>, idService?: AbstractIDService) {
    super({ type: 'radio-group-images', ...element }, idService);
    if (isRadioGroupImagesProperties(element)) {
      this.label = element.label;
      this.options = [...element.options];
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at RadioGroupImagesElement instantiation', element);
      }
      if (element?.label !== undefined) this.label = element.label;
      if (element?.options) this.options = [...element.options];
    }
  }
}

export interface RadioGroupImagesProperties extends InputElementProperties {
  label: string;
  options: TextImageLabel[];
}

function isRadioGroupImagesProperties(blueprint?: Partial<RadioGroupImagesProperties>)
  : blueprint is RadioGroupImagesProperties {
  if (!blueprint) return false;
  return blueprint.label !== undefined &&
    blueprint.options !== undefined;
}
```

## File: ./src/app/models/elements/radio-button-group.ts

```ts
// import { Type } from '@angular/core';
// import { InputElement, UIElement } from 'common/models/elements/element';
// import { ElementComponent } from 'common/directives/element-component.directive';
// import { RadioButtonGroupComponent } from 'common/components/input-elements/radio-button-group.component';
// import { VariableInfo, VariableValue } from '@iqb/responses';
// import {
//   BasicStyles, PositionProperties, PropertyGroupGenerators, PropertyGroupValidators
// } from 'common/models/elements/property-group-interfaces';
// import { environment } from 'common/environment';
// import {
//   AbstractIDService, InputElementProperties, OptionElement, TextLabel, UIElementType
// } from 'common/interfaces';
// import { InstantiationError } from 'common/errors';
//
// export class RadioButtonGroupElement extends InputElement implements OptionElement, RadioButtonGroupProperties {
//   type: UIElementType = 'radio';
//   label: string = 'Beschriftung';
//   options: TextLabel[] = [];
//   alignment: 'column' | 'row' = 'column';
//   strikeOtherOptions: boolean = false;
//   position: PositionProperties;
//   styling: BasicStyles & {
//     lineHeight: number;
//   };
//
//   static title: string = 'Optionsfelder';
//   static icon: string = 'radio_button_checked';
//
//   constructor(element?: Partial<RadioButtonGroupProperties>, idService?: AbstractIDService) {
//     super({ type: 'radio', ...element }, idService);
//     if (isRadioButtonGroupProperties(element)) {
//       this.label = element.label;
//       this.options = [...element.options];
//       this.alignment = element.alignment;
//       this.strikeOtherOptions = element.strikeOtherOptions;
//       this.position = { ...element.position };
//       this.styling = { ...element.styling };
//     } else {
//       if (environment.strictInstantiation) {
//         throw new InstantiationError('Error at RadioButtonGroupElement instantiation', element);
//       // }
//       if (element?.label !== undefined) this.label = element.label;
//       if (element?.options) this.options = [...element.options];
//       if (element?.alignment) this.alignment = element.alignment;
//       if (element?.strikeOtherOptions) this.strikeOtherOptions = element.strikeOtherOptions;
//       this.dimensions = PropertyGroupGenerators.generateDimensionProps({
//         height: 100,
//         ...element?.dimensions
//       });
//       this.position = PropertyGroupGenerators.generatePositionProps(element?.position);
//       this.styling = {
//         ...PropertyGroupGenerators.generateBasicStyleProps(element?.styling),
//         lineHeight: element?.styling?.lineHeight || 135
//       };
//     }
//   }
//
//   getVariableInfos(): VariableInfo[] {
//     return [{
//       id: this.id,
//       alias: this.alias,
//       type: 'integer',
//       format: '',
//       multiple: false,
//       nullable: false,
//       values: this.getVariableInfoValues(),
//       valuePositionLabels: [],
//       page: '',
//       valuesComplete: true
//     }];
//   }
//
//   private getVariableInfoValues(): VariableValue[] {
//     return this.options
//       .map((option, index) => ({
//         value: (index + 1).toString(),
//         label: InputElement.stripHTML(option.text)
//       }));
//   }
//
//   getElementComponent(): Type<ElementComponent> {
//     return RadioButtonGroupComponent;
//   }
//
//   getNewOptionLabel(optionText: string): TextLabel {
//     return UIElement.createOptionLabel(optionText) as TextLabel;
//   }
// }
//
// export interface RadioButtonGroupProperties extends InputElementProperties {
//   label: string;
//   options: TextLabel[];
//   alignment: 'column' | 'row';
//   strikeOtherOptions: boolean;
//   position: PositionProperties;
//   styling: BasicStyles & {
//     lineHeight: number;
//   };
// }
//
// function isRadioButtonGroupProperties(blueprint?: Partial<RadioButtonGroupProperties>)
//   : blueprint is RadioButtonGroupProperties {
//   if (!blueprint) return false;
//   return blueprint.label !== undefined &&
//     blueprint.options !== undefined &&
//     blueprint.alignment !== undefined &&
//     blueprint.strikeOtherOptions !== undefined &&
//     PropertyGroupValidators.isValidPosition(blueprint.position) &&
//     PropertyGroupValidators.isValidBasicStyles(blueprint.styling) &&
//     blueprint.styling?.lineHeight !== undefined;
// }
```

## File: ./src/app/models/elements/reduced-keyboard.ts

```ts
import {
  AbstractIDService,
  InputElementProperties,
  UIElementType
} from "../../interfaces";
import { InputElement } from "./input-element";
import { environment } from "../../environments/environment";
import { InstantiationError } from "../../errors";

/**
 * Interface representing a keyboard button option (letter or grapheme)
 */
export interface KeyboardButton {
  id: string;
  text: string; // Can be single character or grapheme (multiple characters) - uppercase
  value?: string; // Optional different value
  lowerCaseText?: string; // Lower case version of text (for case switching)
}

export class ReducedKeyboardElement extends InputElement {
  type: UIElementType = 'reduced-keyboard';
  label: string = '';
  buttons: KeyboardButton[] = [];
  showBackspace: boolean = true;
  showSubmit: boolean = true;
  maxLength: number | null = null; // Optional character limit
  submitButtonText: string = '';
  backspaceButtonText: string = 'Löschen';
  placeholder: string = '';

  static title: string = 'Reduzierte Tastatur';
  static icon: string = 'keyboard';

  constructor(element?: Partial<ReducedKeyboardProperties>, idService?: AbstractIDService) {
    super({ type: 'reduced-keyboard', ...element }, idService);
    if (isReducedKeyboardProperties(element)) {
      this.label = element.label;
      this.buttons = [...element.buttons];
      this.showBackspace = element.showBackspace;
      this.showSubmit = element.showSubmit;
      this.maxLength = element.maxLength;
      this.submitButtonText = element.submitButtonText;
      this.backspaceButtonText = element.backspaceButtonText;
      this.placeholder = element.placeholder || '';

      // Generate lowercase versions for buttons that don't have them explicitly defined
      this.buttons.forEach(button => {
        if (!button.lowerCaseText && typeof button.text === 'string') {
          button.lowerCaseText = button.text.toLowerCase();
        }
      });
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at ReducedKeyboardElement instantiation', element);
      }
      if (element?.label !== undefined) this.label = element.label;
      if (element?.buttons) {
        this.buttons = [...element.buttons];
        // Generate lowercase versions for buttons that don't have them explicitly defined
        this.buttons.forEach(button => {
          if (!button.lowerCaseText && typeof button.text === 'string') {
            button.lowerCaseText = button.text.toLowerCase();
          }
        });
      }
      if (element?.showBackspace !== undefined) this.showBackspace = element.showBackspace;
      if (element?.showSubmit !== undefined) this.showSubmit = element.showSubmit;
      if (element?.maxLength !== undefined) this.maxLength = element.maxLength;
      if (element?.submitButtonText !== undefined) this.submitButtonText = element.submitButtonText;
      if (element?.backspaceButtonText !== undefined) this.backspaceButtonText = element.backspaceButtonText;
      if (element?.placeholder !== undefined) this.placeholder = element.placeholder;
    }
  }

  // Get the current text to display for a button based on text content
  getButtonText(button: KeyboardButton, textIsEmpty: boolean): string {
    if (textIsEmpty) {
      return button.text; // Uppercase when empty
    } else {
      return button.lowerCaseText || button.text.toLowerCase(); // Lowercase when text exists
    }
  }

  // Get the current value for a button based on text content
  getButtonValue(button: KeyboardButton, textIsEmpty: boolean): string {
    if (button.value) {
      // If a specific value is set, use it regardless of case
      return button.value;
    } else if (textIsEmpty) {
      return button.text; // Uppercase when empty
    } else {
      return button.lowerCaseText || button.text.toLowerCase(); // Lowercase when text exists
    }
  }
}

export interface ReducedKeyboardProperties extends InputElementProperties {
  label: string;
  buttons: KeyboardButton[];
  showBackspace: boolean;
  showSubmit: boolean;
  maxLength: number | null;
  submitButtonText: string;
  backspaceButtonText: string;
  placeholder?: string;
}

function isReducedKeyboardProperties(blueprint?: Partial<ReducedKeyboardProperties>)
  : blueprint is ReducedKeyboardProperties {
  if (!blueprint) return false;
  return blueprint.label !== undefined &&
    blueprint.buttons !== undefined &&
    blueprint.showBackspace !== undefined &&
    blueprint.showSubmit !== undefined &&
    blueprint.maxLength !== undefined &&
    blueprint.submitButtonText !== undefined &&
    blueprint.backspaceButtonText !== undefined;
}
```

## File: ./src/app/models/interaction.ts

```ts
import {
  AbstractIDService,
  UIElementProperties,
  UIElementType
} from "../interfaces";
import { UIElement } from "./elements/ui-element";


export class InteractionElement extends UIElement {
  type: UIElementType = "interaction";

  constructor(element?: Partial<UIElementProperties>, idService?: AbstractIDService) {
    super({ type: 'interaction', ...element }, idService);
  }
}
```

## File: ./src/app/models/stimulus.ts

```ts
import {
  AbstractIDService,
  UIElementProperties,
  UIElementType
} from "../interfaces";
import { InstantiationError } from "../errors";
import { environment } from "../environments/environment";
import { UIElement } from "./elements/ui-element";


export class StimulusElement extends UIElement implements StimulusProperties {
  type: UIElementType = "stimulus";
  position: string = '';

  constructor(element?: Partial<StimulusProperties>, idService?: AbstractIDService) {
    super({ type: 'stimulus', ...element }, idService);
    if (isStimulusProperties(element)) {
      this.position = element.position;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at Text instantiation', element);
      }
      if (element?.position !== undefined) this.position = element.position;
    }
  }
}

export interface StimulusProperties extends UIElementProperties {
  position: string;
}

function isStimulusProperties(properties?: Partial<StimulusProperties>): properties is StimulusProperties {
  if (!properties) return false;
  return properties.position !== undefined;
}
```

## File: ./src/app/models/section.ts

```ts
import { UIElement } from './elements/ui-element';
import { ElementFactory } from './element.factory';
import { environment } from '../environments/environment';
import {
  AbstractIDService,
  Coder,
  UIElementProperties,
  UIElementValue
} from '../interfaces';
import { InstantiationError } from '../errors';


export class Section implements SectionProperties {
  [index: string]: unknown;
  layoutId: string;
  instructions?: UIElement;
  stimulus?: UIElement;
  interaction?: UIElement;
  variant?: string;
  coding?: Coder;

  idService?: AbstractIDService;

  constructor(section?: SectionProperties, idService?: AbstractIDService) {
    this.idService = idService;
    console.log(section);
    if (section) {
      this.layoutId = section.layoutId || "default";
      this.variant = section.variant || undefined;
      this.coding = section.coding || undefined;
      this.instructions = section.instructions ?
        ElementFactory.createElement(section.instructions, idService)
        : undefined;
      this.interaction = section.interaction ?
        ElementFactory.createElement(section.interaction, idService)
        : undefined;
      this.stimulus = section.stimulus ?
        ElementFactory.createElement(section.stimulus, idService)
        : undefined;
    } else {
      if (environment.strictInstantiation) {
        throw new InstantiationError('Error at Section instantiation');
      }
    }
    console.log(this.instructions);
  }

  setProperty(property: string, value: UIElementValue): void {
    this[property] = value;
  }

  getAllElements(elementType?: string): UIElement[] {
    let allElements: UIElement[] = [];
    if (elementType) {
      allElements = allElements.filter(element => element.type === elementType);
    }
    return allElements;
  }
}

export interface SectionProperties {
  instructions?: UIElementProperties;
  stimulus?: UIElementProperties;
  interaction?: UIElementProperties;
  layoutId: string;
  variant?: string;
  coding?: Coder;
}
```

## File: ./src/app/models/element.factory.ts

```ts
import { Type } from '@angular/core';

import {
  UIElement,
  ImageElement,
  TextElement,
  AudioElement,
  CheckboxElement,
  RadioGroupImagesElement,
  RadioGroupTextElement,
  MultiChoiceImagesElement,
  ReducedKeyboardElement,
  SyllableCounterElement,
  BinaryChoiceElement
} from './index';
import {
  AbstractIDService,
  UIElementProperties,
  UIElementType
} from "../interfaces";


export abstract class ElementFactory {
  static ELEMENT_CLASSES: Record<string, Type<UIElement>> = {
    "text": TextElement,
    "image": ImageElement,
    "checkbox": CheckboxElement,
    "radio-group-images": RadioGroupImagesElement,
    "multi-choice-images": MultiChoiceImagesElement,
    "radio-group-text": RadioGroupTextElement,
    "audio": AudioElement,
    "reduced-keyboard": ReducedKeyboardElement,
    "syllable-counter": SyllableCounterElement,
    "binary-choice": BinaryChoiceElement
  };

  static createElement(element: { type: UIElementType } & Partial<UIElementProperties>, idService?: AbstractIDService)
    : UIElement {
    return new ElementFactory.ELEMENT_CLASSES[element.type](element, idService);
  }
}
```

## File: ./src/app/models/index.ts

```ts
export { StimulusElement } from  './stimulus';
export { InteractionElement } from  './interaction';
export { InstructionsElement } from  './instructions';

export { UIElement } from './elements/ui-element';
export { TextElement } from './elements/text';
export { ImageElement } from './elements/image';
export { AudioElement } from './elements/audio';
export { CheckboxElement } from './elements/checkbox';
export { RadioGroupImagesElement } from './elements/radio-group-images';
export { MultiChoiceImagesElement } from './elements/multi-choice-images';
export { ReducedKeyboardElement } from './elements/reduced-keyboard';
export { SyllableCounterElement  } from './elements/syllable-counter'
export { RadioGroupTextElement } from './elements/radio-group-text';
export { BinaryChoiceElement } from './elements/binary-choice';
```

## File: ./src/app/models/aspect-error.ts

```ts
export class AspectError extends Error {
  code: string;
  name = 'AspectError';
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}
```

## File: ./src/app/app.component.html

```html
<stars-unit #unit
      (valueChange)="valueChanged.next($event)">
  @if (isStandalone) {
    <stars-unit-menu class="unit-definition-menu"></stars-unit-menu>
  }
</stars-unit>
```

## File: ./src/app/components/section/section.component.scss

```scss
.section-wrapper {
  display: flex;
}

.section-wrapper.row-align {
  flex-direction: row;
  align-items: baseline;
}

.section-wrapper.column-align {
  flex-direction: column;
}

.dynamic-section {
  display: grid;
  position: relative;
  z-index: 0;
  flex-grow: 1;
}

.static-section {
  position: relative;
}

.static-element {
  display: block;
  position: absolute;
}

.no-pointer-events {
  pointer-events: none;
}

.centered-horizontal {
  display: flex;
  justify-content: center;
}

.centered-vertical {
  display: flex;
  align-items: center;
}
```

## File: ./src/app/components/section/section.component.ts

```ts
import { Component, input, output, inject } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { Section } from "../../models/section";
import { ResponseStatus, VeronaResponse } from "../../models/verona";
import { JSONObject } from "../../interfaces";
import { UnitStateService } from "../../services/unit-state.service";

@Component({
  selector: 'stars-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  standalone: false
})
export class SectionComponent {
  section = input.required<Section>();
  form = new FormGroup({});
  valueChange = output<VeronaResponse>();

  private unitStateService = inject(UnitStateService);

  valueChanged(event: VeronaResponse) {

    if (this.section().coding) {
      const coding = this.section().coding;
      let code = 0;
      let score = 0;

      if (coding.fullCredit) {
        if (coding.fullCredit == event.value) {
          code = 1;
          score = 1;
        } else if (code === 0 && coding.partialCredit) {
          let partialCredits: JSONObject[];

          if (Array.isArray(coding.partialCredit)) {
            partialCredits = coding.partialCredit;
          } else if (typeof coding.partialCredit === 'object') {
            partialCredits = [coding.partialCredit as JSONObject];
          } else {
            partialCredits = [];
          }

          const creditMatch = partialCredits.find((c: JSONObject) => c['partial'] == event.value);
          if (creditMatch) {
            score = typeof creditMatch['score'] === 'number' ? creditMatch['score'] : 0.5;
            code = typeof creditMatch['code'] === 'number' ? creditMatch['code'] : 2;
          }
        }
      }

      event.code = code;
      event.score = score;
      event.status = ResponseStatus.CODING_COMPLETE;

      this.unitStateService.changeElementCodeValue({
        id: event.id,
        value: event.value,
        status: ResponseStatus.CODING_COMPLETE,
        code: code,
        score: score
      });
    }

    this.valueChange.emit(event);
  }
}
```

## File: ./src/app/components/section/section.component.html

```html
<!-- section.component.html (relevant part) -->

<div>
  @switch (section().layoutId) {
    @case("PicPicLayout") {
      <pic-pic-layout
        [interaction]="section().interaction"
        [instructions]="section().instructions"
        [stimulus]="section().stimulus"
        [variant]="section().variant"
        [parentForm]="form"
        (valueChange)="valueChanged($event)"
      ></pic-pic-layout>
    }
    @case("PicTextLayout") {
      <pic-text-layout
        [interaction]="section().interaction"
        [instructions]="section().instructions"
        [stimulus]="section().stimulus"
        [parentForm]="form"
        (valueChange)="valueChange.emit($event)"
      ></pic-text-layout>
    }
  }
</div>
```

## File: ./src/app/components/elements/text.component.ts

```ts
import { Component, input } from '@angular/core';

import { TextElement } from "../../models";
import { ElementComponent } from "../../directives/element-component.directive";


@Component({
  selector: 'stars-text',
  standalone: false,
  template: `
    <p [ngClass]="position()">
        {{elementModel().text}}
    </p>
  `,
  styles: [
    '.center { text-align: center; }',
    '.right { text-align: right; }'
  ]
})

export class TextComponent extends ElementComponent {
  elementModel = input.required<TextElement>();
  position = input<string>("center");
}
```

## File: ./src/app/components/elements/reduced-keyboard/reduced-keyboard.component.scss

```scss
.keyboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  font-family: 'Quicksand', sans-serif;
}

.keyboard-label {
  width: 100%;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  font-family: 'Quicksand', sans-serif;
}

.text-display {
  width: 80%;
  min-height: 70px;
  border: 2px solid #ddd;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.text-content {
  font-family: 'Quicksand', sans-serif;
  font-size: 3.5rem;
  font-weight: 500;
  letter-spacing: 0.15rem;
  text-align: center;
  min-height: 2rem;
}

.placeholder {
  color: #aaa;
  font-style: italic;
  font-weight: 400;
}

.keyboard-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  width: 85%;
}

.keyboard-button {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 55px;
  height: 55px;
  font-family: 'Quicksand', sans-serif;
  font-size: 1.4rem;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 3px rgba(0,0,0,0.1);

  &:hover:not(:disabled) {
    background-color: #e0e0e0;
    transform: translateY(-2px);
    box-shadow: 0 3px 5px rgba(0,0,0,0.15);
  }

  &:active:not(:disabled) {
    background-color: #d0d0d0;
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.special {
  background-color: #e8eaf6;

  &:hover:not(:disabled) {
    background-color: #c5cae9;
  }

  &:active:not(:disabled) {
    background-color: #9fa8da;
  }
}

.backspace-button {
  min-width: 80px;
  background-color: #ffebee;

  &:hover:not(:disabled) {
    background-color: #ffcdd2;
  }

  &:active:not(:disabled) {
    background-color: #ef9a9a;
  }
}

.submit-button {
  min-width: 120px;
  background-color: #e8f5e9;
  font-weight: 600;

  &:hover:not(:disabled) {
    background-color: #c8e6c9;
  }

  &:active:not(:disabled) {
    background-color: #a5d6a7;
  }
}
```

## File: ./src/app/components/elements/reduced-keyboard/reduced-keyboard.component.html

```html
<div class="keyboard-container">
  <div class="keyboard-label">
    <label [id]="elementModel().id+'-keyboard-label'">
      {{elementModel().label}}
    </label>
  </div>

  <div class="text-display">
    <div class="text-content" [attr.aria-label]="'Eingegebener Text'">
      <span *ngIf="currentText">{{currentText}}</span>
      <span *ngIf="!currentText" class="placeholder">{{elementModel().placeholder}}</span>
    </div>
  </div>

  <!-- Single container for all buttons -->
  <div class="keyboard-buttons">
    <!-- Letter buttons -->
    @for (button of elementModel().buttons; track button) {
      <button type="button"
              class="keyboard-button"
              [attr.aria-label]="elementModel().getButtonText(button, textIsEmpty)"
              (click)="addChar(button)"
              [disabled]="isSubmitted || (elementModel().maxLength !== null && currentText.length >= elementModel().maxLength)">
        {{elementModel().getButtonText(button, textIsEmpty)}}
      </button>
    }

    <!-- Control buttons (backspace, submit, etc.) -->
    @if (elementModel().showBackspace) {
      <button type="button"
              class="keyboard-button special backspace-button"
              [attr.aria-label]="elementModel().backspaceButtonText"
              (click)="deleteChar()"
              [disabled]="isSubmitted || currentText.length === 0">
        <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32" fill="currentColor"><path d="m456-320 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 160q-19 0-36-8.5T296-192L80-480l216-288q11-15 28-23.5t36-8.5h440q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H360ZM180-480l180 240h440v-480H360L180-480Zm400 0Z"/></svg>
      </button>
    }

    @if (elementModel().showSubmit) {
      <button type="button"
              class="keyboard-button special submit-button"
              [attr.aria-label]="elementModel().submitButtonText"
              (click)="submitText()"
              [disabled]="isSubmitted">
        {{elementModel().submitButtonText}}
      </button>
    }
  </div>
</div>
```

## File: ./src/app/components/elements/reduced-keyboard/reduced-keyboard.component.ts

```ts
// Fixed reduced-keyboard.component.ts

import { Component, input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl } from "@angular/forms";

import { ReducedKeyboardElement } from "../../../models/elements/reduced-keyboard";
import { ElementComponent } from "../../../directives/element-component.directive";
import { ResponseStatus, VeronaResponse } from "../../../models/verona";
import { UnitStateService } from "../../../services/unit-state.service";
import { ValidationService } from "../../../services/validation.service";

@Component({
  selector: 'stars-reduced-keyboard',
  templateUrl: './reduced-keyboard.component.html',
  styleUrls: ['./reduced-keyboard.component.scss'],
  standalone: false
})
export class ReducedKeyboardComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<ReducedKeyboardElement>();
  KeyboardInputControl = new FormControl('');
  currentText: string = '';
  isSubmitted: boolean = false;
  position = input<string>("row");

  private unitStateService = inject(UnitStateService);
  private validationService = inject(ValidationService);

  ngOnInit() {
    const restoredValue = this.unitStateService.registerElementWithRestore(
      this.elementModel().id,
      this.elementModel().alias || this.elementModel().id,
      this.elementModel().value || ""
    );

    // FIXED: Ensure consistent state restoration
    this.currentText = typeof restoredValue === 'string' ? restoredValue : '';
    this.elementModel().value = this.currentText;
    this.KeyboardInputControl.setValue(this.currentText, { emitEvent: false });

    this.parentForm()?.addControl(this.elementModel().id, this.KeyboardInputControl);

    if (this.elementModel().required) {
      this.validationService.registerFormControl(this.KeyboardInputControl);
    }

    this.updateElementStatus(ResponseStatus.DISPLAYED);

    console.log(`⌨️ Reduced keyboard initialized: ${this.elementModel().id}, restored value: "${this.currentText}"`);
  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.elementModel().id);
  }

  get textIsEmpty(): boolean {
    return this.currentText.length === 0;
  }

  addChar(button: any) {
    if (this.isSubmitted) return;

    if (this.elementModel().maxLength !== null &&
      this.currentText.length >= this.elementModel().maxLength) {
      return;
    }

    const charToAdd = this.elementModel().getButtonValue(button, this.textIsEmpty);
    this.currentText += charToAdd;
    this.updateStateAndModel();

    console.log(`⌨️ Character added: "${charToAdd}" -> current text: "${this.currentText}"`);
  }

  deleteChar() {
    if (this.isSubmitted) return;

    if (this.currentText.length > 0) {
      this.currentText = this.currentText.slice(0, -1);
      this.updateStateAndModel();

      console.log(`⌨️ Character deleted -> current text: "${this.currentText}"`);
    }
  }

  clearText() {
    if (this.isSubmitted) return;

    this.currentText = '';
    this.updateStateAndModel();

    console.log(`⌨️ Text cleared`);
  }

  submitText() {
    this.isSubmitted = true;
    this.elementModel().value = this.currentText;

    // FIXED: Use consistent status and ensure proper state sync
    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: this.currentText,
      status: ResponseStatus.CODING_COMPLETE
    });

    this.emitStateChange(ResponseStatus.CODING_COMPLETE);
    console.log(`⌨️ Text submitted: "${this.currentText}"`);
  }

  private updateStateAndModel() {
    this.elementModel().value = this.currentText;
    this.KeyboardInputControl.setValue(this.currentText);

    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: this.currentText,
      status: ResponseStatus.VALUE_CHANGED
    });

    this.emitStateChange(ResponseStatus.VALUE_CHANGED);
  }

  private updateElementStatus(status: ResponseStatus) {
    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: this.currentText,
      status: status
    });
  }

  private emitStateChange(status: ResponseStatus) {
    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || this.elementModel().id,
      value: this.currentText,
      status: status
    };

    this.valueChange.emit(response);
  }
}
```

## File: ./src/app/components/elements/binary-choice/binary-choice.component.scss

```scss
:host {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.options-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10vw;
  max-width: 80%;
}

.option-button {
  .option-icon {
    width: clamp(100px, 15vw, 200px);
    height: clamp(100px, 15vw, 200px);
    cursor: pointer;
    border: 6px solid transparent;
    border-radius: 26px;
    box-sizing: border-box;
    transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out, border-color 0.2s ease-in-out;

    & ::ng-deep svg {
      width: 100%;
      height: 100%;
    }
  }

  &:hover .option-icon {
    transform: scale(1.05);
  }
}

::ng-deep .mat-mdc-radio-button .mdc-radio {
  display: none !important;
}

.mat-mdc-radio-checked .option-icon {
  transform: scale(1.1);
  border-color: #0050E5;
}
```

## File: ./src/app/components/elements/binary-choice/binary-choice.component.ts

```ts
import { Component, input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

import { BinaryChoiceElement } from "../../../models/elements/binary-choice";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse, ResponseStatus } from "../../../models/verona";
import { UnitStateService } from "../../../services/unit-state.service";
import { ValidationService } from "../../../services/validation.service";

@Component({
  selector: 'stars-binary-choice',
  templateUrl: './binary-choice.component.html',
  styleUrls: ['./binary-choice.component.scss'],
  standalone: false
})
export class BinaryChoiceComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<BinaryChoiceElement>();
  RadioInputControl = new FormControl();

  option1Icon: SafeHtml;
  option2Icon: SafeHtml;

  private unitStateService = inject(UnitStateService);
  private validationService = inject(ValidationService);
  private sanitizer = inject(DomSanitizer);

  private readonly option1Svg = `
<svg width="210" height="210" viewBox="0 0 210 210" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_12_227)">
<rect x="0.623047" y="0.0239258" width="200" height="200" rx="20.1601" fill="white"/>
</g>
<path d="M62.623 106.239L84.8237 130.214C85.2302 130.653 85.9285 130.639 86.3174 130.185L138.623 69.0386" stroke="#4A7611" stroke-width="16" stroke-linecap="round"/>
<defs>
<filter id="filter0_d_12_227" x="0.623047" y="0.0239258" width="209.072" height="209.072" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feMorphology radius="4.03202" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_12_227"/>
<feOffset dx="5.04003" dy="5.04003"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.109804 0 0 0 0 0.380392 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_12_227"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_12_227" result="shape"/>
</filter>
</defs>
</svg>
`;
  private readonly option2Svg = `
<svg width="210" height="210" viewBox="0 0 210 210" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_12_235)">
<rect x="0.623047" y="0.0239258" width="200" height="200" rx="20.1601" fill="white"/>
</g>
<path d="M66.623 67.139L134.623 132.91" stroke="#B83A1E" stroke-width="16" stroke-linecap="round"/>
<path d="M133.508 66.0238L67.7376 134.024" stroke="#B83A1E" stroke-width="16" stroke-linecap="round"/>
<defs>
<filter id="filter0_d_12_235" x="0.623047" y="0.0239258" width="209" height="209" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feMorphology radius="4" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_12_235"/>
<feOffset dx="5" dy="5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.109804 0 0 0 0 0.380392 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_12_235"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_12_235" result="shape"/>
</filter>
</defs>
</svg>
`;

  constructor() {
    super();
    this.option1Icon = this.sanitizer.bypassSecurityTrustHtml(this.option1Svg);
    this.option2Icon = this.sanitizer.bypassSecurityTrustHtml(this.option2Svg);
  }

  ngOnInit() {
    const restoredValue = this.unitStateService.registerElementWithRestore(
      this.elementModel().id,
      this.elementModel().alias || this.elementModel().id,
      this.elementModel().value // value is now null, 1 or 0
    );

    this.elementModel().value = restoredValue;
    this.RadioInputControl.setValue(restoredValue, { emitEvent: false });
    this.parentForm()?.addControl(this.elementModel().id, this.RadioInputControl);
    if (this.elementModel().required) {
      this.validationService.registerFormControl(this.RadioInputControl);
    }
    this.updateElementStatus(ResponseStatus.DISPLAYED);
  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.elementModel().id);
  }

  valueChanged($event: any) {
    const value = $event.value; // This will be 1 or 0
    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: value,
      status: ResponseStatus.VALUE_CHANGED
    });

    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || this.elementModel().id,
      value: value.toString(),
      status: ResponseStatus.VALUE_CHANGED
    };

    this.valueChange.emit(response);
  }

  private updateElementStatus(status: ResponseStatus) {
    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: this.elementModel().value,
      status: status
    });
  }
}
```

## File: ./src/app/components/elements/binary-choice/binary-choice.component.html

```html
<mat-radio-group
  class="options-container"
  [formControl]="RadioInputControl"
  (change)="valueChanged($event)">
  <mat-radio-button [value]="1" class="option-button">
    <div class="option-icon" [innerHTML]="option1Icon"></div>
  </mat-radio-button>
  <mat-radio-button [value]="0" class="option-button">
    <div class="option-icon" [innerHTML]="option2Icon"></div>
  </mat-radio-button>
</mat-radio-group>
```

## File: ./src/app/components/elements/syllable-counter/syllable-counter.component.html

```html
<div class="syllable-counter-container" [ngClass]="'layout-' + elementModel().layout">
  @if (elementModel()) {
    @if (elementModel().label && elementModel().label.trim()) {
      <label [id]="elementModel().id+'-syllable-label'"
             class="syllable-label"
             [innerHTML]="elementModel().label | safeResourceHTML">
      </label>
    }

    <!-- Vertical Layout: Radio Group with Multiple Hands -->
    @if (elementModel().layout === 'vertical') {
      <mat-radio-group [attr.aria-labelledby]="elementModel().label ? elementModel().id+'-syllable-label' : null"
                       [attr.aria-label]="!elementModel().label ? 'Silben zählen' : null"
                       [value]="elementModel().value ? elementModel().value - 1 : null"
                       (change)="valueChangedVertical($event)"
                       class="syllable-options vertical-layout">
        @if (elementModel().options && elementModel().options.length > 0) {
          @for (option of elementModel().options; track option; let i = $index) {
            <mat-label class="syllable-option">
              <mat-radio-button class="syllable-radio"
                                [style.pointer-events]="elementModel().readOnly ? 'none' : 'unset'"
                                [attr.aria-label]="option.altText"
                                [value]="i">
                <div class="hands-container vertical">
                  @for (handIndex of getHandIndices(i + 1); track handIndex) {
                    <img [src]="elementModel().imgSrc"
                         [alt]="'Klatschende Hand ' + (handIndex + 1)"
                         class="hand-image"
                         loading="lazy">
                  }
                </div>
              </mat-radio-button>
            </mat-label>
          }
        }
      </mat-radio-group>
    }

    <!-- Row Layout: Multi-Choice with Single Hands -->
    @if (elementModel().layout === 'row') {
      <div class="syllable-options row-layout"
           [formGroup]="MultiChoiceFormGroup">
        @if (elementModel().options && elementModel().options.length > 0) {
          @for (option of elementModel().options; track option; let i = $index) {
            <mat-checkbox
              [formControlName]="option.id"
              [attr.aria-label]="option.altText"
              [style.pointer-events]="elementModel().readOnly ? 'none' : 'unset'"
              (change)="valueChangedRow()"
              class="syllable-checkbox">

              <div class="hands-container row">
                <img [src]="elementModel().imgSrc"
                     [alt]="option.altText"
                     class="hand-image single"
                     loading="lazy">
              </div>
            </mat-checkbox>
          }
        }
      </div>
    }

    @if (!elementModel().options || elementModel().options.length === 0) {
      <div class="error-message">
        No options available! Check console for debug info.
      </div>
    }
  } @else {
    <div class="error-message">
      Element model is undefined! Component not properly initialized.
    </div>
  }
</div>
```

## File: ./src/app/components/elements/syllable-counter/syllable-counter.component.ts

```ts
import { Component, input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";

import { SyllableCounterElement } from "../../../models/elements/syllable-counter";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse, ResponseStatus } from "../../../models/verona";
import { UnitStateService } from "../../../services/unit-state.service";
import { ValidationService } from "../../../services/validation.service";

@Component({
  selector: 'stars-syllable-counter',
  templateUrl: './syllable-counter.component.html',
  styleUrls: ['./syllable-counter.component.scss'],
  standalone: false
})
export class SyllableCounterComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<SyllableCounterElement>();

  SyllableInputControl = new FormControl(); // For vertical (radio group)
  MultiChoiceFormGroup = new FormGroup({}); // For row (multi-choice)

  position = input<string>("row");

  private unitStateService = inject(UnitStateService);
  private validationService = inject(ValidationService);

  ngOnInit() {
    const restoredValue = this.unitStateService.registerElementWithRestore(
      this.elementModel().id,
      this.elementModel().alias || this.elementModel().id,
      this.elementModel().value
    );
    this.elementModel().value = restoredValue;
    this.initializeFormControls(restoredValue);

    if (this.elementModel().required) {
      if (this.elementModel().layout === 'vertical') {
        this.validationService.registerFormControl(this.SyllableInputControl);
      } else {
        this.validationService.registerFormControl(this.MultiChoiceFormGroup);
      }
    }
    this.updateElementStatus(ResponseStatus.DISPLAYED);

    console.log(`Syllable counter initialized: ${this.elementModel().id}, layout: ${this.elementModel().layout}, restored value:`, restoredValue);
  }

  private initializeFormControls(restoredValue: any): void {
    if (this.elementModel().layout === 'vertical') {
      let selectedIndex = null;
      if (typeof restoredValue === 'number' && restoredValue >= 1 && restoredValue <= this.elementModel().maxSyllables) {
        selectedIndex = restoredValue - 1;
      }
      this.SyllableInputControl.setValue(selectedIndex, { emitEvent: false });
      this.parentForm()?.addControl(this.elementModel().id, this.SyllableInputControl);
    } else {
      const binaryString = typeof restoredValue === 'number' && restoredValue > 0
        ? SyllableCounterElement.syllableCountToBinaryString(restoredValue, this.elementModel().maxSyllables)
        : '';

      this.elementModel().options.forEach((option, index) => {
        const isChecked = binaryString.length > index && binaryString[index] === '1';
        const formControl = new FormControl();
        formControl.setValue(isChecked, { emitEvent: false });
        this.MultiChoiceFormGroup.addControl(option.id, formControl);
      });

      this.parentForm()?.addControl(this.elementModel().id, this.MultiChoiceFormGroup);
    }
  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.elementModel().id);
  }

  getHandIndices(count: number): number[] {
    return Array(count).fill(0).map((_, index) => index);
  }

  valueChangedVertical($event: any) {
    const syllableCount = $event.value + 1;
    this.saveValue(syllableCount);
  }

  valueChangedRow() {
    let syllableCount = 0;
    for (const field in this.MultiChoiceFormGroup.controls) {
      if (this.MultiChoiceFormGroup.controls[field].value === true) {
        syllableCount++;
      }
    }
    this.saveValue(syllableCount);
  }

  private saveValue(syllableCount: number): void {
    console.log(`Syllable value changed: ${this.elementModel().id} -> syllable count: ${syllableCount}`);
    this.elementModel().value = syllableCount;
    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: syllableCount,
      status: ResponseStatus.VALUE_CHANGED
    });
    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || this.elementModel().id,
      value: syllableCount.toString(),
      status: ResponseStatus.VALUE_CHANGED
    };

    this.valueChange.emit(response);
  }

  private updateElementStatus(status: ResponseStatus) {
    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: this.elementModel().value,
      status: status
    });
  }
}
```

## File: ./src/app/components/elements/syllable-counter/syllable-counter.component.scss

```scss
.syllable-counter-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  font-family: 'Quicksand', sans-serif;
  justify-content: center;
}

.syllable-label {
  display: block;
  text-align: center;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  flex-shrink: 0;
  line-height: 1.2;
}

.syllable-options.vertical-layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: clamp(0.25rem, 1.2vh, 0.5rem);
  width: 100%;
  max-width: clamp(400px, 80vw, 600px);  // ← Wider for full-width container
  margin: 0 auto;
  justify-self: center;  // ← Ensure it centers in the grid
  flex: 1;
  overflow: hidden;
  padding: clamp(0.25rem, 1vh, 0.5rem);
}

.vertical-layout .syllable-option {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  cursor: pointer;
  max-width: none;
  min-width: 0;
}

.vertical-layout .syllable-radio {
  ::ng-deep .mdc-radio {
    display: none !important;
  }

  ::ng-deep .mat-mdc-radio-button {
    display: flex !important;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
}

.hands-container.vertical {
  display: flex;
  flex-direction: row;
  gap: clamp(0.2rem, 0.8vw, 0.4rem);
  align-items: center;
  justify-content: flex-start;
  padding: clamp(0.4rem, 1vh, 0.6rem) clamp(0.5rem, 1vw, 0.8rem);
  border: 6px solid transparent;
  border-radius: 10px;
  transition: all 0.3s ease;
  background-color: #ffffff;
  min-height: clamp(40px, 6vh, 60px);
  width: 100%;
  max-width: clamp(220px, 55vw, 350px);
  overflow: hidden;
}

.syllable-options.row-layout {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.6rem;
  padding: 0.75rem;
  width: 100%;
  height: 100%;
  max-width: 95%;
  margin: 0 auto;
  box-sizing: border-box;
  overflow: hidden;
  flex: 1;
}

.syllable-checkbox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex: 1;
  width: 100%;
  height: 100%;
  min-width: 0;
  padding: 0.25rem;
  max-width: none;
}

::ng-deep .row-layout .syllable-checkbox .mdc-checkbox {
  display: none !important;
}

::ng-deep .row-layout .syllable-checkbox .mat-mdc-checkbox {
  display: flex !important;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.hands-container.row {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 6px solid transparent;
  border-radius: 8px;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  height: 100%;
  min-height: 80px;
  aspect-ratio: 1 / 1;
  min-width: 0;
}

.hand-image {
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: transform 0.2s ease;
  flex-shrink: 1;

  .vertical-layout & {
    height: clamp(30px, 5vh, 50px);
    width: clamp(30px, 5vh, 50px);
    min-height: 30px;
    min-width: 30px;
    max-height: 50px;
    max-width: 50px;
  }

  .row-layout & {
    width: 100%;
    height: 100%;
    max-height: none;
    object-fit: contain;
    cursor: pointer;
  }
}

mat-radio-button.mat-mdc-radio-checked .hands-container.vertical {
  border-color: #0050E5;
}

mat-radio-button.mat-mdc-radio-checked .hand-image {
  animation: bounce 0.3s ease-out;
}

mat-checkbox.mat-mdc-checkbox-checked .hands-container.row {
  border-color: #0050E5;
}

mat-checkbox.mat-mdc-checkbox-checked .hand-image {
  transform: scale(0.98);
}

@keyframes bounce {
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
}

.error-message {
  color: #dc3545;
  padding: 15px;
  background: #ffe6e6;
  border: 1px solid #ff9999;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  margin: 1rem;
}

@media (orientation: landscape) {
  .syllable-options.vertical-layout {
    gap: 0.35rem;
    max-width: 320px;
  }

  .hands-container.vertical {
    min-height: 45px;
    padding: 0.5rem 0.7rem;
  }

  .hand-image {
    .vertical-layout & {
      height: 38px;
      max-height: 50px;
    }
  }
}

```

## File: ./src/app/components/elements/text-field.component.ts

```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'aspect-text-field',
  template: `
    <ng-container *ngIf="!tableMode">
      <mat-form-field [class.small-input]="elementModel.label === ''"
                      [style.width.%]="100"
                      [style.height.%]="100"
                      [style.line-height.%]="elementModel.styling.lineHeight"
                      [style.color]="elementModel.styling.fontColor"
                      [style.font-size.px]="elementModel.styling.fontSize"
                      [style.font-weight]="elementModel.styling.bold ? 'bold' : ''"
                      [style.font-style]="elementModel.styling.italic ? 'italic' : ''"
                      [style.text-decoration]="elementModel.styling.underline ? 'underline' : ''"
                      [style.--backgroundColor]="elementModel.styling.backgroundColor"
                      [appearance]="$any(elementModel.appearance)">
        <mat-label>{{elementModel.label}}</mat-label>
        <input matInput #input
               autocomplete="off"
               autocapitalize="none"
               autocorrect="off"
               spellcheck="false"
               value="{{elementModel.value}}"
               [attr.inputmode]="elementModel.showSoftwareKeyboard || elementModel.hideNativeKeyboard ? 'none' : 'text'"
               [formControl]="elementFormControl"
               [pattern]="$any(elementModel.pattern)"
               [readonly]="elementModel.readOnly"
               (paste)="elementModel.isLimitedToMaxLength && elementModel.maxLength ? $event.preventDefault() : null"
               (keydown)="onKeyDown.emit({keyboardEvent: $event, inputElement: input})"
               (focus)="focusChanged.emit({ inputElement: input, focused: true })"
               (blur)="focusChanged.emit({ inputElement: input, focused: false })">
        <div matSuffix
             class="fx-row-center-baseline">
  <!--        TODO nicht zu sehen-->
          <mat-icon *ngIf="!elementFormControl.touched && elementModel.hasKeyboardIcon">keyboard_outline</mat-icon>
          <button *ngIf="elementModel.clearable"
                  type="button"
                  mat-icon-button aria-label="Clear"
                  (click)="elementFormControl.setValue('')">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <mat-error *ngIf="elementFormControl.errors">
          {{elementFormControl.errors | errorTransform: elementModel}}
        </mat-error>
      </mat-form-field>
    </ng-container>

    <ng-container *ngIf="tableMode">
      <aspect-cloze-child-error-message *ngIf="elementFormControl.errors && elementFormControl.touched"
                                        [elementModel]="elementModel"
                                        [elementFormControl]="elementFormControl">
      </aspect-cloze-child-error-message>
      <input #input
             class="table-child"
             autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false"
             [class.errors]="elementFormControl.errors && elementFormControl.touched"
             [attr.inputmode]="elementModel.showSoftwareKeyboard || elementModel.hideNativeKeyboard ? 'none' : 'text'"
             [style.line-height.%]="elementModel.styling.lineHeight"
             [style.color]="elementModel.styling.fontColor"
             [style.font-size.px]="elementModel.styling.fontSize"
             [style.font-weight]="elementModel.styling.bold ? 'bold' : ''"
             [style.font-style]="elementModel.styling.italic ? 'italic' : ''"
             [style.text-decoration]="elementModel.styling.underline ? 'underline' : ''"
             [style.background-color]="elementModel.styling.backgroundColor"
             [readonly]="elementModel.readOnly"
             [formControl]="elementFormControl"
             [value]="elementModel.value"
             (paste)="elementModel.isLimitedToMaxLength && elementModel.maxLength ? $event.preventDefault() : null"
             (keydown)="onKeyDown.emit({keyboardEvent: $event, inputElement: input})"
             (focus)="focusChanged.emit({ inputElement: input, focused: true })"
             (blur)="focusChanged.emit({ inputElement: input, focused: false })">
    </ng-container>
  `,
  styles: [`
    :host ::ng-deep .small-input div.mdc-notched-outline {
        top: 0.45em;
        bottom: 0.45em;
        height: unset;
    }
    :host ::ng-deep .small-input .mdc-notched-outline__notch {
      display: none;
    }
    :host ::ng-deep .mat-mdc-form-field-infix  {
      z-index: 1;
    }
    :host ::ng-deep .mat-mdc-text-field-wrapper .mdc-notched-outline * {
      background-color: var(--backgroundColor) !important;
    }
    :host ::ng-deep .mat-mdc-text-field-wrapper.mdc-text-field--filled {
      background-color: var(--backgroundColor) !important;
    }
    .fx-row-center-baseline {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: baseline;
    }
    .table-child {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: none;
      padding: 0 10px;
      font-family: inherit;
    }
  `]
})
export class TextFieldComponent extends TextInputComponent {
  @Input() elementModel!: TextFieldElement;
  tableMode: boolean = false;
}
```

## File: ./src/app/components/elements/radio-group-text/radio-group-text.component.ts

```ts
import { Component, input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl } from "@angular/forms";

import { RadioGroupTextElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse, ResponseStatus } from "../../../models/verona";
import { UnitStateService } from "../../../services/unit-state.service";
import { ValidationService } from "../../../services/validation.service";

@Component({
  selector: 'stars-radio-group-text',
  templateUrl: './radio-group-text.component.html',
  styleUrls: ['./radio-group-text.component.scss'],
  standalone: false
})
export class RadioGroupTextComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<RadioGroupTextElement>();
  RadioInputControl = new FormControl();
  position = input<string>("row");
  sectionVariant = input<string>('row_layout');

  layoutClass: string = 'row-layout';

  private unitStateService = inject(UnitStateService);
  private validationService = inject(ValidationService);

  ngOnInit() {
    this.layoutClass = this.getLayoutClass();

    const restoredValue = this.unitStateService.registerElementWithRestore(
      this.elementModel().id,
      this.elementModel().alias || this.elementModel().id,
      this.elementModel().value
    );

    this.elementModel().value = restoredValue;
    this.RadioInputControl.setValue(restoredValue, { emitEvent: false });
    this.parentForm()?.addControl(this.elementModel().id, this.RadioInputControl);
    if (this.elementModel().required) {
      this.validationService.registerFormControl(this.RadioInputControl);
    }

    this.updateElementStatus(ResponseStatus.DISPLAYED);

  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.elementModel().id);
  }

  valueChanged($event: any) {

    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: $event.value,
      status: ResponseStatus.VALUE_CHANGED
    });

    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || this.elementModel().id,
      value: $event.value,
      status: ResponseStatus.VALUE_CHANGED
    };

    this.valueChange.emit(response);
  }

  private updateElementStatus(status: ResponseStatus) {
    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: this.elementModel().value,
      status: status
    });
  }

  getLayoutClass(): string {
    const variant = this.sectionVariant();
    console.log(`🎨 Section variant for radio-group: ${variant}`);

    switch (variant) {
      case 'grid_layout':
        return 'grid-layout';
      case 'row_layout':
      default:
        return 'row-layout';
    }
  }
}
```

## File: ./src/app/components/elements/radio-group-text/radio-group-text.component.scss

```scss

.radio-group-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &.four-option-center {
    display: grid !important;
    place-items: center !important;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: 100%;

    mat-radio-group {
      align-self: center;
      justify-self: center;
    }
  }
}

.radio-group-label {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  flex-shrink: 0;
}

mat-radio-group {
  display: flex;
  width: 100%;
  height: calc(100% - 3rem);
  overflow: hidden;

  &.grid-layout {
    align-items: center;
    justify-content: center;
  }
}

mat-radio-group.row-layout {
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  box-sizing: border-box;
}

mat-radio-group.grid-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 25vmin));
  grid-template-rows: repeat(2, minmax(180px, 25vmin));

  gap: clamp(15px, 2vmin, 30px);
  padding: clamp(15px, 2vmin, 30px);
  place-items: center;
  justify-content: center;

  width: fit-content;
  height: fit-content;
  margin: 0 auto;
  box-sizing: border-box;

  align-self: center;
  justify-self: center;

  &[style*="--option-count='3'"] {
    grid-template-columns: repeat(2, minmax(180px, 25vmin));
    grid-template-rows: repeat(2, minmax(180px, 25vmin));
    gap: clamp(15px, 2vmin, 30px);
  }

  &[style*="--option-count='4'"] {
    grid-template-columns: repeat(2, minmax(180px, 25vmin));
    grid-template-rows: repeat(2, minmax(180px, 25vmin));
    gap: clamp(15px, 2vmin, 30px);
    width: fit-content;
  }

  &[style*="--option-count='5'"],
  &[style*="--option-count='6'"] {
    grid-template-columns: repeat(2, minmax(180px, 25vmin));
    grid-template-rows: repeat(3, minmax(180px, 25vmin));
    gap: clamp(15px, 2vmin, 30px);
  }
}

mat-radio-group.grid-layout mat-radio-button {
  width: clamp(180px, 25vmin, 280px);
  height: clamp(180px, 25vmin, 280px);
  min-width: 180px;
  min-height: 180px;

  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; // Prevent shrinking
}

mat-radio-group.grid-layout[style*="--option-count='4'"] mat-radio-button {
  width: clamp(180px, 25vmin, 280px);
  height: clamp(180px, 25vmin, 280px);
  min-width: 180px;
  min-height: 180px;

  aspect-ratio: 1 / 1;
  flex-shrink: 0;
}

mat-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 0;
}

mat-radio-button {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

::ng-deep mat-radio-button .mdc-radio {
  display: none !important;
}

::ng-deep mat-radio-button .mat-mdc-radio-button .mdc-radio {
  display: none !important;
}

.large-letter {
  display: flex;
  align-items: center;
  justify-content: center;

  width: clamp(160px, 22vmin, 240px);
  height: clamp(160px, 22vmin, 240px);
  min-width: 160px;
  min-height: 160px;

  aspect-ratio: 1 / 1;
  cursor: pointer;
  background: #ffffff;
  border: 3px solid transparent;
  border-radius: clamp(12px, 2vmin, 20px);
  transition: all 0.2s ease;
  box-sizing: border-box;

  font-size: clamp(80px, 15vmin, 140px);
  font-weight: bold;
  font-family: 'Quicksand', sans-serif;
  color: #333;
  line-height: 1;
  text-transform: uppercase;
}

mat-radio-button.mat-mdc-radio-checked .large-letter {
  border-color: #0050E5 !important;
  background-color: #0050E5 !important;
  box-shadow: 0 2px 12px rgba(0, 123, 255, 0.4);
  color: white;
}

.option-text {
  display: none;
}

@media (orientation: landscape) and (max-height: 600px) {
  mat-radio-group.grid-layout mat-radio-button {
    width: clamp(150px, 20vmin, 220px);
    height: clamp(150px, 20vmin, 220px);
    min-width: 150px;
    min-height: 150px;
    aspect-ratio: 1 / 1;
  }

  mat-radio-group.grid-layout[style*="--option-count='4'"] mat-radio-button {
    width: clamp(150px, 20vmin, 220px);
    height: clamp(150px, 20vmin, 220px);
    min-width: 150px;
    min-height: 150px;
    aspect-ratio: 1 / 1;
  }

  .large-letter {
    width: clamp(130px, 18vmin, 190px);
    height: clamp(130px, 18vmin, 190px);
    min-width: 130px;
    min-height: 130px;
    font-size: clamp(65px, 12vmin, 110px);
    border-radius: clamp(10px, 1.5vmin, 16px);
  }

  mat-radio-group.grid-layout {
    grid-template-columns: repeat(2, minmax(150px, 20vmin));
    grid-template-rows: repeat(2, minmax(150px, 20vmin));
    gap: clamp(10px, 1.5vmin, 20px);
    padding: clamp(10px, 1.5vmin, 20px);
  }
}
```

## File: ./src/app/components/elements/radio-group-text/radio-group-text.component.html

```html

<div class="radio-group-container" [class.four-option-center]="elementModel().options.length === 4">
  <label [id]="elementModel().id+'-radio-group-label'" class="radio-group-label" [innerHTML]="elementModel().label | safeResourceHTML"></label>
  <mat-radio-group [attr.aria-labelledby]="elementModel().id+'-radio-group-label'" [value]="elementModel().value" [ngClass]="getLayoutClass()" [style.--option-count]="elementModel().options.length" (change)="valueChanged($event)">
    @for (option of elementModel().options; track option; let i = $index) {
      <mat-label>
        <mat-radio-button class="button-radio" [style.pointer-events]="elementModel().readOnly ? 'none' : 'unset'" [aria-label]="option.text" [value]="option.text">
          <div class="large-letter">{{ option.text }}</div>
        </mat-radio-button>
      </mat-label>
    }
  </mat-radio-group>
</div>


```

## File: ./src/app/components/elements/radio-group-images/radio-group-images.component.scss

```scss

.radio-group-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &.four-option-center {
    display: grid !important;
    place-items: center !important;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: 100%;

    mat-radio-group {
      align-self: center;
      justify-self: center;
    }
  }
}

.radio-group-label {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  flex-shrink: 0;
}

mat-radio-group {
  display: flex;
  width: 100%;
  height: calc(100% - 3rem);
  overflow: hidden;

  &.grid-layout {
    align-items: center;
    justify-content: center;
  }
}

mat-radio-group.row-layout {
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  box-sizing: border-box;
}

mat-radio-group.grid-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 0.5rem 0.75rem;
  padding: clamp(0.5rem, 1.5vw, 1.5rem);
  place-items: center;
  max-width: clamp(280px, 50vw, 450px);
  margin: 0 auto;
  box-sizing: border-box;
  height: auto;
  max-height: clamp(400px, 80vh, 800px);
  align-self: center;
  justify-self: center;

  &[style*="--option-count='3'"] {
    grid-template-rows: repeat(2, 1fr);
    gap: 0.5rem 0.75rem;
    max-width: clamp(280px, 45vw, 400px);
  }

  &[style*="--option-count='4'"] {
    max-width: clamp(180px, 25vw, 240px);
    gap: 0.4rem 0.4rem;
    margin: 0;
    width: fit-content;
    grid-template-rows: repeat(2, 1fr);
    align-self: center;
    justify-self: center;
  }

  &[style*="--option-count='5'"],
  &[style*="--option-count='6'"] {
    grid-template-rows: repeat(3, 1fr);
    gap: 0.5rem 0.75rem;
    max-width: clamp(300px, 50vw, 450px);
  }
}

mat-radio-group.grid-layout mat-radio-button {
  width: 100%;
  height: 100%;
  max-width: 150px;
  max-height: 150px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

mat-radio-group.grid-layout[style*="--option-count='4'"] mat-radio-button {
  width: clamp(70px, min(10vw, 10vh), 100px);
  height: clamp(70px, min(10vw, 10vh), 100px);
}

mat-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 0;
}

mat-radio-button {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

::ng-deep mat-radio-button .mdc-radio {
  display: none !important;
}

::ng-deep mat-radio-button .mat-mdc-radio-button .mdc-radio {
  display: none !important;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}

mat-radio-group.grid-layout[style*="--option-count='4'"] .image-wrapper {
  width: clamp(55px, 8vw, 85px);
  height: clamp(55px, 8vw, 85px);
}

img {
  width: 100%;
  height: 100%;
  max-height: min(200px, 25vh);
  max-width: 100%;
  object-fit: contain;
  cursor: pointer;
  background: #ffffff;
  border: 6px solid transparent;
  border-radius: clamp(4px, 1vw, 12px);
  transition: border-color 0.2s ease;
}

mat-radio-button.mat-mdc-radio-checked img {
  border-color: #0050E5;
}

.option-text {
  display: none;
}

@media (orientation: landscape) and (max-height: 600px) {
  mat-radio-group.grid-layout {
    gap: 0.5rem 0.75rem;
    padding: 0.5rem;
  }

  mat-radio-group.grid-layout mat-radio-button {
    max-width: 130px;
    max-height: 100px;
    min-height: 70px;
  }
}

```

## File: ./src/app/components/elements/radio-group-images/radio-group-images.component.html

```html

<div class="radio-group-container"
     [class.four-option-center]="elementModel().options.length === 4">
  <label [id]="elementModel().id+'-radio-group-label'"
         class="radio-group-label"
         [innerHTML]="elementModel().label | safeResourceHTML">
  </label>

  <mat-radio-group [attr.aria-labelledby]="elementModel().id+'-radio-group-label'"
                   [value]="elementModel().value"
                   [ngClass]="getLayoutClass()"
                   [style.--option-count]="elementModel().options.length"
                   (change)="valueChanged($event)">
    @for (option of elementModel().options; track option; let i = $index) {
      <mat-label>
        <mat-radio-button class="button-radio"
                          [style.pointer-events]="elementModel().readOnly ? 'none' : 'unset'"
                          [aria-label]="option.text"
                          [value]="i">
            <div class="image-wrapper">
              <img #image
                   [src]="option.imgSrc"
                   [alt]="option.altText"
                   fill="">
            </div>
        </mat-radio-button>
      </mat-label>
    }
  </mat-radio-group>
</div>



IGNORE_WHEN_COPYING_START
```

## File: ./src/app/components/elements/radio-group-images/radio-group-images.component.ts

```ts
import { Component, input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl } from "@angular/forms";

import { RadioGroupImagesElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse, ResponseStatus } from "../../../models/verona";
import { UnitStateService } from "../../../services/unit-state.service";
import { ValidationService } from "../../../services/validation.service";

@Component({
  selector: 'stars-radio-group-images',
  templateUrl: './radio-group-images.component.html',
  styleUrls: ['./radio-group-images.component.scss'],
  standalone: false
})
export class RadioGroupImagesComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<RadioGroupImagesElement>();
  RadioInputControl = new FormControl();
  position = input<string>("row");
  sectionVariant = input<string>('row_layout'); // Add variant input

  layoutClass: string = 'row-layout';

  private unitStateService = inject(UnitStateService);
  private validationService = inject(ValidationService);

  ngOnInit() {
    // Set layout class based on variant
    this.layoutClass = this.getLayoutClass();

    const restoredValue = this.unitStateService.registerElementWithRestore(
      this.elementModel().id,
      this.elementModel().alias || this.elementModel().id,
      this.elementModel().value
    );

    let internalValue = null;
    if (typeof restoredValue === 'number' && restoredValue >= 1) {
      internalValue = restoredValue - 1; //
    }

    // Set the restored value in both model and form control
    this.elementModel().value = restoredValue;
    this.RadioInputControl.setValue(internalValue, { emitEvent: false });
    this.parentForm()?.addControl(this.elementModel().id, this.RadioInputControl);

    // Register for validation if required
    if (this.elementModel().required) {
      this.validationService.registerFormControl(this.RadioInputControl);
    }

    // Mark as displayed when component initializes
    this.updateElementStatus(ResponseStatus.DISPLAYED);

  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.elementModel().id);
  }

  valueChanged($event: any) {

    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: $event.value + 1,
      status: ResponseStatus.VALUE_CHANGED
    });

    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || this.elementModel().id,
      value: $event.value + 1,
      status: ResponseStatus.VALUE_CHANGED
    };

    this.valueChange.emit(response);
  }

  private updateElementStatus(status: ResponseStatus) {
    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: this.elementModel().value,
      status: status
    });
  }

  getLayoutClass(): string {
    const variant = this.sectionVariant();
    console.log(`🎨 Section variant for radio-group: ${variant}`);

    switch (variant) {
      case 'grid_layout':
        return 'grid-layout';
      case 'row_layout':
      default:
        return 'row-layout';
    }
  }
}
```

## File: ./src/app/components/elements/image.component.ts

```ts
import { Component, input } from '@angular/core';

import { ImageElement } from "../../models";
import { ElementComponent } from "../../directives/element-component.directive";
import {MediaPlayerService} from "../../services/media-player-service";


@Component({
  selector: 'stars-image',
  template: `
    @if (elementModel().imgSrc) {
      <img #image
           [src]="elementModel().imgSrc"
           [alt]="elementModel().altText"
           fill="">
    }
  `,
  styles: [
    'img { object-fit: contain; width: clamp(100px, 30vw, 400px); height: clamp(100px, 30vh, 400px); max-width: 100%; max-height: 100%; }'
  ],
  standalone: false
})

export class ImageComponent extends ElementComponent {
  elementModel = input.required<ImageElement>();

  constructor(private mediaPlayerService: MediaPlayerService) {
    super();
    mediaPlayerService.durationChange.subscribe(value => {
      if (value.currentDuration > 2) {

      }
    });
  }
}
```

## File: ./src/app/components/elements/multi-choice-images/multi-choice-images.component.ts

```ts
import { Component, input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { MultiChoiceImagesElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse, ResponseStatus } from "../../../models/verona";
import { UnitStateService } from "../../../services/unit-state.service";
import { ValidationService } from "../../../services/validation.service";

@Component({
  selector: 'stars-multi-choice-images',
  templateUrl: 'multi-choice-images.component.html',
  styleUrls: ['multi-choice-images.component.scss'],
  standalone: false
})
export class MultiChoiceImagesComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<MultiChoiceImagesElement>();
  formId = Math.floor(Math.random() * 20000000 + 10000000).toString();
  MultiCheckboxFormGroup = new FormGroup({});
  sectionVariant = input<string>('row_layout');
  layoutClass: string = 'row-layout';

  private unitStateService = inject(UnitStateService);
  private validationService = inject(ValidationService);

  ngOnInit() {
    this.layoutClass = this.getLayoutClass();

    const restoredValue = this.unitStateService.registerElementWithRestore(
      this.elementModel().id,
      this.elementModel().alias || this.elementModel().id,
      this.elementModel().value || "" // default empty string
    );

    this.elementModel().value = restoredValue;
    this.elementModel().options.forEach((option, index) => {
      const formControl = new FormControl();

      if (typeof restoredValue === 'string' && restoredValue.length > index) {
        const isChecked = restoredValue[index] === '1';
        formControl.setValue(isChecked, { emitEvent: false });
      }
      this.MultiCheckboxFormGroup.addControl(option.id, formControl, { emitEvent: false });
    });
    this.parentForm()?.addControl(this.formId, this.MultiCheckboxFormGroup);
    if (this.elementModel().required) {
      this.validationService.registerFormControl(this.MultiCheckboxFormGroup);
    }
    this.updateElementStatus(ResponseStatus.DISPLAYED);

  }

  ngOnDestroy() {
    this.parentForm()?.removeControl(this.formId);
  }

  valueChanged(event: any) {
    let value = "";
    for (let i = 0; i < this.elementModel().options.length; i++) {
      const option = this.elementModel().options[i];
      const formControl = this.MultiCheckboxFormGroup.controls[option.id];
      value += formControl.value === true ? '1' : '0';
    }
    this.elementModel().value = value;

    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: value,
      status: ResponseStatus.VALUE_CHANGED
    });

    const response: VeronaResponse = {
      id: this.elementModel().id,
      alias: this.elementModel().alias || this.elementModel().id,
      value: value,
      status: ResponseStatus.VALUE_CHANGED
    };

    this.valueChange.emit(response);
  }

  private updateElementStatus(status: ResponseStatus) {
    this.unitStateService.changeElementCodeValue({
      id: this.elementModel().id,
      value: this.elementModel().value,
      status: status
    });
  }

  getLayoutClass(): string {
    const variant = this.sectionVariant();
    console.log(`Section variant for multi-choice: ${variant}`);

    switch (variant) {
      case 'grid_layout':
        return 'grid-layout';
      case 'row_layout':
      default:
        return 'row-layout';
    }
  }

  getContainerHeight(): string {
    const container = document.querySelector('.checkbox-group.grid-layout');
    return container ? `${container.clientHeight}px` : 'unknown';
  }

}
```

## File: ./src/app/components/elements/multi-choice-images/multi-choice-images.component.html

```html
<!-- Updated multi-choice-images.component.html -->

<!-- Add a centering wrapper specifically for 4 options -->
<div class="multi-choice-wrapper"
     [class.four-option-center]="elementModel().options.length === 4">

  <div class="checkbox-group"
       [ngClass]="getLayoutClass()"
       [style.--option-count]="elementModel().options.length"
       [formGroup]="MultiCheckboxFormGroup">
    @for (option of elementModel().options; track option; let i = $index) {
      <mat-checkbox
        [formControlName]="option.id"
        [attr.aria-label]="option.text"
        (change)="valueChanged($event)">

        <div class="image-container">
          <img [src]="option.imgSrc"
               [alt]="option.altText"
               loading="lazy">
        </div>
      </mat-checkbox>
    }
  </div>
</div>
```

## File: ./src/app/components/elements/multi-choice-images/multi-choice-images.component.scss

```scss
.multi-choice-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &.four-option-center {
    align-items: center !important;
    justify-content: center !important;
    min-height: 100% !important;

    .checkbox-group {
      position: static !important;
      margin: 0 !important;
      transform: none !important;
    }
  }
}

.multi-choice-wrapper.four-option-center {
  display: grid !important;
  place-items: center !important;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  height: 100vh;
}

.checkbox-group.grid-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem 0.75rem;
  padding: clamp(0.5rem, 1.5vw, 1.5rem);
  place-items: center;
  max-width: clamp(280px, 50vw, 450px);
  margin: 0 auto;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  max-height: clamp(400px, 80vh, 800px);
  align-self: center;
  justify-self: center;

  &[style*="--option-count='1'"] {
    grid-template-columns: 1fr;
    max-width: clamp(180px, 30vw, 250px);
  }

  &[style*="--option-count='2'"] {
    max-width: clamp(250px, 40vw, 350px);
  }

  &[style*="--option-count='3'"] {
    max-width: clamp(280px, 45vw, 400px);
  }

  &[style*="--option-count='4'"] {
    max-width: clamp(240px, 25vw, 300px);
    gap: 0.4rem 0.4rem;
    margin: 0;
    width: fit-content;
  }

  &[style*="--option-count='5'"],
  &[style*="--option-count='6'"] {
    max-width: clamp(300px, 50vw, 450px);
  }

  &[style*="--option-count='7'"],
  &[style*="--option-count='8'"] {
    max-width: clamp(320px, 55vw, 500px);
  }
}

.checkbox-group.grid-layout mat-checkbox {
  width: clamp(120px, min(20vw, 20vh), 220px);
  height: clamp(120px, min(20vw, 20vh), 220px);

  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-group.grid-layout[style*="--option-count='4'"] mat-checkbox {
  width: clamp(70px, min(10vw, 10vh), 100px);
  height: clamp(70px, min(10vw, 10vh), 100px);
}

.checkbox-group.grid-layout .image-container {
  width: clamp(100px, min(18vw, 18vh), 190px);
  height: clamp(100px, min(18vw, 18vh), 190px);

  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6px solid transparent;
  border-radius: clamp(4px, 1vw, 12px);
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.checkbox-group.grid-layout[style*="--option-count='4'"] .image-container {
  width: clamp(55px, 8vw, 85px);
  height: clamp(55px, 8vh, 85px);
}

.checkbox-group.grid-layout .image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

::ng-deep .checkbox-group.grid-layout mat-checkbox .mdc-checkbox {
  display: none !important;
}

::ng-deep .checkbox-group.grid-layout mat-checkbox .mat-mdc-checkbox {
  display: flex !important;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.checkbox-group.row-layout {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  gap: clamp(0.25rem, 2vw, 1rem);
  padding: 0.75rem;
  width: 100%;
  height: 100%;
  max-width: 95%;
  margin: 0 auto;
  box-sizing: border-box;
}

.checkbox-group.row-layout mat-checkbox {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100%;
  height: 100%;
  min-width: 0;
  padding: 0.25rem;
  max-width: none;
}

::ng-deep .checkbox-group.row-layout mat-checkbox .mdc-checkbox {
  display: none !important;
}

::ng-deep .checkbox-group.row-layout mat-checkbox .mat-mdc-checkbox {
  display: flex !important;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.checkbox-group.row-layout .image-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 6px solid transparent;
  border-radius: 8px;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  height: 100%;
  min-height: 80px;
  aspect-ratio: 1 / 1;
  min-width: 0;
}

.checkbox-group.row-layout .image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  cursor: pointer;
}

.interaction-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: clamp(0.5rem, 2vw, 2rem);
}

.interaction-container:has(.checkbox-group[style*="--option-count='4'"]) {
  align-items: center;
  justify-content: center;
}

mat-checkbox.mat-mdc-checkbox-checked .image-container {
  border-color: #0050E5 !important;
}

mat-checkbox.mat-mdc-checkbox-checked .image-container img {
  transform: scale(1.02);
}

:host {
  display: block;
  width: 100%;
  height: 100%;
}

@media (max-width: 1023px) and (orientation: landscape) {
  .checkbox-group.row-layout {
    gap: clamp(0.2rem, 1vw, 0.4rem);
    max-width: 90%;
    padding: 0.5rem;
  }

  .checkbox-group.row-layout .image-container {
    min-height: 75px;
  }
}

@media (max-width: 900px) {
  .checkbox-group.row-layout {
    gap: clamp(0.15rem, 0.8vw, 0.3rem);
    max-width: 95%;
    padding: 0.4rem;
  }

  .checkbox-group.row-layout .image-container {
    min-height: 70px;
  }
}

@media (orientation: landscape) and (min-width: 1500px) {
  .checkbox-group.row-layout {
    gap: clamp(0.5rem, 2.5vw, 1.2rem);
    max-width: 80%;
  }

  .checkbox-group.row-layout .image-container {
    min-height: 100px;
  }
}

.checkbox-group.grid-layout {
  &[style*="--option-count: 3"] mat-checkbox:last-child {
    grid-column: 1 / -1 !important;
    justify-self: center !important;
  }

  &[style*="--option-count: 5"] mat-checkbox:last-child {
    grid-column: 1 / -1 !important;
    justify-self: center !important;
  }

  &[style*="--option-count: 7"] mat-checkbox:last-child {
    grid-column: 1 / -1 !important;
    justify-self: center !important;
  }
}
```

## File: ./src/app/components/elements/interaction-selection/interaction-selection.component.ts

```ts
import { Component, input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

import {
  MultiChoiceImagesElement,
  RadioGroupImagesElement,
  ReducedKeyboardElement,
  SyllableCounterElement,
  RadioGroupTextElement,
  BinaryChoiceElement,
  UIElement
} from "../../../models";
import { UIElementType } from "../../../interfaces";
import { ElementComponent } from "../../../directives/element-component.directive";


@Component({
  selector: 'interaction-selection',
  templateUrl: './interaction-selection.component.html',
  styleUrls: ['./interaction-selection.component.scss'],
  standalone: false
})

export class InteractionSelectionComponent extends ElementComponent implements OnInit {
  elementModel = input.required<UIElement>();
  parentForm = input.required<FormGroup>();
  sectionVariant = input<string>('row_layout');
  elementType: UIElementType | undefined;

  stimulusTypes: UIElementType[] = [
    "radio-group-images",
    "multi-choice-images",
    "radio-group-text",
    "reduced-keyboard",
    "syllable-counter",
    "binary-choice"
  ];

  ngOnInit() {
    this.elementType = this.stimulusTypes.find(type => type === this.elementModel().type );
  }

  get elementModelAsRadioGroupImagesElement(): RadioGroupImagesElement {
    return this.elementModel() as RadioGroupImagesElement;
  }

  get elementModelAsMultiChoiceImagesElement(): MultiChoiceImagesElement {
    return this.elementModel() as MultiChoiceImagesElement;
  }

  get elementModelAsReducedKeyboardElement(): ReducedKeyboardElement {
    return this.elementModel() as ReducedKeyboardElement;
  }

  get elementModelAsSyllableCounterElement(): SyllableCounterElement {
    return this.elementModel() as SyllableCounterElement;
  }

  get elementModelAsRadioGroupTextElement(): RadioGroupTextElement {
    return this.elementModel() as RadioGroupTextElement;
  }

  get elementModelAsBinaryChoiceElement(): BinaryChoiceElement {
    return this.elementModel() as BinaryChoiceElement;
  }
}
```

## File: ./src/app/components/elements/interaction-selection/interaction-selection.component.html

```html
<div class="interaction-container">
  @switch (elementType) {
    @case ("radio-group-images") {
      <stars-radio-group-images
        [elementModel]="elementModelAsRadioGroupImagesElement"
        [parentForm]="parentForm()"
        [position]="'row'"
        [sectionVariant]="sectionVariant()"
        (valueChange)="valueChange.emit($event)"
      ></stars-radio-group-images>
    }
    @case ("radio-group-text") {
      <stars-radio-group-text
        [elementModel]="elementModelAsRadioGroupTextElement"
        [parentForm]="parentForm()"
        [position]="'row'"
        [sectionVariant]="sectionVariant()"
        (valueChange)="valueChange.emit($event)"
      ></stars-radio-group-text>
    }
    @case ("multi-choice-images") {
      <stars-multi-choice-images
        [elementModel]="elementModelAsMultiChoiceImagesElement"
        [parentForm]="parentForm()"
        [sectionVariant]="sectionVariant()"
        (valueChange)="valueChange.emit($event)"
      ></stars-multi-choice-images>
    }
    @case ("reduced-keyboard") {
      <stars-reduced-keyboard
        [elementModel]="elementModelAsReducedKeyboardElement"
        [parentForm]="parentForm()"
        (valueChange)="valueChange.emit($event)"
      ></stars-reduced-keyboard>
    }
    @case ("syllable-counter") {
      <stars-syllable-counter
        [elementModel]="elementModelAsSyllableCounterElement"
        [parentForm]="parentForm()"
        (valueChange)="valueChange.emit($event)"
      ></stars-syllable-counter>
    }
    @case ("binary-choice") {
      <stars-binary-choice
        [elementModel]="elementModelAsBinaryChoiceElement"
        [parentForm]="parentForm()"
        (valueChange)="valueChange.emit($event)"
      ></stars-binary-choice>
    }
    @default {
      Error: Unsupported ElementType
    }
  }
</div>
```

## File: ./src/app/components/elements/interaction-selection/interaction-selection.component.scss

```scss
.interaction-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.interaction-container > * {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}
```

## File: ./src/app/components/elements/audio.component.ts

```ts
import { Component, ElementRef, input, OnInit,OnDestroy, ViewChild } from '@angular/core';
import { AudioElement } from "../../models";
import { MediaPlayerElementComponent } from "../../directives/media-player-element-component.directive";

@Component({
  selector: 'stars-audio',
  template: `
    @if (elementModel().audioSrc) {
      <div class="audio-instruction-container">
        <div class="audio-button-wrapper">
          <stars-media-player [player]="player"
                              [playerId]="elementModel().id"
                              [isPlaying]="isPlaying"
                              (elementValueChanged)="valueChanged($event)"
                              [image]="elementModel().image">
            <audio #player
                   [src]="elementModel().audioSrc | safeResourceUrl"
                   (loadedmetadata)="onAudioLoaded()"
                   (play)="onPlay()"
                   (pause)="onPause()"
                   (ended)="onPause()"
                   (error)="throwError('audio-not-loading', $event.message)">
            </audio>
            <label>
              Audio
            </label>
          </stars-media-player>
        </div>

        @if (elementModel().text && elementModel().text.trim()) {
          <div class="audio-text-wrapper">
            <p class="audio-instruction-text" [innerHTML]="formatText(elementModel().text)"></p>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .audio-instruction-container {
      display: block;
      width: auto;
    }

    .audio-button-wrapper {
      display: block;
      width: auto;
      max-width: clamp(150px, 15vw, 300px);
      margin-bottom: 0.75rem;
    }

    .audio-text-wrapper {
      display: block;
      width: 100%;
      clear: both;
    }

    .audio-instruction-text {
      margin: 0;
      padding: 0;
      max-width: clamp(150px, 20vw, 250px);
      font-size: clamp(0.7rem, 2vw, 1rem);
      color: #000;
      text-align: center;
      line-height: 1.3;
      width: auto;
      word-wrap: break-word;
      font-style: italic;
      display: block;
    }

    @media (max-width: 768px) {
      .audio-instruction-text {
        font-size: 0.9rem;
        max-width: 200px;
      }

      .audio-button-wrapper {
        margin-bottom: 0.5rem;
      }
    }

    @media (max-height: 600px) {
      .audio-instruction-text {
        font-size: 0.85rem;
      }

      .audio-button-wrapper {
        margin-bottom: 0.5rem;
      }
    }
  `],
  standalone: false
})
export class AudioComponent extends MediaPlayerElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<AudioElement>();
  @ViewChild('player', { static: false }) audioElementRef!: ElementRef<HTMLAudioElement>;
  private static hasUserInteracted = false;
  private static firstTouchListenersAdded = false;
  private static currentOverlay: HTMLElement | null = null;
  private audioElement: HTMLAudioElement | null = null;
  isPlaying: boolean = false;

  ngOnInit() {
    // console.log(this.elementModel());
    if (!AudioComponent.firstTouchListenersAdded) {
      this.setupFirstTouchListeners();
    }
  }

  ngOnDestroy() {
    this.removeOverlay();
    super.ngOnDestroy();
  }

  onAudioLoaded() {
    this.isLoaded.next(true);
    setTimeout(() => {
      if (this.audioElementRef?.nativeElement) {
        this.audioElement = this.audioElementRef.nativeElement;
        console.log('Audio element found via ViewChild:', this.audioElement);
      } else {
        console.warn('Audio element not found via ViewChild');
      }
    }, 100);
  }

  onPlay() {
    this.isPlaying = true;
  }

  onPause() {
    this.isPlaying = false;
  }

  valueChanged(event) {
    // console.log(event);
  }

  private setupFirstTouchListeners(): void {
    AudioComponent.firstTouchListenersAdded = true;
    console.log('Setting up first touch listeners with overlay method');

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '9999';
    overlay.style.backgroundColor = 'transparent';
    overlay.style.cursor = 'pointer';
    AudioComponent.currentOverlay = overlay;
    document.body.appendChild(overlay);

    const handleFirstInteraction = (event: Event) => {

      if (!AudioComponent.hasUserInteracted) {
        AudioComponent.hasUserInteracted = true;

        if (this.audioElement) {
          this.audioElement.play().then(() => {
          }).catch(error => {
            console.warn('Could not play audio on first touch:', error);
          });
        } else {
          const audioElement = document.querySelector('audio') as HTMLAudioElement;
          if (audioElement) {
            audioElement.play().catch(error => {
              console.warn('Fallback audio play failed:', error);
            });
          }
        }
        this.removeOverlay();
      }
    };
    overlay.addEventListener('click', handleFirstInteraction, { capture: true });
    overlay.addEventListener('touchstart', handleFirstInteraction, { capture: true });
    overlay.addEventListener('touchend', handleFirstInteraction, { capture: true });
    overlay.addEventListener('pointerdown', handleFirstInteraction, { capture: true });
    overlay.addEventListener('mousedown', handleFirstInteraction, { capture: true });
  }

  private removeOverlay(): void {
    if (AudioComponent.currentOverlay && AudioComponent.currentOverlay.parentNode) {
      document.body.removeChild(AudioComponent.currentOverlay);
      AudioComponent.currentOverlay = null;
    }
  }

  static reset(): void {
    AudioComponent.hasUserInteracted = false;
    AudioComponent.firstTouchListenersAdded = false;

    if (AudioComponent.currentOverlay && AudioComponent.currentOverlay.parentNode) {
      document.body.removeChild(AudioComponent.currentOverlay);
      AudioComponent.currentOverlay = null;
    }
  }

  formatText(text: string): string {
    if (!text) return '';
    return text.replace(/\n/g, '<br>');
  }

  private sendPlaybackTimeChanged() {
    // if (this.currentTime > 0) {
    // this.valueChange.emit({
    //   id: this.elementModel().id,
    //   value: this.currentTime.toString(),
    //   status: "VALUE_CHANGED"
    // });
    // }
  }
}
```

## File: ./src/app/components/elements/button.component.ts

```ts
import {
  Component, EventEmitter, Input, Output
} from '@angular/core';
import { ButtonElement, ButtonEvent } from 'common/models/elements/button/button';
import { ElementComponent } from '../../directives/element-component.directive';

@Component({
  selector: 'aspect-button',
  template: `
    <a *ngIf="!elementModel.imageSrc && elementModel.asLink"
       href="{{elementModel.action+'-'+elementModel.actionParam}}"
       [style.background-color]="elementModel.styling.backgroundColor"
       [style.color]="elementModel.styling.fontColor"
       [style.font-size.px]="elementModel.styling.fontSize"
       [style.font-weight]="elementModel.styling.bold ? 'bold' : ''"
       [style.font-style]="elementModel.styling.italic ? 'italic' : ''"
       [style.text-decoration]="elementModel.styling.underline ? 'underline' : ''"
       pointerEventTooltip
       [tooltipPosition]="elementModel.tooltipPosition"
       [tooltipText]="elementModel.tooltipText"
       (click)="$event.preventDefault();
                elementModel.action && elementModel.actionParam !== null ?
                buttonActionEvent.emit($any({ action: elementModel.action, param: elementModel.actionParam})) :
                false">
      {{elementModel.label}}
    </a>

    <button *ngIf="!elementModel.imageSrc && !elementModel.asLink" mat-button
            type='button'
            class="full-size"
            [style.background-color]="elementModel.styling.backgroundColor"
            [style.color]="elementModel.styling.fontColor"
            [style.font-size]="elementModel.labelAlignment !== 'baseline' ?
                                'smaller' :
                                elementModel.styling.fontSize + 'px'"
            [style.font-style]="elementModel.styling.italic ? 'italic' : ''"
            [style.text-decoration]="elementModel.styling.underline ? 'underline' : ''"
            [style.border-width.px]="elementModel.styling.borderWidth"
            [style.border-style]="elementModel.styling.borderStyle"
            [style.border-color]="elementModel.styling.borderColor"
            [style.border-radius.px]="elementModel.styling.borderRadius"
            [style.vertical-align]="elementModel.labelAlignment"
            [style.font-weight]="elementModel.styling.bold ? 'bold' :
                                  elementModel.labelAlignment !== 'baseline' ?
                                    400 : ''"
            pointerEventTooltip
            [tooltipPosition]="elementModel.tooltipPosition"
            [tooltipText]="elementModel.tooltipText"
            (click)="elementModel.action && elementModel.actionParam !== null ?
                     buttonActionEvent.emit($any({ action: elementModel.action, param: elementModel.actionParam })) :
                     false">
      {{elementModel.label}}
    </button>

    <input *ngIf="elementModel.imageSrc"
           type="image"
           class="full-size image"
           [src]="elementModel.imageSrc | safeResourceUrl"
           [alt]="'imageNotFound' | translate"
           pointerEventTooltip
           [tooltipPosition]="elementModel.tooltipPosition"
           [tooltipText]="elementModel.tooltipText"
           (click)="elementModel.action !== null && elementModel.actionParam !== null?
                    buttonActionEvent.emit($any({ action: elementModel.action, param: elementModel.actionParam })) :
                    false">
  `,
  styles: [
    ':host {display: flex; width: 100%; height: 100%;}',
    '.full-size {width: 100%; height: 100%;}',
    '.image {object-fit: contain;}',
    '.mdc-button {min-width: unset;}'
  ]
})
export class ButtonComponent extends ElementComponent {
  @Input() elementModel!: ButtonElement;
  @Output() buttonActionEvent = new EventEmitter<ButtonEvent>();
}
```

## File: ./src/app/components/elements/instructions-selection/instructions-selection.component.scss

```scss
.instructions-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;
  padding: 0;
  box-sizing: border-box;
}
.instructions-container stars-audio {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}
.instructions-container stars-text,
.instructions-container stars-image {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}
```

## File: ./src/app/components/elements/instructions-selection/instructions-selection.component.html

```html
<div class="instructions-container">
  @switch (elementType) {
    @case ("text") {
      <stars-text
        [elementModel]="elementModelAsTextElement"
      ></stars-text>
    }
    @case ("image") {
      <stars-image
        [elementModel]="elementModelAsImageElement"
      ></stars-image>
    }
    @case ("audio") {
      <stars-audio
        [elementModel]="elementModelAsAudioElement"
      ></stars-audio>
    }
    @default {
      Error: Unsupported ElementType
    }
  }
</div>
```

## File: ./src/app/components/elements/instructions-selection/instructions-selection.component.ts

```ts
import { Component, input, OnInit } from "@angular/core";

import {
  ImageElement,
  TextElement,
  AudioElement,
  UIElement
} from "../../../models";
import { UIElementType } from "../../../interfaces";
import { ElementComponent } from "../../../directives/element-component.directive";


@Component({
  selector: 'instructions-selection',
  templateUrl: './instructions-selection.component.html',
  styleUrls: ['./instructions-selection.component.scss'],
  standalone: false
})

export class InstructionsSelectionComponent extends ElementComponent implements OnInit {
  elementModel = input.required<UIElement>();
  elementType: UIElementType | undefined;

  instructionsTypes: UIElementType[] = [
    "text",
    "image",
    "audio"
  ];

  ngOnInit() {
    this.elementType = this.instructionsTypes.find(type => type === this.elementModel().type );
  }

  get elementModelAsTextElement(): TextElement {
    return this.elementModel() as TextElement;
  }

  get elementModelAsImageElement(): ImageElement {
    return this.elementModel() as ImageElement;
  }

  get elementModelAsAudioElement(): AudioElement {
    return this.elementModel() as AudioElement;
  }
}
```

## File: ./src/app/components/elements/stimulus-selection/stimulus-selection.component.scss

```scss
.stimulus-container {
  display: flex;
  justify-content: center;
  height: 100%;
  overflow: hidden;
}

stars-image, stars-text {
  object-fit: contain;
  height: 100%;
}
```

## File: ./src/app/components/elements/stimulus-selection/stimulus-selection.component.ts

```ts
import { Component, input, OnInit } from "@angular/core";

import {
  ImageElement,
  TextElement,
  UIElement
} from "../../../models";
import { UIElementType } from "../../../interfaces";


@Component({
  selector: 'stimulus-selection',
  templateUrl: './stimulus-selection.component.html',
  styleUrls: ['./stimulus-selection.component.scss'],
  standalone: false
})

export class StimulusSelectionComponent implements OnInit {
  elementModel = input.required<UIElement>();
  elementType: UIElementType | undefined;

  stimulusTypes: UIElementType[] = [
    "text",
    "image"
  ];

  ngOnInit() {
    this.elementType = this.stimulusTypes.find(type => type === this.elementModel().type );
  }

  get elementModelAsTextElement(): TextElement {
    return this.elementModel() as TextElement;
  }

  get elementModelAsImageElement(): ImageElement {
    return this.elementModel() as ImageElement;
  }
}
```

## File: ./src/app/components/elements/stimulus-selection/stimulus-selection.component.html

```html
<div class="stimulus-container">
  @switch (elementModel().type) {
    @case ("text") {
      <stars-text
        [elementModel]="elementModelAsTextElement"
        [position]="center"
      ></stars-text>
    }
    @case ("image") {
      <stars-image
        [elementModel]="elementModelAsImageElement"
      ></stars-image>
    }
    @default {
      Error: Unsupported ElementType
    }
  }
</div>
```

## File: ./src/app/components/elements/media-player/media-player.component.scss

```scss
.custom-audio-button {
  display: inline-flex;
  justify-content: flex-start;
  align-items: flex-start;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  width: auto;
  height: auto;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .speaker-icon {
    width: auto;
    height: auto;
    max-width: min(200px, 25vw, 20vh);
    max-height: min(200px, 25vh, 20vh);
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    & > svg {
      width: 100% !important;
      height: 100% !important;
      display: block;
    }
  }
}

@media (min-width: 1024px) {
  .custom-audio-button {
    .speaker-icon {
      max-width: min(220px, 28vw, 25vh);
      max-height: min(220px, 28vh, 25vh);
    }
  }
}

@media (min-width: 1440px) {
  .custom-audio-button {
    .speaker-icon {
      max-width: min(250px, 25vw, 22vh);
      max-height: min(250px, 25vh, 22vh);
    }
  }
}

@media (max-width: 1023px) and (min-width: 769px) {
  .custom-audio-button {
    .speaker-icon {
      max-width: min(180px, 28vw, 18vh);
      max-height: min(180px, 28vh, 18vh);
    }
  }
}

@media (max-width: 768px) {
  .custom-audio-button {
    .speaker-icon {
      max-width: min(140px, 35vw, 15vh);
      max-height: min(140px, 35vh, 15vh);
    }
  }
}

.custom-audio-button .speaker-icon {
  width: clamp(120px, 20vw, 250px);
  height: clamp(80px, 15vw, 180px);
  margin: 0;
  overflow: visible;

  --scale-factor: clamp(4, calc(4 + 5vw / 100), 8);

  & > svg {
    width: 100% !important;
    height: 100% !important;
    transform: scale(var(--scale-factor));
    transform-origin: center;
  }
}
```

## File: ./src/app/components/elements/media-player/media-player.component.html

```html
@if (image()) {
  <div class="custom-audio-button" (click)="play()">
    <img [src]="audioIconSrc" [alt]="isPlaying() ? 'Audio playing' : 'Play audio'" />
  </div>
} @else {
  <div class="custom-audio-button" (click)="play()">
    <img [src]="audioIconSrc"
         [alt]="isPlaying() ? 'Audio playing' : 'Play audio'"
         class="speaker-icon" />
  </div>
}
```

## File: ./src/app/components/elements/media-player/media-player.component.ts

```ts
import {Component, input, OnDestroy, OnInit, output} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ImageElement} from "../../../models";
import {fromEvent, Subject, tap, throttleTime} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {MediaChangeItem, MediaPlayerService} from '../../../services/media-player-service';

@Component({
  selector: 'stars-media-player',
  template: `
    @if (image()) {
      <div class="custom-audio-button" (click)="play()">
        <div [innerHTML]="audioIconSvg" class="speaker-icon"></div>
      </div>
    } @else {
      <div class="custom-audio-button" (click)="play()">
        <div [innerHTML]="audioIconSvg" class="speaker-icon"></div>
      </div>
    }
  `,
  styleUrls: ['./media-player.component.scss'],
  standalone: false
})
export class MediaPlayerComponent implements OnInit, OnDestroy {
  player = input.required<HTMLAudioElement>();
  playerId = input<string>();
  image = input<ImageElement>();
  isPlaying = input<boolean>(false);
  elementValueChanged = output();

  currentTime = 0;
  private ngUnsubscribe = new Subject<void>();


  private staticSvg = `
<svg width="200" height="112" viewBox="0 0 316 112" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g filter="url(#filter0_d_12_188)">
    <rect x="0.503906" y="0.943359" width="78" height="78.2128" rx="39" fill="white" shape-rendering="crispEdges"/>
    <g clip-path="url(#clip0_12_188)">
      <path d="M27.6744 25.0836C28.301 24.2986 28.3101 23.1534 27.601 22.4421C26.8888 21.7278 25.7247 21.723 25.0803 22.4989C22.1911 25.9773 20.4541 30.4532 20.4541 35.3399C20.4541 40.2266 22.1911 44.7024 25.0803 48.1808C25.7247 48.9567 26.8888 48.9518 27.6009 48.2376C28.3101 47.5263 28.3009 46.381 27.6743 45.5961C25.4301 42.7848 24.0915 39.2193 24.0915 35.34C24.0915 31.4606 25.4303 27.8949 27.6744 25.0836Z" fill="#101C61"/>
      <path d="M45.9163 55.4059C45.398 55.4059 44.8887 55.2965 44.525 55.1322C43.2428 54.4481 42.3152 53.5179 41.4149 50.7815C40.4783 47.945 38.7414 46.6042 37.059 45.2999C35.6223 44.1871 34.1309 43.0378 32.8487 40.6937C31.8938 38.9426 31.3665 37.0361 31.3665 35.3398C31.3665 30.2229 35.3586 26.2188 40.4601 26.2188C44.9426 26.2188 48.5687 29.3101 49.3826 33.5314C49.5728 34.5177 50.3681 35.3398 51.3726 35.3398C52.377 35.3398 53.2047 34.521 53.0693 33.5257C52.2158 27.2546 46.9835 22.5704 40.4602 22.5704C33.3217 22.5704 27.729 28.1798 27.729 35.3398C27.729 37.6475 28.4201 40.1739 29.6659 42.4541C31.321 45.4731 33.2762 46.9781 34.8493 48.2002C36.3225 49.3404 37.3864 50.1614 37.9684 51.9307C39.0596 55.2418 40.4691 57.1113 42.9245 58.4065C43.8702 58.8352 44.8705 59.0543 45.9163 59.0543C49.3074 59.0543 52.1653 56.7128 52.967 53.5578C53.2144 52.5843 52.3769 51.7574 51.3725 51.7574C50.368 51.7574 49.5916 52.62 49.1118 53.5025C48.4951 54.6367 47.2957 55.4059 45.9163 55.4059Z" fill="#101C61"/>
      <path d="M46.013 35.3879C39.3769 36.1719 41.499 45.5537 47.7555 44.6763" stroke="#101C61" stroke-width="3.12851" stroke-linecap="round"/>
    </g>
  </g>
  <defs>
    <filter id="filter0_d_12_188" x="0.503906" y="0.943359" width="85.8213" height="86.034" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feMorphology radius="3.12851" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_12_188"/>
      <feOffset dx="4.69277" dy="4.69277"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.109804 0 0 0 0 0.380392 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_12_188"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_12_188" result="shape"/>
    </filter>
    <clipPath id="clip0_12_188">
      <rect width="38.3243" height="39.1064" fill="white" transform="translate(20.3418 20.4966)"/>
    </clipPath>
  </defs>
</svg>

  `;

  private animatedSvg = `
<svg width="200" height="112" viewBox="0 0 316 112" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0.72168" y="0.943359" width="78" height="78" rx="39" fill="#0050E5"/>
  <g clip-path="url(#clip0_12_154)">
    <path d="M27.8936 24.9789C28.5201 24.194 28.5292 23.0489 27.8202 22.3377C27.1081 21.6235 25.9441 21.6187 25.2997 22.3945C22.4109 25.8725 20.6741 30.3479 20.6741 35.234C20.6741 40.1202 22.4109 44.5955 25.2997 48.0735C25.9441 48.8493 27.1081 48.8445 27.8201 48.1303C28.5292 47.4191 28.52 46.2739 27.8935 45.4891C25.6495 42.6782 24.3111 39.1131 24.3111 35.2341C24.3111 31.3552 25.6497 27.7899 27.8936 24.9789Z" fill="white"/>
    <path d="M46.1333 55.2977C45.615 55.2977 45.1058 55.1882 44.7421 55.0239C43.4601 54.3399 42.5326 53.4098 41.6324 50.6737C40.6958 47.8375 38.9592 46.4969 37.277 45.1928C35.8404 44.0801 34.3491 42.9309 33.0671 40.587C32.1124 38.8362 31.5851 36.9299 31.5851 35.2337C31.5851 30.1174 35.5767 26.1137 40.6777 26.1137C45.1597 26.1137 48.7853 29.2048 49.5992 33.4256C49.7894 34.4118 50.5846 35.2337 51.5889 35.2337C52.5933 35.2337 53.4209 34.415 53.2855 33.4198C52.4321 27.1494 47.2004 22.4658 40.6778 22.4658C33.54 22.4658 27.948 28.0745 27.948 35.2337C27.948 37.5412 28.639 40.0673 29.8847 42.3472C31.5396 45.3659 33.4945 46.8707 35.0675 48.0927C36.5405 49.2328 37.6044 50.0537 38.1863 51.8228C39.2774 55.1335 40.6867 57.0029 43.1418 58.2979C44.0874 58.7266 45.0876 58.9456 46.1333 58.9456C49.524 58.9456 52.3816 56.6044 53.1832 53.4497C53.4305 52.4763 52.5932 51.6495 51.5888 51.6495C50.5845 51.6495 49.8082 52.512 49.3284 53.3944C48.7118 54.5285 47.5125 55.2977 46.1333 55.2977Z" fill="white"/>
    <path d="M46.2302 35.2816C39.5948 36.0656 41.7167 45.4464 47.9725 44.5691" stroke="white" stroke-width="4" stroke-linecap="round"/>
  </g>
  <path d="M99.0703 37.5693L99.0703 42.3166" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
  <path d="M273.876 31.8408L273.876 48.0443" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
  <path d="M137.916 37.5303L137.916 42.3556" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
  <path d="M176.762 37.5303L176.762 42.3556" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
  <path d="M312.721 34.8242L312.721 45.0613" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
  <path d="M196.185 31.8418L196.185 48.0439" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
  <path d="M215.607 16.9946L215.607 62.891" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
  <path d="M254.453 20.2134L254.453 59.6721" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
  <path d="M235.03 20.2139L235.03 59.6719" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
  <path d="M118.493 26.1523L118.493 53.7336" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
  <path d="M157.339 28.9502L157.339 50.9358" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
  <path d="M186.473 34.8242L186.473 45.0611" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
  <path d="M225.319 10.0479L225.319 69.8379" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
  <path d="M264.165 34.4463L264.165 45.4391" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
  <path d="M108.782 37.5308L108.782 42.3545" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
  <path d="M283.587 27.6274L283.587 52.2579" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
  <path d="M128.205 34.8247L128.205 45.061" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
  <path d="M167.05 20.4678L167.05 59.4181" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
  <path d="M303.01 31.8413L303.01 48.0442" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
  <path d="M147.627 34.8252L147.627 45.0608" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
  <path d="M205.896 25.4404L205.896 54.4455" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
  <path d="M244.742 33.4287L244.742 46.4569" stroke="#101C61" stroke-width="5" stroke-linecap="square"/>
  <path d="M293.298 34.8247L293.298 45.061" stroke="#0050E5" stroke-width="5" stroke-linecap="square"/>
  <defs>
    <clipPath id="clip0_12_154">
      <rect width="38.32" height="39.102" fill="white" transform="translate(20.5618 20.3923)"/>
    </clipPath>
  </defs>
</svg>

  `;

  constructor(
    private mediaPlayerService: MediaPlayerService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    fromEvent(this.player(), 'timeupdate')
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(() => {
          this.currentTime = this.player().currentTime / 60;
        }),
        throttleTime(100)
      )
      .subscribe(() => this.sendPlaybackTimeChanged());
  }

  ngOnDestroy() {
    this.pause();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private scaleUpSvgContent(baseSvg: string, scale: number = 2): string {
    // First, make the SVG container responsive
    let scaledSvg = baseSvg
      .replace(/width="316"/, 'width="100%"')
      .replace(/height="112"/, 'height="100%"')
      .replace(/width="316"/, 'width="100%"'); // For the second SVG if needed

    // Add a transform group right after the opening <svg> tag to scale all content
    scaledSvg = scaledSvg.replace(
      /(<svg[^>]*>)/,
      `$1\n  <g transform="scale(${scale})">`
    );

    // Close the group before the closing </svg> tag
    scaledSvg = scaledSvg.replace(
      /<\/svg>/,
      '  </g>\n</svg>'
    );

    return scaledSvg;
  }

  get audioIconSvg(): SafeHtml {
    const baseSvg = this.isPlaying() ? this.animatedSvg : this.staticSvg;
    return this.sanitizer.bypassSecurityTrustHtml(baseSvg);
  }

  play(): void {
    this.player()
      .play()
      .then(() => this.sendPlaybackTimeChanged());
  }

  pause(): void {
    this.sendPlaybackTimeChanged();
    this.player().pause();
  }

  sendPlaybackTimeChanged(): void {
    this.mediaPlayerService.changeDuration(
      new MediaChangeItem(this.player().currentTime)
    );
  }
}
```

## File: ./src/app/components/elements/checkbox.component.ts

```ts
import { Component, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";

import { CheckboxElement } from "../../models";
import { ElementComponent } from "../../directives/element-component.directive";


@Component({
  selector: 'aspect-checkbox',
  template: `
    @if (elementModel) {
      <mat-form-field>
        <mat-checkbox #checkbox class="example-margin"
                      [checked]="$any(elementModel().value)"
                      (change)="valueChanged($event)">
          <div [innerHTML]="elementModel().label"></div>
        </mat-checkbox>
      </mat-form-field>
    }
  `,
  standalone: false
})

export class CheckboxComponent extends ElementComponent implements OnInit, OnDestroy {
  elementModel = input.required<CheckboxElement>();

  ngOnInit() {
    // this.elementFormControl = new FormControl(this.elementModel().value);
    // this.parentForm().addControl(this.elementModel().id, this.elementFormControl, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this.parentForm().removeControl(this.elementModel().id);
  }

  valueChanged($event) {
    // this.valueChange.emit($event);
  }
}
```

## File: ./src/app/components/layouts/pic-text-layout/pic-text-layout.component.ts

```ts
import { Component, input, output } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { UIElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse } from "../../../models/verona";


@Component({
  selector: 'pic-text-layout',
  templateUrl: './pic-text-layout.component.html',
  styleUrls: ['./pic-text-layout.component.scss'],
  standalone: false
})

export class PicTextLayoutComponent extends ElementComponent {
  instructions = input<UIElement>();
  interaction = input<UIElement>();
  stimulus = input<UIElement>();
  parentForm = input.required<FormGroup>();
  valueChange = output<VeronaResponse>();
}
```

## File: ./src/app/components/layouts/pic-text-layout/pic-text-layout.component.scss

```scss
```

## File: ./src/app/components/layouts/pic-text-layout/pic-text-layout.component.html

```html
<div class="pic-text container">
  <div class="row">
    @if (stimulus()) {
      <stimulus-selection [elementModel]="stimulus()">

      </stimulus-selection>
    }
    @if (interaction()) {
      <interaction-selection
        [elementModel]="interaction()"
        [parentForm]="parentForm()"
        (valueChange)="valueChange.emit($event)">

      </interaction-selection>
    }
  </div>
</div>
```

## File: ./src/app/components/layouts/pic-pic-layout/pic-pic-layout.component.scss

```scss
// Fixed pic-pic-layout.component.scss

.top {
  grid-area: stimulus;
  grid-column: 1 / -1;
  justify-self: center;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 25vh;
  min-height: 80px;
  padding: 0 5%;
  margin-top: 4vh;
}

.container {
  display: grid;
  width: 100vw;
  height: 100vh;
  padding: 0.75rem;
  gap: 0.75rem;
  box-sizing: border-box;
  overflow: hidden;

  grid-template-columns: max-content 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "instructions stimulus"
    "instruction  interaction";
}

.container.no-stimulus {
  grid-template-columns: max-content 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "instructions interaction";

  .middle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
}

.side {
  grid-area: instructions;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0.5rem;
  width: auto;
}

.middle {
  grid-area: interaction;
  grid-column: 1 / -1;
  justify-self: center;
  overflow: hidden;
  padding: 0 10%;

  display: flex;
  align-items: center;
  justify-content: center;
}

@media (orientation: portrait) {
  .container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    grid-template-areas:
      "instructions"
      "stimulus"
      "interaction";
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .container.no-stimulus {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "instructions"
      "interaction";

    .side {
      align-items: center;
    }
  }

  .side {
    padding: 0.25rem;
    min-height: 60px;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .top {
    min-height: 100px;
  }
}


.side > *, .top > *, .middle > * {
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
}

.top > stimulus-selection,
.side > instructions-selection {
  display: flex;
  align-items: center;
  justify-content: center;
}

.side > instructions-selection {
  align-items: flex-start;
  justify-content: flex-start;
}
```

## File: ./src/app/components/layouts/pic-pic-layout/pic-pic-layout.component.ts

```ts
import { Component, input, output } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { UIElement } from "../../../models";
import { ElementComponent } from "../../../directives/element-component.directive";
import { VeronaResponse } from "../../../models/verona";


@Component({
  selector: 'pic-pic-layout',
  templateUrl: './pic-pic-layout.component.html',
  styleUrls: ['./pic-pic-layout.component.scss'],
  standalone: false
})

export class PicPicLayoutComponent extends ElementComponent {
  instructions = input<UIElement>();
  interaction = input<UIElement>();
  stimulus = input<UIElement>();
  parentForm = input.required<FormGroup>();
  variant = input<string>('row_layout');
  valueChange = output<VeronaResponse>();
}
```

## File: ./src/app/components/layouts/pic-pic-layout/pic-pic-layout.component.html

```html
<!-- Updated pic-pic-layout.component.html -->

<div class="pic-pic container"
     [class.no-stimulus]="!stimulus()"
     [class.large-interaction]="!stimulus()">

  <div class="side">
    @if (instructions()) {
      <instructions-selection
        [elementModel]="instructions()"
        (valueChange)="valueChange.emit($event)">
      </instructions-selection>
    }
  </div>

  <!-- Only render the stimulus area if stimulus exists -->
  @if (stimulus() && stimulus().position == "top") {
    <div class="top">
      <stimulus-selection [elementModel]="stimulus()">
      </stimulus-selection>
    </div>
  }

  <div class="middle">
    @if (interaction()) {
      <interaction-selection
        [elementModel]="interaction()"
        [parentForm]="parentForm()"
        [sectionVariant]="variant()"
        (valueChange)="valueChange.emit($event)">
      </interaction-selection>
    }
  </div>
</div>
```

## File: ./src/app/components/index.ts

```ts
import {bindCallback} from "rxjs";
import {BinaryChoiceElement} from "../models";

export { UnitComponent } from './unit/unit.component';
export { SectionComponent } from './section/section.component';
export { UnitMenuComponent } from './menu/unit-menu.component';

export { PicPicLayoutComponent } from './layouts/pic-pic-layout/pic-pic-layout.component';
export { PicTextLayoutComponent } from './layouts/pic-text-layout/pic-text-layout.component';

export { StimulusSelectionComponent } from './elements/stimulus-selection/stimulus-selection.component'
export { InteractionSelectionComponent } from './elements/interaction-selection/interaction-selection.component'
export { InstructionsSelectionComponent } from './elements/instructions-selection/instructions-selection.component'

export { TextComponent } from './elements/text.component';
export { ImageComponent } from './elements/image.component';
export { CheckboxComponent } from './elements/checkbox.component';
export { RadioGroupImagesComponent } from './elements/radio-group-images/radio-group-images.component';
export { MultiChoiceImagesComponent } from './elements/multi-choice-images/multi-choice-images.component';
export { AudioComponent } from './elements/audio.component';
export { MediaPlayerComponent } from './elements/media-player/media-player.component';
export { ReducedKeyboardComponent } from './elements/reduced-keyboard/reduced-keyboard.component';
export { SyllableCounterComponent} from './elements/syllable-counter/syllable-counter.component';
export { BinaryChoiceComponent } from './elements/binary-choice/binary-choice.component';
```

## File: ./src/app/components/unit/unit.component.html

```html
<ng-content></ng-content>
@for (section of this.sections; track section) {
  <stars-section [section]="section"
                 (valueChange)="valueChanged($event)">
  </stars-section>

  <stars-unit-nav-next *ngIf="shouldShowUnitNavNext" (navigate)="navigateToNext()"></stars-unit-nav-next>
}
```

## File: ./src/app/components/unit/unit.component.ts

```ts
import { ChangeDetectorRef, Component, OnDestroy, OnInit, output, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  PlayerConfig,
  Progress, VeronaResponse,
  VopPlayerConfigChangedNotification,
  VopStartCommand
} from '../../models/verona';
import { VeronaSubscriptionService } from '../../services/verona-subscription.service';
import { VeronaPostService } from '../../services/verona-post.service';
import { MetaDataService } from '../../services/meta-data.service';
import { UnitStateService } from '../../services/unit-state.service';
import { StateVariableStateService } from '../../services/state-variable-state.service';
import { InstantiationError } from '../../errors';
import { Section } from "../../models/section";
import {Unit, UnitNavNextButtonMode} from "../../models/unit";
import { LogService } from "../../services/log.service";
import { AudioComponent } from "../elements/audio.component";

@Component({
  selector: 'stars-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss'],
  standalone: false
})
export class UnitComponent implements OnInit, OnDestroy {
  sections: Section[] = [];
  playerConfig: PlayerConfig = {};
  navNextButtonMode: UnitNavNextButtonMode = 'always'
  valueChange = output<VeronaResponse>();

  presentationProgressStatus: BehaviorSubject<Progress> = new BehaviorSubject<Progress>('none');

  constructor(
    private metaDataService: MetaDataService,
    private veronaPostService: VeronaPostService,
    private veronaSubscriptionService: VeronaSubscriptionService,
    private changeDetectorRef: ChangeDetectorRef,
    private unitStateService: UnitStateService,
    private stateVariableStateService: StateVariableStateService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.veronaSubscriptionService.vopStartCommand
      .subscribe((message: VopStartCommand) => this.configureUnit(message));
    this.veronaSubscriptionService.vopPlayerConfigChangedNotification
      .subscribe((message: VopPlayerConfigChangedNotification) => this.setPlayerConfig(message.playerConfig || {}));
  }

  ngOnDestroy(): void {
    // Cleanup is handled by AppComponent
  }

  private configureUnit(message: VopStartCommand): void {
    this.reset();
    setTimeout(() => {
      if (message.unitDefinition) {
        try {
          const unitDefinition = JSON.parse(message.unitDefinition as string);

          this.checkUnitDefinitionVersion(unitDefinition);
          const unit: Unit = new Unit(unitDefinition);

          this.initElementCodes(message, unit);
          this.applyBackgroundColor(unit.backgroundColor);

          this.sections = unit.sections;
          this.navNextButtonMode = unit.navNextButtonMode;
          this.setPlayerConfig(message.playerConfig || {});
          this.metaDataService.resourceURL = this.playerConfig.directDownloadUrl;
          this.veronaPostService.sessionID = message.sessionId;

          this.presentationProgressStatus.next('some');

          this.changeDetectorRef.detectChanges();
        } catch (e: unknown) {
          console.error('Unit configuration error:', e);
          if (e instanceof InstantiationError) {
            console.error('Failing element blueprint:', e.faultyBlueprint);
            this.showErrorDialog('unitDefinitionIsNotReadable');
          } else if (e instanceof Error) {
            this.showErrorDialog(e.message);
          } else {
            this.showErrorDialog('unitDefinitionIsNotReadable');
          }
        }
      } else {
        LogService.warn('No unit definition in message');
      }
    });
  }

  get shouldShowUnitNavNext(): boolean {
    switch (this.navNextButtonMode) {
      case 'always':
        return true;
      case 'onInteraction':
        return this.hasUserProvidedInput();
      default:
        return false;
    }
  }

  private applyBackgroundColor(backgroundColor?: string): void {
    if (backgroundColor) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', backgroundColor);
      this.renderer.setStyle(document.body, 'background-color', backgroundColor);
    } else {
      this.renderer.removeStyle(this.elementRef.nativeElement, 'background-color');
      this.renderer.removeStyle(document.body, 'background-color');
    }
  }

  private setPlayerConfig(playerConfig: PlayerConfig): void {
    this.playerConfig = playerConfig;
  }

  private checkUnitDefinitionVersion(unitDefinition: Record<string, unknown>): void {
    // Implement version checking if needed
  }

  private initElementCodes(message: VopStartCommand, unit: Unit): void {
    const existingElementCodes = message.unitState?.dataParts?.elementCodes ?
      JSON.parse(message.unitState.dataParts.elementCodes) : [];

    const elementIdentifiers = unit.getAllElements().map(element => ({
      id: element.id,
      alias: element.alias || element.id
    }));

    this.unitStateService.setElementCodes(existingElementCodes, elementIdentifiers);

    const existingStateVariableCodes = message.unitState?.dataParts?.stateVariableCodes ?
      JSON.parse(message.unitState.dataParts.stateVariableCodes) : [];

    const stateVariableIdentifiers = unit.stateVariables.map(stateVariable => ({
      id: stateVariable.id,
      alias: stateVariable.alias
    }));

    this.stateVariableStateService.setElementCodes(existingStateVariableCodes, stateVariableIdentifiers);

    unit.stateVariables.forEach(stateVariable => {
      this.stateVariableStateService.registerElementCode(
        stateVariable.id,
        stateVariable.alias,
        stateVariable.value
      );
    });
  }

  private hasUserProvidedInput(): boolean {
    const responses = this.unitStateService.getResponses();
    return responses.some(response => {
      return response.value !== null &&
        response.value !== undefined &&
        response.value !== '' &&
        response.status !== 'UNSET';
    });
  }

  private showErrorDialog(text: string): void {
    console.error('🚨 Error:', text);
    // TODO: Implement proper error dialog
  }

  navigateToNext(): void {
    this.veronaPostService.sendVopUnitNavigationRequestedNotification('next');
  }

  private reset(): void {
    this.presentationProgressStatus.next('none');
    this.sections = [];
    this.playerConfig = {};
    this.navNextButtonMode = 'always'
    this.unitStateService.reset();
    this.stateVariableStateService.reset();

    this.applyBackgroundColor();
    AudioComponent.reset()

    this.changeDetectorRef.detectChanges();
  }

  valueChanged(event: VeronaResponse): void {
    this.valueChange.emit(event);
  }
}
```

## File: ./src/app/components/unit/unit.component.scss

```scss

:host {
  display: block;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

// Ensure sections don't cause overflow
::ng-deep stars-section {
  display: block;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
```

## File: ./src/app/components/menu/unit-menu.component.scss

```scss
.start-page {
  display: flex;
  padding: 0 50px;
}
```

## File: ./src/app/components/menu/unit-menu.component.ts

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FileService } from '../../services/file.service';
import {
  UnitState,
  VopPageNavigationCommand,
  VopPlayerConfigChangedNotification,
  VopStartCommand
} from '../../models/verona';


@Component({
  selector: 'stars-unit-menu',
  templateUrl: './unit-menu.component.html',
  styleUrls: ['./unit-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})

export class UnitMenuComponent {
  private postTarget: Window = window;

  private vopStartCommandMessage: VopStartCommand = {
    type: 'vopStartCommand',
    sessionId: 'load',
    unitDefinition: undefined,
    playerConfig: {
      pagingMode: undefined
    },
    unitState: undefined
  };

  async load(): Promise<void> {
    await FileService.loadFile(['.json', '.voud']).then(unitDefinition => {
      this.loadUnit(unitDefinition.content, {});
    });
  }

  private loadUnit(unitDefinition: string, unitSate: UnitState): void {
    this.vopStartCommandMessage.unitDefinition = unitDefinition;
    this.postMessage(this.vopStartCommandMessage);
  }

  private postMessage(message: VopStartCommand | VopPageNavigationCommand | VopPlayerConfigChangedNotification): void {
    this.postTarget.postMessage(message, '*');
  }
}
```

## File: ./src/app/components/menu/unit-menu.component.html

```html
<button mat-icon-button
        [matMenuTriggerFor]="menu">
  <mat-icon>more_vert</mat-icon>
</button>

<mat-menu #menu="matMenu">
  <button mat-menu-item
          (click)="load()">
    <mat-icon>file_upload</mat-icon>
    <span>Load Unit File</span>
  </button>
</mat-menu>
```

## File: ./src/app/components/unit-nav-next.component.ts

```ts
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'stars-unit-nav-next',
  standalone: true,
  imports: [],
  template: `
    <div class="unit-nav-next fx-row-end-center">
      <span class="svg-container" (click)="navigate.emit()">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_12_133)">
<rect x="0.932617" y="0.621094" width="70" height="70" rx="35" fill="#0050E5" shape-rendering="crispEdges"/>
<path d="M50.1328 35.621L20.1328 35.621" stroke="white" stroke-width="5" stroke-linecap="round"/>
<path d="M38.7324 22.621L51.7325 35.6211L38.7324 48.6212" stroke="white" stroke-width="5" stroke-linecap="round"/>
</g>
<defs>
<filter id="filter0_d_12_133" x="0.932617" y="0.621094" width="79" height="79" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feMorphology radius="4" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_12_133"/>
<feOffset dx="5" dy="5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.109804 0 0 0 0 0.380392 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_12_133"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_12_133" result="shape"/>
</filter>
</defs>
</svg>

      </span>
    </div>
  `,
  styles: `
    .unit-nav-next {
      font-size: 20px;
      position: absolute;
      bottom: 20px;
      right: 20px;
      z-index: 100;
    }
    .button-text {
      margin-bottom: 6px;
      margin-right: 15px;
    }
    .unit-nav-next .svg-container {
      vertical-align: middle;
      margin: 5px;
    }
    .unit-nav-next .svg-container:hover {
      filter: brightness(90%);
    }
  `
})
export class UnitNavNextComponent {
  @Output() navigate = new EventEmitter();
}
```

## File: ./src/app/errors.ts

```ts
import { UIElementProperties } from './interfaces';

export class IDError extends Error {
  constructor(message: string, public code?: number) {
    super(message);
    this.name = 'IDError';
  }
}

/* Custom Error to show the element blueprint that failed validation. */
export class InstantiationError extends Error {
  faultyBlueprint: Partial<UIElementProperties> | undefined;

  constructor(message: string, faultyBlueprint?: Partial<UIElementProperties>) {
    super(message);
    this.faultyBlueprint = faultyBlueprint;
  }
}
```

## File: ./src/app/app.component.ts

```ts
import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, Subject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VeronaPostService } from './services/verona-post.service';
import { NativeEventService } from './services/native-event.service';
import { MetaDataService } from './services/meta-data.service';
import { VeronaSubscriptionService } from "./services/verona-subscription.service";
import { UnitStateService } from './services/unit-state.service';
import { StateVariableStateService } from './services/state-variable-state.service';
import { ValidationService } from './services/validation.service';
import { UnitState, UnitStateDataType, VeronaResponse, Progress } from "./models/verona";
import { LogService } from './services/log.service';

@Component({
  selector: 'stars-player',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  isStandalone: boolean;
  private ngUnsubscribe = new Subject<void>();
  valueChanged = new Subject<VeronaResponse>();
  form = new FormGroup({});
  unit: {} = {};

  // Presentation progress tracking
  presentationProgressStatus: Subject<Progress> = new Subject<Progress>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private nativeEventService: NativeEventService,
    private veronaPostService: VeronaPostService,
    private veronaSubscriptionService: VeronaSubscriptionService,
    private metaDataService: MetaDataService,
    private unitStateService: UnitStateService,
    private stateVariableStateService: StateVariableStateService,
    private validationService: ValidationService
  ) {
    this.isStandalone = window === window.parent;
  }

  ngOnInit(): void {
    this.veronaPostService.sendReadyNotification(this.metaDataService.playerMetadata);

    this.nativeEventService.focus
      .subscribe((isFocused: boolean) => this.veronaPostService
        .sendVopWindowFocusChangedNotification(isFocused));

    merge(
      this.unitStateService.elementCodeChanged,
      this.stateVariableStateService.elementCodeChanged,
      this.unitStateService.pagePresented
    )
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(100)
      )
      .subscribe(() => {
        this.sendVopStateChangedNotification();
      });

    this.valueChanged
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(50)
      )
      .subscribe(($event) => {
        LogService.debug('Value changed:', $event);
      });
  }

  ngOnDestroy(): void {
    this.sendVopStateChangedNotification();
    this.unitStateService.reset();
    this.stateVariableStateService.reset();
    this.validationService.reset();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private sendVopStateChangedNotification(): void {
    if (this.isStandalone) {
      console.log('🔄 State update (standalone mode)');
      console.log('📊 Unit State Responses:', this.unitStateService.getResponses());
      console.log('🔧 State Variable Responses:', this.stateVariableStateService.getResponses());
      return;
    }

    const unitState: UnitState = {
      unitStateDataType: UnitStateDataType,
      dataParts: {
        elementCodes: JSON.stringify(this.unitStateService.getResponses()),
        stateVariableCodes: JSON.stringify(this.stateVariableStateService.getResponses())
      },
      presentationProgress: this.getPresentationProgress(),
      responseProgress: this.validationService.responseProgress
    };

    LogService.debug('📤 Sending state notification:', unitState);
    this.veronaPostService.sendVopStateChangedNotification({ unitState });
  }

  private getPresentationProgress(): Progress {
    return this.unitStateService.presentedPagesProgress;
  }

  @HostListener('window:blur')
  onBlur(): void {
    this.veronaPostService.sendVopWindowFocusChangedNotification(false);
  }

  @HostListener('window:focus')
  onFocus(): void {
    this.veronaPostService.sendVopWindowFocusChangedNotification(true);
  }

  @HostListener('window:unload')
  onUnload(): void {
    this.sendVopStateChangedNotification();
  }

  sendValueChanged(): void {
    this.sendVopStateChangedNotification();
  }
}
```

## File: ./src/app/directives/media-player-element-component.directive.ts

```ts
import {
  Directive, EventEmitter, Input, OnDestroy, OnInit, Output
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { ElementComponent } from "./element-component.directive";


@Directive()
export abstract class MediaPlayerElementComponent extends ElementComponent implements OnInit, OnDestroy {
  // @Input() actualPlayingId!: Subject<string | null>;

  active: boolean = true;
  isLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
```

## File: ./src/app/directives/element-group.directive.ts

```ts
// import { Directive, Input } from '@angular/core';
// import { ElementComponent } from 'common/directives/element-component.directive';
// import { UIElement } from 'common/models/elements/element';
// import { ResponseValueType } from '@iqb/responses';
// import { UnitStateService } from '../services/unit-state.service';
//
// @Directive()
// export abstract class ElementGroupDirective {
//   @Input() elementModel!: UIElement;
//   @Input() pageIndex!: number;
//   abstract unitStateService: UnitStateService;
//
//   registerAtUnitStateService(
//     id: string, alias: string, value: ResponseValueType, elementComponent: ElementComponent, pageIndex: number
//   ): void {
//     const elementModel = elementComponent.elementModel;
//     const relevantPageIndex = elementModel.isRelevantForPresentationComplete ? pageIndex : null;
//     this.unitStateService.registerElementCode(
//       id, alias, value, elementComponent.domElement, relevantPageIndex
//     );
//   }
// }
```

## File: ./src/app/directives/compound-element.directive.ts

```ts
// import {
//   AfterViewInit,
//   Directive, EventEmitter, Input, Output, QueryList
// } from '@angular/core';
// import { UntypedFormGroup } from '@angular/forms';
// import { ElementComponent } from './element-component.directive';
// import { ClozeChildOverlay } from '../components/compound-elements/cloze/cloze-child-overlay.component';
// import { LikertRadioButtonGroupComponent } from
//   '../components/compound-elements/likert/likert-radio-button-group.component';
// import { TableChildOverlay } from 'common/components/compound-elements/table/table-child-overlay.component';
//
// @Directive()
// export abstract class CompoundElementComponent extends ElementComponent implements AfterViewInit {
//   @Output() childrenAdded = new EventEmitter<ElementComponent[]>();
//   @Input() parentForm!: UntypedFormGroup;
//   compoundChildren!: QueryList<ClozeChildOverlay | LikertRadioButtonGroupComponent | TableChildOverlay>;
//
//   ngAfterViewInit(): void {
//     this.childrenAdded.emit(this.getFormElementChildrenComponents());
//   }
//
//   abstract getFormElementChildrenComponents(): ElementComponent[];
// }
```

## File: ./src/app/directives/element-form-group.directive.ts

```ts
// import { Directive, OnDestroy } from '@angular/core';
// import {
//   UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators
// } from '@angular/forms';
// import { takeUntil } from 'rxjs/operators';
// import { Subject } from 'rxjs';
// import { InputElementValue } from 'common/interfaces';
// import { VopNavigationDeniedNotification } from 'player/modules/verona/models/verona';
// import { VeronaSubscriptionService } from 'player/modules/verona/services/verona-subscription.service';
// import { LogService } from 'player/modules/logging/services/log.service';
// import { InputElement } from 'common/models/elements/element';
// import { SliderElement } from 'common/models/elements/input-elements/slider';
// import { hotspotImageRequiredValidator } from 'player/src/app/validators/hotspot-image-required.validator';
// import { ValidationService } from '../services/validation.service';
// import { ElementGroupDirective } from './element-group.directive';
// import { ElementModelElementCodeMappingService } from '../services/element-model-element-code-mapping.service';
// import { UnitStateService } from '../services/unit-state.service';
//
// @Directive()
// export abstract class ElementFormGroupDirective extends ElementGroupDirective implements OnDestroy {
//   form: UntypedFormGroup = new UntypedFormGroup({});
//   abstract unitStateService: UnitStateService;
//   abstract elementModelElementCodeMappingService: ElementModelElementCodeMappingService;
//   abstract veronaSubscriptionService: VeronaSubscriptionService;
//   abstract validationService: ValidationService;
//
//   ngUnsubscribe = new Subject<void>();
//
//   createForm(elementModels: InputElement[]): void {
//     elementModels.forEach(elementModel => {
//       const initialValue = this.elementModelElementCodeMappingService
//         .mapToElementModelValue(this.unitStateService.getElementCodeById(elementModel.id)?.value, elementModel);
//       const formControl = new UntypedFormControl(initialValue, ElementFormGroupDirective.getValidators(elementModel));
//       this.form.addControl(elementModel.id, formControl);
//       formControl.valueChanges
//         .pipe(takeUntil(this.ngUnsubscribe))
//         .subscribe((inputValue: InputElementValue) => {
//           this.unitStateService.changeElementCodeValue({
//             id: elementModel.id,
//             value: ElementModelElementCodeMappingService.mapToElementCodeValue(inputValue, elementModel.type)
//           });
//         });
//       if (ElementFormGroupDirective.needsValidation(elementModel)) {
//         this.validationService.registerFormControl(formControl);
//       }
//     });
//     this.veronaSubscriptionService.vopNavigationDeniedNotification
//       .pipe(takeUntil(this.ngUnsubscribe))
//       .subscribe((message: VopNavigationDeniedNotification): void => this.onNavigationDenied(message));
//   }
//
//   private onNavigationDenied(message: VopNavigationDeniedNotification): void {
//     LogService.info('player: onNavigationDenied', message);
//     if (message.reason && message.reason.find(reason => reason === 'responsesIncomplete')) {
//       this.form.markAllAsTouched();
//     }
//   }
//
//   private static needsValidation = (elementModel: InputElement): boolean => [
//     elementModel.required, !!elementModel.minLength, !!elementModel.maxLength, !!elementModel.pattern
//   ].some(validator => validator);
//
//   private static getValidators = (elementModel: InputElement) => {
//     const validators: ValidatorFn[] = [];
//     let requiredAdded = false;
//     if (elementModel.required) {
//       switch (elementModel.type) {
//         case 'hotspot-image':
//           validators.push(hotspotImageRequiredValidator());
//           break;
//         case 'checkbox':
//           validators.push(Validators.requiredTrue);
//           break;
//         case 'slider':
//           requiredAdded = true;
//           validators.push(Validators.required);
//           validators.push(Validators.min((elementModel as SliderElement).minValue + 1));
//           break;
//         default:
//           requiredAdded = true;
//           validators.push(Validators.required);
//       }
//     }
//     if (elementModel.minLength) {
//       if (!requiredAdded) validators.push(Validators.required);
//       validators.push(Validators.minLength(<number> elementModel.minLength));
//     }
//     if (elementModel.maxLength) {
//       validators.push(Validators.maxLength(<number> elementModel.maxLength));
//     }
//     if (elementModel.pattern) {
//       if (!requiredAdded) validators.push(Validators.required);
//       validators.push(Validators.pattern(<string> elementModel.pattern));
//     }
//     return validators;
//   };
//
//   ngOnDestroy(): void {
//     this.ngUnsubscribe.next();
//     this.ngUnsubscribe.complete();
//   }
// }
```

## File: ./src/app/directives/player-state.directive.ts

```ts
// import {
//   Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges
// } from '@angular/core';
// import { BehaviorSubject, debounceTime, Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import {VeronaPostService} from "../services/verona-post.service";
// import {LogService} from "../services/log.service";
// import {PlayerState, ValidPage} from "../models/verona";
//
//
//
// @Directive({
//   selector: '[aspectPlayerState]'
// })
// export class PlayerStateDirective implements OnChanges, OnInit, OnDestroy {
//   @Input() isVisibleIndexPages!: BehaviorSubject<IsVisibleIndex[]>;
//   @Input() currentPageIndex!: number;
//
//   private validPages: Record<string, string> = {};
//   private ngUnsubscribe = new Subject<void>();
//   constructor(
//     private veronaPostService: VeronaPostService,
//     private navigationService: NavigationService
//   ) {}
//
//   ngOnInit(): void {
//     this.isVisibleIndexPages
//       .pipe(
//         debounceTime(50),
//         takeUntil(this.ngUnsubscribe)
//       )
//       .subscribe(isVisibleIndexPages => {
//         this.validPages = this.getValidPages(isVisibleIndexPages);
//         this.sendVopStateChangedNotification();
//       });
//   }
//
//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes.currentPageIndex) {
//       this.navigationService.currentPageIndexChanged.emit(this.currentPageIndex);
//       this.sendVopStateChangedNotification();
//     }
//   }
//
//   private getValidPages(isVisibleIndexPages: IsVisibleIndex[]): Record<string, string> {
//   //   return isVisibleIndexPages
//   //     .reduce(
//   //       (validPages: Record<string, string>, indexPage: IsVisibleIndex) => ({
//   //         ...validPages,
//   //         ...(indexPage.isVisible && {
//   //           [indexPage.index.toString(10)]:
//   //             `${this.translateService.instant('pageIndication', { index: indexPage.index + 1 })}`
//   //         })
//   //       }), {}
//   //     );
//   }
//
//   private sendVopStateChangedNotification(): void {
//     const playerState: PlayerState = {
//       currentPage: this.currentPageIndex.toString(10),
//       validPages: this.mapValidPagesToArray()
//     };
//     LogService.debug('player: sendVopStateChangedNotification', playerState);
//     this.veronaPostService.sendVopStateChangedNotification({ playerState });
//   }
//
//   private mapValidPagesToArray(): ValidPage[] {
//     return Object.keys(this.validPages).map(key => ({ id: key, label: this.validPages[key] }));
//   }
//
//   ngOnDestroy(): void {
//     this.ngUnsubscribe.next();
//     this.ngUnsubscribe.complete();
//   }
// }
```

## File: ./src/app/directives/unit-state.directive.ts

```ts
// import {
//   Directive, HostListener, Input, OnDestroy, OnInit
// } from '@angular/core';
// import {
//   BehaviorSubject, debounceTime, merge, Subject
// } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { Progress, UnitState } from 'player/modules/verona/models/verona';
// import { VeronaSubscriptionService } from 'player/modules/verona/services/verona-subscription.service';
// import { VeronaPostService } from 'player/modules/verona/services/verona-post.service';
// import { LogService } from 'player/modules/logging/services/log.service';
// import { StateVariableStateService } from 'player/src/app/services/state-variable-state.service';
// import { MediaPlayerService } from '../services/media-player.service';
// import { ValidationService } from '../services/validation.service';
//
// @Directive({
//   selector: '[aspectUnitState]'
// })
// export class UnitStateDirective implements OnInit, OnDestroy {
//   @HostListener('window:unload')
//   onUnload(): void {
//     this.sendVopStateChangedNotification();
//   }
//
//   private ngUnsubscribe = new Subject<void>();
//   @Input() presentationProgressStatus!: BehaviorSubject<Progress>;
//
//   constructor(
//     private unitStateService: UnitStateService,
//     private stateVariableStateService: StateVariableStateService,
//     private mediaPlayerService: MediaPlayerService,
//     private veronaSubscriptionService: VeronaSubscriptionService,
//     private veronaPostService: VeronaPostService,
//     private validatorService: ValidationService
//   ) {}
//
//   ngOnInit(): void {
//     merge(
//       this.mediaPlayerService.mediaStatusChanged,
//       this.unitStateService.pagePresented,
//       this.unitStateService.elementCodeChanged,
//       this.stateVariableStateService.elementCodeChanged
//     )
//       .pipe(
//         debounceTime(100),
//         takeUntil(this.ngUnsubscribe)
//       )
//       .subscribe((): void => this.sendVopStateChangedNotification());
//   }
//
//   private get presentationProgress(): Progress {
//     if (this.presentationProgressStatus.value === 'complete') return 'complete';
//     if (this.mediaPlayerService.areMediaElementsRegistered()) {
//       const mediaStatus = this.mediaPlayerService.mediaStatus;
//       this.presentationProgressStatus
//         .next(mediaStatus === this.unitStateService.presentedPagesProgress ? mediaStatus : 'some');
//     } else {
//       this.presentationProgressStatus
//         .next(this.unitStateService.presentedPagesProgress);
//     }
//     return this.presentationProgressStatus.value;
//   }
//
//   private sendVopStateChangedNotification(): void {
//     LogService.debug('player: this.unitStateService.getResponses',
//       this.unitStateService.getResponses());
//     LogService.debug('player: this.stateVariableStateService.getResponses',
//       this.stateVariableStateService.getResponses());
//     const unitState: UnitState = {
//       dataParts: {
//         stateVariableCodes: JSON.stringify(this.stateVariableStateService.getResponses()),
//         elementCodes: JSON.stringify(this.unitStateService.getResponses())
//       },
//       presentationProgress: this.presentationProgress,
//       responseProgress: this.validatorService.responseProgress,
//       unitStateDataType: 'iqb-standard@1.0'
//     };
//     LogService.debug('player: unitState sendVopStateChangedNotification', unitState);
//     this.veronaPostService.sendVopStateChangedNotification({ unitState });
//   }
//
//   ngOnDestroy(): void {
//     this.sendVopStateChangedNotification();
//     this.unitStateService.reset();
//     this.stateVariableStateService.reset();
//     this.mediaPlayerService.reset();
//     this.validatorService.reset();
//     this.ngUnsubscribe.next();
//     this.ngUnsubscribe.complete();
//   }
// }
```

## File: ./src/app/directives/text-input-group.directive.ts

```ts
// import { Directive, OnDestroy } from '@angular/core';
// import { ElementFormGroupDirective } from 'player/src/app/directives/element-form-group.directive';
// import { InputElement, UIElement } from 'common/models/elements/element';
// import { ElementComponent } from 'common/directives/element-component.directive';
// import { FormElementComponent } from 'common/directives/form-element-component.directive';
// import { Subscription } from 'rxjs';
// import { DeviceService } from 'player/src/app/services/device.service';
// import { KeypadService } from 'player/src/app/services/keypad.service';
// import { KeyboardService } from 'player/src/app/services/keyboard.service';
// import { TextInputComponentType } from 'player/src/app/models/text-input-component.type';
// import { RangeSelectionService } from 'common/services/range-selection-service';
// import { MathfieldElement } from '@iqb/mathlive';
// import { MathKeyboardService } from 'player/src/app/services/math-keyboard.service';
// import { MathFieldComponent } from 'common/components/input-elements/math-field.component';
// import { takeUntil } from 'rxjs/operators';
//
// @Directive()
// export abstract class TextInputGroupDirective extends ElementFormGroupDirective implements OnDestroy {
//   isKeypadOpen: boolean = false;
//   inputElement!: HTMLTextAreaElement | HTMLInputElement | HTMLElement;
//
//   keypadEnterKeySubscription!: Subscription;
//   keypadDeleteCharactersSubscription!: Subscription;
//   keypadSelectSubscription!: Subscription;
//   keyboardEnterKeySubscription!: Subscription;
//   keyboardDeleteCharactersSubscription!: Subscription;
//
//   abstract deviceService: DeviceService;
//   abstract keypadService: KeypadService;
//   abstract keyboardService: KeyboardService;
//   abstract mathKeyboardService: MathKeyboardService;
//
//   private shallOpenKeypad(elementModel: InputElement): boolean {
//     return !!elementModel.inputAssistancePreset &&
//       !(elementModel.showSoftwareKeyboard &&
//         elementModel.addInputAssistanceToKeyboard &&
//         this.deviceService.isMobileWithoutHardwareKeyboard);
//   }
//
//   async toggleKeyInput(focusedTextInput: { inputElement: HTMLElement; focused: boolean },
//                        elementComponent: TextInputComponentType | MathFieldComponent): Promise<void> {
//     const isMathInput = focusedTextInput.inputElement instanceof MathfieldElement;
//     const promises: Promise<boolean>[] = [];
//     if (isMathInput) {
//       this.mathKeyboardService
//         .toggle(focusedTextInput as { inputElement: MathfieldElement; focused: boolean },
//           elementComponent);
//       this.forceCloseKeyboard();
//     } else if (!(elementComponent instanceof MathFieldComponent)) {
//       if (elementComponent.elementModel.showSoftwareKeyboard && !elementComponent.elementModel.readOnly) {
//         promises.push(this.keyboardService
//           .toggleAsync(focusedTextInput, elementComponent, this.deviceService.isMobileWithoutHardwareKeyboard));
//       }
//       if (this.shallOpenKeypad(elementComponent.elementModel)) {
//         promises.push(this.keypadService.toggleAsync(focusedTextInput, elementComponent));
//       }
//       if (promises.length) {
//         await Promise.all(promises)
//           .then(() => {
//             if (this.keyboardService.isOpen) {
//               this.subscribeForKeyboardEvents(elementComponent.elementModel, elementComponent);
//             } else {
//               this.unsubscribeFromKeyboardEvents();
//             }
//             if (this.keypadService.isOpen) {
//               this.subscribeForKeypadEvents(elementComponent.elementModel, elementComponent);
//             } else {
//               this.unsubscribeFromKeypadEvents();
//             }
//             this.isKeypadOpen = this.keypadService.isOpen;
//             if (this.keyboardService.isOpen || this.keypadService.isOpen) {
//               this.inputElement = this.getInputElement(focusedTextInput.inputElement);
//               this.forceCloseMathKeyboard();
//             }
//           });
//       }
//     }
//   }
//
//   private forceCloseKeyboard(): void {
//     if (this.mathKeyboardService.isOpen && this.keyboardService.isOpen) {
//       this.keyboardService.close();
//       this.unsubscribeFromKeyboardEvents();
//     }
//   }
//
//   private forceCloseMathKeyboard(): void {
//     if (this.mathKeyboardService.isOpen && this.keyboardService.isOpen) {
//       this.mathKeyboardService.close();
//     }
//   }
//
//   // eslint-disable-next-line class-methods-use-this
//   checkInputLimitation(event: {
//     keyboardEvent: KeyboardEvent;
//     inputElement: HTMLInputElement | HTMLTextAreaElement | HTMLElement;
//   }, elementModel: UIElement): void {
//     const inputValue = TextInputGroupDirective.getValueOfInput(event.inputElement);
//     if (elementModel.maxLength &&
//       elementModel.isLimitedToMaxLength &&
//       inputValue.length === elementModel.maxLength &&
//       !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(event.keyboardEvent.key)) {
//       event.keyboardEvent.preventDefault();
//     }
//   }
//
//   detectHardwareKeyboard(elementModel: UIElement): void {
//     if (elementModel.showSoftwareKeyboard) {
//       this.deviceService.hasHardwareKeyboard = true;
//       this.keyboardService.close();
//     }
//   }
//
//   private subscribeForKeypadEvents(elementModel: UIElement, elementComponent: ElementComponent): void {
//     this.keypadEnterKeySubscription = this.keypadService.enterKey
//       .pipe(takeUntil(this.ngUnsubscribe))
//       .subscribe(key => this.enterKey(key, elementModel, elementComponent));
//     this.keypadDeleteCharactersSubscription = this.keypadService.deleteCharacters
//       .pipe(takeUntil(this.ngUnsubscribe))
//       .subscribe(isBackspace => this.deleteCharacters(isBackspace, elementComponent));
//     this.keypadSelectSubscription = this.keypadService.select
//       .pipe(takeUntil(this.ngUnsubscribe))
//       .subscribe(key => this.select(key));
//   }
//
//   private unsubscribeFromKeypadEvents(): void {
//     if (this.keypadSelectSubscription) this.keypadSelectSubscription.unsubscribe();
//     if (this.keypadEnterKeySubscription) this.keypadEnterKeySubscription.unsubscribe();
//     if (this.keypadDeleteCharactersSubscription) this.keypadDeleteCharactersSubscription.unsubscribe();
//   }
//
//   private subscribeForKeyboardEvents(elementModel: UIElement, elementComponent: ElementComponent): void {
//     this.keyboardEnterKeySubscription = this.keyboardService.enterKey
//       .pipe(takeUntil(this.ngUnsubscribe))
//       .subscribe(key => this.enterKey(key, elementModel, elementComponent));
//     this.keyboardDeleteCharactersSubscription = this.keyboardService.deleteCharacters
//       .pipe(takeUntil(this.ngUnsubscribe))
//       .subscribe(isBackspace => this.deleteCharacters(isBackspace, elementComponent));
//   }
//
//   private unsubscribeFromKeyboardEvents(): void {
//     if (this.keyboardEnterKeySubscription) this.keyboardEnterKeySubscription.unsubscribe();
//     if (this.keyboardDeleteCharactersSubscription) this.keyboardDeleteCharactersSubscription.unsubscribe();
//   }
//
//   private getInputElement(inputElement: HTMLElement): HTMLTextAreaElement | HTMLInputElement | HTMLElement {
//     switch (this.elementModel.type) {
//       case 'text-area':
//         return inputElement as HTMLTextAreaElement;
//       case 'text-area-math':
//         return inputElement as HTMLElement;
//       default:
//         return inputElement as HTMLInputElement;
//     }
//   }
//
//   private select(direction: string): void {
//     let lastBreak = 0;
//     const inputValueKeys = this.getInputElementValue().split('');
//     const lineBreaks = inputValueKeys
//       .reduce(
//         (previousValue: number[][],
//          currentValue,
//          currentIndex) => {
//           if (currentValue === '\n') {
//             const d = [lastBreak, currentIndex + 1];
//             lastBreak = currentIndex + 1;
//             return [...previousValue, d];
//           }
//           if (currentIndex === inputValueKeys.length - 1) {
//             return [...previousValue, [lastBreak, currentIndex + 2]];
//           }
//           return previousValue;
//         }, []);
//     const selectionStart = this.getSelection().start;
//     const selectionEnd = this.getSelection().end;
//     let newSelection: number;
//     switch (direction) {
//       case 'ArrowLeft': {
//         newSelection = selectionStart === selectionEnd ? selectionStart - 1 : selectionStart;
//         break;
//       }
//       case 'ArrowRight': {
//         newSelection = selectionStart === selectionEnd ? selectionEnd + 1 : selectionEnd;
//         break;
//       }
//       case 'ArrowUp': {
//         const targetLine = lineBreaks.reverse().find(line => line[1] <= selectionStart);
//         if (targetLine) {
//           const posInLine = selectionStart - targetLine[1];
//           newSelection = targetLine[0] + posInLine < targetLine[1] ? targetLine[0] + posInLine : targetLine[1] - 1;
//         } else {
//           newSelection = 0;
//         }
//         break;
//       }
//       case 'ArrowDown': {
//         const targetLine = lineBreaks.find(line => line[0] > selectionEnd);
//         if (targetLine) {
//           const currentLine = lineBreaks.find(line => line[1] === targetLine[0]) || [0, 1];
//           const posInLine = selectionEnd - currentLine[0];
//           newSelection = targetLine[0] + posInLine < targetLine[1] ? targetLine[0] + posInLine : targetLine[1] - 1;
//         } else {
//           newSelection = inputValueKeys.length;
//         }
//         break;
//       }
//       default: {
//         newSelection = selectionStart;
//       }
//     }
//     this.setSelection(newSelection, newSelection);
//   }
//
//   private enterKey(key: string, elementModel: UIElement, elementComponent: ElementComponent): void {
//     if (!(elementModel.maxLength &&
//       elementModel.isLimitedToMaxLength &&
//       this.getInputElementValue().length === elementModel.maxLength)) {
//       const selectionStart = this.getSelection().start;
//       const selectionEnd = this.getSelection().end;
//       const newSelection = selectionStart ? selectionStart + 1 : 1;
//       this.insert({
//         selectionStart, selectionEnd, newSelection, key
//       }, elementComponent);
//     }
//   }
//
//   private deleteCharacters(backspace: boolean, elementComponent: ElementComponent): void {
//     let selectionStart = this.getSelection().start;
//     let selectionEnd = this.getSelection().end;
//     if (backspace) {
//       if (selectionStart === selectionEnd && selectionEnd > 0) {
//         selectionStart -= 1;
//       }
//       this.insert({
//         selectionStart, selectionEnd, newSelection: selectionStart, key: ''
//       }, elementComponent, (backspace && selectionEnd === 0) || undefined);
//     }
//     if (!backspace && selectionEnd <= this.getInputElementValue().length) {
//       if (selectionStart === selectionEnd) {
//         selectionEnd += 1;
//       }
//       this.insert({
//         selectionStart, selectionEnd, newSelection: selectionStart, key: ''
//       }, elementComponent);
//     }
//   }
//
//   private getSelection(): { start: number; end: number } {
//     if (this.inputElement instanceof HTMLInputElement || this.inputElement instanceof HTMLTextAreaElement) {
//       return { start: this.inputElement.selectionStart || 0, end: this.inputElement.selectionEnd || 0 };
//     }
//     return this.getSelectionRange();
//   }
//
//   private getSelectionRange(): { start: number; end: number } {
//     const range = RangeSelectionService.getRange();
//     if (!range) return { start: 0, end: 0 };
//     return RangeSelectionService.getSelectionRange(range, this.inputElement);
//   }
//
//   private getInputElementValue(): string {
//     return TextInputGroupDirective.getValueOfInput(this.inputElement);
//   }
//
//   private static getValueOfInput(inputElement: HTMLElement | HTMLInputElement | HTMLTextAreaElement): string {
//     if (inputElement instanceof HTMLInputElement || inputElement instanceof HTMLTextAreaElement) {
//       return inputElement.value;
//     }
//     return inputElement.textContent || '';
//   }
//
//   private insert(keyAtPosition: {
//     selectionStart: number;
//     selectionEnd: number;
//     newSelection: number;
//     key: string
//   }, elementComponent: ElementComponent, backSpaceAtFirstPosition?: boolean): void {
//     const startText = this.getStartText(keyAtPosition.selectionStart);
//     const endText = this.getEndText(keyAtPosition.selectionEnd);
//     (elementComponent as FormElementComponent)
//       .setElementValue(startText + keyAtPosition.key + endText, backSpaceAtFirstPosition || undefined);
//     this.setSelection(keyAtPosition.newSelection, keyAtPosition.newSelection, backSpaceAtFirstPosition || undefined);
//   }
//
//   private getStartText(startPosition: number): string {
//     return this.getInputElementValue().substring(0, startPosition);
//   }
//
//   private getEndText(endPosition: number): string {
//     return this.getInputElementValue().substring(endPosition);
//   }
//
//   private setSelection(start: number, end: number, backSpaceAtFirstPosition?: boolean): void {
//     if (this.inputElement instanceof HTMLInputElement || this.inputElement instanceof HTMLTextAreaElement) {
//       this.inputElement.setSelectionRange(start, end);
//     } else if (!backSpaceAtFirstPosition) {
//       setTimeout(() => {
//         RangeSelectionService.setSelectionRange(this.inputElement, start, end);
//         this.inputElement.dispatchEvent(new Event('input'));
//       });
//     }
//   }
//
//   ngOnDestroy(): void {
//     this.unsubscribeFromKeypadEvents();
//     this.unsubscribeFromKeyboardEvents();
//     super.ngOnDestroy();
//   }
// }
```

## File: ./src/app/directives/text-input-component.directive.ts

```ts
import {
  Directive, EventEmitter, OnInit, Output
} from '@angular/core';

import { FormElementComponent } from "./form-element-component.directive";


@Directive()

export abstract class TextInputComponent extends FormElementComponent implements OnInit {
  @Output() focusChanged = new EventEmitter<{ inputElement: HTMLElement; focused: boolean }>();
  @Output() onKeyDown = new EventEmitter<{
    keyboardEvent: KeyboardEvent;
    inputElement: HTMLInputElement | HTMLTextAreaElement | HTMLElement;
  }>();

  ngOnInit() {
  }
}
```

## File: ./src/app/directives/element-component.directive.ts

```ts
import { Directive, input, output } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { AspectError } from "../models/aspect-error";
import { VeronaResponse } from "../models/verona";


@Directive()

export abstract class ElementComponent {
  parentForm = input<FormGroup>();
  valueChange = output<VeronaResponse>();

  throwError(code: string, message: string) {
    throw new AspectError(code, message);
  }
}
```

## File: ./src/app/environments/environment.prod.ts

```ts
export const environment = {
  production: true
};
```

## File: ./src/app/environments/environment.ts

```ts
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  strictInstantiation: false
};
```

## File: ./src/app/interfaces.ts

```ts
import { StateVariable } from './models/state-variable';
import { UIElement } from './models';

export type UIElementType =
  'text'
  | 'button'
  | 'text-field'
  | 'text-field-simple'
  | 'checkbox'
  | 'radio'
  | 'radio-button-group'
  | 'image'
  | 'audio'
  | 'video'
  | 'radio-group-images'
  | 'radio-group-text'
  | 'multi-choice-images'
  | 'hotspot-image'
  | 'drop-list'
  | 'stimulus'
  | 'interaction'
  | 'instructions'
  | 'reduced-keyboard'
  | 'syllable-counter'
  | 'binary-choice';

export type UIBlueprintType =
  'PicPicBlueprint'
  | 'PicTextBlueprint';

export interface JSONObject {
  [key: string]: any
}

export interface TextLabel {
  text: string;
}

export interface TextImageLabel extends TextLabel {
  id: string;
  imgSrc: string | null;
  imgFileName: string;
  text: string;
  altText: string;
}

export interface Coder {
  fullCredit: string;
  partialCredit: [JSONObject] | string;
}

export interface DragNDropValueObject extends TextImageLabel {
  id: string;
  alias: string;
  originListID: string;
  originListIndex: number;
  audioSrc: string | null;
  audioFileName: string;
}

export type Label = TextLabel | TextImageLabel | DragNDropValueObject;

// export interface OptionElement extends UIElement {
//   getNewOptionLabel(optionText: string): Label;
// }

export type IDTypes = UIElementType | 'value' | 'state-variable';

export interface AbstractIDService {
  getAndRegisterNewID: (idType: IDTypes, alias?: boolean) => string;
  register: (id: string, idType: IDTypes, useIDRegistry: boolean, useAliasRegistry: boolean) => void;
  unregister: (id: string, idType: IDTypes, useIDRegistry: boolean, useAliasRegistry: boolean) => void;
  isAliasAvailable: (id: string, idType: IDTypes) => boolean;
  changeAlias: (oldID: string, newID: string, idType: IDTypes) => void
}

export type InputElementValue =
  TextLabel[]
  | string[]
  | string
  | number[]
  | number
  | boolean[]
  | boolean
  | null;

export interface InputElementProperties extends UIElementProperties {
  label?: string;
  value: InputElementValue;
  required: boolean;
  requiredWarnMessage: string;
  readOnly: boolean;
}

export interface ValueChangeElement {
  id: string;
  value: InputElementValue;
}

export type UIElementValue = string | number | boolean | undefined | UIElementType | InputElementValue |
TextLabel | TextLabel[] | StateVariable | UIElement[];

export type InputAssistancePreset = null | 'french' | 'numbers' | 'numbersAndOperators' | 'numbersAndBasicOperators'
| 'comparisonOperators' | 'squareDashDot' | 'placeValue' | 'space' | 'comma' | 'custom';

export interface UIElementProperties {
  type: UIElementType;
  id: string;
  alias?: string;
  position?: string;
}

export type TooltipPosition = 'left' | 'right' | 'above' | 'below';

export interface KeyInputElementProperties {
  inputAssistancePreset: InputAssistancePreset;
  inputAssistancePosition: 'floating' | 'right';
  inputAssistanceFloatingStartPosition: 'startBottom' | 'endCenter';
  showSoftwareKeyboard: boolean;
  addInputAssistanceToKeyboard: boolean;
  hideNativeKeyboard: boolean;
  hasArrowKeys: boolean;
}

export interface TextInputElementProperties extends KeyInputElementProperties, InputElementProperties {
  inputAssistanceCustomKeys: string;
  restrictedToInputAssistanceChars: boolean;
  hasBackspaceKey: boolean;
}

export interface PlayerElementBlueprint extends UIElementProperties {
  player: PlayerProperties;
}

export interface PlayerProperties {
  [index: string]: unknown;
  autostart: boolean;
  autostartDelay: number;
  loop: boolean;
  startControl: boolean;
  pauseControl: boolean;
  progressBar: boolean;
  interactiveProgressbar: boolean;
  volumeControl: boolean;
  defaultVolume: number;
  minVolume: number;
  muteControl: boolean;
  interactiveMuteControl: boolean;
  hintLabel: string;
  hintLabelDelay: number;
  activeAfterID: string;
  minRuns: number;
  maxRuns: number | null;
  showRestRuns: boolean;
  showRestTime: boolean;
  playbackTime: number;
  fileName: string;
}

export type SectionLayoutVariant = 'grid_layout' | 'row_layout';

export interface SectionVariantConfig {
  variant?: SectionLayoutVariant;
  columns?: number; // For future customization of grid columns
  aspectRatio?: 'square' | 'wide' | 'portrait'; // For future image aspect ratio control
}
```

## File: ./src/app/app.component.scss

```scss
.unit-definition-menu{
  position: fixed;
  z-index: 2000;
  right: 0;
  top:0;
}
```

## File: ./src/app/services/validation.service.ts

```ts
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Progress } from '../models/verona';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private formControls: AbstractControl[] = [];

  registerFormControl(formControl: FormControl | FormGroup): void {
    this.formControls.push(formControl);
  }

  get responseProgress(): Progress {
    if (this.formControls.length === 0) return 'none';

    const validControls = this.formControls.filter(control => {
      if (control instanceof FormGroup) {
        const values = Object.values(control.value);
        return values.some(value => value === true);
      } else {
        return control.valid && control.value !== null && control.value !== '';
      }
    });

    if (validControls.length === 0) return 'none';
    if (validControls.length === this.formControls.length) return 'complete';
    return 'some';
  }

  reset(): void {
    this.formControls = [];
  }
}
```

## File: ./src/app/services/error.service.ts

```ts
import { ErrorHandler, Injectable } from '@angular/core';
import { AspectError } from "../models/aspect-error";
import { VeronaPostService } from "./verona-post.service";


@Injectable({
  providedIn: 'root'
})

export class ErrorService implements ErrorHandler {
  constructor(private veronaPostService: VeronaPostService) {}

  handleError(error: AspectError): void {
    if (error.name === AspectError.name) {
      this.veronaPostService.sendVopRuntimeErrorNotification(error);
    }
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
```

## File: ./src/app/services/version-manager.ts

```ts
// @ts-ignore
import packageJSON from '../../../package.json';

/* General version strategy:
  Player + Editor:
  - isNewer -> abgelehnt
  - isOlder -> wunderbar

  - isLesserMajor is accepeted by Editor and sanitized
 */
export class VersionManager {
  private static acceptedLesserMajor = [3, 10, 0];
  private static currentVersion: [number, number, number] =
    packageJSON.config.unit_definition_version.split('.').map(Number) as [number, number, number];

  static getCurrentVersion(): string {
    return VersionManager.currentVersion.join('.');
  }

  static hasCompatibleVersion(unitDefinition: Record<string, unknown>): boolean {
    const unitDefinitionVersion = VersionManager.getUnitDefinitionVersion(unitDefinition);
    const result = !VersionManager.isNewer(unitDefinition) &&
      VersionManager.isSameMajor(unitDefinitionVersion);
    if (!result) {
      console.log('Current version: ', VersionManager.currentVersion);
      console.log('Found version: ', unitDefinitionVersion);
    }
    return result;
  }

  static isNewer(unitDefinition: Record<string, unknown>): boolean {
    return VersionManager.compare(VersionManager.getUnitDefinitionVersion(unitDefinition)) === 1;
  }

  static needsSanitization(unitDefinition: Record<string, unknown>): boolean {
    const unitDefinitionVersion = VersionManager.getUnitDefinitionVersion(unitDefinition);
    return !VersionManager.isSameMajor(unitDefinitionVersion) &&
      unitDefinitionVersion.join() === VersionManager.acceptedLesserMajor.join();
  }

  private static getUnitDefinitionVersion(unitDefinition: Record<string, any>): [number, number, number] {
    return unitDefinition.version.split('.').map(Number);
  }

  private static compare(unitDefinitionVersion: [number, number, number]): number {
    let i = 0;
    let result = 0;
    while (result === 0 && i < 3) {
      result = VersionManager.compareVersionDigit(unitDefinitionVersion[i], VersionManager.currentVersion[i]);
      i += 1;
    }
    return result;
  }

  /* -1 for older */
  private static compareVersionDigit(a: number, b: number): number {
    if (a === b) return 0;
    return a < b ? -1 : 1;
  }

  private static isSameMajor(unitDefinitionVersion: [number, number, number]): boolean {
    return VersionManager.compareVersionDigit(unitDefinitionVersion[0], VersionManager.currentVersion[0]) === 0;
  }
}
```

## File: ./src/app/services/verona-subscription.service.ts

```ts
import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';

import {
  VopMessage,
  VopNavigationDeniedNotification,
  VopPageNavigationCommand,
  VopPlayerConfigChangedNotification,
  VopStartCommand
} from '../models/verona';
import { LogService } from "./log.service";


@Injectable({
  providedIn: 'root'
})

export class VeronaSubscriptionService {
  private _vopStartCommand = new Subject<VopStartCommand>();
  private _vopNavigationDeniedNotification = new Subject<VopNavigationDeniedNotification>();
  private _vopPageNavigationCommand = new Subject<VopPageNavigationCommand>();
  private _vopPlayerConfigChangedNotification = new Subject<VopPlayerConfigChangedNotification>();

  resourceURL: string | undefined;

  constructor() {
    fromEvent(window, 'message')
      .subscribe((event: Event): void => this.handleMessage((event as MessageEvent).data as VopMessage));
  }

  private handleMessage(messageData: VopMessage): void {
    switch (messageData.type) {
      case 'vopStartCommand':
        LogService.debug('player: _vopStartCommand ', messageData);
        this._vopStartCommand.next(messageData);
        break;
      case 'vopPlayerConfigChangedNotification':
        LogService.debug('player: vopPlayerConfigChangedNotification ', messageData);
        this._vopPlayerConfigChangedNotification.next(messageData);
        break;
      case 'vopNavigationDeniedNotification':
        LogService.info('player: _vopNavigationDeniedNotification ', messageData);
        this._vopNavigationDeniedNotification.next(messageData);
        break;
      case 'vopPageNavigationCommand':
        LogService.info('player: _vopPageNavigationCommand ', messageData);
        this._vopPageNavigationCommand.next(messageData);
        break;
      default:
        LogService.info(`player: got message of unknown type ${messageData.type}`);
    }
  }

  get vopStartCommand(): Observable<VopStartCommand> {
    return this._vopStartCommand.asObservable();
  }

  get vopPlayerConfigChangedNotification(): Observable<VopPlayerConfigChangedNotification> {
    return this._vopPlayerConfigChangedNotification.asObservable();
  }

  get vopNavigationDeniedNotification(): Observable<VopNavigationDeniedNotification> {
    return this._vopNavigationDeniedNotification.asObservable();
  }

  get vopPageNavigationCommand(): Observable<VopPageNavigationCommand> {
    return this._vopPageNavigationCommand.asObservable();
  }
}
```

## File: ./src/app/services/page-change.service.ts

```ts
import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PageChangeService {
  @Output() pageChanged = new EventEmitter<void>();
}
```

## File: ./src/app/services/verona-post.service.ts

```ts
import { Injectable } from '@angular/core';

import { LogService } from './log.service';
import {
  LogData,
  NavigationTarget,
  PlayerState,
  UnitState,
  VopError,
  VopMessage,
  VopMetaData,
  VopStateChangedNotification
} from '../models/verona';


@Injectable({
  providedIn: 'root'
})

export class VeronaPostService {
  sessionID: string | undefined;
  postTarget: Window = window.parent;

  private sendMessage(message: VopMessage): void {
    this.postTarget.postMessage(message, '*');
  }

  sendVopStateChangedNotification(values: {
    unitState?: UnitState,
    playerState?: PlayerState,
    log?: LogData[]
  }): void {
    this.sendMessage(this.createVopStateChangedNotification(values));
  }

  private createVopStateChangedNotification(values: {
    unitState?: UnitState,
    playerState?: PlayerState,
    log?: LogData[]
  }): VopStateChangedNotification {
    return {
      type: 'vopStateChangedNotification',
      sessionId: this.sessionID as string,
      timeStamp: Date.now(),
      ...(values)
    };
  }

  sendReadyNotification(playerMetadata: VopMetaData): void {
    if (playerMetadata) {
      LogService.debug('player: sendVopReadyNotification', playerMetadata);
      this.sendMessage({
        type: 'vopReadyNotification',
        metadata: playerMetadata
      });
    } else {
      LogService.warn('player: no playerMetadata defined');
    }
  }

  sendVopRuntimeErrorNotification(error: VopError): void {
    this.sendMessage({
      type: 'vopRuntimeErrorNotification',
      sessionId: this.sessionID as string,
      code: error.code,
      message: error.message
    });
  }

  sendVopUnitNavigationRequestedNotification(target: NavigationTarget): void {
    this.sendMessage({
      type: 'vopUnitNavigationRequestedNotification',
      sessionId: this.sessionID as string,
      target: target
    });
  }

  sendVopWindowFocusChangedNotification(focused: boolean): void {
    this.sendMessage({
      type: 'vopWindowFocusChangedNotification',
      timeStamp: Date.now(),
      hasFocus: focused
    });
  }
}
```

## File: ./src/app/services/log.service.ts

```ts
import { Injectable } from '@angular/core';

export enum LogLevel { NONE = 0, ERROR = 1, WARN = 2, INFO = 3, DEBUG = 4 }

@Injectable({
  providedIn: 'root'
})
export class LogService {
  static level: LogLevel = 4;

  static error(...args: unknown[]): void {
    if (LogService.level >= LogLevel.ERROR) {
      window.console.error.apply(console, args);
    }
  }

  static warn(...args: unknown[]): void {
    if (LogService.level >= LogLevel.WARN) {
      window.console.warn.apply(console, args);
    }
  }

  static info(...args: unknown[]): void {
    if (LogService.level >= LogLevel.INFO) {
      window.console.info.apply(console, args);
    }
  }

  static debug(...args: unknown[]): void {
    if (LogService.level >= LogLevel.DEBUG) {
      window.console.log.apply(console, args);
    }
  }
}
```

## File: ./src/app/services/native-event.service.ts

```ts
import { Inject, Injectable } from '@angular/core';
import {
  from, fromEvent, Observable, Subject
} from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { mergeMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class NativeEventService {
  private _focus = new Subject<boolean>();
  private _mouseUp = new Subject<MouseEvent>();
  private _pointerDown = new Subject<PointerEvent>();
  private _pointerUp = new Subject<PointerEvent>();
  private _resize = new Subject<number>();

  constructor(@Inject(DOCUMENT) private document: Document) {
    from(['blur', 'focus'])
      .pipe(
        mergeMap(event => fromEvent(window, event))
      )
      .subscribe(
        () => this._focus.next(document.hasFocus())// Do something with the event here
      );

    fromEvent(window, 'mouseup')
      .subscribe(event => this._mouseUp.next(event as MouseEvent));

    fromEvent(window, 'pointerup')
      .subscribe(event => this._pointerUp.next(event as PointerEvent));

    fromEvent(window, 'pointerdown')
      .subscribe(event => this._pointerDown.next(event as PointerEvent));

    fromEvent(window, 'resize')
      .subscribe(() => this._resize.next(window.innerWidth));
  }

  get focus(): Observable<boolean> {
    return this._focus.asObservable();
  }

  get mouseUp(): Observable<MouseEvent> {
    return this._mouseUp.asObservable();
  }

  get pointerUp(): Observable<PointerEvent> {
    return this._pointerUp.asObservable();
  }

  get pointerDown(): Observable<PointerEvent> {
    return this._pointerDown.asObservable();
  }

  get resize(): Observable<number> {
    return this._resize.asObservable();
  }
}
```

## File: ./src/app/services/unit-state.service.ts

```ts


import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { VeronaResponse, ResponseStatus, Progress } from '../models/verona';

export interface ElementCode {
  id: string;
  alias: string;
  value: string | number | boolean | null;
  status: ResponseStatus;
  code?: number;
  score?: number;
  timeStamp: number;
  domElement?: HTMLElement;
  pageIndex?: number | null;
}

export interface ElementIdentifier {
  id: string;
  alias: string;
}

@Injectable({
  providedIn: 'root'
})
export class UnitStateService {
  private elementCodes: Map<string, ElementCode> = new Map();
  private _elementCodeChanged = new Subject<ElementCode>();
  private _pagePresented = new Subject<number>();
  private presentedPages: Set<number> = new Set();

  get elementCodeChanged() {
    return this._elementCodeChanged.asObservable();
  }

  get pagePresented() {
    return this._pagePresented.asObservable();
  }

  registerElementCode(
    id: string,
    alias: string,
    value: any,
    domElement?: HTMLElement,
    pageIndex?: number | null
  ): void {
    const existingCode = this.elementCodes.get(id);

    if (existingCode) {
      existingCode.domElement = domElement;
      if (pageIndex !== undefined) existingCode.pageIndex = pageIndex;
      this._elementCodeChanged.next(existingCode);
      return;
    }

    const elementCode: ElementCode = {
      id,
      alias,
      value,
      status: ResponseStatus.UNSET,
      timeStamp: Date.now(),
      domElement,
      pageIndex
    };

    this.elementCodes.set(id, elementCode);
    this._elementCodeChanged.next(elementCode);
  }

  changeElementCodeValue(change: {
    id: string;
    value: any;
    status?: ResponseStatus;
    code?: number;
    score?: number
  }): void {
    const elementCode = this.elementCodes.get(change.id);
    if (elementCode) {
      elementCode.value = change.value;
      elementCode.status = change.status || ResponseStatus.VALUE_CHANGED;
      elementCode.timeStamp = Date.now();

      if (change.code !== undefined) elementCode.code = change.code;
      if (change.score !== undefined) elementCode.score = change.score;

      this.elementCodes.set(change.id, elementCode);
      this._elementCodeChanged.next(elementCode);
    }
  }


  registerElementWithRestore(
    id: string,
    alias: string,
    defaultValue: any,
    domElement?: HTMLElement,
    pageIndex?: number | null
  ): any {
    const existingState = this.elementCodes.get(id);

    if (existingState) {
      existingState.domElement = domElement;
      if (pageIndex !== undefined) existingState.pageIndex = pageIndex;
      return existingState.value;
    } else {
      this.registerElementCode(id, alias, defaultValue, domElement, pageIndex);
      return defaultValue;
    }
  }

  getResponses(): {
    timeStamp: number;
    score: number;
    code: number;
    alias: string;
    id: string;
    value: string | number | boolean;
    status: ResponseStatus
  }[] {
    return Array.from(this.elementCodes.values()).map(elementCode => ({
      id: elementCode.id,
      alias: elementCode.alias,
      value: elementCode.value,
      status: elementCode.status,
      code: elementCode.code,
      score: elementCode.score,
      timeStamp: elementCode.timeStamp
    }));
  }

  get presentedPagesProgress(): Progress {
    if (this.presentedPages.size === 0) return 'none';
    // You can implement more sophisticated logic here based on total pages
    return this.presentedPages.size > 0 ? 'some' : 'none';
  }

  reset(): void {
    this.elementCodes.clear();
    this.presentedPages.clear();
  }

  setElementCodes(elementCodes: any[], elementIdentifiers: ElementIdentifier[]): void {
    elementCodes.forEach(code => {
      this.elementCodes.set(code.id, {
        id: code.id,
        alias: code.alias || code.id,
        value: code.value,
        status: code.status || ResponseStatus.UNSET,
        code: code.code,
        score: code.score,
        timeStamp: code.timeStamp || Date.now()
      });
    });
  }
}
```

## File: ./src/app/services/media-player-service.ts

```ts
import { EventEmitter, Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})

export class MediaPlayerService {
  public durationChange: EventEmitter<MediaChangeItem>;
  private currentDuration = 0;
  private currentPercentage: number = 0;

  constructor() {
    this.durationChange = new EventEmitter();
    // fromEvent(window, 'message')
    //   .subscribe((event: Event): void => this.handleMessage((event as MessageEvent).data as VopMessage));
  }

  public changeDuration(event: MediaChangeItem): void {
    this.currentDuration = event.currentDuration;
    this.currentPercentage = event.currentPercentage;
    this.durationChange.emit(event);
  }

  public getCurrentDuration() {
    return this.currentDuration;
  }
}

export class MediaChangeItem {
  currentDuration: number;
  currentPercentage: number;

  constructor(duration: number, percentage?: number) {
    this.currentDuration = duration;
    this.currentPercentage = percentage || undefined;
  }
}
```

## File: ./src/app/services/meta-data.service.ts

```ts
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { VopMetaData } from "../models/verona";


@Injectable({
  providedIn: 'root'
})

export class MetaDataService {
  playerMetadata!: VopMetaData;
  resourceURL: string | undefined;

  constructor(@Inject(DOCUMENT) private document: Document) {
    const playerMetadata: string | null | undefined = document.getElementById('meta_data')?.textContent;
    if (playerMetadata) {
      this.playerMetadata = JSON.parse(playerMetadata);
    }
  }

  getResourceURL(): string {
    return this.resourceURL || 'assets';
  }
}
```

## File: ./src/app/services/file.service.ts

```ts
import { Injectable } from '@angular/core';

export interface FileInformation {
  name: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})

export class FileService {
  static async loadFile(fileTypes: string[] = [], asBase64: boolean = false): Promise<FileInformation> {
    return new Promise<FileInformation>((resolve, reject) => {
      const fileUploadElement = document.createElement('input');
      fileUploadElement.type = 'file';
      fileUploadElement.accept = fileTypes.toString();
      fileUploadElement.addEventListener('change', event => {
        const uploadedFile = (event.target as HTMLInputElement).files?.[0];
        const reader = new FileReader();
        reader.onload = loadEvent => resolve({
          name: uploadedFile?.name as string,
          content: loadEvent.target?.result as string
        });
        reader.onerror = errorEvent => reject(errorEvent);
        if (uploadedFile) {
          asBase64 ? reader.readAsDataURL(uploadedFile) : reader.readAsText(uploadedFile);
        }
      });
      fileUploadElement.click();
    });
  }

  static loadImage(): Promise<FileInformation> {
    return FileService.loadFile(['image/*'], true);
  }

  static loadAudio(): Promise<FileInformation> {
    return FileService.loadFile(['audio/*'], true);
  }

  static loadVideo(): Promise<FileInformation> {
    return FileService.loadFile(['video/*'], true);
  }
}
```

## File: ./src/app/services/state-variable-state.service.ts

```ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { VeronaResponse, ResponseStatus } from '../models/verona';

export interface StateVariableCode {
  id: string;
  alias: string;
  value: any;
  status: ResponseStatus;
  timeStamp: number;
}

export interface StateVariableIdentifier {
  id: string;
  alias: string;
}

@Injectable({
  providedIn: 'root'
})
export class StateVariableStateService {
  private stateVariableCodes: Map<string, StateVariableCode> = new Map();
  private _elementCodeChanged = new Subject<StateVariableCode>();

  get elementCodeChanged() {
    return this._elementCodeChanged.asObservable();
  }

  registerElementCode(elementId: string, elementAlias: string, elementValue: any): void {
    const stateVariableCode: StateVariableCode = {
      id: elementId,
      alias: elementAlias,
      value: elementValue,
      status: ResponseStatus.UNSET,
      timeStamp: Date.now()
    };

    this.stateVariableCodes.set(elementId, stateVariableCode);
    this._elementCodeChanged.next(stateVariableCode);
  }

  getResponses(): VeronaResponse[] {
    return Array.from(this.stateVariableCodes.values()).map(code => ({
      id: code.id,
      alias: code.alias,
      value: code.value,
      status: code.status,
      timeStamp: code.timeStamp
    }));
  }

  setElementCodes(stateVariableCodes: any[], stateVariableIdentifiers: StateVariableIdentifier[]): void {
    stateVariableCodes.forEach(code => {
      this.stateVariableCodes.set(code.id, {
        id: code.id,
        alias: code.alias || code.id,
        value: code.value,
        status: code.status || ResponseStatus.UNSET,
        timeStamp: code.timeStamp || Date.now()
      });
    });
  }

  reset(): void {
    this.stateVariableCodes.clear();
  }
}
```

## File: ./src/app/pipes/safe-resource-url.pipe.ts

```ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeResourceUrl'
})
export class SafeResourceUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(resourceUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(resourceUrl);
  }
}
```

## File: ./src/app/pipes/safe-resource-html.pipe.ts

```ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeResourceHTML'
})
export class SafeResourceHTMLPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(safeHtml: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(safeHtml);
  }
}
```

## File: ./src/test.ts

```ts
// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
```

## File: ./src/main.ts

```ts
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from "./app/environments/environment";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
```
