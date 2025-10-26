<template>
    <component
        :is="tagName"
        ref="button"
        class="Btn button"
        :class="[
            `Btn-${size}`,
            `Btn-${effectiveToken}`,
            `Btn-iconPos-${iconPos}`,
            {
                'Btn-link': isLink,
                'Btn-disabled': disabled || blocked,
                'Btn-square': square,
                'Btn-round': round,
                'Btn-outline': outline,
                'Btn-flat': flat,
                'Btn-shadow': shadow,
                'Btn-block': block,
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
        @mouseout="active = false">

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

        kind: { type: String, default: 'link-base' },
        hoverKind: { type: String },
        activeKind: { type: String },

        icon: { type: String },
        iconPos: { type: String, default: 'left' },

        disabled: { type: Boolean, default: false },
        size: { type: String, default: 'm' },
        square: { type: Boolean, default: false },
        block: { type: Boolean, default: false },
        round: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        flat: { type: Boolean, default: false },
        shadow: { type: Boolean, default: false },
        forceFocus: { type: Boolean, default: false },
        forceHover: { type: Boolean, default: false },
        forceActive: { type: Boolean, default: false },
    },

    data() {
        return {
            hover: false,
            active: false,
            blocked: false,
        };
    },

    computed: {

        effectiveHover() {
            return this.forceHover || this.hover;
        },

        effectiveActive() {
            return this.forceActive || this.active;
        },

        effectiveKind() {
            const { kind, effectiveHover, effectiveActive, hoverKind, activeKind } = this;
            if (effectiveHover && hoverKind) {
                return hoverKind;
            }
            if (effectiveActive && activeKind) {
                return activeKind;
            }
            return kind;
        },

        effectiveToken() {
            return this.effectiveKind.replace(/^link-/i, '');
        },

        isLink() {
            return this.effectiveKind.startsWith('link-');
        }

    },

    methods: {

        // TODO add debounce

    }

};
</script>

<style scoped>
.Btn {
    --Btn-padding: var(--sp1-5);
    --Btn-gap: var(--sp);
    --Btn-size: var(--input-size);
    --Btn-font-size: var(--font-size);

    --Btn-text-color: var(--input-color-surface-text);

    --Btn-outline-color: transparent;
    --Btn-outline-size: var(--input-outline-size);
    --Btn-outline-offset: var(--input-outline-offset);

    --Btn-surface: var(--input-color-surface);
    --Btn-surface-top: var(--input-color-surface-top);
    --Btn-surface-bottom: var(--input-color-surface-bottom);

    --Btn-border-size: 0;
    --Btn-border-color: transparent;
    --Btn-border-radius: var(--border-radius);

    --Btn-gradient-x: 50%;
    --Btn-gradient-y: 0%;
    --Btn-gradient-width: 150%;
    --Btn-gradient-height: 150%;

    --Btn-shadow-color: var(--input-color-shadow);

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
    overflow: hidden;

    font-family: inherit;
    font-size: var(--Btn-font-size);

    color: var(--Btn-text-color);
    outline: var(--Btn-outline-size) solid var(--Btn-outline-color);
    outline-offset: var(--Btn-outline-offset);
    background: radial-gradient(
        var(--Btn-gradient-width) var(--Btn-gradient-height) at var(--Btn-gradient-x) var(--Btn-gradient-y),
        var(--Btn-surface-top),
        var(--Btn-surface-bottom)
    );

    transition: color .3s, outline .3s, filter .3s, border-radius .3s;
}

.Btn:focus, .Btn:active, .Btn:hover {
    transition: none;
}

.Btn:not(:disabled):hover, .Btn.Btn-force-hover {
    filter: brightness(.96);
}

.Btn:not(:disabled):focus, .Btn.Btn-force-focus {
    z-index: 10;
    --Btn-outline-color: var(--input-color-outline);
    --Btn-border-color: var(--input-color-border-focus);
}

