<template>
    <Transition
        :name="'fade-' + resolvedProps.dir"
        appear>
        <div
            class="Bubble"
            :class="[
                `Bubble-${resolvedProps.dir}`,
                `Bubble-${resolvedProps.align}`,
            ]">
            <div
                v-if="resolvedProps.arrowShown"
                class="Arrow" />
            <div class="Body">
                <slot />
            </div>
        </div>
    </Transition>
</template>

<script>
import { nightshadeMixin } from '../helpers/props.js';

export default {

    mixins: [nightshadeMixin],

    props: {
        dir: { type: String, default: 'bottom' },
        align: { type: String, default: 'start' },
        arrowShown: { type: Boolean, default: true },
    },

};
</script>

<style scoped>
/* Nightshade's order, stated wherever these styles load first. */
@layer nightshade, nightshade-docs, nightshade-components;

@layer nightshade-components {

    /* A point: the arrow's tip. The arrow and the body sit outside it, on the `dir` side */
    .Bubble {
        --Bubble-background: var(--surface-raised);
        --Bubble-arrow-size: var(--sp);
        --Bubble-arrow-offset: var(--sp2);
        --Bubble-radius: var(--radius-m);
        --Bubble-max-width: calc(100vw - var(--sp4));
        --Bubble-shadow: var(--shadow-light);
        --Bubble-filter: drop-shadow(0 1px 3px var(--Bubble-shadow));

        position: absolute;
        z-index: 10;
        width: 0;
        height: 0;
        filter: var(--Bubble-filter);
    }

    /* A point has no width to shrink into, so the body takes its content's */
    .Body {
        position: absolute;
        width: max-content;
        max-width: var(--Bubble-max-width);
        min-width: var(--sp6);
        min-height: var(--sp2);
        border-radius: var(--Bubble-radius);
        background: var(--Bubble-background);
    }

    /* Clipped to the triangle, so it covers nothing past the tip */
    .Arrow {
        position: absolute;
        background: var(--Bubble-background);
    }

    /* Directions */

    .Bubble-top > .Body {
        bottom: var(--Bubble-arrow-size);
    }

    .Bubble-bottom > .Body {
        top: var(--Bubble-arrow-size);
    }

    .Bubble-left > .Body {
        right: var(--Bubble-arrow-size);
    }

    .Bubble-right > .Body {
        left: var(--Bubble-arrow-size);
    }

    /* Alignments: where the arrow lands along the body's edge */

    .Bubble-start.Bubble-top > .Body,
    .Bubble-start.Bubble-bottom > .Body {
        left: calc(-1 * var(--Bubble-arrow-offset));
    }

    .Bubble-center.Bubble-top > .Body,
    .Bubble-center.Bubble-bottom > .Body {
        left: 0;
        transform: translateX(-50%);
    }

    .Bubble-end.Bubble-top > .Body,
    .Bubble-end.Bubble-bottom > .Body {
        right: calc(-1 * var(--Bubble-arrow-offset));
    }

    .Bubble-start.Bubble-left > .Body,
    .Bubble-start.Bubble-right > .Body {
        top: calc(-1 * var(--Bubble-arrow-offset));
    }

    .Bubble-center.Bubble-left > .Body,
    .Bubble-center.Bubble-right > .Body {
        top: 0;
        transform: translateY(-50%);
    }

    .Bubble-end.Bubble-left > .Body,
    .Bubble-end.Bubble-right > .Body {
        bottom: calc(-1 * var(--Bubble-arrow-offset));
    }

    /* Arrows */

    .Bubble-top > .Arrow,
    .Bubble-bottom > .Arrow {
        left: calc(-1 * var(--Bubble-arrow-size));
        width: calc(2 * var(--Bubble-arrow-size));
        height: var(--Bubble-arrow-size);
    }

    .Bubble-left > .Arrow,
    .Bubble-right > .Arrow {
        top: calc(-1 * var(--Bubble-arrow-size));
        width: var(--Bubble-arrow-size);
        height: calc(2 * var(--Bubble-arrow-size));
    }

    .Bubble-top > .Arrow {
        bottom: 0;
        clip-path: polygon(0 0, 100% 0, 50% 100%);
    }

    .Bubble-bottom > .Arrow {
        top: 0;
        clip-path: polygon(50% 0, 100% 100%, 0 100%);
    }

    .Bubble-left > .Arrow {
        right: 0;
        clip-path: polygon(0 0, 100% 50%, 0 100%);
    }

    .Bubble-right > .Arrow {
        left: 0;
        clip-path: polygon(0 50%, 100% 0, 100% 100%);
    }

}
</style>
