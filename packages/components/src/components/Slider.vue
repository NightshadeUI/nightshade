<template>
    <component
        :is="resolvedProps.tagName"
        class="Slider InputElement"
        :class="[
            effectiveStyle.tone && `tone-${effectiveStyle.tone}`,
            effectiveStyle.size && `input-size-${effectiveStyle.size}`,
            {
                'Slider-outline': effectiveStyle.outline,
                'Slider-round': effectiveStyle.round,
                'Slider-flat': effectiveStyle.flat,
                'Slider-translucent': effectiveStyle.translucent,
                'Slider-disabled': resolvedProps.disabled,
                'Slider-forceFocus': resolvedProps.forceFocus,
                'Slider-forceHover': resolvedProps.forceHover,
                'Slider-dragging': dragging,
            }
        ]"
        role="slider"
        :aria-valuemin="resolvedProps.min"
        :aria-valuemax="resolvedProps.max"
        :aria-valuenow="currentValue"
        :aria-disabled="resolvedProps.disabled || undefined"
        :tabindex="resolvedProps.disabled ? -1 : 0"
        :style="{ '--Slider-ratio': ratio }"
        @pointerdown="onPointerDown"
        @keydown="onKeydown"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @focusin="focus = true"
        @focusout="focus = false">
        <div
            ref="hitArea"
            class="HitArea" />
        <div
            ref="trackArea"
            class="TrackArea">
            <div
                ref="rail"
                class="Track">
                <div
                    class="Fill"
                    :class="`Slider-fill-${fillStyle}`" />
            </div>
            <div
                ref="knob"
                class="Knob">
                <Bubble
                    v-if="tooltipShown"
                    :class="`Tooltip tone-${resolvedProps.tooltipTone}`"
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
                :data-value="tick"
                :style="tickElementStyle(tick)">
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
} from '../helpers/props.js';
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
        tone: { type: String },
        size: { type: String },
        round: { type: Boolean, default: false },
        flat: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        translucent: { type: Boolean, default: false },
        disabled: { type: Boolean },
        forceFocus: { type: Boolean, default: false },
        forceHover: { type: Boolean, default: false },
        focusOverrides: { type: Object },
        hoverOverrides: { type: Object },
        tooltip: { type: String, default: 'off' },
        formatTooltip: { type: Function },
        tooltipTone: { type: String, default: 'inverse' },
        scale: { type: Array },
        formatScale: { type: Function },
        tickStyle: { type: Function },
        snapThreshold: { type: Number },
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
                tone: resolvedProps.tone,
                size: resolvedProps.size,
                round: resolvedProps.round,
                outline: resolvedProps.outline,
                flat: resolvedProps.flat,
                translucent: resolvedProps.translucent,
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
        this.stopDrag();
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

        tickElementStyle(tick) {
            const { min, max, tickStyle } = this.resolvedProps;
            const span = max - min;
            const ratio = span ? (tick - min) / span : 0;
            return Object.assign(
                { '--Slider-ratio': ratio },
                tickStyle?.(tick),
            );
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
            this.setValue(this.valueFromClientX(ev.clientX));
            window.addEventListener('pointermove', this.onPointerMove, { passive: false });
            window.addEventListener('pointerup', this.onPointerUp);
            window.addEventListener('pointercancel', this.onPointerUp);
            this.$refs.hitArea?.setPointerCapture(ev.pointerId);
        },

        onPointerMove(ev) {
            if (!this.dragging) {
                return;
            }
            ev.preventDefault();
            this.setValue(this.valueFromClientX(ev.clientX));
        },

        onPointerUp(ev) {
            if (!this.dragging) {
                return;
            }
            this.dragging = false;
            this.stopDrag();
            const hitArea = this.$refs.hitArea;
            if (hitArea?.hasPointerCapture(ev.pointerId)) {
                hitArea.releasePointerCapture(ev.pointerId);
            }
        },

        stopDrag() {
            window.removeEventListener('pointermove', this.onPointerMove);
            window.removeEventListener('pointerup', this.onPointerUp);
            window.removeEventListener('pointercancel', this.onPointerUp);
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
    --Slider-inset-position: calc(
        var(--Slider-knob-size) / 2 + var(--Slider-ratio) * (100% - var(--Slider-knob-size))
    );

    --Slider-track-height: calc(var(--input-minor-height) - var(--sp));
    --Slider-knob-size: var(--input-minor-height);

    --Slider-outline: transparent;

    --Slider-track-background: var(--surface-deep);
    --Slider-fill-background: var(--tone-fill);
    --Slider-knob-background: var(--surface-knob);
    --Slider-knob-transparency: 0%;

    --Slider-border-size: 0px;
    --Slider-border: transparent;
    --Slider-radius: var(--radius-m);
    --Slider-knob-radius: var(--radius-m);

    --Slider-shadow: var(--shadow-light);
    --Slider-track-box-shadow: 0 1px 3px var(--Slider-shadow) inset, 0 0 5px -1px var(--Slider-shadow) inset;
    --Slider-knob-box-shadow: 0 0 3px var(--Slider-shadow), 0 1px 5px var(--Slider-shadow);

    --Slider-tooltip-background: var(--surface-raised);
    --Slider-tooltip-text: var(--text-base);
    --Slider-tooltip-shadow: var(--shadow-light);

    position: relative;
    display: block;
    width: 100%;

    outline: 0;
    cursor: pointer;
    touch-action: none;
    user-select: none;
}

