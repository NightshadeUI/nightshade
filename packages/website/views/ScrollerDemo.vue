<template>
    <div class="ScrollerDemo">
        <div
            v-for="(probe, i) in probes"
            :key="probe.title"
            ref="columns"
            class="Column"
            :style="{ '--ScrollerDemo-t': probe.controller.t }">
            <div
                v-if="i > 0"
                class="Divider" />
            <div class="Sticky">
                <div class="Title">
                    {{ probe.title }}
                </div>
                <div class="Note">
                    {{ probe.note }}
                </div>
                <div class="Seed">
                    <span
                        v-for="ring in 5"
                        :key="ring"
                        class="Ring"
                        :style="{ '--ScrollerDemo-ring': ring }" />
                </div>
                <code class="Value">t = {{ probe.controller.t.toFixed(3) }}</code>
                <span class="Bar" />
                <code class="Params">{{ formatParams(probe.params) }}</code>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * One 2400px track, read by four controllers with different anchors, side by side:
 * scroll, and compare where each `t` starts and ends.
 */
export default {

    inject: [
        'scrollerDemoManager',
    ],

    data() {
        return {
            probes: this.scrollerDemoManager.createProbes(),
        };
    },

    mounted() {
        for (const [i, probe] of this.probes.entries()) {
            probe.controller.mount(this.$refs.columns[i]);
        }
    },

    beforeUnmount() {
        for (const probe of this.probes) {
            probe.controller.unmount();
        }
    },

    methods: {

        formatParams(params) {
            const entries = Object.entries(params);
            if (!entries.length) {
                return 'defaults';
            }
            return entries.map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n');
        },

    },

};
</script>

<style scoped>
.ScrollerDemo {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    height: 2400px;
    margin: var(--sp3) 0;
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
    background: var(--surface-base);
}

.Column {
    --ScrollerDemo-t: 0;

    position: relative;
}

.Divider {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-left: 1px dashed var(--border-base);
}

.Sticky {
    position: sticky;
    top: calc(var(--Site-header-height) + var(--sp2));
    display: flex;
    flex-flow: column;
    align-items: stretch;
    gap: var(--sp1);
    padding: var(--sp2);
}

.Title {
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-s);
}

.Note {
    min-height: 3lh;
    font-size: var(--font-size-xs);
    color: var(--text-subtle);
}

.Seed {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
}

.Ring {
    position: absolute;
    inset: 0;
    margin: auto;
    width: calc(var(--ScrollerDemo-ring) * 20%);
    height: calc(var(--ScrollerDemo-ring) * 20%);
    border: 1px solid var(--color-primary-600);
    border-radius: 50%;
    background: color-mix(in oklab, var(--color-primary-500), transparent 88%);
    opacity: clamp(0.15, calc(var(--ScrollerDemo-t) * 5 - var(--ScrollerDemo-ring) + 1), 1);
    transform: scale(clamp(0.6, calc(var(--ScrollerDemo-t) * 5 - var(--ScrollerDemo-ring) + 1.6), 1));
}

.Value {
    font: var(--font-weight-bold) var(--font-size-s)/1 var(--font-monospace);
    color: var(--text-base);
}

.Bar {
    width: calc(var(--ScrollerDemo-t) * 100%);
    height: var(--sp0-5);
    border-radius: var(--radius-s);
    background: var(--color-primary-500);
}

.Params {
    font: var(--font-size-xxs)/1.4 var(--font-monospace);
    white-space: pre;
    color: var(--text-faint);
}

@media (max-width: 640px) {
    .Sticky {
        padding: var(--sp1);
    }

    .Note {
        display: none;
    }
}
</style>
