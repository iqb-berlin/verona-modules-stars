import { deepEqual, equal } from 'node:assert/strict';
import { UnitDefinition } from '@shared/models/unit-definition';
import { EditorDefinitionBuilderService } from '../src/app/services/editor-definition-builder.service';
import { EditorDefinitionLoaderService } from '../src/app/services/editor-definition-loader.service';
import { EditorInteractionAdapterRegistry } from '../src/app/services/editor-interaction-adapters';
import { EditorStateSnapshot } from '../src/app/services/editor-state.model';
import { EditorVariableMetadataBuilderService } from '../src/app/services/editor-variable-metadata-builder.service';

const interactionAdapters = new EditorInteractionAdapterRegistry();
const definitionBuilder = new EditorDefinitionBuilderService();
const definitionLoader = new EditorDefinitionLoaderService(interactionAdapters);
const variableMetadataBuilder = new EditorVariableMetadataBuilderService(interactionAdapters);

function snapshot(overrides: Partial<EditorStateSnapshot> = {}): EditorStateSnapshot {
  return {
    unitId: 'stars-unit-definition',
    unitVersion: '',
    backgroundColor: '#EEE',
    ribbonBars: false,
    continueButtonShow: 'ALWAYS',
    interactionType: 'BUTTONS',
    mainAudioEnabled: false,
    mainAudioSource: '',
    mainAudioMaxPlay: 0,
    mainAudioDisableInteractionUntilComplete: false,
    firstClickLayer: 'OFF',
    animateButton: 'OFF',
    openingImageEnabled: false,
    openingImageSource: '',
    openingAudioSource: '',
    openingPresentationDurationMS: 1500,
    interactionParams: {
      variableId: 'BUTTONS',
      options: { buttons: [] },
      buttonType: 'BIG_SQUARE',
      numberOfRows: 1,
      multiSelect: false,
      imagePosition: 'LEFT',
      layout: 'LEFT_CENTER'
    },
    variableInfo: [],
    audioFeedback: undefined,
    closingMetaButtons: undefined,
    ...overrides
  };
}

function testDefinitionExport(): void {
  const definition = definitionBuilder.build(snapshot({
    unitId: 'unit-1',
    unitVersion: '1.2.3',
    backgroundColor: '#fff',
    mainAudioEnabled: true,
    mainAudioSource: 'audio.mp3',
    mainAudioMaxPlay: 2,
    mainAudioDisableInteractionUntilComplete: true,
    firstClickLayer: 'BLUR',
    openingImageEnabled: true,
    openingImageSource: 'intro.png',
    openingAudioSource: '',
    openingPresentationDurationMS: 2500
  }));

  equal(definition.id, 'unit-1');
  equal(definition.version, '1.2.3');
  deepEqual(definition.mainAudio, {
    audioSource: 'audio.mp3',
    maxPlay: 2,
    disableInteractionUntilComplete: true
  });
  deepEqual(definition.firstAudioOptions, { firstClickLayer: 'BLUR' });
  deepEqual(definition.openingImage, {
    imageSource: 'intro.png',
    presentationDurationMS: 2500
  });
  equal(definition.variableInfo, undefined);
}

function testDefinitionImportAndNormalization(): void {
  const imported: UnitDefinition = {
    id: 'legacy-unit',
    interactionType: 'META_BUTTONS' as any,
    mainAudio: {
      audioSource: 'main.mp3',
      maxPlay: 1,
      firstClickLayer: true,
      animateButton: 'KIND'
    },
    interactionParameters: {
      variableId: 'WRITE',
      addUmlautKeys: true,
      keysToAdd: ['ß'],
      keyboardMode: 'CHARACTERS'
    } as any
  };
  const patch = definitionLoader.loadFromJson(JSON.stringify(imported));

  equal(patch.interactionType, 'META');
  equal(patch.mainAudioEnabled, true);
  equal(patch.firstClickLayer, true);
  equal(patch.animateButton, 'KIND');

  const writePatch = definitionLoader.loadFromJson(JSON.stringify({
    ...imported,
    interactionType: 'WRITE'
  }));
  deepEqual((writePatch.interactionParams as any).keysLine4, ['ä', 'ö', 'ü', 'ß']);
  equal((writePatch.interactionParams as any).addUmlautKeys, true);

  const explicitFirstAudioOptionsPatch = definitionLoader.loadFromJson(JSON.stringify({
    id: 'first-audio-precedence',
    interactionType: 'BUTTONS',
    firstAudioOptions: {
      firstClickLayer: false,
      animateButton: false
    },
    mainAudio: {
      audioSource: 'main.mp3',
      firstClickLayer: true,
      animateButton: 'KIND'
    }
  }));
  equal(explicitFirstAudioOptionsPatch.firstClickLayer, false);
  equal(explicitFirstAudioOptionsPatch.animateButton, false);
}

function testVariableMetadata(): void {
  const singleSelectVariables = variableMetadataBuilder.build(snapshot({
    interactionParams: {
      variableId: 'CHOICE',
      options: {
        buttons: [
          { text: 'A' },
          { label: 'B' }
        ]
      },
      multiSelect: false
    }
  }));
  deepEqual(singleSelectVariables[0]!.values, [
    { value: '1', label: 'A' },
    { value: '2', label: 'B' }
  ]);

  const multiSelectVariables = variableMetadataBuilder.build(snapshot({
    interactionParams: {
      variableId: 'CHOICE',
      options: {
        repeatButton: {
          numberOfOptions: 3,
          option: { text: 'Item' }
        }
      },
      multiSelect: true
    }
  }));
  equal(multiSelectVariables[0]!.multiple, true);
  deepEqual(multiSelectVariables[0]!.valuePositionLabels, ['Item', 'Item', 'Item']);

  const integerVariables = variableMetadataBuilder.build(snapshot({
    interactionType: 'EQUATION',
    interactionParams: {
      variableId: 'EQUATION',
      operators: ['+']
    }
  }));
  equal(integerVariables[0]!.type, 'integer');
}

testDefinitionExport();
testDefinitionImportAndNormalization();
testVariableMetadata();

console.log('editor-state builders: ok');
