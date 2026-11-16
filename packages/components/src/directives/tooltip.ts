import { createVNode, Directive, DirectiveBinding, render } from 'vue';

import Tooltip from '../components/Tooltip.vue';

export interface TooltipOptions {
    title?: string;
    text?: string;
    dir?: string;
    align?: string;
}

export type TooltipValue = string | TooltipOptions | null | undefined;

/**
 * Each element's tooltip renders into a detached container: the bubble itself teleports to `#overlays`.
 */
const containers = new WeakMap<HTMLElement, HTMLElement>();

/**
 * `v-tooltip="'Saves the draft'"` or `v-tooltip="{ title: 'Save', text: 'Saves the draft' }"`.
 * The directive renders a `Tooltip` anchored to its element; use `Tooltip` directly for rich content.
 */
export const vTooltip: Directive<HTMLElement, TooltipValue> = {

    mounted(el, binding) {
        const container = document.createElement('div');
        containers.set(el, container);
        renderTooltip(el, binding);
    },

    updated(el, binding) {
        renderTooltip(el, binding);
    },

    beforeUnmount(el) {
        render(null, containers.get(el)!);
        containers.delete(el);
    },

};

function renderTooltip(el: HTMLElement, binding: DirectiveBinding<TooltipValue>) {
    const options = typeof binding.value === 'string' ? { text: binding.value } : binding.value ?? {};
    const vnode = createVNode(Tooltip, {
        ...options,
        anchorEl: el,
    });
    vnode.appContext = binding.instance?.$.appContext ?? null;
    render(vnode, containers.get(el)!);
}
