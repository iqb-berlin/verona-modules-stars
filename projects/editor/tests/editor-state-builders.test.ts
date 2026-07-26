import '@angular/compiler';
import {
  deepEqual, equal, ok
} from 'node:assert/strict';
import { InteractionEnum, UnitDefinition } from '@shared/models/unit-definition';
import { EditorDefinitionBuilderService } from '../src/app/services/editor-definition-builder.service';
import { EditorDefinitionLoaderService } from '../src/app/services/editor-definition-loader.service';
import {
  EditorInteractionAdapterRegistry
} from '../src/app/services/editor-interaction-adapters';
import { INTERACTION_TYPE_DESCRIPTORS } from '../src/app/services/interaction-type-registry';
import { EditorStateSnapshot } from '../src/app/services/editor-state.model';
import { EditorVariableMetadataBuilderService } from '../src/app/services/editor-variable-metadata-builder.service';
import { PreviewPlayerController } from '../src/app/components/live-preview/preview-player-controller';

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
    unsupportedInteractionType: undefined,
    interactionMaxTimeMS: undefined,
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
      options: { buttons: [{ text: 'Option 1' }] },
      buttonType: 'BIG_SQUARE',
      numberOfRows: 1,
      multiSelect: false,
      imagePosition: 'LEFT',
      layout: 'LEFT_CENTER'
    },
    variableInfo: [],
    audioFeedbackEnabled: false,
    audioFeedback: undefined,
    closingMetaButtons: undefined,
    ...overrides
  };
}

function testDefinitionExportAndOrder(): void {
  const result = definitionBuilder.buildResult(snapshot({
    unitId: 'unit-1',
    unitVersion: '1.2.3',
    backgroundColor: '#fff',
    ribbonBars: true,
    firstClickLayer: 'BLUR',
    continueButtonShow: 'ON_ANY_RESPONSE',
    openingImageEnabled: true,
    openingImageSource: 'intro.png',
    openingPresentationDurationMS: 2500,
    mainAudioEnabled: true,
    mainAudioSource: 'audio.mp3',
    mainAudioMaxPlay: 2,
    mainAudioDisableInteractionUntilComplete: true,
    interactionMaxTimeMS: 5000,
    variableInfo: [{
      variableId: 'BUTTONS',
      responseComplete: 'ALWAYS',
      codingSource: 'VALUE',
      codes: [{
        method: 'EQUALS', parameter: '1', code: 1, score: 1
      }]
    }],
    audioFeedbackEnabled: true,
    audioFeedback: { trigger: 'ANY_RESPONSE', feedback: [] },
    closingMetaButtons: { variableIdReference: 'BUTTONS' }
  }));

  deepEqual(Object.keys(result.draft), [
    'id',
    'version',
    'backgroundColor',
    'ribbonBars',
    'firstAudioOptions',
    'continueButtonShow',
    'openingImage',
    'mainAudio',
    'interactionType',
    'interactionMaxTimeMS',
    'interactionParameters',
    'variableInfo',
    'audioFeedback',
    'closingMetaButtons'
  ]);
  deepEqual(result.draft.mainAudio, {
    audioSource: 'audio.mp3',
    maxPlay: 2,
    disableInteractionUntilComplete: true
  });
  deepEqual(result.draft.openingImage, {
    imageSource: 'intro.png',
    presentationDurationMS: 2500
  });
  equal(result.issues.length, 0);
  equal(result.runtimeDefinition, result.draft);
}

