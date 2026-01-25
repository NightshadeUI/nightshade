<template>
    <component
        :is="tagName"
        ref="button"
        class="Btn InputElement"
        :class="[
            `ui-${effectiveStyle.kind}`,
            `input-size-${effectiveStyle.size}`,
            `Btn-iconPos-${iconPos}`,
            {
                'Btn-ghost': effectiveStyle.ghost,
                'Btn-round': effectiveStyle.round,
                'Btn-outline': effectiveStyle.outline,
                'Btn-flat': effectiveStyle.flat,
                'Btn-square': square,
                'Btn-block': block,
                'Btn-disabled': disabled || blocked,
                'Btn-forceFocus': forceFocus,
                'Btn-forceHover': forceHover,
                'Btn-forceActive': forceActive,
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
    --Btn-size: var(--input-height);
    --Btn-padding: var(--input-padding-x);
    --Btn-gap: var(--input-gap);
    --Btn-font-size: var(--input-font-size);

    --Btn-text-color: var(--ui-surface-text-color);
    --Btn-text-shadow: var(--ui-surface-text-shadow-color);

    --Btn-outline-color: transparent;

    --Btn-surface: var(--ui-surface-color);
    --Btn-surface-top: var(--ui-surface-top-color);
    --Btn-surface-bottom: var(--ui-surface-bottom-color);

    --Btn-border-size: 0;
    --Btn-border-color: transparent;
    --Btn-radius: var(--input-radius);

    --Btn-shadow-color: var(--ui-shadow-color);
    --Btn-shadow: 0 1px 1px var(--Btn-shadow-color), 0 1px 5px var(--shadow-color-light);

    -webkit-appearance: none;
    appearance: none;

    position: relative;
    z-index: var(--ui-z);
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
    border-radius: var(--Btn-radius);

    color: var(--Btn-text-color);
    text-shadow: 0 1px 1px var(--Btn-text-shadow);
    outline: var(--input-outline-size) solid var(--Btn-outline-color);
    outline-offset: var(--input-outline-offset);
    background: linear-gradient(
        to bottom,
        var(--Btn-surface-top),
        var(--Btn-surface-bottom)
    );
    box-shadow: var(--Btn-shadow);

    cursor: pointer;
    user-select: none;

    font-family: inherit;
    font-size: var(--Btn-font-size);

    transition: color .3s, outline .3s, filter .3s, border-radius .3s;
}

.Btn::after {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: var(--Btn-radius);

    background: rgba(127,127,127,.05);
    mix-blend-mode: color-dodge;
    pointer-events: none;
    opacity: 0;
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

.Btn:not(:disabled):hover::after, .Btn.Btn-forceHover::after {
    opacity: 1;
}

.Btn:not(:disabled):focus, .Btn.Btn-forceFocus {
    z-index: 10;
    --Btn-outline-color: var(--ui-focus-light-color);
    --Btn-border-color: var(--ui-focus-medium-color);
}

.Btn:not(:disabled):active, .Btn.Btn-forceActive {
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
    --Btn-radius: var(--input-radius-round);
}

.Btn-outline {
    --Btn-border-color: var(--ui-border-color);
    --Btn-border-size: var(--input-border-size);
}

.Btn-ghost {
    --Btn-surface: transparent;
    --Btn-surface-top: transparent;
    --Btn-surface-bottom: transparent;
    --Btn-border-color: var(--ui-text-color);
    --Btn-text-color: var(--ui-text-color);
    --Btn-text-shadow: none;
    --Btn-shadow: none;
}

.Btn-flat {
    --Btn-surface-top: var(--Btn-surface);
    --Btn-surface-bottom: var(--Btn-surface);
    --Btn-text-shadow: none;
    --Btn-shadow: none;
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
