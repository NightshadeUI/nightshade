<template>
    <div class="LayerRings">
        <div class="Layout">
            <div class="Diagram">
                <svg
                    viewBox="0 0 660 660"
                    role="img"
                    aria-label="Principles, styles and your system as rings, with opt-in packages orbiting them">
                    <g
                        v-for="ring in ringsOutsideIn"
                        :key="ring.id"
                        class="Ring"
                        :class="[
                            `Ring-${ring.id}`,
                            {
                                'Ring-active': activeId === ring.id,
                            },
                        ]"
                        @mouseenter="activeId = ring.id">
                        <circle
                            :cx="center"
                            :cy="center"
                            :r="ring.radius" />
                        <text
                            :x="center"
                            :y="ring.labelY"
                            text-anchor="middle">
                            {{ ring.title }}
                        </text>
                    </g>
                    <g
                        v-for="satellite in satellites"
                        :key="satellite.id"
                        class="Satellite"
                        :class="[
                            `Satellite-${satellite.kind}`,
                            {
                                'Satellite-active': activeId === satellite.id,
                            },
                        ]"
                        @mouseenter="activeId = satellite.id">
                        <line
                            class="Link"
                            :x1="satellite.linkStart[0]"
                            :y1="satellite.linkStart[1]"
                            :x2="satellite.linkEnd[0]"
                            :y2="satellite.linkEnd[1]" />
                        <circle
                            class="LinkTip"
                            :cx="satellite.linkEnd[0]"
                            :cy="satellite.linkEnd[1]"
                            r="3.5" />
                        <circle
                            class="Body"
                            :cx="satellite.position[0]"
                            :cy="satellite.position[1]"
                            :r="satelliteRadius" />
                        <text
                            :x="satellite.position[0]"
                            :y="satellite.position[1] + 4"
                            text-anchor="middle">
                            {{ satellite.short }}
                        </text>
                    </g>
                </svg>
            </div>
            <div class="Legend">
                <ol class="List">
                    <li
                        v-for="ring in rings"
                        :key="ring.id"
                        class="Item"
                        :class="{ 'Item-active': activeId === ring.id }"
                        @mouseenter="activeId = ring.id">
                        <a
                            :href="withBase(ring.link)"
                            class="ItemLink">
                            <span class="ItemTitle">{{ ring.title }}</span>
                            <code class="Package">{{ ring.package }}</code>
                        </a>
                        <p class="Summary">
                            {{ ring.summary }}
                        </p>
                        <p class="Action">
                            <i class="fas fa-arrow-right" />
                            {{ ring.action }}
                        </p>
                    </li>
                </ol>
                <h3 class="OptInsTitle">
                    Opt-ins
                </h3>
                <ul class="OptIns">
                    <li
                        v-for="satellite in satellites"
                        :key="satellite.id"
                        class="OptIn"
                        :class="{ 'OptIn-active': activeId === satellite.id }"
                        @mouseenter="activeId = satellite.id">
                        <a
                            :href="withBase(satellite.link)"
                            class="OptInLink">
                            <span class="OptInTitle">{{ satellite.title }}</span>
                            <span class="OptInNote">{{ satellite.note }}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { withBase } from 'vitepress';

const center = 330;
const satelliteRadius = 34;
const satelliteDistance = 285;

const rings = [
    {
        id: 'principles',
        title: 'Principles',
        package: 'philosophy',
        link: '/philosophy/',
        summary: 'The few ideas everything else follows: simplicity, finite vocabularies, CSS first, ownership.',
        action: 'Take what helps, and adapt the rest to your product.',
        radius: 84,
    },
    {
        id: 'styles',
        title: 'Styles',
        package: '@nightshadeui/stylesheets',
        link: '/styles/',
        summary: 'The principles as CSS variables: scales, context and roles. Install, generate a palette, go.',
        action: 'Any variable can be overridden at your :root, and your CSS always wins.',
        radius: 168,
    },
    {
        id: 'app',
        title: 'Your system',
        package: 'your app',
        link: '/philosophy/ownership',
        summary: 'Your product’s look and language, grown on the styles and whatever opt-ins you take.',
        action: 'Grow your own components on the same roles. It’s all yours.',
        radius: 244,
    },
];