function testDraftValidationAndPartialRoundTrip(): void {
  const invalid = definitionBuilder.buildResult(snapshot({
    openingImageEnabled: true,
    mainAudioEnabled: true
  }));
  deepEqual(invalid.draft.openingImage, {
    imageSource: '',
    presentationDurationMS: 1500
  });
  deepEqual(invalid.draft.mainAudio, {
    audioSource: '',
    maxPlay: 0,
    disableInteractionUntilComplete: false
  });
  equal(invalid.runtimeDefinition, undefined);
  deepEqual(invalid.issues.map(issue => issue.path), [
    'openingImage.imageSource',
    'mainAudio.audioSource'
  ]);

  const partialPatch = definitionLoader.loadFromJson(JSON.stringify({
    id: 'partial',
    interactionType: 'BUTTONS',
    openingImage: { imageSource: '', presentationDurationMS: 3000 },
    mainAudio: { audioSource: '', maxPlay: 4 }
  }));
  const partialDraft = definitionBuilder.buildResult(snapshot(partialPatch)).draft;
  deepEqual(partialDraft.openingImage, { imageSource: '', presentationDurationMS: 3000 });
  deepEqual(partialDraft.mainAudio, {
    audioSource: '',
    maxPlay: 4,
    disableInteractionUntilComplete: false
  });
}

function testDefinitionImportAndNormalization(): void {
  const imported: UnitDefinition = {
    id: 'legacy-unit',
    interactionType: 'META_BUTTONS' as InteractionEnum,
    interactionMaxTimeMS: 1200,
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
    }
  };
  const patch = definitionLoader.loadFromJson(JSON.stringify(imported));
  equal(patch.interactionType, 'META');
  equal(patch.interactionMaxTimeMS, 1200);
  equal(patch.mainAudioEnabled, true);
  equal(patch.firstClickLayer, true);
  equal(patch.animateButton, 'KIND');

  const writePatch = definitionLoader.loadFromJson(JSON.stringify({ ...imported, interactionType: 'WRITE' }));
  deepEqual((writePatch.interactionParams as { keysLine4?: string[] }).keysLine4, ['ä', 'ö', 'ü', 'ß']);

  const explicitOptions = definitionLoader.loadFromJson(JSON.stringify({
    id: 'first-audio-precedence',
    interactionType: 'BUTTONS',
    firstAudioOptions: { firstClickLayer: false, animateButton: false },
    mainAudio: { audioSource: 'main.mp3', firstClickLayer: true, animateButton: 'KIND' }
  }));
  equal(explicitOptions.firstClickLayer, false);
  equal(explicitOptions.animateButton, false);

  const legacyImageOnly = definitionLoader.loadFromJson(JSON.stringify({
    id: 'legacy-image-only',
    interactionType: 'IMAGE_ONLY',
    interactionParameters: {
      variableId: 'BUTTONS',
      imageSource: 'image.png'
    }
  }));
  equal('variableId' in (legacyImageOnly.interactionParams || {}), false);
  const canonicalImageOnly = definitionBuilder.buildResult(snapshot(legacyImageOnly));
  equal('variableId' in (canonicalImageOnly.draft.interactionParameters || {}), false);
  deepEqual(variableMetadataBuilder.build(snapshot(legacyImageOnly)), []);

  const contaminatedImageOnly = definitionBuilder.buildResult(
    snapshot({
      interactionType: 'IMAGE_ONLY',
      interactionParams: {
        variableId: 'BUTTONS',
        imageSource: 'image.png',
        imagePosition: 'TOP',
        layout: 'TOP_CENTER',
        imageUseFullArea: true,
        text: 'Statischer Inhalt',
        options: { buttons: [{ text: 'Nicht interaktiv' }] },
        multiSelect: true,
        numberOfRows: 2,
        buttonType: 'TEXT',
        triggerNavigationOnSelect: true
      }
    })
  );
  deepEqual(contaminatedImageOnly.draft.interactionParameters, {
    imageSource: 'image.png',
    imagePosition: 'TOP',
    layout: 'TOP_CENTER',
    imageUseFullArea: true,
    text: 'Statischer Inhalt'
  });
  equal(contaminatedImageOnly.issues.length, 0);
  ok(contaminatedImageOnly.runtimeDefinition);

  const unsupported = definitionLoader.loadFromJson(JSON.stringify({
    id: 'unsupported',
    interactionType: 'BOGUS',
    interactionParameters: { futureOption: 'preserved' }
  }));
  equal(unsupported.interactionType, 'NONE');
  equal(unsupported.unsupportedInteractionType, 'BOGUS');
  deepEqual(unsupported.interactionParams, { futureOption: 'preserved' });
  const unsupportedResult = definitionBuilder.buildResult(snapshot(unsupported));
  equal(unsupportedResult.draft.interactionType, 'BOGUS' as InteractionEnum);
  deepEqual(unsupportedResult.draft.interactionParameters, { futureOption: 'preserved' });
  ok(unsupportedResult.issues.some(issue => issue.path === 'interactionType'));
  equal(unsupportedResult.runtimeDefinition, undefined);
}

