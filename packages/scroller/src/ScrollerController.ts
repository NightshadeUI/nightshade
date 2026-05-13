import { reactive } from 'vue';

import type { ScrollerParams } from './types.js';

export class ScrollerController {

    private el: HTMLElement | null = null;
    private frame = 0;
    private state = reactive({
        t: 0,
    });

    private onScroll = () => this.update();

    constructor(
        readonly params: ScrollerParams = {},
    ) {}

    get t() {
        return this.state.t;
    }

    mount(el: HTMLElement) {
        this.el = el;
        window.addEventListener('scroll', this.onScroll, { passive: true });
        this.update();
    }

    unmount() {
        this.el = null;
        window.removeEventListener('scroll', this.onScroll);
        cancelAnimationFrame(this.frame);
    }

    update() {
        cancelAnimationFrame(this.frame);
        this.frame = requestAnimationFrame(() => this.updateNow());
    }

    private updateNow() {
        if (!this.el) {
            return;
        }
        this.state.t = this.computeT(this.el);
    }

    private computeT(el: HTMLElement) {
        const {
            start = 0,
            end = 1,
            startAnchor = 'top',
            endAnchor = 'bottom',
        } = this.params;
        const h = window.innerHeight;
        const rect = el.getBoundingClientRect();
        const startAnchorY = startAnchor === 'top' ? rect.top : rect.top + rect.height;
        const endAnchorY = endAnchor === 'top' ? rect.top : rect.top + rect.height;
        const startY = startAnchorY - h * (1 - start);
        const endY = endAnchorY - h * (1 - end);
        const extent = endY - startY;
        const t = (0 - startY) / extent;
        return Math.min(1, Math.max(0, t));
    }

}
