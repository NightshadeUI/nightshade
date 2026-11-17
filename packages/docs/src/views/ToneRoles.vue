<template>
    <div class="ToneRoles">
        <div
            class="Tones"
            role="group"
            aria-label="Tone">
            <button
                v-for="name in stylesManager.tones"
                :key="name"
                type="button"
                class="ToneButton"
                :class="[`tone-${name}`, { 'ToneButton-selected': name === tone }]"
                :aria-pressed="String(name === tone)"
                @click="tone = name">
                <span class="ToneDot" />
                {{ name }}
            </button>
        </div>
        <div
            ref="figure"
            class="Figure"
            :class="[`tone-${tone}`, { 'Figure-compact': compact }]">
            <svg
                class="Leaders"
                :viewBox="`0 0 ${size.width} ${size.height}`"
                aria-hidden="true">
                <template
                    v-for="leader in leaders"
                    :key="leader.role">
                    <polyline
                        v-if="!compact"
                        class="Line"
                        :points="leader.points" />
                    <circle
                        class="Dot"
                        :cx="leader.target.x"
                        :cy="leader.target.y"
                        :r="compact ? 8 : 3" />
                    <text
                        v-if="compact"
                        class="DotNumber"
                        :x="leader.target.x"
                        :y="leader.target.y">{{ leader.number }}</text>
                </template>
            </svg>
            <ul
                ref="leftLabels"
                class="Labels Labels-left">
                <li
                    v-for="label in sideLabels('left')"
                    :key="label.role"
                    class="Label"
                    :style="{ top: `${label.columnTop}px` }">
                    <RoleLabel
                        :label="label"
                        :end="true" />
                </li>
            </ul>
            <div
                class="Stage"
                :style="{ minHeight: `${stageHeight}px` }">
                <article
                    ref="card"
                    class="Card">
                    <header class="CardHeader">
                        <span class="CardTitle">Nightly price check</span>
                        <span
                            ref="chip"
                            class="Chip">
                            <span ref="chipText">Running</span>
                        </span>
                    </header>
                    <div class="Progress">
                        <span class="ProgressMeta">12 of 19 sites</span>
                        <span class="Track">
                            <span
                                ref="fill"
                                class="TrackFill" />
                        </span>
                    </div>
                    <div class="Controls">
                        <span
                            ref="button"
                            class="Button">
                            <span ref="buttonText">Run now</span>
                        </span>
                        <span
                            ref="field"
                            class="Field">Search runs</span>
                    </div>
                    <span
                        ref="link"
                        class="Link">View 12 runs</span>
                </article>
            </div>
            <ul
                ref="rightLabels"
                class="Labels Labels-right">
                <li
                    v-for="label in sideLabels('right')"
                    :key="label.role"
                    class="Label"
                    :style="{ top: `${label.columnTop}px` }">
                    <RoleLabel :label="label" />
                </li>
            </ul>
            <ol
                v-if="compact"
                class="Legend">
                <li
                    v-for="label in numberedLabels"
                    :key="label.role"
                    class="LegendItem">
                    <span class="LegendNumber">{{ label.number }}</span>
                    <RoleLabel :label="label" />
                </li>
            </ol>
        </div>
    </div>
</template>

<script>
import { rampSteps } from '../helpers/commons.js';

/**
 * Where each role shows on the card: the part (a ref), a point on it (fractions of its box, plus a px nudge),
 * and the side its label sits on.
 */
const anatomy = [
    { role: 'fill', ref: 'fill', x: 0.04, y: 0.5, side: 'left' },
    { role: 'fill-top', ref: 'button', x: 0.06, y: 0.18, side: 'left' },
    { role: 'border', ref: 'button', x: 0, y: 0.5, side: 'left' },
    { role: 'fill-bottom', ref: 'button', x: 0.06, y: 0.82, side: 'left' },
    { role: 'fill-text', ref: 'buttonText', x: 0.5, y: 1, dy: 1, side: 'left' },
    { role: 'text', ref: 'link', x: 0, y: 0.55, dx: -3, side: 'left' },
    { role: 'shadow', ref: 'button', x: 0.3, y: 1, dy: 5, side: 'left' },
    { role: 'tint', ref: 'chip', x: 1, y: 0.5, dx: -5, side: 'right' },
    { role: 'tint-text', ref: 'chipText', x: 0.5, y: 1, dy: 1, side: 'right' },
    { role: 'focus-outline', ref: 'field', x: 1, y: 0.3, dx: 3, side: 'right' },
    { role: 'focus-border', ref: 'field', x: 1, y: 0.72, dx: -0.5, side: 'right' },
];