function testAudioFeedbackArrayPreservation(): void {
  const feedback = {
    trigger: 'ANY_RESPONSE' as const,
    feedback: [{
      variableId: 'BUTTONS',
      source: 'VALUE' as const,
      method: 'EQUALS' as const,
      parameter: '1',
      audioSource: 'correct.mp3',
      showResponse: [
        { variableId: 'A', value: '1', delayMS: 0 },
        { variableId: 'B', value: '2', delayMS: 100 }
      ]
    }]
  };
  const imported = definitionLoader.loadFromJson(JSON.stringify({
    id: 'feedback-array', interactionType: 'BUTTONS', audioFeedback: feedback
  }));
  const exported = definitionBuilder.build(snapshot(imported));
  deepEqual(exported.audioFeedback, feedback);

  const codingOnlyReference = definitionBuilder.buildResult(snapshot({
    variableInfo: [{
      variableId: 'TYPO',
      responseComplete: 'ALWAYS',
      codingSource: 'VALUE',
      codes: [{
        method: 'EQUALS', parameter: '1', code: 1, score: 1
      }]
    }],
    audioFeedbackEnabled: true,
    audioFeedback: {
      trigger: 'ANY_RESPONSE',
      feedback: [{
        variableId: 'TYPO',
        source: 'VALUE',
        method: 'EQUALS',
        parameter: '1',
        audioSource: 'feedback.mp3'
      }]
    }
  }));
  ok(codingOnlyReference.issues.some(
    issue => issue.path === 'audioFeedback.feedback[0].variableId'
  ));
  equal(codingOnlyReference.runtimeDefinition, undefined);

  const invalidShowResponses = definitionBuilder.buildResult(
    snapshot({
      audioFeedbackEnabled: true,
      audioFeedback: {
        trigger: 'ANY_RESPONSE',
        feedback: [
          {
            variableId: 'BUTTONS',
            source: 'VALUE',
            method: 'EQUALS',
            parameter: '1',
            audioSource: 'feedback.mp3',
            showResponse: [
              { variableId: '', value: '1', delayMS: 0 },
              { variableId: ' BUTTONS ', value: '2', delayMS: -1 },
              { variableId: 'MISSING', value: '3', delayMS: Number.NaN }
            ]
          }
        ]
      }
    })
  );
  deepEqual(
    invalidShowResponses.issues
      .filter(issue => issue.path.includes('.showResponse'))
      .map(issue => issue.path),
    [
      'audioFeedback.feedback[0].showResponse[0].variableId',
      'audioFeedback.feedback[0].showResponse[1].variableId',
      'audioFeedback.feedback[0].showResponse[1].delayMS',
      'audioFeedback.feedback[0].showResponse[2].variableId',
      'audioFeedback.feedback[0].showResponse[2].delayMS'
    ]
  );
  equal(invalidShowResponses.runtimeDefinition, undefined);

  const validSecondaryShowResponse = definitionBuilder.buildResult(
    snapshot({
      interactionType: 'PLACE_VALUE',
      interactionParams: interactionAdapters.defaultParams('PLACE_VALUE'),
      audioFeedbackEnabled: true,
      audioFeedback: {
        trigger: 'ANY_RESPONSE',
        feedback: [
          {
            variableId: 'PLACE_VALUE',
            source: 'VALUE',
            method: 'EQUALS',
            parameter: '1',
            audioSource: 'feedback.mp3',
            showResponse: {
              variableId: 'PLACE_VALUE_TENS',
              value: '2',
              delayMS: 100
            }
          }
        ]
      }
    })
  );
  equal(validSecondaryShowResponse.issues.length, 0);
  ok(validSecondaryShowResponse.runtimeDefinition);
}

