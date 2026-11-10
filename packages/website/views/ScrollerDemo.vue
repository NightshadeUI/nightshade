<template>
    <div
        ref="track"
        class="ScrollerDemo"
        :style="{ '--ScrollerDemo-t': t }">
        <div class="Sticky">
            <div class="Seed">
                <span
                    v-for="ring in 5"
                    :key="ring"
                    class="Ring"
                    :style="{ '--ScrollerDemo-ring': ring }" />
            </div>
            <div class="Readout">
                <code>scroller.t = {{ t.toFixed(3) }}</code>
                <span class="Bar" />
            </div>
        </div>
    </div>
</template>

<script>
export default {

    inject: [
        'scrollerDemoManager',
    ],

    computed: {

        t() {
            return this.scroller?.t ?? 0;
        },

    },

    created() {
        this.scroller = this.scrollerDemoManager.createController();
    },

    mounted() {
        this.scroller.mount(this.$refs.track);
    },

    beforeUnmount() {
        this.scroller.unmount();
    },

};
</script>

<style scoped>
.ScrollerDemo {
    --ScrollerDemo-t: 0;

    height: 150vh;
    margin: var(--sp3) 0;
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
    background: var(--surface-base);
}

.Sticky {
    position: sticky;
    top: calc(var(--Site-header-height) + var(--sp4));
    display: flex;
    flex-flow: column;
    align-items: center;
    gap: var(--sp3);
    padding: var(--sp6) var(--sp3);
}

.Seed {
    position: relative;
    width: 240px;
    height: 240px;
}

.Ring {
    position: absolute;
    inset: 0;
    margin: auto;
    width: calc(var(--ScrollerDemo-ring) * 48px);
    height: calc(var(--ScrollerDemo-ring) * 48px);
    border: 1px solid var(--color-primary-600);
    border-radius: 50%;
    background: color-mix(in oklab, var(--color-primary-500), transparent 88%);
    opacity: clamp(0, calc(var(--ScrollerDemo-t) * 5 - var(--ScrollerDemo-ring) + 1), 1);
    transform: scale(clamp(0.6, calc(var(--ScrollerDemo-t) * 5 - var(--ScrollerDemo-ring) + 1.6), 1));
}

.Readout {
    display: flex;
    flex-flow: column;
    align-items: center;
    gap: var(--sp1);
    width: 240px;
    font: 400 12px/1 var(--font-monospace);
    color: var(--text-subtle);
}

.Bar {
    width: calc(var(--ScrollerDemo-t) * 100%);
    height: 4px;
    align-self: flex-start;
    border-radius: var(--radius-s);
    background: var(--color-primary-500);
}
</style>