const LABEL_GAP = 60;
/** Tall enough for the longer column of labels. */
const STAGE_HEIGHT = LABEL_GAP * Math.max(...['left', 'right'].map(side => {
    return anatomy.filter(part => part.side === side).length;
}));
const ELBOW = 16;
const COMPACT_WIDTH = 640;

/**
 * Every tone role, on the part of a control that uses it: a close-up of a made-up card, in one tone at a time,
 * with a leader from each role's label to where it shows, and the step the role reads in that tone.
 * Below 600px the leaders give way to numbered dots and a legend.
 */
export default {

    inject: [
        'stylesManager',
    ],

    data() {
        return {
            tone: 'primary',
            size: {
                width: 0,
                height: 0,
            },
            labels: [],
            leaders: [],
            compact: false,
            stageHeight: STAGE_HEIGHT,
        };
    },

    computed: {

        numberedLabels() {
            return this.labels.toSorted((a, b) => a.number - b.number);
        },

    },

    watch: {

        async tone() {
            await this.$nextTick();
            this.measure();
        },

    },

    mounted() {
        this.observer = new ResizeObserver(() => this.measure());
        this.observer.observe(this.$refs.figure);
        document.fonts?.ready.then(() => this.measure());
        this.measure();
    },

    beforeUnmount() {
        this.observer.disconnect();
    },

    methods: {

        sideLabels(side) {
            return this.compact ? [] : this.labels.filter(label => label.side === side);
        },

        measure() {
            const figure = this.$refs.figure.getBoundingClientRect();
            this.size = {
                width: figure.width,
                height: figure.height,
            };
            this.compact = figure.width < COMPACT_WIDTH;
            const steps = this.readSteps();
            const labels = anatomy.map((part, index) => ({
                ...part,
                number: index + 1,
                step: steps[part.role],
                target: this.locate(part, figure),
            }));
            this.labels = [
                ...this.stackLabels(labels.filter(label => label.side === 'left'), figure),
                ...this.stackLabels(labels.filter(label => label.side === 'right'), figure),
            ];
            this.leaders = this.labels.map(label => this.drawLeader(label, figure));
        },

        locate(part, figure) {
            const rect = this.$refs[part.ref].getBoundingClientRect();
            return {
                x: rect.left - figure.left + rect.width * part.x + (part.dx ?? 0),
                y: rect.top - figure.top + rect.height * part.y + (part.dy ?? 0),
            };
        },

        // Slots sit level with the targets where they can, never closer than the gap, and inside the column;
        // labels fill them in the anatomy's order, chosen so the leaders don't tangle.
        // `top` is in the figure's coordinates (for the leader), `columnTop` in the column's (for the label).
        stackLabels(labels, figure) {
            const column = this.$refs[`${labels[0].side}Labels`].getBoundingClientRect();
            const columnStart = column.top - figure.top;
            const sorted = labels.toSorted((a, b) => a.target.y - b.target.y);
            let next = columnStart + LABEL_GAP / 2;
            for (const label of sorted) {
                label.top = Math.max(label.target.y, next);
                next = label.top + LABEL_GAP;
            }
            const overflow = next - LABEL_GAP / 2 - (columnStart + column.height);
            const slots = sorted.map(label => label.top - Math.max(0, overflow));
            for (const [index, label] of labels.entries()) {
                label.top = slots[index];
                label.columnTop = label.top - columnStart;
            }
            return labels;
        },

        // Where a side's leaders bend: just outside the card
        elbowX(side, figure) {
            const card = this.$refs.card.getBoundingClientRect();
            return side === 'left' ? card.left - figure.left - ELBOW : card.right - figure.left + ELBOW;
        },

        drawLeader(label, figure) {
            const left = label.side === 'left';
            const column = (left ? this.$refs.leftLabels : this.$refs.rightLabels).getBoundingClientRect();
            const start = (left ? column.right : column.left) - figure.left;
            const elbow = this.elbowX(label.side, figure);
            return {
                role: label.role,
                number: label.number,
                target: label.target,
                points: `${start},${label.top} ${elbow},${label.top} ${label.target.x},${label.target.y}`,
            };
        },

        // The step each role resolves to in this tone: `500`, `contrast`, `secondary 300`, or `{ light, dark }`
        readSteps() {
            const style = getComputedStyle(this.$refs.card);
            const names = this.readValueNames(style);
            const steps = {};
            for (const { role } of anatomy) {
                steps[role] = this.nameValue(style.getPropertyValue(`--tone-${role}`).trim(), names);
            }
            return steps;
        },

        // Later entries win: a tone's own step names a value before the ramp it points at
        readValueNames(style) {
            const names = new Map();
            const read = name => style.getPropertyValue(name).trim();
            for (const ramp of this.stylesManager.ramps) {
                for (const step of rampSteps) {
                    names.set(read(`--color-${ramp}-${step}`), `${ramp} ${step}`);
                }
            }
            for (const level of ['light', 'medium', 'heavy']) {
                names.set(read(`--shadow-${level}`), `shadow-${level}`);
            }
            names.set(read('--tone-contrast'), 'contrast');
            for (const step of rampSteps) {
                names.set(read(`--tone-${step}`), String(step));
            }
            return names;
        },

        nameValue(value, names) {
            if (names.has(value)) {
                return names.get(value);
            }
            const [light, dark] = this.splitLightDark(value);
            if (names.has(light) && names.has(dark)) {
                return { light: names.get(light), dark: names.get(dark) };
            }
            return '';
        },

        splitLightDark(value) {
            const inner = value.match(/^light-dark\((.*)\)$/)?.[1] ?? '';
            let depth = 0;
            for (const [index, char] of [...inner].entries()) {
                depth += char === '(' ? 1 : char === ')' ? -1 : 0;
                if (char === ',' && depth === 0) {
                    return [inner.slice(0, index).trim(), inner.slice(index + 1).trim()];
                }
            }
            return [];
        },

    },

};
</script>

