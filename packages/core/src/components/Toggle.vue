<template>
    <label
        class="Toggle InputElement"
        :class="[
            `Toggle-${effectiveStyle.kind}`,
            `input-kind-${effectiveStyle.kind}`,
            `Toggle-${effectiveStyle.size}`,
            {
                'Toggle-active': !!modelValue,
                'Toggle-outline': effectiveStyle.outline,
                'Toggle-round': effectiveStyle.round,
                'Toggle-flat': effectiveStyle.flat,
                'Toggle-disabled': disabled,
                'Toggle-force-focus': forceFocus,
                'Toggle-force-hover': forceHover,
            }
        ]"
        tabindex="0"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @focusin="focus = true"
        @focusout="focus = false">
        <input
            type="checkbox"
            :checked="modelValue"
            :disabled="disabled"
            @change="onChange" />
    </label>
</template>

<script>
export default {

    props: {
        modelValue: { type: Boolean },
        disabled: { type: Boolean },
        kind: { type: String, default: 'base' },
        activeKind: { type: String },
        size: { type: String, default: 'normal' },
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

        isActive() {
            return !!this.modelValue;
        },

        baseStyle() {
            return {
                kind: (this.isActive ? this.activeKind : this.kind) ?? this.kind,
                size: this.size,
                round: this.round,
                outline: this.outline,
                flat: this.flat,
            };
        },

        effectiveStyle() {
            const {
                baseStyle,
                hoverOverrides = {},
                focusOverrides = {},
                hover,
                focus,
                forceHover,
                forceFocus,
            } = this;
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
.Toggle {
    --Toggle-size: var(--input-size);
    --Toggle-width: calc(1.618 * var(--Toggle-size));
    --Toggle-knob-offset: 4px;
    --Toggle-knob-size: calc(var(--Toggle-size) - 2 * var(--Toggle-knob-offset));
    --Toggle-knob-outline-offset: -2px;
    --Toggle-knob-radius: calc(var(--Toggle-radius) - 0.5 * var(--Toggle-knob-offset));

    --Toggle-outline-color: transparent;

    --Toggle-surface: var(--color-base-200);
    --Toggle-knob-surface: var(--input-text-color);
    --Toggle-knob-surface: light-dark(var(--color-base-0), var(--color-base-800));

    --Toggle-border-size: 0px;
    --Toggle-border-color: transparent;
    --Toggle-radius: var(--input-radius);

    --Toggle-shadow-color: var(--shadow-color-light);

    display: block;
    position: relative;
    width: var(--Toggle-width);
    height: var(--Toggle-size);

    border: var(--Toggle-border-size) solid var(--Toggle-border-color);
    border-radius: var(--Toggle-radius);

    background: var(--Toggle-surface);
    outline: var(--input-outline-size) solid var(--Toggle-outline-color);
    outline-offset: var(--input-outline-offset);
    background-clip: border-box;

    cursor: pointer;
    user-select: none;

    box-shadow:
        0 1px 3px var(--Toggle-shadow-color) inset,
        0 0 5px -1px var(--Toggle-shadow-color) inset;

    transition: background-color .3s, border-radius .3s;
}

.Toggle input {
    display: none;
}

.Toggle::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: var(--Toggle-knob-size);
    height: var(--Toggle-knob-size);
    border-radius: var(--Toggle-knob-radius);
    background: var(--Toggle-knob-surface);
    box-shadow: 0 1px 3px var(--Toggle-shadow-color);

    transform: translate(calc(var(--Toggle-knob-offset) - var(--Toggle-border-size)), -50%);
    transition: transform .3s, border-radius .3s;
}

/* States */

.Toggle-disabled {
    cursor: not-allowed;
    opacity: .5;
}

.Toggle:not(:disabled):hover, .Toggle.Toggle-force-hover {
    filter: brightness(.96);
}

.Toggle:not(:disabled):focus, .Toggle.Toggle-force-focus {
    z-index: 10;
    --Toggle-outline-color: var(--input-focus-light-color);
    --Toggle-border-color: var(--input-focus-medium-color);
}

.Toggle-active {
    --Toggle-surface: var(--input-surface-color);
    --Toggle-knob-surface: var(--input-surface-color-text);
}

.Toggle-active::before {
    transform: translate(calc(var(--Toggle-width) - var(--Toggle-knob-size) - var(--Toggle-knob-offset) - var(--Toggle-border-size)), -50%);
}

/* Styles */

.Toggle-round {
    --Toggle-radius: var(--input-radius-full);
    --Toggle-knob-radius: var(--input-radius-full);
}

.Toggle-outline {
    --Toggle-border-color: var(--input-border-color);
    --Toggle-border-size: var(--input-border-size);
}

.Toggle-flat {
    --Toggle-shadow-color: none;
    box-shadow: none;
}

/* Sizes */

.Toggle-small {
    --Toggle-size: var(--input-size-s);
}

.Toggle-large {
    --Toggle-size: var(--input-size-l);
}
</style>
