<template>
    <component
        :is="resolvedProps.tagName"
        class="Chip InputElement"
        :class="[
            effectiveStyle.tone && `tone-${effectiveStyle.tone}`,
            effectiveStyle.size && `input-size-${effectiveStyle.size}`,
            {
                'Chip-round': effectiveStyle.round,
                'Chip-outline': effectiveStyle.outline,
                'Chip-ghost': effectiveStyle.ghost,
                'Chip-flat': effectiveStyle.flat,
                'Chip-translucent': effectiveStyle.translucent && !effectiveStyle.ghost,
                'Chip-disabled': resolvedProps.disabled,
                'Chip-forceFocus': resolvedProps.forceFocus,
                'Chip-forceHover': resolvedProps.forceHover,
            },
        ]"
        :disabled="resolvedProps.disabled">
        <slot name="before" />
        <slot>
            <i
                v-if="resolvedProps.icon"
                :class="resolvedProps.icon"
                class="Icon" />
            <span
                v-if="resolvedProps.label"
                class="Label">
                {{ resolvedProps.label }}
            </span>
        </slot>
        <slot name="after" />
    </component>
</template>

<script>
import {
    nightshadeMixin,
} from '../helpers/props.js';

/**
 * A compact label on the tint of its tone: tags, filters, segmented choices.
 * Like `Btn`, it holds no selection state: the caller says how a chosen chip looks.
 */
export default {

    mixins: [nightshadeMixin],

    props: {
        tagName: { type: String, default: 'button' },
        label: { type: String },
        icon: { type: String },

        tone: { type: String },
        size: { type: String },
        flat: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        ghost: { type: Boolean, default: false },
        round: { type: Boolean, default: false },
        translucent: { type: Boolean, default: false },

        disabled: { type: Boolean, default: false },
        forceFocus: { type: Boolean, default: false },
        forceHover: { type: Boolean, default: false },
    },

    computed: {

        effectiveStyle() {
            const { resolvedProps } = this;
            return {
                tone: resolvedProps.tone,
                size: resolvedProps.size,
                flat: resolvedProps.flat,
                outline: resolvedProps.outline,
                ghost: resolvedProps.ghost,
                round: resolvedProps.round,
                translucent: resolvedProps.translucent,
            };
        },

    },

};
</script>

<style scoped>
.Chip {
    --Chip-size: var(--input-major-height);
    --Chip-padding: var(--input-major-padding);
    --Chip-gap: var(--input-gap);
    --Chip-font-size: var(--input-font-size);

    --Chip-background: var(--tone-tint);
    --Chip-text: var(--tone-tint-text);
    --Chip-icon: var(--tone-tint-text);

    --Chip-border-size: 0px;
    --Chip-border: transparent;
    --Chip-outline: transparent;
    --Chip-radius: var(--radius-m);

    --Chip-box-shadow: 0 1px 1px var(--shadow-light);

    -webkit-appearance: none;
    appearance: none;

    position: relative;
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: var(--Chip-gap);
    box-sizing: border-box;
    height: var(--Chip-size);
    margin: 0;
    padding: 0 var(--Chip-padding);

    border: var(--Chip-border-size) solid var(--Chip-border);
    border-radius: var(--Chip-radius);
    outline: var(--input-outline-size) solid var(--Chip-outline);
    outline-offset: var(--input-outline-offset);

    background: var(--Chip-background);
    box-shadow: var(--Chip-box-shadow);
    color: var(--Chip-text);

    font-family: inherit;
    font-size: var(--Chip-font-size);
    white-space: nowrap;
    cursor: pointer;
    user-select: none;

    transition: background-color .2s, color .2s, border-color .2s, border-radius .3s;
}

.Chip::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--input-hover-overlay);
    mix-blend-mode: color-dodge;
    pointer-events: none;
    opacity: 0;
}

.Icon {
    color: var(--Chip-icon);
}

/* States */

.Chip:not(.Chip-disabled):hover::after,
.Chip-forceHover::after {
    opacity: 1;
}

.Chip:not(.Chip-disabled):focus-visible,
.Chip-forceFocus {
    z-index: 10;
    --Chip-outline: var(--tone-focus-outline);
    --Chip-border: var(--tone-focus-border);
}

.Chip-disabled {
    opacity: var(--input-disabled-opacity);
    filter: var(--input-disabled-filter);
    cursor: not-allowed;
}

/* Styles */

.Chip-round {
    --Chip-radius: calc(.5 * var(--Chip-size));
}

.Chip-outline {
    --Chip-border-size: var(--input-border-size);
    --Chip-border: var(--tone-border);
}

.Chip-ghost {
    --Chip-background: transparent;
    --Chip-text: var(--tone-text);
    --Chip-icon: var(--tone-text);
    --Chip-border: var(--tone-text);
    --Chip-box-shadow: none;
}

.Chip-flat {
    --Chip-box-shadow: none;
}

.Chip-translucent {
    --Chip-background: color-mix(in srgb, var(--tone-tint), transparent var(--translucency-mix-medium));
    --Chip-box-shadow: 0 0 3px var(--translucency-highlight) inset;
    backdrop-filter: blur(var(--translucency-blur));
}

.Chip-ghost.Chip-translucent {
    --Chip-background: transparent;
    --Chip-box-shadow: none;
    backdrop-filter: none;
}
</style>