<style scoped>
.ToneRoles {
    margin: var(--sp3) 0;
}

/* The tone switch */

.Tones {
    display: flex;
    flex-flow: row wrap;
    gap: var(--sp0-5);
    margin-bottom: var(--sp2);
}

.ToneButton {
    display: inline-flex;
    align-items: center;
    gap: var(--sp1);
    height: var(--sp3);
    padding: 0 var(--sp1);
    border: 1px solid var(--border-base);
    border-radius: var(--radius-m);
    background: var(--surface-base);
    color: var(--text-subtle);
    font: 500 var(--font-size-xs) var(--font-monospace);
    line-height: var(--line-height-main);
    cursor: pointer;
}

.ToneButton:not(.ToneButton-selected):hover {
    color: var(--text-base);
}

.ToneButton:focus-visible {
    outline: 2px solid var(--tone-focus-outline);
    outline-offset: 1px;
}

.ToneButton-selected {
    border-color: var(--tone-border);
    background: var(--tone-tint);
    color: var(--tone-tint-text);
}

.ToneDot {
    width: var(--sp1);
    height: var(--sp1);
    border-radius: 50%;
    background: var(--tone-fill);
    box-shadow: 0 0 0 1px var(--tone-border);
}

/* The figure: labels, the close-up, labels */

.Figure {
    position: relative;
    display: grid;
    grid-template-columns: minmax(110px, 1fr) minmax(280px, 340px) minmax(110px, 1fr);
    gap: var(--sp5);
    padding: var(--sp5) var(--sp3);
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
    background: var(--surface-shade);
}

.Figure-compact {
    grid-template-columns: minmax(0, 1fr);
    padding: var(--sp3) var(--sp2);
}

.Leaders {
    position: absolute;
    inset: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
}

.Line {
    fill: none;
    stroke: var(--text-faint);
    stroke-width: 1;
}

