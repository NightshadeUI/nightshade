export type ScrollerAnchor = 'top' | 'bottom';

export interface ScrollerParams {
    start?: number;
    end?: number;
    startAnchor?: ScrollerAnchor;
    endAnchor?: ScrollerAnchor;
}
