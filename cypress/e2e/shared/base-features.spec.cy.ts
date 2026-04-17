import { veronaInterfaceFeatures } from './verona-interface.spec.cy';
import { testMainAudioFeatures } from './main-audio.spec.cy';
import { testContinueButtonFeatures } from './continue-button.spec.cy';
import { testRibbonBars } from './ribbon-bar.spec.cy';
import { testOpeningImageFeatures } from './opening-image.spec.cy';
import { testAudioFeedback } from './audio-feedback.spec.cy';
import { firstAudioOptionsFeatures } from './first-audio-options.spec.cy';

export function testBaseFeatures(interactionType: string, defaultTestFile: string) {
  describe('Shared Features', () => {
    veronaInterfaceFeatures(interactionType);
    testMainAudioFeatures(interactionType, defaultTestFile);
    testContinueButtonFeatures(interactionType);
    testRibbonBars(interactionType, `${interactionType}_ribbonBars_true_test`);
    testOpeningImageFeatures(interactionType, `${interactionType}_with_openingImage_test`);
    testAudioFeedback(interactionType, `${interactionType}_feedback_test`);
    firstAudioOptionsFeatures(interactionType, `${interactionType}_firstClickLayer_transparent_test`);
  });
}