function testVariableMetadataAndDescriptors(): void {
  const descriptorKeys = Object.keys(INTERACTION_TYPE_DESCRIPTORS) as InteractionEnum[];
  deepEqual(descriptorKeys, [
    'BUTTONS', 'IMAGE_ONLY', 'WRITE', 'DROP', 'FIND_ON_IMAGE', 'VIDEO',
    'POLYGON_BUTTONS', 'PLACE_VALUE', 'NUMBER_LINE', 'PYRAMID', 'EQUATION', 'META', 'NONE'
  ]);
  descriptorKeys.forEach(type => {
    equal(INTERACTION_TYPE_DESCRIPTORS[type].label, type);
    equal(INTERACTION_TYPE_DESCRIPTORS[type].hasVariable, interactionAdapters.get(type).hasVariable);
  });
  descriptorKeys
    .filter(type => INTERACTION_TYPE_DESCRIPTORS[type].visible)
    .forEach(type => ok(INTERACTION_TYPE_DESCRIPTORS[type].editorComponent));
  equal(INTERACTION_TYPE_DESCRIPTORS.NONE.editorComponent, null);
  equal('variableId' in interactionAdapters.defaultParams('IMAGE_ONLY'), false);

  const singleSelectVariables = variableMetadataBuilder.build(snapshot({
    interactionParams: {
      variableId: 'CHOICE',
      options: { buttons: [{ text: 'A' }, { label: 'B' }] },
      multiSelect: false
    }
  }));
  deepEqual(singleSelectVariables[0]!.values, [
    { value: '1', label: 'A' },
    { value: '2', label: 'B' }
  ]);

  const dropVariables = variableMetadataBuilder.build(snapshot({
    interactionType: 'DROP',
    interactionParams: {
      variableId: 'DROP',
      options: [{ text: 'Rot' }, { text: 'Blau' }]
    }
  }));
  deepEqual(dropVariables[0]!.values, [
    { value: '1', label: 'Rot' },
    { value: '2', label: 'Blau' }
  ]);

  const equationVariables = variableMetadataBuilder.build(snapshot({
    interactionType: 'EQUATION',
    interactionParams: { variableId: 'EQUATION', operators: ['+'] }
  }));
  equal(equationVariables[0]!.type, 'string');

  const videoVariables = variableMetadataBuilder.build(
    snapshot({
      interactionType: 'VIDEO',
      interactionParams: { variableId: 'VIDEO', videoSource: 'video.mp4' }
    })
  );
  equal(videoVariables[0]!.type, 'number');

  const placeValueVariables = variableMetadataBuilder.build(
    snapshot({
      interactionType: 'PLACE_VALUE',
      interactionParams: {
        variableId: 'PLACE_VALUE',
        value: 0,
        maxNumberOfTens: 9,
        maxNumberOfOnes: 9
      }
    })
  );
  deepEqual(
    placeValueVariables.map(variable => variable.id),
    ['PLACE_VALUE', 'PLACE_VALUE_TENS']
  );
  deepEqual(
    placeValueVariables.map(variable => variable.type),
    ['integer', 'integer']);

  const imageOnlyAudioVariables = variableMetadataBuilder.build(snapshot({
    interactionType: 'IMAGE_ONLY',
    interactionParams: { imageSource: 'image.png' },
    mainAudioEnabled: true,
    mainAudioSource: 'main.mp3',
    variableInfo: [
      {
        variableId: 'mainAudio',
        responseComplete: 'ALWAYS',
        codingSource: 'VALUE',
        codes: [{
          method: 'EQUALS', parameter: '1', code: 1, score: 1
        }]
      },
      {
        variableId: 'TYPO',
        responseComplete: 'ALWAYS',
        codingSource: 'VALUE',
        codes: [{
          method: 'EQUALS', parameter: '1', code: 1, score: 1
        }]
      }
    ]
  }));
  deepEqual(imageOnlyAudioVariables.map(variable => variable.id), ['mainAudio']);
  equal(imageOnlyAudioVariables[0]!.type, 'coded');

  const implicitClosingMetaSnapshot = snapshot({
    closingMetaButtons: { variableIdReference: 'BUTTONS' },
    variableInfo: [{
      variableId: 'META',
      responseComplete: 'ALWAYS',
      codingSource: 'VALUE',
      codes: [{
        method: 'EQUALS', parameter: '1', code: 1, score: 1
      }]
    }],
    audioFeedbackEnabled: true,
    audioFeedback: {
      trigger: 'ANY_RESPONSE',
      feedback: [{
        variableId: 'META',
        parameter: '1',
        audioSource: 'meta-feedback.mp3'
      }]
    }
  });
  const implicitClosingMetaVariables = variableMetadataBuilder.build(implicitClosingMetaSnapshot);
  deepEqual(implicitClosingMetaVariables.map(variable => variable.id), ['BUTTONS', 'META']);
  equal(implicitClosingMetaVariables[1]!.type, 'coded');
  equal(definitionBuilder.buildResult(implicitClosingMetaSnapshot).issues.length, 0);
}

