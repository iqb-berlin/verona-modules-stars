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
