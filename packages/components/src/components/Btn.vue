<template>
    <component
        :is="resolvedProps.tagName"
        ref="button"
        class="Btn InputElement"
        :class="[
            effectiveStyle.tone && `tone-${effectiveStyle.tone}`,
            effectiveStyle.size && `input-size-${effectiveStyle.size}`,
            `Btn-iconPos-${resolvedProps.iconPos}`,
            {
                'Btn-ghost': effectiveStyle.ghost,
                'Btn-round': effectiveStyle.round,
                'Btn-outline': effectiveStyle.outline,
                'Btn-flat': effectiveStyle.flat,
                'Btn-translucent': effectiveStyle.translucent && !effectiveStyle.ghost,
                'Btn-square': resolvedProps.square,
                'Btn-block': resolvedProps.block,
                'Btn-disabled': inactive,
                'Btn-forceFocus': resolvedProps.forceFocus,
                'Btn-forceHover': resolvedProps.forceHover,
                'Btn-forceActive': resolvedProps.forceActive,
            },
        ]"
        :disabled="isButton ? inactive : undefined"
        :aria-disabled="!isButton && inactive ? 'true' : undefined"
        :tabindex="!isButton && inactive ? -1 : undefined"
        :title="resolvedProps.title ?? resolvedProps.label"
        :href="inactive ? undefined : resolvedProps.href"
        @click.capture="onClickCapture"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @mousedown="active = true"
        @mouseup="active = false"
        @mouseout="active = false"
        @focusin="focus = true"
        @focusout="focus = false">

        <slot
            name="before"
            :hover="hover"
            :active="active"
            :focus="focus"
            :blocked="blocked" />

        <slot
            :hover="hover"
            :active="active"
            :focus="focus"
            :blocked="blocked">
            <i
                v-if="resolvedProps.icon"
                :class="resolvedProps.icon"
                class="Icon" />
            <slot
                name="label"
                :hover="hover"
                :active="active"
                :focus="focus"
                :blocked="blocked">
                <span
                    v-if="resolvedProps.label"
                    class="Label">
                    {{ resolvedProps.label }}
                </span>
            </slot>
        </slot>

        <slot
            name="after"
            :hover="hover"
            :active="active"
            :focus="focus"
            :blocked="blocked" />

    </component>
</template>

<script>
import {
    nightshadeMixin,
} from '../helpers/props.js';

export default {

    mixins: [nightshadeMixin],

    props: {
        tagName: { type: String, default: 'button' },
        href: { type: String },
        label: { type: String },
        title: { type: String },

        tone: { type: String },
        size: { type: String },
        flat: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        round: { type: Boolean, default: false },
        translucent: { type: Boolean, default: false },
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

        isButton() {
            return this.resolvedProps.tagName === 'button';
        },

        inactive() {
            return this.resolvedProps.disabled || this.blocked;
        },

        baseStyle() {
            const { resolvedProps } = this;
            return {
                tone: resolvedProps.tone,
                size: resolvedProps.size,
                flat: resolvedProps.flat,
                outline: resolvedProps.outline,
                round: resolvedProps.round,
                translucent: resolvedProps.translucent,
                ghost: resolvedProps.ghost,
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
                resolvedProps,
            } = this;
            const { forceActive, forceHover, forceFocus } = resolvedProps;
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

        /** Only a `<button>` ignores clicks when disabled: stop them on any other tag (links, router links). */
        onClickCapture(ev) {
            if (this.inactive) {
                ev.preventDefault();
                ev.stopImmediatePropagation();
            }
        },

    },

};
</script>

<style scoped>
.Btn {
    --Btn-size: var(--input-major-height);
    --Btn-padding: var(--input-major-padding);
    --Btn-gap: var(--input-gap);
    --Btn-font-size: var(--input-font-size);

    --Btn-text: var(--tone-fill-text);

    --Btn-outline: transparent;

    --Btn-fill: var(--tone-fill);
    --Btn-fill-top: var(--tone-fill-top);
    --Btn-fill-bottom: var(--tone-fill-bottom);
    --Btn-background: linear-gradient(
        to bottom,
        var(--Btn-fill-top),
        var(--Btn-fill-bottom)
    );

    --Btn-border-size: 0px;
    --Btn-border: transparent;
    --Btn-radius: var(--radius-m);

    --Btn-shadow: var(--tone-shadow);
    --Btn-box-shadow:
        0 1px 1px var(--Btn-shadow),
        0 1px 5px var(--shadow-medium);
    --Btn-text-shadow: 0 1px 1px var(--text-shadow-auto);

    -webkit-appearance: none;
    appearance: none;

    position: relative;
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

    border: var(--Btn-border-size) solid var(--Btn-border);
    border-radius: var(--Btn-radius);

    color: var(--Btn-text);
    text-shadow: var(--Btn-text-shadow);
    outline: var(--input-outline-size) solid var(--Btn-outline);
    outline-offset: var(--input-outline-offset);
    background: var(--Btn-background);
    box-shadow: var(--Btn-box-shadow);

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

    background: var(--input-hover-overlay);
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

.Btn:not(.Btn-disabled):hover::after, .Btn.Btn-forceHover::after {
    opacity: 1;
}

.Btn:not(.Btn-disabled):focus-visible, .Btn.Btn-forceFocus {
    z-index: 10;
    --Btn-outline: var(--tone-focus-outline);
    --Btn-border: var(--tone-focus-border);
}

.Btn:not(.Btn-disabled):active, .Btn.Btn-forceActive {
    padding-top: 1px;
    box-shadow:
        0 6px 12px var(--shadow-light) inset,
        0 1px 2px var(--shadow-medium) inset;
}

.Btn-disabled {
    opacity: var(--input-disabled-opacity);
    filter: var(--input-disabled-filter);
    cursor: not-allowed;
}

/* Styles */

.Btn-round {
    --Btn-radius: calc(.5 * var(--Btn-size));
}

.Btn-outline {
    --Btn-border: var(--tone-border);
    --Btn-border-size: var(--input-border-size);
}

.Btn-ghost {
    --Btn-fill: transparent;
    --Btn-fill-top: transparent;
    --Btn-fill-bottom: transparent;
    --Btn-border: var(--tone-text);
    --Btn-text: var(--tone-text);
    --Btn-text-shadow: none;
    --Btn-box-shadow: none;
}

.Btn-flat {
    --Btn-fill-top: var(--Btn-fill);
    --Btn-fill-bottom: var(--Btn-fill);
    --Btn-text-shadow: none;
    --Btn-box-shadow: none;
}

.Btn-translucent {
    --Btn-background: linear-gradient(
        to bottom,
        color-mix(in srgb, var(--Btn-fill-top), transparent var(--translucency-mix-light)),
        color-mix(in srgb, var(--Btn-fill-bottom), transparent var(--translucency-mix-light))
    );
    --Btn-box-shadow:
        0 1px 1px var(--Btn-shadow),
        0 1px 5px var(--shadow-medium),
        0 0 3px var(--translucency-highlight) inset;

    backdrop-filter: blur(var(--translucency-blur));
}

.Btn-flat.Btn-translucent {
    --Btn-box-shadow: 0 0 3px var(--translucency-highlight) inset;
}

.Btn-ghost.Btn-translucent {
    --Btn-background: transparent;
    --Btn-box-shadow: none;
    backdrop-filter: none;
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
</style>
