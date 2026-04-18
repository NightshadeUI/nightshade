<template>
    <label
        class="Checkbox InputElement"
        :class="[
            `ui-${effectiveStyle.kind}`,
            `input-size-${effectiveStyle.size}`,
            `Checkbox-mark-${resolvedProps.mark}`,
            {
                'Checkbox-active': !!resolvedProps.modelValue,
                'Checkbox-outline': effectiveStyle.outline,
                'Checkbox-round': effectiveStyle.round,
                'Checkbox-flat': effectiveStyle.flat,
                'Checkbox-disabled': resolvedProps.disabled,
                'Checkbox-force-focus': resolvedProps.forceFocus,
                'Checkbox-force-hover': resolvedProps.forceHover,
            }
        ]"
        tabindex="0"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @focusin="focus = true"
        @focusout="focus = false">
        <slot v-if="resolvedProps.modelValue" name="active">
            <component
                :is="markComponent"
                v-if="markComponent"
                class="Mark MarkGlyph" />
            <div
                v-else
                class="Mark" />
        </slot>
        <slot v-if="!resolvedProps.modelValue" name="inactive" />
        <input
            type="checkbox"
            :checked="resolvedProps.modelValue"
            :disabled="resolvedProps.disabled"
            @change="onChange" />
    </label>
</template>

<script>
import {
    GhyphXmark,
    GlyphCheck,
} from '../glyphs/index.js';
import {
    nightshadeMixin,
} from '../utils/props';

export default {

    mixins: [nightshadeMixin],

    props: {
        mark: { type: String, default: 'check' },
        modelValue: { type: Boolean },
        disabled: { type: Boolean },
        kind: { type: String, default: 'base' },
        activeKind: { type: String },
        size: { type: String, default: 'm' },
        round: { type: Boolean, default: false },
        flat: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        forceFocus: { type: Boolean, default: false },
        forceHover: { type: Boolean, default: false },
        focusOverrides: { type: Object },
        hoverOverrides: { type: Object },
    },

    emits: [
        'update:modelValue',
    ],

    data() {
        return {
            hover: false,
            focus: false,
        };
    },

    computed: {

        markComponent() {
            if (this.resolvedProps.mark === 'check') {
                return GlyphCheck;
            }
            if (this.resolvedProps.mark === 'xmark') {
                return GhyphXmark;
            }
            return null;
        },

        isActive() {
            return !!this.resolvedProps.modelValue;
        },

        baseStyle() {
            const { resolvedProps } = this;
            return {
                kind: (this.isActive ? resolvedProps.activeKind : resolvedProps.kind) ?? resolvedProps.kind,
                size: resolvedProps.size,
                round: resolvedProps.round,
                outline: resolvedProps.outline,
                flat: resolvedProps.flat,
            };
        },

        effectiveStyle() {
            const {
                baseStyle,
                hoverOverrides = {},
                focusOverrides = {},
                hover,
                focus,
                resolvedProps,
            } = this;
            const { forceHover, forceFocus } = resolvedProps;
            const style = Object.assign({}, baseStyle);
            if (hover || forceHover) {
                Object.assign(style, hoverOverrides);
            }
            if (focus || forceFocus) {
                Object.assign(style, focusOverrides);
            }
            return style;
        },

    },

    methods: {

        onChange(ev) {
            this.$emit('update:modelValue', ev.target.checked);
        }

    }

};
</script>

<style scoped>
.Checkbox {
    --Checkbox-size: var(--input-minor-height);

    --Checkbox-outline-color: transparent;

    --Checkbox-surface: var(--color-base-200);

    --Checkbox-border-size: 0px;
    --Checkbox-border-color: transparent;
    --Checkbox-radius: var(--border-radius);

    --Checkbox-shadow: 0 1px 3px var(--Checkbox-shadow-color) inset, 0 0 5px -1px var(--Checkbox-shadow-color) inset;
    --Checkbox-shadow-color: var(--shadow-color-light);
    --Checkbox-mark-shadow: 0 1px 1px var(--ui-auto-text-shadow-color);

    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: var(--Checkbox-size);
    height: var(--Checkbox-size);
    overflow: hidden;

    border: var(--Checkbox-border-size) solid var(--Checkbox-border-color);
    border-radius: var(--Checkbox-radius);

    background: var(--Checkbox-surface);
    outline: var(--input-outline-size) solid var(--Checkbox-outline-color);
    outline-offset: var(--input-outline-offset);
    background-clip: border-box;

    font-size: var(--Checkbox-size);
    color: var(--ui-surface-text-color);
    text-shadow: var(--Checkbox-mark-shadow);
    box-shadow: var(--Checkbox-shadow);

    cursor: pointer;
    user-select: none;

    transition: background-color .3s, border-radius .3s;
}

.Checkbox input {
    display: none;
}

.Mark {
    opacity: 0;

    transition: opacity .1s, border-radius .3s;
}

.MarkGlyph {
    width: 1em;
    height: 1em;
}

.Checkbox-active .Mark {
    opacity: 1;
}

/* Marks */

.Checkbox-mark-dot .Mark::after {
    content: '●';
}

.Checkbox-mark-knob .Mark {
    content: '';
    width: calc(var(--Checkbox-size) - var(--sp));
    height: calc(var(--Checkbox-size) - var(--sp));
    border-radius: calc(var(--Checkbox-radius) - 2px);
    background: var(--ui-surface-text-color);
    box-shadow: 0 1px 2px var(--Checkbox-shadow-color);
}

/* States */

.Checkbox-disabled {
    cursor: not-allowed;
    opacity: .5;
}

.Checkbox:not(:disabled):hover, .Checkbox.Checkbox-force-hover {
    filter: brightness(.96);
}

.Checkbox:not(:disabled):focus, .Checkbox.Checkbox-force-focus {
    z-index: 10;
    --Checkbox-outline-color: var(--ui-focus-outline-color);
    --Checkbox-border-color: var(--ui-focus-border-color);
}

.Checkbox-active {
    --Checkbox-surface: var(--ui-surface-color);
}

/* Styles */

.Checkbox-round {
    --Checkbox-radius: calc(.5 * var(--input-major-height));
}

.Checkbox-outline {
    --Checkbox-border-color: var(--ui-border-color);
    --Checkbox-border-size: var(--input-border-size);
}

.Checkbox-flat {
    --Checkbox-shadow: none;
    --Checkbox-shadow-color: none;
    --Checkbox-mark-shadow: none;
}
</style>