.Btn:not(:disabled):active, .Btn.Btn-force-active {
    padding-top: 1px;
    box-shadow:
        0 6px 12px rgba(0,0,0,.08) inset,
        0 1px 2px rgba(0,0,0,.12) inset;
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

.Btn-square {
    padding-left: 0;
    padding-right: 0;
    width: var(--Btn-size);
    justify-content: center;
}

.Btn-round {
    --Btn-border-radius: var(--border-radius-l);
}

.Btn-disabled {
    opacity: .64;
    filter: saturate(40%);
    cursor: not-allowed;
}

.Btn-block {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
}

.Btn-link {
    --Btn-surface: transparent;
    --Btn-surface-top: transparent;
    --Btn-surface-bottom: transparent;
    --Btn-text-color: var(--input-color-text);
    --Btn-shadow-color: transparent;
}

.Btn-outline {
    --Btn-border-color: var(--input-color-border);
    --Btn-border-size: var(--input-border-size);
}

.Btn-flat {
    --Btn-surface-top: var(--Btn-surface);
    --Btn-surface-bottom: var(--Btn-surface);
}

.Btn-shadow {
    box-shadow: var(--input-shadow-offset-x) var(--input-shadow-offset-y) var(--input-shadow-size) var(--Btn-shadow-color);
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

.Btn-iconPos-right .Icon {
    order: 100;
}

/* Kinds */

.Btn-base {
    --input-color-text: var(--input-color-text-base);
    --input-color-surface: var(--input-color-surface-base);
    --input-color-surface-top: var(--input-color-surface-top-base);
    --input-color-surface-bottom: var(--input-color-surface-bottom-base);
    --input-color-surface-text: var(--input-color-surface-text-base);
    --input-color-border: var(--input-color-border-base);
    --input-color-border-focus: var(--input-color-border-focus-base);
    --input-color-outline: var(--input-color-outline-base);
    --input-color-shadow: var(--input-color-shadow-base);
}

.Btn-inverse {
    --input-color-text: var(--input-color-text-inverse);
    --input-color-surface: var(--input-color-surface-inverse);
    --input-color-surface-top: var(--input-color-surface-top-inverse);
    --input-color-surface-bottom: var(--input-color-surface-bottom-inverse);
    --input-color-surface-text: var(--input-color-surface-text-inverse);
    --input-color-border: var(--input-color-border-inverse);
    --input-color-border-focus: var(--input-color-border-focus-inverse);
    --input-color-outline: var(--input-color-outline-inverse);
    --input-color-shadow: var(--input-color-shadow-inverse);
}

.Btn-primary {
    --input-color-text: var(--input-color-text-primary);
    --input-color-surface: var(--input-color-surface-primary);
    --input-color-surface-top: var(--input-color-surface-top-primary);
    --input-color-surface-bottom: var(--input-color-surface-bottom-primary);
    --input-color-surface-text: var(--input-color-surface-text-primary);
    --input-color-border: var(--input-color-border-primary);
    --input-color-border-focus: var(--input-color-border-focus-primary);
    --input-color-outline: var(--input-color-outline-primary);
    --input-color-shadow: var(--input-color-shadow-primary);
}

.Btn-secondary {
    --input-color-text: var(--input-color-text-secondary);
    --input-color-surface: var(--input-color-surface-secondary);
    --input-color-surface-top: var(--input-color-surface-top-secondary);
    --input-color-surface-bottom: var(--input-color-surface-bottom-secondary);
    --input-color-surface-text: var(--input-color-surface-text-secondary);
    --input-color-border: var(--input-color-border-secondary);
    --input-color-border-focus: var(--input-color-border-focus-secondary);
    --input-color-outline: var(--input-color-outline-secondary);
    --input-color-shadow: var(--input-color-shadow-secondary);
}

.Btn-tertiary {
    --input-color-text: var(--input-color-text-tertiary);
    --input-color-surface: var(--input-color-surface-tertiary);
    --input-color-surface-top: var(--input-color-surface-top-tertiary);
    --input-color-surface-bottom: var(--input-color-surface-bottom-tertiary);
    --input-color-surface-text: var(--input-color-surface-text-tertiary);
    --input-color-border: var(--input-color-border-tertiary);
    --input-color-border-focus: var(--input-color-border-focus-tertiary);
    --input-color-outline: var(--input-color-outline-tertiary);
    --input-color-shadow: var(--input-color-shadow-tertiary);
}

.Btn-success {
    --input-color-text: var(--input-color-text-success);
    --input-color-surface: var(--input-color-surface-success);
    --input-color-surface-top: var(--input-color-surface-top-success);
    --input-color-surface-bottom: var(--input-color-surface-bottom-success);
    --input-color-surface-text: var(--input-color-surface-text-success);
    --input-color-border: var(--input-color-border-success);
    --input-color-border-focus: var(--input-color-border-focus-success);
    --input-color-outline: var(--input-color-outline-success);
    --input-color-shadow: var(--input-color-shadow-success);
}

.Btn-warning {
    --input-color-text: var(--input-color-text-warning);
    --input-color-surface: var(--input-color-surface-warning);
    --input-color-surface-top: var(--input-color-surface-top-warning);
    --input-color-surface-bottom: var(--input-color-surface-bottom-warning);
    --input-color-surface-text: var(--input-color-surface-text-warning);
    --input-color-border: var(--input-color-border-warning);
    --input-color-border-focus: var(--input-color-border-focus-warning);
    --input-color-outline: var(--input-color-outline-warning);
    --input-color-shadow: var(--input-color-shadow-warning);
}

.Btn-danger {
    --input-color-text: var(--input-color-text-danger);
    --input-color-surface: var(--input-color-surface-danger);
    --input-color-surface-top: var(--input-color-surface-top-danger);
    --input-color-surface-bottom: var(--input-color-surface-bottom-danger);
    --input-color-surface-text: var(--input-color-surface-text-danger);
    --input-color-border: var(--input-color-border-danger);
    --input-color-border-focus: var(--input-color-border-focus-danger);
    --input-color-outline: var(--input-color-outline-danger);
    --input-color-shadow: var(--input-color-shadow-danger);
}
</style>
