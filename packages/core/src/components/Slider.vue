<template>
    <component
        :is="resolvedProps.tagName"
        class="Slider InputElement"
        :class="[
            `ui-${effectiveStyle.kind}`,
            `input-size-${effectiveStyle.size}`,
            {
                'Slider-outline': effectiveStyle.outline,
                'Slider-round': effectiveStyle.round,
                'Slider-flat': effectiveStyle.flat,
                'Slider-disabled': resolvedProps.disabled,
                'Slider-force-focus': resolvedProps.forceFocus,
                'Slider-force-hover': resolvedProps.forceHover,
                'Slider-dragging': dragging,
            }
        ]"
        role="slider"
        :aria-valuemin="resolvedProps.min"
        :aria-valuemax="resolvedProps.max"
        :aria-valuenow="currentValue"
        :aria-disabled="resolvedProps.disabled || undefined"
        tabindex="0"
        :style="{ '--Slider-ratio': ratio }"
        @keydown="onKeydown"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @focusin="focus = true"
        @focusout="focus = false">
        <div
            ref="trackArea"
            class="TrackArea">
            <div
                ref="rail"
                class="Track"
                @pointerdown="onPointerDown">
                <div
                    class="Fill"
                    :class="`Slider-fill-style-${fillStyle}`" />
            </div>
            <div
                ref="knob"
                class="Knob"
                :class="`Slider-knob-style-${knobStyle}`"
                @pointerdown="onPointerDown">
                <Bubble
                    v-if="tooltipShown"
                    :class="`Tooltip ui-${resolvedProps.tooltipKind}`"
                    dir="top"
                    align="center"
                    @pointerdown.stop>
                    <div class="TooltipContent">
                        <div
                            v-if="!tooltipEditing"
                            class="TooltipBody"
                            @click.stop="startTooltipEdit">
                            {{ tooltipText }}
                        </div>
                        <input
                            v-else
                            ref="tooltipInput"
                            class="TooltipInput"
                            type="number"
                            :value="tooltipDraft"
                            :min="resolvedProps.min"
                            :max="resolvedProps.max"
                            step="any"
                            @input="onTooltipDraftInput"
                            @keydown.stop="onTooltipInputKeydown"
                            @blur="commitTooltipEdit"
                            @click.stop
                            @pointerdown.stop />
                    </div>
                </Bubble>
            </div>
        </div>
        <div
            v-if="scaleTicks.length"
            class="Scale">
            <div
                v-for="tick in scaleTicks"
                :key="tick"
                class="Tick"
                :style="tickStyle(tick)">
                <div class="Mark" />
                <div class="Label">{{ scaleLabel(tick) }}</div>
            </div>
        </div>
    </component>
</template>

<script>
import { clamp, quantize } from '@nightshadeui/util';

import {
    nightshadeMixin,
} from '../utils/props';
import Bubble from './Bubble.vue';

