<template>
    <component
        :is="tagName"
        ref="button"
        class="Btn button"
        :class="[
            `Btn-${effectiveStyle.size}`,
            `Btn-${effectiveStyle.kind}`,
            `input-kind-${effectiveStyle.kind}`,
            `Btn-iconPos-${iconPos}`,
            {
                'Btn-ghost': effectiveStyle.ghost,
                'Btn-round': effectiveStyle.round,
                'Btn-outline': effectiveStyle.outline,
                'Btn-flat': effectiveStyle.flat,
                'Btn-shadow': effectiveStyle.shadow,
                'Btn-square': square,
                'Btn-block': block,
                'Btn-disabled': disabled || blocked,
                'Btn-force-focus': forceFocus,
                'Btn-force-hover': forceHover,
                'Btn-force-active': forceActive,
            },
        ]"
        :disabled="disabled || blocked"
        :title="title ?? label"
        :href="href"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @mousedown="active = true"
        @mouseup="active = false"
        @mouseout="active = false"
        @focusin="focus = true"
        @focusout="focus = false">

        <slot
            name="icon"
            :hover="hover"
            :blocked="blocked">
            <i
                v-if="icon"
                :class="icon"
                class="Icon" />
        </slot>

        <span
            v-if="label"
            class="Label">
            {{ label }}
        </span>

        <slot
            :hover="hover"
            :active="active"
            :blocked="blocked" />

    </component>
</template>

<script>
export default {

    props: {
        tagName: { type: String, default: 'button' },
        href: { type: String },
        label: { type: String },
        title: { type: String },

        kind: { type: String, default: 'base' },
        size: { type: String, default: 'm' },
        flat: { type: Boolean, default: false },
        shadow: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        round: { type: Boolean, default: false },
        ghost: { type: Boolean, default: false },

        block: { type: Boolean, default: false },
        square: { type: Boolean, default: false },

        disabled: { type: Boolean, default: false },
        forceFocus: { type: Boolean, default: false },
        forceHover: { type: Boolean, default: false },
        forceActive: { type: Boolean, default: false },

        icon: { type: String },
        iconPos: { type: String, default: 'left' },

        hoverOverrides: { type: Object },
        activeOverrides: { type: Object },
        focusOverrides: { type: Object },
    },

    data() {
        return {
            hover: false,
            active: false,
            focus: false,
            blocked: false,
        };
    },

    computed: {

        baseStyle() {
            return {
                kind: this.kind,
                size: this.size,
                flat: this.flat,
                shadow: this.shadow,
                outline: this.outline,
                round: this.round,
                ghost: this.ghost,
            };
        },

        effectiveStyle() {
            const {
                baseStyle,
                hoverOverrides = {},
                activeOverrides = {},
                focusOverrides = {},
                active,
                hover,
                focus,
                forceActive,
                forceHover,
                forceFocus
            } = this;
            const style = Object.assign({}, baseStyle);
            if (active || forceActive) {
                Object.assign(style, activeOverrides);
            }
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

        // TODO add debounce

    }

};
</script>

<style scoped>
.Btn {
    --Btn-size: var(--input-size);
    --Btn-padding: var(--sp1-5);
    --Btn-gap: var(--sp);
    --Btn-font-size: var(--font-size);

    --Btn-text-color: var(--input-surface-color-text);
    --Btn-text-shadow: var(--Btn-surface-bottom);

    --Btn-outline-color: transparent;
    --Btn-outline-size: var(--input-outline-size);
    --Btn-outline-offset: var(--input-outline-offset);

    --Btn-surface: var(--input-surface-color);
    --Btn-surface-top: var(--input-surface-color-top);
    --Btn-surface-bottom: var(--input-surface-color-bottom);

    --Btn-border-size: 0;
    --Btn-border-color: transparent;
    --Btn-border-radius: var(--border-radius);

    --Btn-gradient-x: 50%;
    --Btn-gradient-y: 0%;
    --Btn-gradient-width: 150%;
    --Btn-gradient-height: 150%;

    --Btn-shadow-color: var(--input-shadow-color);

    -webkit-appearance: none;
    appearance: none;

    position: relative;
    z-index: 1;
    margin: 0;
    padding: 0 var(--Btn-padding);
    height: var(--Btn-size);
    line-height: var(--Btn-size);
    box-sizing: border-box;

    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    flex-shrink: 0;
    gap: var(--Btn-gap);

    border: var(--Btn-border-size) solid var(--Btn-border-color);
    border-radius: var(--Btn-border-radius);
    cursor: pointer;
    user-select: none;

    font-family: inherit;
    font-size: var(--Btn-font-size);

    color: var(--Btn-text-color);
    text-shadow: 0 1px 1px var(--Btn-text-shadow);
    outline: var(--Btn-outline-size) solid var(--Btn-outline-color);
    outline-offset: var(--Btn-outline-offset);
    background: radial-gradient(
        var(--Btn-gradient-width) var(--Btn-gradient-height) at var(--Btn-gradient-x) var(--Btn-gradient-y),
        var(--Btn-surface-top),
        var(--Btn-surface-bottom)
    );

    transition: color .3s, outline .3s, filter .3s, border-radius .3s;
}

.Label {
    line-height: var(--Btn-size);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.Icon {
    width: var(--sp2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--Btn-font-size);
}

.Btn-iconPos-right .Icon {
    order: 100;
}

/* States */

.Btn:focus, .Btn:active, .Btn:hover {
    transition: none;
}

.Btn:not(:disabled):hover, .Btn.Btn-force-hover {
    filter: brightness(.96);
}

.Btn:not(:disabled):focus, .Btn.Btn-force-focus {
    z-index: 10;
    --Btn-outline-color: var(--input-focus-light-color);
    --Btn-border-color: var(--input-focus-medium-color);
}

.Btn:not(:disabled):active, .Btn.Btn-force-active {
    padding-top: 1px;
    box-shadow:
        0 6px 12px var(--shadow-color-light) inset,
        0 1px 2px var(--shadow-color-medium) inset;
}

.Btn-disabled {
    opacity: .64;
    filter: saturate(40%);
    cursor: not-allowed;
}

/* Styles */

.Btn-round {
    --Btn-border-radius: var(--border-radius-l);
}

.Btn-ghost {
    --Btn-surface: transparent;
    --Btn-surface-top: transparent;
    --Btn-surface-bottom: transparent;
    --Btn-text-color: var(--input-text-color);
    --Btn-text-shadow: none;
    --Btn-shadow-color: var(--shadow-color-light);
}

.Btn-outline {
    --Btn-border-color: var(--input-border-color);
    --Btn-border-size: var(--input-border-size);
}

.Btn-flat {
    --Btn-surface-top: var(--Btn-surface);
    --Btn-surface-bottom: var(--Btn-surface);
    --Btn-text-shadow: none;
}

.Btn-shadow {
    box-shadow:
        0 1px 1px var(--Btn-shadow-color),
        0 1px 3px var(--shadow-color-light),
        0 0 5px -1px var(--shadow-color-light);
}

.Btn-square {
    padding-left: 0;
    padding-right: 0;
    width: var(--Btn-size);
    justify-content: center;
}

.Btn-block {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
}

/* Sizes */

.Btn-large {
    --Btn-size: var(--input-size-l);
    --Btn-font-size: var(--font-size-l);
    --Btn-padding: var(--sp2);
}

.Btn-small {
    --Btn-size: var(--input-size-s);
    --Btn-font-size: var(--font-size-s);
    --Btn-padding: var(--sp);
    --Btn-gap: var(--sp0-5);
}
</style>
