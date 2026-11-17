<template>
    <div class="PlaygroundBar">
        <span class="Title">Playground</span>
        <div class="Group">
            <Btn
                v-for="option in playgroundManager.lookOptions"
                :key="option.key"
                :label="option.label"
                :tone="playgroundManager.options[option.key] ? 'primary' : undefined"
                :ghost="!playgroundManager.options[option.key]"
                size="s"
                flat
                @click="playgroundManager.toggleOption(option.key)" />
        </div>
        <span class="Divider" />
        <div class="Group">
            <Btn
                v-for="option in stateOptions"
                :key="option.key"
                :label="option.label"
                :tone="playgroundManager.options[option.key] ? 'secondary' : undefined"
                :ghost="!playgroundManager.options[option.key]"
                size="s"
                flat
                @click="playgroundManager.toggleOption(option.key)" />
        </div>
        <Btn
            v-if="playgroundManager.modified"
            class="Reset"
            icon="fas fa-rotate-left"
            title="Reset playground"
            size="s"
            square
            ghost
            @click="playgroundManager.reset()" />
    </div>
</template>

<script>
/**
 * Sets the control options every demo on the site follows.
 * `active` adds the Active switch, for pages with buttons: no other control has a pressed state.
 */
export default {

    inject: [
        'playgroundManager',
    ],

    props: {
        active: { type: Boolean, default: false },
    },

    computed: {

        stateOptions() {
            return this.playgroundManager.stateOptions.filter(option => this.active || option.key !== 'forceActive');
        },

    },

    mounted() {
        // A forced press left on from another page would have no switch here to turn it off
        if (!this.active) {
            this.playgroundManager.clearOption('forceActive');
        }
    },

};
</script>

<style scoped>
.PlaygroundBar {
    position: sticky;
    z-index: 20;
    top: calc(var(--Site-header-height) + var(--sp1));
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    gap: var(--sp1);
    margin: var(--sp3) 0;
    padding: var(--sp1) var(--sp1-5);
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
    background: color-mix(in oklab, var(--surface-base), transparent 15%);
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 24px -12px var(--shadow-medium);
}

.Title {
    margin-right: var(--sp0-5);
    font: 600 var(--font-size-xs) var(--font-main);
    line-height: var(--line-height-main);
    color: var(--text-faint);
}

.Group {
    display: flex;
    flex-flow: row wrap;
    gap: var(--sp0-5);
}

.Divider {
    width: 1px;
    height: var(--sp2);
    background: var(--border-base);
}

.Reset {
    margin-left: auto;
}
</style>