export default {

    components: {
        Bubble,
    },

    mixins: [nightshadeMixin],

    props: {
        tagName: { type: String, default: 'div' },
        modelValue: { type: Number },
        min: { type: Number, default: 0 },
        max: { type: Number, default: 100 },
        step: { type: Number, default: 1 },
        kind: { type: String, default: 'base' },
        size: { type: String, default: 'm' },
        round: { type: Boolean, default: false },
        flat: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        disabled: { type: Boolean },
        forceFocus: { type: Boolean, default: false },
        forceHover: { type: Boolean, default: false },
        focusOverrides: { type: Object },
        hoverOverrides: { type: Object },
        tooltip: { type: String, default: 'off' },
        formatTooltip: { type: Function },
        tooltipKind: { type: String, default: 'inverse' },
        scale: { type: Array },
        formatScale: { type: Function },
        snapThreshold: { type: Number },
        knobStyle: {
            type: String,
            default: 'opaque',
            validator: value => ['opaque', 'translucent'].includes(value),
        },
        fillStyle: {
            type: String,
            default: 'track',
            validator: value => ['track', 'inset', 'none'].includes(value),
        },
    },

    emits: [
        'update:modelValue',
    ],

    data() {
        return {
            hover: false,
            focus: false,
            dragging: false,
            valuePulse: false,
            valuePulseTimer: null,
            tooltipEditing: false,
            tooltipDraft: '',
        };
    },

    computed: {

        currentValue() {
            const { modelValue, min } = this.resolvedProps;
            return modelValue == null ? min : Number(modelValue);
        },

        ratio() {
            const { min, max } = this.resolvedProps;
            const span = max - min;
            if (!span) {
                return 0;
            }
            return (this.clampedValue - min) / span;
        },

        clampedValue() {
            const { min, max } = this.resolvedProps;
            return clamp(this.currentValue, min, max);
        },

        scaleTicks() {
            const { scale, min, max } = this.resolvedProps;
            if (!scale?.length) {
                return [];
            }
            return scale.filter(tick => tick >= min && tick <= max);
        },

        tooltipShown() {
            const { tooltip } = this.resolvedProps;
            if (tooltip === 'visible') {
                return true;
            }
            if (tooltip !== 'dynamic') {
                return false;
            }
            return this.hover || this.dragging || this.focus || this.valuePulse || this.tooltipEditing;
        },

        tooltipText() {
            return this.formatValue(this.clampedValue, this.resolvedProps.formatTooltip);
        },

        baseStyle() {
            const { resolvedProps } = this;
            return {
                kind: resolvedProps.kind,
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

    watch: {

        clampedValue() {
            if (this.resolvedProps.tooltip !== 'dynamic') {
                return;
            }
            this.valuePulse = true;
            clearTimeout(this.valuePulseTimer);
            this.valuePulseTimer = setTimeout(() => {
                this.valuePulse = false;
            }, 1000);
        },

    },

    beforeUnmount() {
        clearTimeout(this.valuePulseTimer);
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);
    },

    methods: {

        snap(value) {
            const { scale, snapThreshold } = this.resolvedProps;
            if (!scale?.length || snapThreshold == null) {
                return value;
            }
            let match = null;
            let bestDist = Infinity;
            for (const tick of scale) {
                const dist = Math.abs(tick - value);
                if (dist <= snapThreshold && dist < bestDist) {
                    bestDist = dist;
                    match = tick;
                }
            }
            return match ?? value;
        },

        normalize(value) {
            const { min, max, step } = this.resolvedProps;
            return this.snap(quantize(clamp(value, min, max), min, step));
        },

        valueFromClientX(clientX) {
            const area = this.$refs.trackArea;
            const knob = this.$refs.knob;
            if (!area || !knob) {
                return this.clampedValue;
            }
            const areaRect = area.getBoundingClientRect();
            const knobRect = knob.getBoundingClientRect();
            const effectiveWidth = areaRect.width - knobRect.width;
            const offset = clientX - areaRect.left - knobRect.width / 2;
            const ratio = effectiveWidth ? clamp(offset / effectiveWidth, 0, 1) : 0;
            const { min, max } = this.resolvedProps;
            return this.normalize(min + ratio * (max - min));
        },

        setValue(value) {
            const next = this.normalize(value);
            if (next !== this.currentValue) {
                this.$emit('update:modelValue', next);
            }
        },

        setPreciseValue(value) {
            const { min, max } = this.resolvedProps;
            const next = clamp(value, min, max);
            if (next !== this.currentValue) {
                this.$emit('update:modelValue', next);
            }
        },

        tickStyle(tick) {
            const { min, max } = this.resolvedProps;
            const span = max - min;
            const ratio = span ? (tick - min) / span : 0;
            return { left: this.insetPosition(ratio) };
        },

        insetPosition(ratio) {
            return `calc(var(--Slider-knob-size) / 2 + ${ratio} * (100% - var(--Slider-knob-size)))`;
        },

        scaleLabel(tick) {
            return this.formatValue(tick, this.resolvedProps.formatScale);
        },

        formatValue(value, formatter) {
            return formatter ? formatter(value) : String(value);
        },

        onPointerDown(ev) {
            if (this.resolvedProps.disabled || ev.button !== 0) {
                return;
            }
            this.dragging = true;
            this.$refs.rail?.setPointerCapture(ev.pointerId);
            this.setValue(this.valueFromClientX(ev.clientX));
            window.addEventListener('pointermove', this.onPointerMove);
            window.addEventListener('pointerup', this.onPointerUp);
        },

        onPointerMove(ev) {
            if (!this.dragging) {
                return;
            }
            this.setValue(this.valueFromClientX(ev.clientX));
        },

        onPointerUp(ev) {
            if (!this.dragging) {
                return;
            }
            this.dragging = false;
            this.$refs.rail?.releasePointerCapture(ev.pointerId);
            window.removeEventListener('pointermove', this.onPointerMove);
            window.removeEventListener('pointerup', this.onPointerUp);
        },

        startTooltipEdit() {
            if (this.resolvedProps.disabled) {
                return;
            }
            this.tooltipEditing = true;
            this.tooltipDraft = String(this.clampedValue);
            this.$nextTick(() => {
                const input = this.$refs.tooltipInput;
                input?.focus();
                input?.select();
            });
        },

        onTooltipDraftInput(ev) {
            this.tooltipDraft = ev.target.value;
        },

        commitTooltipEdit() {
            if (!this.tooltipEditing) {
                return;
            }
            const parsed = Number(this.tooltipDraft);
            if (this.tooltipDraft !== '' && !Number.isNaN(parsed)) {
                this.setPreciseValue(parsed);
            }
            this.tooltipEditing = false;
        },

        onTooltipInputKeydown(ev) {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                this.$refs.tooltipInput?.blur();
                return;
            }
            if (ev.key === 'Escape') {
                ev.preventDefault();
                this.tooltipEditing = false;
            }
        },

        onKeydown(ev) {
            if (this.resolvedProps.disabled) {
                return;
            }
            const { min, max, step } = this.resolvedProps;
            const delta = {
                ArrowLeft: -step,
                ArrowDown: -step,
                ArrowRight: step,
                ArrowUp: step,
            }[ev.key];
            if (delta) {
                ev.preventDefault();
                this.setValue(this.clampedValue + delta);
                return;
            }
            if (ev.key === 'Home') {
                ev.preventDefault();
                this.setValue(min);
            }
            if (ev.key === 'End') {
                ev.preventDefault();
                this.setValue(max);
            }
        },

    },

};
</script>

<style scoped>
.Slider {
    --Slider-ratio: 0;
    --Slider-inset-position: calc(var(--Slider-knob-size) / 2 + var(--Slider-ratio) * (100% - var(--Slider-knob-size)));

    --Slider-track-height: calc(var(--input-minor-height) - var(--sp));
    --Slider-knob-size: var(--input-minor-height);

    --Slider-outline-color: transparent;

    --Slider-track-surface: var(--color-base-200);
    --Slider-fill-surface: var(--ui-surface-color);
    --Slider-knob-surface: light-dark(var(--color-base-0), var(--color-base-800));

    --Slider-border-size: 0px;
    --Slider-border-color: transparent;
    --Slider-radius: var(--border-radius);
    --Slider-knob-radius: var(--border-radius);

    --Slider-shadow-color: var(--shadow-color-light);
    --Slider-track-shadow: 0 1px 3px var(--shadow-color-light) inset, 0 0 5px -1px var(--shadow-color-light) inset;
    --Slider-knob-shadow: 0 0 3px var(--shadow-color-light), 0 1px 5px var(--shadow-color-light);

    --Slider-tooltip-surface: var(--color-base-0);
    --Slider-tooltip-text: var(--text-color);
    --Slider-tooltip-shadow-color: var(--shadow-color-light);

    display: block;
    width: 100%;

    outline: 0;
    cursor: pointer;
    user-select: none;
}

.TrackArea {
    position: relative;
    height: var(--Slider-knob-size);
}

.Track {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 0;
    right: 0;
    height: var(--Slider-track-height);
    transform: translateY(-50%);
    overflow: hidden;

    border: var(--Slider-border-size) solid var(--Slider-border-color);
    border-radius: var(--Slider-radius);
    outline: var(--input-outline-size) solid var(--Slider-outline-color);
    outline-offset: var(--input-outline-offset);
    background: var(--Slider-track-surface);
    box-shadow: var(--Slider-track-shadow);

    transition: filter .3s, border-radius .3s;
}

.Fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;

    border-radius: inherit;
    background: var(--Slider-fill-surface);

    pointer-events: none;
}

