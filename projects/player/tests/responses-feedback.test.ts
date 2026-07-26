import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import { deepEqual, equal } from 'node:assert/strict';
import { ShowResponse } from '../src/app/models/feedback';
import { ResponsesService } from '../src/app/services/responses.service';
import { VeronaPostService } from '../src/app/services/verona-post.service';

type ResponsesServiceInternals = {
  pendingShowResponses: ShowResponse[];
};

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
const testWindow = {} as Window;
Object.defineProperty(testWindow, 'parent', { value: testWindow });
Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: testWindow
});

try {
  const injector = Injector.create({
    providers: [{ provide: VeronaPostService, useValue: {} }]
  });
  const responsesService = runInInjectionContext(
    injector,
    () => new ResponsesService()
  );
  const internals = responsesService as unknown as ResponsesServiceInternals;

  internals.pendingShowResponses = [
    { variableId: 'PLACE_VALUE', value: '13', delayMS: 0 },
    { variableId: 'PLACE_VALUE_TENS', value: '2', delayMS: 0 }
  ];
  responsesService.startFeedback();
  deepEqual(responsesService.feedbackHints(), {
    PLACE_VALUE: '13',
    PLACE_VALUE_TENS: '2'
  });

  internals.pendingShowResponses = [
    { variableId: 'PLACE_VALUE', value: '31', delayMS: 0 }
  ];
  responsesService.startFeedback();
  deepEqual(responsesService.feedbackHints(), { PLACE_VALUE: '31' });
  equal(responsesService.feedbackHintFor('PLACE_VALUE_TENS'), '');
  equal(responsesService.feedbackHint(), '31');

  internals.pendingShowResponses = [];
  responsesService.startFeedback();
  deepEqual(responsesService.feedbackHints(), {});
  equal(responsesService.feedbackHint(), '');
} finally {
  if (originalWindow) {
    Object.defineProperty(globalThis, 'window', originalWindow);
  } else {
    delete (globalThis as { window?: Window }).window;
  }
}

console.log('responses feedback: ok');
