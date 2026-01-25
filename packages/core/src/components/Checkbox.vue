<template>
    <label
        class="Checkbox InputElement"
        :class="[
            `ui-${effectiveStyle.kind}`,
            `input-size-${effectiveStyle.size}`,
            `Checkbox-mark-${mark}`,
            {
                'Checkbox-active': !!modelValue,
                'Checkbox-outline': effectiveStyle.outline,
                'Checkbox-round': effectiveStyle.round,
                'Checkbox-flat': effectiveStyle.flat,
                'Checkbox-disabled': disabled,
                'Checkbox-force-focus': forceFocus,
                'Checkbox-force-hover': forceHover,
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
.Checkbox {
    --Checkbox-size: var(--input-height);

    --Checkbox-outline-color: transparent;

    --Checkbox-surface: var(--color-base-200);

    --Checkbox-border-size: 0px;
    --Checkbox-border-color: transparent;
    --Checkbox-radius: var(--input-radius);

    --Checkbox-shadow: 0 1px 3px var(--Checkbox-shadow-color) inset, 0 0 5px -1px var(--Checkbox-shadow-color) inset;
    --Checkbox-shadow-color: var(--shadow-color-light);
    --Checkbox-mark-shadow: 0 1px 1px var(--ui-surface-text-shadow-color);

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

    cursor: pointer;
    user-select: none;

    box-shadow: var(--Checkbox-shadow);

    transition: background-color .3s, border-radius .3s;
}

.Checkbox input {
    display: none;
}

.Checkbox::after {
    opacity: 0;
    font-size: var(--Checkbox-size);
    color: var(--ui-surface-text-color);
    text-shadow: var(--Checkbox-mark-shadow);

    transition: opacity .1s, border-radius .3s;
}

.Checkbox-active::after {
    opacity: 1;
}

/* Marks */

.Checkbox-mark-check::after {
    content: '✓';
}

.Checkbox-mark-xmark::after {
    content: '✗';
}

.Checkbox-mark-dot::after {
    content: '●';
}

.Checkbox-mark-knob::after {
    content: '';
    width: calc(var(--Checkbox-size) - var(--sp));
    height: calc(var(--Checkbox-size) - var(--sp));
    border-radius: calc(var(--Checkbox-radius) - 2px);
    background: var(--ui-surface-text-color);
    box-shadow: 0 1px 2px var(--Checkbox-shadow-color);
}

.Checkbox-mark-none::after {
    content: '';
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
    --Checkbox-outline-color: var(--ui-focus-light-color);
    --Checkbox-border-color: var(--ui-focus-medium-color);
}

.Checkbox-active {
    --Checkbox-surface: var(--ui-surface-color);
}

/* Styles */

.Checkbox-round {
    --Checkbox-radius: var(--input-radius-round);
}

.Checkbox-outline {
    --Checkbox-border-color: var(--ui-border-color);
    --Checkbox-border-size: var(--input-border-size);
}

.Checkbox-flat {
    --Checkbox-shadow: none;
    --Checkbox-shadow-color: none;
    --Checkbox-mark-shadow-color: none;
}
</style>
