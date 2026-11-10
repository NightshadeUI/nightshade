<template>
    <div
        class="ToolPanel"
        :class="[
            resolvedProps.size && `ToolPanel-size-${resolvedProps.size}`,
            resolvedProps.size && `input-size-${resolvedProps.size}`,
            {
                'ToolPanel-flat': resolvedProps.flat,
                'ToolPanel-outline': resolvedProps.outline,
                'ToolPanel-round': resolvedProps.round,
            }
        ]">
        <slot />
    </div>
</template>

<script>
import {
    nightshadeMixin,
} from '../helpers/props.js';

export default {

    mixins: [nightshadeMixin],

    props: {
        size: { type: String },
        flat: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        round: { type: Boolean, default: false },
    },

};
</script>

<style scoped>
.ToolPanel {
    --ToolPanel-size: var(--input-major-height);
    --ToolPanel-padding: var(--input-minor-padding);
    --ToolPanel-gap: var(--input-gap);

    --ToolPanel-background: var(--surface-deep);

    --ToolPanel-border-size: 0;
    --ToolPanel-border: var(--border-deep);
    --ToolPanel-radius: var(--radius-m);

    --ToolPanel-shadow: var(--shadow-light);
    --ToolPanel-box-shadow: 0 1px 1px var(--ToolPanel-shadow) inset, 0 0 5px var(--ToolPanel-shadow) inset;

    display: flex;
    align-items: center;
    gap: var(--ToolPanel-gap);
    padding: var(--ToolPanel-padding);
    height: var(--ToolPanel-size);
    min-height: 0;

    border: var(--ToolPanel-border-size) solid var(--ToolPanel-border);
    border-radius: var(--ToolPanel-radius);
    box-shadow: var(--ToolPanel-box-shadow);
    background: var(--ToolPanel-background);

    transition: color .3s, background-color .3s, border-radius .3s, filter .3s;
}

.ToolPanel-size-s {
    --ToolPanel-padding: var(--sp0-25);
}

/* Styles */

.ToolPanel-round {
    --ToolPanel-radius: calc(.5 * var(--ToolPanel-size));
}

.ToolPanel-outline {
    --ToolPanel-border-size: var(--input-border-size);
}

.ToolPanel-flat {
    --ToolPanel-box-shadow: none;
}
</style>
