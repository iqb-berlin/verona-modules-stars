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
