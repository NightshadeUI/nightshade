<template>
    <div
        class="Demo"
        :class="{
            'Demo-dual': dual,
            'Demo-stacked': stacked,
            'Demo-column': column,
            'Demo-grid': grid,
        }">
        <div
            v-for="scheme in schemes"
            :key="scheme"
            class="Stage"
            :class="`Stage-${scheme}`">
            <span
                v-if="dual"
                class="SchemeLabel">
                {{ scheme }}
            </span>
            <div class="StageContent">
                <slot :state="state" />
            </div>
        </div>
    </div>
</template>

<script>
import { toRaw } from 'vue';

/**
 * A live demo stage. Components inside take the app's `$nightshade.defaults`, or the site's
 * `demoDefaults` when it provides them (a playground that sets states for every demo),
 * and the slot gets a `state` object seeded from `initial` for `v-model`.
 * With `grid`, the stage draws the spacing grid its content snaps to. With `dual`, the schemes stand side by side,
 * or one above the other with `stacked`, for wide content.
 */
export default {

    inject: {
        appDefaults: {
            from: '$nightshade',
            default: () => ({ defaults: {} }),
        },
        demoDefaults: {
            from: 'demoDefaults',
            default: null,
        },
    },

    provide() {
        const source = this.demoDefaults ?? this.appDefaults;
        return {
            $nightshade: {
                get defaults() {
                    return source.defaults;
                },
            },
        };
    },

    props: {
        dual: { type: Boolean, default: false },
        stacked: { type: Boolean, default: false },
        column: { type: Boolean, default: false },
        grid: { type: Boolean, default: false },
        initial: { type: Object, default: () => ({}) },
    },

    data() {
        return {
            state: structuredClone(toRaw(this.initial)),
        };
    },

    computed: {

        schemes() {
            return this.dual ? ['light', 'dark'] : ['auto'];
        },

    },

};
</script>

<style scoped>
.Demo {
    display: grid;
    gap: 1px;
    margin: var(--sp3) 0;
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
    background: var(--border-base);
    overflow: hidden;
}

.Demo-dual {
    grid-template-columns: 1fr 1fr;
}

.Demo-stacked {
    grid-template-columns: minmax(0, 1fr);
}

.Stage {
    position: relative;
    padding: var(--sp5) var(--sp3);
    background: var(--surface-base);
    color: var(--text-base);
}

/* The grid is the spacing scale: a line every --sp. Content starts on a line. */

.Demo-grid .Stage {
    --Demo-grid-line: color-mix(in oklab, var(--color-primary-500), transparent 82%);
    padding: var(--sp4);
    background-image:
        linear-gradient(to right, var(--Demo-grid-line) 1px, transparent 1px),
        linear-gradient(to bottom, var(--Demo-grid-line) 1px, transparent 1px);
    background-size: var(--sp) var(--sp);
    background-position: -.5px -.5px;
}

.Demo-grid .StageContent {
    justify-content: flex-start;
    align-items: flex-start;
    gap: var(--sp1);
}

.Stage-light {
    color-scheme: light;
}

.Stage-dark {
    color-scheme: dark;
}

.StageContent {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
    gap: var(--sp1-5);
}

.Demo-column .StageContent {
    flex-flow: column;
    align-items: stretch;
    max-width: 420px;
    margin: 0 auto;
}

.SchemeLabel {
    position: absolute;
    top: var(--sp1);
    left: var(--sp1-5);
    font: 600 var(--font-size-xs)/1 var(--font-main);
    color: var(--text-faint);
}

@media (max-width: 640px) {
    .Demo-dual {
        grid-template-columns: 1fr;
    }
}
</style>