.Fill.Slider-fill-style-track {
    width: var(--Slider-inset-position);
}

.Knob {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: var(--Slider-inset-position);
    width: var(--Slider-knob-size);
    height: var(--Slider-knob-size);
    transform: translate(-50%, -50%);

    border-radius: var(--Slider-knob-radius);
    background: var(--Slider-knob-surface);
    box-shadow: var(--Slider-knob-shadow);
    outline: var(--input-outline-size) solid var(--Slider-outline-color);

    transition: border-radius .3s;
}

.Tooltip {
    --Slider-tooltip-surface: var(--ui-surface-color, var(--color-base-0));
    --Slider-tooltip-text: var(--ui-surface-text-color, var(--text-color));
    --Slider-tooltip-height: calc(var(--font-size-s) + var(--sp1));
    --Bubble-color: var(--Slider-tooltip-surface);
    --Bubble-shadow-color: var(--Slider-tooltip-shadow-color);
    --Bubble-arrow-size: 8px;

    top: 0;
    left: 50%;
    transform: translateX(-50%);
}

.TooltipContent {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: var(--Slider-tooltip-height);
    padding: 0 var(--sp1);

    font-size: var(--font-size-s);
    line-height: 1;
    color: var(--Slider-tooltip-text);
    white-space: nowrap;
}