function testInteractionValidation(): void {
  const validParams: Record<InteractionEnum, EditorStateSnapshot['interactionParams']> = {
    BUTTONS: { variableId: 'BUTTONS', options: { buttons: [{ text: 'A' }] } },
    IMAGE_ONLY: { imageSource: 'image.png' },
    WRITE: interactionAdapters.defaultParams('WRITE'),
    DROP: { variableId: 'DROP', options: [{ text: 'A' }] },
    FIND_ON_IMAGE: { variableId: 'FIND_ON_IMAGE', imageSource: 'image.png' },
    VIDEO: { variableId: 'VIDEO', videoSource: 'video.mp4' },
    POLYGON_BUTTONS: {
      variableId: 'POLYGON_BUTTONS',
      options: [{ label: 'A', svgPath: 'M 0 0 L 10 0 L 10 10 Z' }]
    },
    PLACE_VALUE: interactionAdapters.defaultParams('PLACE_VALUE'),
    NUMBER_LINE: interactionAdapters.defaultParams('NUMBER_LINE'),
    PYRAMID: interactionAdapters.defaultParams('PYRAMID'),
    EQUATION: { variableId: 'EQUATION', operators: ['+'] },
    META: interactionAdapters.defaultParams('META'),
    NONE: interactionAdapters.defaultParams('NONE')
  };

  (Object.keys(validParams) as InteractionEnum[]).forEach(type => {
    equal(interactionAdapters.validate(type, validParams[type]).length, 0, `${type} should be valid`
    );
  });

  deepEqual(
    [
      'BUTTONS',
      'IMAGE_ONLY',
      'DROP',
      'FIND_ON_IMAGE',
      'VIDEO',
      'POLYGON_BUTTONS'
    ]
      .map(type => definitionBuilder.buildResult(
        snapshot({
          interactionType: type as InteractionEnum,
          interactionParams: interactionAdapters.defaultParams(
            type as InteractionEnum
          )
        })
      )
      )
      .map(result => result.issues.some(issue => issue.path.startsWith('interactionParameters.')
      )
      ),
    [true, true, true, true, true, true]
  );

  const invalidEquation = definitionBuilder.buildResult(
    snapshot({
      interactionType: 'EQUATION',
      interactionParams: { variableId: 'EQUATION', operators: [] }
    })
  );
  ok(
    invalidEquation.issues.some(
      issue => issue.path === 'interactionParameters.operators'
    )
  );
  equal(invalidEquation.runtimeDefinition, undefined);

  const polygonWithoutPath = definitionBuilder.buildResult(
    snapshot({
      interactionType: 'POLYGON_BUTTONS',
      interactionParams: {
        variableId: 'POLYGON_BUTTONS',
        options: [{ label: 'A' }]
      }
    })
  );
  ok(
    polygonWithoutPath.issues.some(
      issue => issue.path === 'interactionParameters.options[0].svgPath'
    )
  );
  equal(polygonWithoutPath.runtimeDefinition, undefined);

  const missingVariableId = definitionBuilder.buildResult(
    snapshot({
      interactionParams: {
        variableId: '',
        options: { buttons: [{ text: 'A' }] }
      }
    })
  );
  ok(
    missingVariableId.issues.some(
      issue => issue.path === 'interactionParameters.variableId'
    )
  );
  equal(missingVariableId.runtimeDefinition, undefined);

  const paddedVariableId = definitionBuilder.buildResult(
    snapshot({
      interactionParams: {
        variableId: ' BUTTONS ',
        options: { buttons: [{ text: 'A' }] }
      }
    })
  );
  ok(
    paddedVariableId.issues.some(
      issue => issue.path === 'interactionParameters.variableId'
    )
  );
  equal(paddedVariableId.runtimeDefinition, undefined);

  const reservedMainAudioId = definitionBuilder.buildResult(
    snapshot({
      interactionParams: {
        variableId: 'mainAudio',
        options: { buttons: [{ text: 'A' }] }
      }
    })
  );
  ok(
    reservedMainAudioId.issues.some(
      issue => issue.path === 'interactionParameters.variableId' &&
        issue.message.includes('reserviert')
    )
  );
  equal(reservedMainAudioId.runtimeDefinition, undefined);

  const duplicateMetaIds = definitionBuilder.buildResult(
    snapshot({
      variableInfo: [
        {
          variableId: 'BUTTONS',
          responseComplete: 'ALWAYS',
          codingSource: 'VALUE',
          codes: [{
            method: 'EQUALS', parameter: '1', code: 1, score: 1
          }]
        }
      ],
      closingMetaButtons: {
        variableIdReference: 'BUTTONS',
        variableIdMetaSelection: 'META_DUPLICATE',
        variableIdMetaOutcome: 'META_DUPLICATE'
      }
    })
  );
  ok(
    duplicateMetaIds.issues.some(
      issue => issue.path === 'closingMetaButtons.variableIdMetaOutcome' &&
        issue.message.includes('mehreren')
    )
  );
  equal(duplicateMetaIds.runtimeDefinition, undefined);

  const implicitMetaCollision = definitionBuilder.buildResult(
    snapshot({
      interactionType: 'META',
      interactionParams: { variableId: 'META' },
      closingMetaButtons: { variableIdReference: 'META' }
    })
  );
  ok(
    implicitMetaCollision.issues.some(
      issue => issue.path === 'closingMetaButtons.variableIdMetaSelection' &&
        issue.message.includes('mehreren')
    )
  );
  equal(implicitMetaCollision.runtimeDefinition, undefined);

  const paddedMetaId = definitionBuilder.buildResult(
    snapshot({
      closingMetaButtons: {
        variableIdReference: 'BUTTONS',
        variableIdMetaSelection: ' META '
      }
    })
  );
  ok(
    paddedMetaId.issues.some(
      issue => issue.path === 'closingMetaButtons.variableIdMetaSelection' &&
        issue.message.includes('Leerzeichen')
    )
  );
  equal(paddedMetaId.runtimeDefinition, undefined);

  equal(
    interactionAdapters.validate('IMAGE_ONLY', { imageSource: 'image.png' })
      .length,
    0
  );
}