const satellites = [
    {
        id: 'palette',
        kind: 'tool',
        short: 'Palette',
        title: 'Palette generator',
        note: 'Writes the color scales of the styles from a spec: CLI or Studio.',
        link: '/studio',
        angle: -48,
        target: 'styles',
    },
    {
        id: 'components',
        kind: 'package',
        short: 'Comps',
        title: 'Components',
        note: 'Standard Vue controls that read the styles. Use them, or map your own library to the same variables.',
        link: '/components/',
        angle: 12,
        target: 'app',
    },
    {
        id: 'canvas',
        kind: 'package',
        short: 'Canvas',
        title: 'Canvas',
        note: 'Pan, zoom, select and resize, as a controller.',
        link: '/opt-ins/canvas',
        angle: 62,
        target: 'app',
    },
    {
        id: 'particles',
        kind: 'package',
        short: 'Particles',
        title: 'Particle system',
        note: 'Emitters for HTML, SVG or canvas. The hero above runs on it.',
        link: '/opt-ins/particles',
        angle: 112,
        target: 'app',
    },
    {
        id: 'scroller',
        kind: 'package',
        short: 'Scroller',
        title: 'Scroller',
        note: 'Scroll tracking for long, virtual lists.',
        link: '/opt-ins/scroller',
        angle: 162,
        target: 'app',
    },
    {
        id: 'own',
        kind: 'own',
        short: 'Yours',
        title: 'Your own',
        note: 'Anything you build on the same variables snaps in the same way.',
        link: '/philosophy/ownership',
        angle: 212,
        target: 'app',
    },
];

/**
 * The model: principles and styles at the core of your system, with opt-ins orbiting them.
 */
export default {

    data() {
        return {
            center,
            satelliteRadius,
            rings,
            activeId: 'styles',
        };
    },

    computed: {

        ringsOutsideIn() {
            return rings
                .map((ring, index) => {
                    const inner = index === 0 ? 0 : rings[index - 1].radius;
                    return {
                        ...ring,
                        labelY: index === 0 ? center + 8 : center - (inner + ring.radius) / 2 + 5,
                    };
                })
                .reverse();
        },

        satellites() {
            return satellites.map(satellite => {
                const target = rings.find(ring => ring.id === satellite.target);
                const depth = satellite.target === 'app' ? (rings[1].radius + target.radius) / 2 : target.radius;
                return {
                    ...satellite,
                    position: this.locate(satellite.angle, satelliteDistance),
                    linkStart: this.locate(satellite.angle, satelliteDistance - satelliteRadius),
                    linkEnd: this.locate(satellite.angle, depth),
                };
            });
        },

    },

    methods: {

        withBase,

        locate(angle, distance) {
            const radians = angle * Math.PI / 180;
            return [
                center + Math.cos(radians) * distance,
                center + Math.sin(radians) * distance,
            ];
        },

    },

};
</script>

<style scoped>
.LayerRings {
    container-type: inline-size;
}

.Layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: center;
    gap: var(--sp4);
}

.Diagram svg {
    display: block;
    width: 100%;
    max-width: 520px;
    margin: 0 auto;
    overflow: visible;
}

.Ring circle {
    stroke: color-mix(in oklab, var(--color-primary-600), transparent 55%);
    stroke-width: 1;
    transition: fill .3s, stroke .3s;
}

.Ring-principles circle {
    fill: color-mix(in oklab, var(--color-primary-500), var(--surface-base) 72%);
}

.Ring-styles circle {
    fill: color-mix(in oklab, var(--color-primary-500), var(--surface-base) 84%);
}

