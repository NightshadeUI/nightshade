<template>
    <div
        class="ToolPanel"
        :class="[
            `ToolPanel-size-${size}`,
            `input-size-${size}`,
            {
                'ToolPanel-flat': flat,
                'ToolPanel-outline': outline,
                'ToolPanel-round': round,
            }
        ]">
        <slot />
    </div>
</template>

<script>
export default {

    props: {
        size: { type: String, default: 'm' },
        flat: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        round: { type: Boolean, default: false },
    },

};
</script>

<style scoped>
.ToolPanel {
    --ToolPanel-size: var(--input-height);
    --ToolPanel-padding: var(--sp0-5);
    --ToolPanel-gap: var(--input-gap);

    --ToolPanel-surface: var(--color-base-100);

    --ToolPanel-border-size: 0;
    --ToolPanel-border-color: var(--color-base-200);
    --ToolPanel-radius: var(--input-radius);

    --ToolPanel-shadow-color: var(--shadow-color-light);
    --ToolPanel-shadow: 0 1px 1px var(--ToolPanel-shadow-color) inset, 0 0 5px var(--ToolPanel-shadow-color) inset;

    display: flex;
    align-items: center;
    gap: var(--ToolPanel-gap);
    padding: var(--ToolPanel-padding);
    height: var(--ToolPanel-size);
    min-height: 0;

    border: var(--ToolPanel-border-size) solid var(--ToolPanel-border-color);
    border-radius: var(--ToolPanel-radius);
    box-shadow: var(--ToolPanel-shadow);
    background: var(--ToolPanel-surface);

    transition: color .3s, background-color .3s, border-radius .3s, filter .3s;
}

.ToolPanel-size-s {
    --ToolPanel-padding: var(--sp0-25);
}

/* Styles */

.ToolPanel-round {
    --ToolPanel-radius: var(--input-radius-round);
}

.ToolPanel-outline {
    --ToolPanel-border-size: var(--input-border-size);
}

.ToolPanel-flat {
    --ToolPanel-shadow: none;
}
</style>
