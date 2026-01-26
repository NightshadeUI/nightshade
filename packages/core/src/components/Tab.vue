<template>
    <component
        :is="tagName"
        class="Tab"
        :class="[
            `ui-${kind}`,
            `input-size-${size}`,
            `Tab-${dir}`,
            `Tab-${orientation}`,
        ]">
        <TabCap
            class="TabCap"
            :dir="dir"
            type="start" />
        <div class="Content">
            <slot>
                <div
                    v-if="label"
                    class="TabLabel"
                    :title="label">
                    {{ label }}
                </div>
            </slot>
        </div>
        <TabCap
            class="TabCap"
            :dir="dir"
            type="end" />
    </component>
</template>

<script>
export default {

    props: {
        tagName: { type: String, default: 'div' },
        dir: { type: String, default: 'top' },
        label: { type: String },

        size: { type: String, default: 'm' },
        kind: { type: String, default: 'base' },
    },

    computed: {

        orientation() {
            return this.dir === 'top' || this.dir === 'bottom' ? 'h' : 'v';
        },

    },

};
</script>

<style scoped>
.Tab {
    --Tab-size: var(--input-height);
    --Tab-cap-size: var(--input-height);
    --Tab-font-size: var(--input-font-size);

    --Tab-surface: var(--ui-surface-color);
    --Tab-text-color: var(--ui-surface-text-color);

    --Tab-shadow-color: var(--shadow-color-medium);
    --Tab-shadow: 0 0 .5px var(--Tab-shadow-color);

    display: flex;
    cursor: pointer;
    position: relative;

    color: var(--Tab-text-color);
    filter: drop-shadow(var(--Tab-shadow));

    font-size: var(--Tab-font-size);
}

.TabCap, .Content {
    position: relative;
    z-index: 2;
}

.Content {
    min-width: 0;
    display: flex;
    align-items: center;
    background: var(--Tab-surface);
    color: var(--Tab-color);
}

.TabLabel {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.Tab-h {
    flex-flow: row;
    height: var(--Tab-size);
}

.Tab-v {
    flex-flow: column;
    width: var(--Tab-size);
}

.Tab-v .Content {
    writing-mode: vertical-lr;
    text-orientation: sideways-right;
    transform: rotate(180deg);
    transform-origin: 50% 50%;
}

.TabCap {
    flex: 0 0 var(--Tab-cap-size);
    fill: var(--Tab-surface);
}

.Tab-h .TabCap {
    width: var(--Tab-cap-size);
}

.Tab-v .TabCap {
    height: var(--Tab-cap-size);
}
</style>
