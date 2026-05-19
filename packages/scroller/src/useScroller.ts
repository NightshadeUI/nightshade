import { onMounted, onUnmounted, ref, toRef } from 'vue';

import { ScrollerController } from './ScrollerController.js';
import { ScrollerParams } from './types.js';

export function useScroller(params: ScrollerParams = {}) {
    const scrollerEl = ref<HTMLElement | null>(null);
    const scroller = new ScrollerController(params);
    onMounted(() => {
        const el = scrollerEl.value;
        if (!el) {
            return;
        }
        scroller.mount(el);
    });
    onUnmounted(() => {
        scroller.unmount();
    });
    return {
        t: toRef(scroller, 't'),
        scrollerEl,
        updateScroller: () => scroller.update(),
    };
}
