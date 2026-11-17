<template>
    <div class="CurveEditor">
        <div class="Header">
            <span class="Label">{{ label }}</span>
            <span class="Readout">
                <template v-if="hoverIndex != null">
                    {{ steps[hoverIndex] }} · {{ values[hoverIndex].toFixed(3) }}
                    <template v-if="isCustom(hoverIndex)">
                        (default {{ defaults[hoverIndex].toFixed(3) }})
                    </template>
                </template>
                <template v-else>
                    drag a point, double-click to reset it
                </template>
            </span>
            <Btn
                icon="fas fa-rotate-left"
                :title="`Reset ${label.toLowerCase()} to defaults`"
                size="xs"
                square
                ghost
                :disabled="!customized"
                @click="$emit('reset')" />
        </div>
        <svg
            ref="svg"
            class="Chart"
            :viewBox="`0 0 ${width} ${height}`"
            @pointermove="onPointerMove"
            @pointerup="stopDrag"
            @pointercancel="stopDrag">
            <line
                v-for="y in guides"
                :key="y"
                class="Guide"
                :x1="padding"
                :x2="width - padding"
                :y1="y"
                :y2="y" />
            <polyline
                class="DefaultLine"
                :points="toPoints(defaults).map(p => `${p.x},${p.y}`).join(' ')" />
            <polyline
                class="Line"
                :points="points.map(p => `${p.x},${p.y}`).join(' ')" />
            <g
                v-for="(point, index) in points"
                :key="index"
                class="Point"
                :class="{
                    'Point-active': dragIndex === index,
                    'Point-custom': isCustom(index),
                }"
                @pointerdown="startDrag(index, $event)"
                @pointerenter="hoverIndex = index"
                @pointerleave="hoverIndex = dragIndex">
                <circle
                    class="HitArea"
                    :cx="point.x"
                    :cy="point.y"
                    r="12" />
                <circle
                    class="Dot"
                    :cx="point.x"
                    :cy="point.y"
                    r="4.5" />
            </g>
        </svg>
    </div>
</template>

<script>
import { clamp } from '@nightshadeui/util/src';

const DOUBLE_PRESS_MS = 350;

/**
 * Edits a curve of values, one draggable point per ramp step.
 */
export default {

    props: {
        label: { type: String, required: true },
        values: { type: Array, required: true },
        defaults: { type: Array, required: true },
        steps: { type: Array, required: true },
        min: { type: Number, default: 0 },
        max: { type: Number, default: 1 },
    },

    emits: [
        'update',
        'reset',
    ],

    data() {
        return {
            width: 320,
            height: 120,
            padding: 12,
            dragIndex: null,
            hoverIndex: null,
        };
    },

    computed: {

        points() {
            return this.toPoints(this.values);
        },

        customized() {
            return this.values.some((value, index) => this.isCustom(index));
        },

        guides() {
            const { height, padding } = this;
            return [0, 0.25, 0.5, 0.75, 1].map(t => padding + t * (height - 2 * padding));
        },

    },

    created() {
        this.lastPress = null;
    },

    methods: {

        toPoints(values) {
            const { width, height, padding, min, max } = this;
            const span = (width - 2 * padding) / (values.length - 1);
            return values.map((value, index) => {
                return {
                    x: padding + index * span,
                    y: height - padding - (value - min) / (max - min) * (height - 2 * padding),
                };
            });
        },

        isCustom(index) {
            return this.values[index] !== this.defaults[index];
        },

        /**
         * Pointer capture on the chart swallows `dblclick` on the points,
         * so a second press on the same point within the double-click window resets it here.
         */
        startDrag(index, ev) {
            const last = this.lastPress;
            this.lastPress = {
                index,
                time: ev.timeStamp,
            };
            if (last?.index === index && ev.timeStamp - last.time < DOUBLE_PRESS_MS) {
                this.lastPress = null;
                this.$emit('update', index, this.defaults[index]);
                return;
            }
            this.dragIndex = index;
            this.hoverIndex = index;
            this.$refs.svg.setPointerCapture(ev.pointerId);
        },

        stopDrag(ev) {
            if (this.dragIndex == null) {
                return;
            }
            this.dragIndex = null;
            this.$refs.svg.releasePointerCapture(ev.pointerId);
        },

        onPointerMove(ev) {
            if (this.dragIndex == null) {
                return;
            }
            const rect = this.$refs.svg.getBoundingClientRect();
            const { height, padding, min, max } = this;
            const y = (ev.clientY - rect.top) / rect.height * height;
            const t = clamp((height - padding - y) / (height - 2 * padding), 0, 1);
            const value = Math.round((min + t * (max - min)) * 1000) / 1000;
            this.$emit('update', this.dragIndex, value);
        },

    },

};
</script>

<style scoped>
.CurveEditor {
    display: flex;
    flex-flow: column;
    gap: var(--sp1);
}

.Header {
    display: flex;
    align-items: center;
    gap: var(--sp1);
}

.Label {
    font-size: var(--font-size-s);
    font-weight: 500;
}

.Readout {
    margin-left: auto;
    font: 400 var(--font-size-xxs) var(--font-monospace);
    line-height: var(--line-height-main);
    color: var(--text-faint);
}

.Chart {
    display: block;
    width: 100%;
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
    background: var(--surface-shade);
    touch-action: none;
}

.Guide {
    stroke: var(--border-base);
    stroke-dasharray: 2 4;
}

.DefaultLine {
    fill: none;
    stroke: var(--text-faint);
    stroke-width: 1.5;
    stroke-dasharray: 3 4;
    stroke-linejoin: round;
    opacity: .5;
}

.Line {
    fill: none;
    stroke: var(--color-primary-500);
    stroke-width: 2;
    stroke-linejoin: round;
}

.Point {
    cursor: ns-resize;
}

.HitArea {
    fill: transparent;
}

.Dot {
    fill: var(--surface-base);
    stroke: var(--color-primary-500);
    stroke-width: 2;
    transition: r .15s;
}

.Point-custom .Dot {
    fill: var(--color-primary-500);
}

.Point:hover .Dot,
.Point-active .Dot {
    r: 6;
}
</style>