.TooltipBody {
    cursor: text;
}

.TooltipInput {
    -webkit-appearance: none;
    -moz-appearance: textfield;
    appearance: textfield;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: center;
    cursor: text;
    user-select: text;
}

.TooltipInput::-webkit-outer-spin-button,
.TooltipInput::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.Scale {
    position: relative;
    margin-top: var(--sp1);
    height: var(--sp3);
}

.Tick {
    position: absolute;
    transform: translateX(-50%);
    text-align: center;
}

.Mark {
    width: 1px;
    height: var(--sp1);
    margin: 0 auto;
    background: var(--ui-border-color);
}

.Label {
    margin-top: var(--sp0-25);

    font-size: var(--font-size-xs);
    color: var(--text-color);
    white-space: nowrap;
}

/* States */

.Slider-disabled {
    cursor: not-allowed;
    opacity: .5;
}

.Slider:not(.Slider-disabled):hover .Track,
.Slider.Slider-force-hover .Track {
    filter: brightness(.96);
}

.Slider:not(.Slider-disabled):focus,
.Slider.Slider-force-focus {
    --Slider-outline-color: var(--ui-focus-outline-color);
    --Slider-border-color: var(--ui-focus-border-color);
}

/* Styles */

.Slider-round {
    --Slider-radius: calc(.5 * var(--input-major-height));
    --Slider-knob-radius: calc(.5 * var(--Slider-knob-size));
}

.Slider-outline {
    --Slider-border-color: var(--ui-border-color);
    --Slider-border-size: var(--input-border-size);
}

.Slider-flat {
    --Slider-track-shadow: none;
}

.Knob.Slider-knob-style-translucent {
    --Slider-knob-shadow:
        0 0 2px var(--shadow-color-medium),
        0 1px 5px var(--shadow-color-light),
        0 0 3px rgba(255,255,255,.5) inset;
    background: color-mix(in srgb, var(--Slider-knob-surface), transparent 75%);
    backdrop-filter: blur(3px);
}

.Fill.Slider-fill-style-inset {
    top: var(--input-minor-padding);
    left: calc(var(--Slider-knob-size) / 2);
    width: calc(var(--Slider-ratio) * (100% - var(--Slider-knob-size)));
    height: calc(100% - 2 * var(--input-minor-padding));
    border-radius: var(--Slider-radius);
}

.Fill.Slider-fill-style-none {
    display: none;
}
</style>