function testCodingValidation(): void {
  const result = definitionBuilder.buildResult(
    snapshot({
      closingMetaButtons: { variableIdReference: 'MISSING' },
      variableInfo: [
        {
          variableId: 'BUTTONS',
          responseComplete: 'ALWAYS',
          codingSource: 'SUM_CHAR_MATCHES',
          codingSourceParameter: '10x',
          codes: [{
            method: 'EQUALS', parameter: '', code: 1, score: 1
          }]
        },
        {
          variableId: 'BUTTONS',
          responseComplete: 'ALWAYS',
          codingSource: 'VALUE',
          codes: []
        }
      ]
    })
  );
  ok(result.issues.some(issue => issue.message.includes('eindeutig')));
  ok(
    result.issues.some(issue => issue.path.endsWith('codingSourceParameter'))
  );
  ok(result.issues.some(issue => issue.path.endsWith('codes[0].parameter')));
  ok(
    result.issues.some(
      issue => issue.path === 'closingMetaButtons.variableIdReference'
    )
  );
  equal(result.runtimeDefinition, undefined);

  const validMultiSelectCoding = definitionBuilder.buildResult(
    snapshot({
      interactionParams: {
        variableId: 'BUTTONS',
        options: { buttons: [{ text: 'A' }, { text: 'B' }, { text: 'C' }] },
        multiSelect: true
      },
      variableInfo: [
        {
          variableId: 'BUTTONS',
          responseComplete: 'ALWAYS',
          codingSource: 'SUM_CHAR_MATCHES',
          codingSourceParameter: '101',
          codes: [{
            method: 'EQUALS', parameter: '3', code: 1, score: 1
          }]
        }
      ]
    })
  );
  equal(validMultiSelectCoding.issues.length, 0);

  const mismatchedLength = definitionBuilder.buildResult(
    snapshot({
      interactionParams: {
        variableId: 'BUTTONS',
        options: { buttons: [{ text: 'A' }, { text: 'B' }, { text: 'C' }] },
        multiSelect: true
      },
      variableInfo: [
        {
          variableId: 'BUTTONS',
          responseComplete: 'ALWAYS',
          codingSource: 'SUM_CHAR_MATCHES',
          codingSourceParameter: '10',
          codes: [{
            method: 'EQUALS', parameter: '2', code: 1, score: 1
          }]
        }
      ]
    })
  );
  ok(
    mismatchedLength.issues.some(
      issue => issue.path === 'variableInfo[0].codingSourceParameter' &&
        issue.message.includes('3 Stellen')
    )
  );
  equal(mismatchedLength.runtimeDefinition, undefined);

  const singleSelectSum = definitionBuilder.buildResult(
    snapshot({
      variableInfo: [
        {
          variableId: 'BUTTONS',
          responseComplete: 'ALWAYS',
          codingSource: 'SUM',
          codes: [{
            method: 'EQUALS', parameter: '1', code: 1, score: 1
          }]
        }
      ]
    })
  );
  ok(
    singleSelectSum.issues.some(
      issue => issue.path === 'variableInfo[0].codingSource'
    )
  );
  equal(singleSelectSum.runtimeDefinition, undefined);

  const emptyCodes = definitionBuilder.buildResult(
    snapshot({
      variableInfo: [
        {
          variableId: 'BUTTONS',
          responseComplete: 'ALWAYS',
          codingSource: 'VALUE',
          codes: []
        }
      ]
    })
  );
  ok(emptyCodes.issues.some(issue => issue.path === 'variableInfo[0].codes'));
  equal(emptyCodes.runtimeDefinition, undefined);

  const paddedCodingVariable = definitionBuilder.buildResult(
    snapshot({
      variableInfo: [
        {
          variableId: ' BUTTONS ',
          responseComplete: 'ALWAYS',
          codingSource: 'VALUE',
          codes: [{
            method: 'EQUALS', parameter: '1', code: 1, score: 1
          }]
        }
      ]
    })
  );
  ok(
    paddedCodingVariable.issues.some(
      issue => issue.path === 'variableInfo[0].variableId'
    )
  );
  equal(paddedCodingVariable.runtimeDefinition, undefined);

  const missingResponseProducer = definitionBuilder.buildResult(
    snapshot({
      variableInfo: [
        {
          variableId: 'TYPO',
          responseComplete: 'ALWAYS',
          codingSource: 'VALUE',
          codes: [{
            method: 'EQUALS', parameter: '1', code: 1, score: 1
          }]
        }
      ]
    })
  );
  ok(
    missingResponseProducer.issues.some(
      issue => issue.path === 'variableInfo[0].variableId' &&
        issue.message.includes('keine Response')
    )
  );
  equal(missingResponseProducer.runtimeDefinition, undefined);

  const undeclaredClosingReference = definitionBuilder.buildResult(
    snapshot({
      closingMetaButtons: { variableIdReference: 'TYPO' },
      variableInfo: [
        {
          variableId: 'TYPO',
          responseComplete: 'ALWAYS',
          codingSource: 'VALUE',
          codes: [{
            method: 'EQUALS', parameter: '1', code: 1, score: 1
          }]
        }
      ]
    })
  );
  ok(
    undeclaredClosingReference.issues.some(
      issue => issue.path === 'closingMetaButtons.variableIdReference'
    )
  );
  equal(undeclaredClosingReference.runtimeDefinition, undefined);
}