.Dot {
    fill: var(--text-base);
    stroke: var(--surface-base);
    stroke-width: 1.5;
}

.Figure-compact .Dot {
    fill: var(--surface-base);
    stroke: var(--text-base);
}

.DotNumber {
    fill: var(--text-base);
    font: 700 var(--font-size-xxs) var(--font-monospace);
    line-height: var(--line-height-main);
    text-anchor: middle;
    dominant-baseline: central;
}

.Labels {
    position: relative;
    margin: 0;
    padding: 0;
    list-style: none;
}

.Figure-compact .Labels {
    display: none;
}

/* A label hangs from its name row: the row's middle sits at `top`, where the leader starts */
.Label {
    position: absolute;
    margin: 0;
    transform: translateY(calc(-.5 * var(--sp2)));
}

.Labels-left .Label {
    right: 0;
}

.Labels-right .Label {
    left: 0;
}

/* The close-up: a card drawn from the roles alone, larger than life */

.Stage {
    display: flex;
    align-items: center;
    justify-content: center;
}

.Card {
    display: flex;
    flex-flow: column;
    gap: var(--sp2);
    box-sizing: border-box;
    width: 100%;
    padding: var(--sp3);
    border: 1px solid var(--border-raised);
    border-radius: var(--radius-l);
    background: var(--surface-raised);
    box-shadow: 0 var(--sp1) var(--sp4) var(--shadow-light);
    color: var(--text-base);
    font-size: var(--font-size-m);
}

.CardHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp1);
}

.CardTitle {
    font-weight: var(--font-weight-bold);
}

.Chip {
    display: inline-flex;
    align-items: center;
    height: var(--sp3);
    padding: 0 var(--sp1-5);
    border-radius: var(--sp1-5);
    background: var(--tone-tint);
    color: var(--tone-tint-text);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    letter-spacing: .04em;
    text-transform: uppercase;
}

.Progress {
    display: flex;
    flex-flow: column;
    gap: var(--sp0-5);
}

.ProgressMeta {
    color: var(--text-subtle);
    font-size: var(--font-size-s);
}

.Track {
    display: block;
    height: var(--sp1);
    border-radius: var(--sp0-5);
    background: var(--surface-deep);
}

.TrackFill {
    display: block;
    width: 64%;
    height: 100%;
    border-radius: inherit;
    background: var(--tone-fill);
}

.Link {
    align-self: flex-start;
    color: var(--tone-text);
    font-weight: var(--font-weight-bold);
    text-decoration: underline;
    text-decoration-color: color-mix(in oklab, currentColor, transparent 60%);
    text-underline-offset: 3px;
}

.Controls {
    display: flex;
    align-items: center;
    gap: var(--sp2);
}

.Button {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    box-sizing: border-box;
    height: var(--sp6);
    padding: 0 var(--sp3);
    border: 1px solid var(--tone-border);
    border-radius: var(--radius-m);
    background: linear-gradient(to bottom, var(--tone-fill-top), var(--tone-fill-bottom));
    box-shadow: 0 var(--sp0-5) var(--sp1-5) -2px var(--tone-shadow);
    color: var(--tone-fill-text);
    font-weight: var(--font-weight-bold);
}

.Field {
    display: flex;
    flex: 1;
    align-items: center;
    box-sizing: border-box;
    min-width: 0;
    height: var(--sp6);
    padding: 0 var(--sp1-5);
    border: 1px solid var(--tone-focus-border);
    border-radius: var(--radius-m);
    outline: 3px solid var(--tone-focus-outline);
    outline-offset: 1px;
    background: var(--surface-base);
    color: var(--text-faint);
}

/* Narrow: numbered dots on the card, the roles below it */

.Legend {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: var(--sp1) var(--sp2);
    margin: var(--sp2) 0 0;
    padding: 0;
    list-style: none;
}

.LegendItem {
    display: flex;
    align-items: center;
    gap: var(--sp1);
}

.LegendNumber {
    flex-shrink: 0;
    width: var(--sp2-5);
    color: var(--text-faint);
    font: 700 var(--font-size-xxs) var(--font-monospace);
    line-height: var(--line-height-main);
    text-align: center;
}
</style>
