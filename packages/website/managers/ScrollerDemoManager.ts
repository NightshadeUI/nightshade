import { ScrollerController, ScrollerParams } from '@nightshadeui/scroller/src';
import { markRaw } from 'vue';

export interface ScrollerProbe {
    title: string;
    note: string;
    params: ScrollerParams;
    controller: ScrollerController;
}

/**
 * Creates the probes the scroller demo drives: one controller per column,
 * all reading the same track with different anchors.
 */
export class ScrollerDemoManager {

    createProbes(): ScrollerProbe[] {
        return [
            this.createProbe('top → bottom', 'the whole pass: top enters, bottom leaves', {}),
            this.createProbe('top → top', 'the top edge crossing the viewport', {
                startAnchor: 'top',
                endAnchor: 'top',
            }),
            this.createProbe('bottom → bottom', 'the bottom edge crossing the viewport', {
                startAnchor: 'bottom',
                endAnchor: 'bottom',
            }),
            this.createProbe('top → bottom, 50%', 'while the track covers the middle', {
                start: 0.5,
                end: 0.5,
            }),
        ];
    }

    private createProbe(title: string, note: string, params: ScrollerParams): ScrollerProbe {
        return {
            title,
            note,
            params,
            controller: markRaw(new ScrollerController(params)),
        };
    }

}