.Ring-app circle {
    fill: var(--surface-base);
    /* stroke-dasharray: 4 6; */
}

.Ring text,
.Satellite text {
    font: 600 var(--font-size-xs) var(--font-main);
    line-height: var(--line-height-main);
    fill: var(--text-subtle);
    pointer-events: none;
    transition: fill .3s;
}

.Ring-principles text {
    font: 400 var(--font-size-xl) var(--font-alt);
    line-height: var(--line-height-prose);
}

.Ring-active circle {
    stroke: var(--color-primary-600);
    stroke-width: 1.5;
    fill: color-mix(in oklab, var(--color-primary-500), var(--surface-base) 60%);
}

.Ring-active text,
.Satellite-active text {
    fill: var(--text-base);
}

.Satellite {
    --Satellite-border: var(--color-primary-600);
}

.Satellite-tool {
    --Satellite-border: var(--color-secondary-600);
}

.Satellite .Body {
    fill: var(--surface-base);
    stroke: var(--Satellite-border);
    stroke-width: 1;
    transition: fill .3s;
}

.Satellite-own .Body {
    stroke-dasharray: 3 4;
}

.Satellite text {
    font-size: var(--font-size-xxs);
}

.Link {
    stroke: var(--Satellite-border);
    stroke-width: 1.5;
    stroke-dasharray: 3 4;
}

.LinkTip {
    fill: var(--Satellite-border);
}

.Satellite-active .Body {
    fill: color-mix(in oklab, var(--Satellite-border), var(--surface-base) 80%);
}

/* Legend */

.Legend {
    min-width: 0;
}

.List,
.OptIns {
    margin: 0;
    padding: 0;
    list-style: none;
}

.List {
    border-top: 1px solid var(--border-base);
}

.Item {
    padding: var(--sp1-5) var(--sp2);
    border-bottom: 1px solid var(--border-base);
    transition: background-color .3s;
}

.Item-active {
    background: var(--surface-shade);
    box-shadow: 2px 0 0 var(--color-primary-500) inset;
}

.ItemLink {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp0-5) var(--sp2);
}

.ItemTitle {
    font: 400 var(--font-size-xl) var(--font-alt);
    line-height: var(--line-height-prose);
}

.Item-active .ItemTitle {
    color: var(--color-primary-600);
}

.Package {
    font: 400 var(--font-size-xs) var(--font-monospace);
    line-height: var(--line-height-main);
    color: var(--text-faint);
}

.Summary {
    margin: var(--sp1) 0 0;
    font-size: var(--font-size-s);
    color: var(--text-subtle);
}

.Action {
    display: flex;
    align-items: baseline;
    gap: var(--sp1);
    margin: var(--sp0-5) 0 0;
    font-size: var(--font-size-s);
    font-weight: 600;
}

.Action i {
    font-size: var(--font-size-xs);
    color: var(--color-primary-500);
}

.OptInsTitle {
    margin: var(--sp3) 0 var(--sp1);
    font: 600 var(--font-size-s) var(--font-main);
    line-height: var(--line-height-main);
    color: var(--text-subtle);
}

.OptIns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--sp1);
}

.OptIn {
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
    transition: border-color .3s, background-color .3s;
}

.OptIn-active {
    border-color: var(--color-primary-600);
    background: var(--surface-shade);
}

.OptInLink {
    display: flex;
    flex-flow: column;
    height: 100%;
    padding: var(--sp1) var(--sp1-5);
}

.OptInTitle {
    font-weight: 600;
}

.OptInNote {
    font-size: var(--font-size-xs);
    line-height: var(--line-height-main);
    color: var(--text-subtle);
}

@container (max-width: 480px) {
    .OptIns {
        grid-template-columns: minmax(0, 1fr);
    }
}

@container (min-width: 880px) {
    .Layout {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: var(--sp6);
    }
}
</style>