function testPreviewControllerEventOrder(): void {
  const definition = JSON.stringify({
    id: 'preview',
    interactionType: 'IMAGE_ONLY'
  });

  const loadThenReady = new PreviewPlayerController();
  loadThenReady.begin('test player');
  equal(loadThenReady.updateDefinition(definition, []), undefined);
  equal(loadThenReady.markIframeLoaded(), undefined);
  equal(loadThenReady.markPlayerReady(), definition);
  equal(loadThenReady.markPlayerReady(), undefined);

  const readyThenLoad = new PreviewPlayerController();
  readyThenLoad.begin('test player');
  equal(readyThenLoad.updateDefinition(definition, []), undefined);
  equal(readyThenLoad.markPlayerReady(), undefined);
  equal(readyThenLoad.markIframeLoaded(), definition);

  readyThenLoad.updateDefinition(undefined, [
    {
      path: 'openingImage.imageSource',
      severity: 'error',
      message: 'required'
    }
  ]);
  equal(readyThenLoad.state(), 'invalid-definition');
  readyThenLoad.markUnavailable('timeout');
  equal(readyThenLoad.state(), 'invalid-definition');

  const reloadWhileInvalid = new PreviewPlayerController();
  reloadWhileInvalid.begin('test player');
  reloadWhileInvalid.updateDefinition(definition, []);
  reloadWhileInvalid.markIframeLoaded();
  equal(reloadWhileInvalid.markPlayerReady(), definition);
  reloadWhileInvalid.updateDefinition(undefined, [
    {
      path: 'interactionParameters.videoSource',
      severity: 'error',
      message: 'required'
    }
  ]);
  equal(reloadWhileInvalid.markIframeLoaded(), undefined);
  equal(reloadWhileInvalid.markPlayerReady(), definition);
  equal(reloadWhileInvalid.state(), 'invalid-definition');
  const nextDefinition = JSON.stringify({
    id: 'preview-2',
    interactionType: 'VIDEO'
  });
  equal(
    reloadWhileInvalid.updateDefinition(nextDefinition, []),
    nextDefinition
  );
  equal(reloadWhileInvalid.state(), 'ready');
}

testDefinitionExportAndOrder();
testDraftValidationAndPartialRoundTrip();
testDefinitionImportAndNormalization();
testAudioFeedbackArrayPreservation();
testVariableMetadataAndDescriptors();
testInteractionValidation();
testCodingValidation();
testPreviewControllerEventOrder();

console.log('editor-state builders: ok');