.HitArea {
    position: absolute;
    inset: 0;
    z-index: 0;
    touch-action: none;
}

.TrackArea {
    position: relative;
    z-index: 1;
    height: var(--Slider-knob-size);
    pointer-events: none;
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

    border: var(--Slider-border-size) solid var(--Slider-border);
    border-radius: var(--Slider-radius);
    outline: var(--input-outline-size) solid var(--Slider-outline);
    outline-offset: var(--input-outline-offset);
    background: var(--Slider-track-background);
    box-shadow: var(--Slider-track-box-shadow);

    transition: filter .3s, border-radius .3s;
}

.Fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;

    border-radius: inherit;
    background: var(--Slider-fill-background);

    pointer-events: none;
}

.Fill.Slider-fill-track {
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
    background: color-mix(in srgb, var(--Slider-knob-background), transparent var(--Slider-knob-transparency));
    box-shadow: var(--Slider-knob-box-shadow);
    outline: var(--input-outline-size) solid var(--Slider-outline);

    transition: border-radius .3s;
}

.Tooltip {
    --Slider-tooltip-background: var(--tone-fill);
    --Slider-tooltip-text: var(--tone-fill-text);
    --Slider-tooltip-height: var(--sp3);
    --Bubble-background: var(--Slider-tooltip-background);
    --Bubble-shadow: var(--Slider-tooltip-shadow);
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
    z-index: 1;
    margin-top: var(--sp1);
    height: var(--sp3);
}

.Tick {
    position: absolute;
    left: calc(var(--Slider-knob-size) / 2 + var(--Slider-ratio) * (100% - var(--Slider-knob-size)));
    transform: translateX(-50%);
    text-align: center;
}

.Mark {
    width: 1px;
    height: var(--sp1);
    margin: 0 auto;
    background: var(--tone-border);
}

.Label {
    margin-top: var(--sp0-25);

    font-size: var(--font-size-xs);
    color: var(--text-base);
    white-space: nowrap;
}

/* States */

.Slider-disabled {
    cursor: not-allowed;
    opacity: var(--input-disabled-opacity);
    filter: var(--input-disabled-filter);
}

.Slider-disabled .HitArea {
    pointer-events: none;
}

.Slider:not(.Slider-disabled):hover .Track,
.Slider.Slider-forceHover .Track {
    filter: var(--input-hover-filter);
}

.Slider:not(.Slider-disabled):focus-visible,
.Slider.Slider-forceFocus {
    --Slider-outline: var(--tone-focus-outline);
    --Slider-border: var(--tone-focus-border);
}

/* Styles */

.Slider-round {
    --Slider-radius: calc(.5 * var(--Slider-track-height));
    --Slider-knob-radius: calc(.5 * var(--Slider-knob-size));
}

.Slider-outline {
    --Slider-border: var(--tone-border);
    --Slider-border-size: var(--input-border-size);
}

.Slider-flat {
    --Slider-track-box-shadow: none;
}

.Slider-translucent {
    --Slider-knob-box-shadow:
        0 0 2px var(--shadow-medium),
        0 1px 5px var(--shadow-light),
        0 0 3px var(--translucency-highlight) inset;
    --Slider-knob-transparency: var(--translucency-mix-heavy);
}

.Slider-translucent .Knob {
    backdrop-filter: blur(var(--translucency-blur));
}

.Fill.Slider-fill-inset {
    top: var(--input-minor-padding);
    left: calc(var(--Slider-knob-size) / 2);
    width: calc(var(--Slider-ratio) * (100% - var(--Slider-knob-size)));
    height: calc(100% - 2 * var(--input-minor-padding));
    border-radius: var(--Slider-radius);
}

.Fill.Slider-fill-none {
    display: none;
}
</style>
