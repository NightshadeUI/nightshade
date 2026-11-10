import { ScrollerController } from '@nightshadeui/scroller/src';
import { markRaw } from 'vue';

/**
 * Creates the controller the scroller demo drives: progress from 20% into the track to its end.
 */
export class ScrollerDemoManager {

    createController() {
        return markRaw(new ScrollerController({
            start: 0.2,
            end: 1,
        }));
    }

}
