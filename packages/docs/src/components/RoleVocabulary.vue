<template>
    <div class="RoleVocabulary">
        <div class="Groups">
            <section
                v-for="group in groups"
                :key="group.id"
                class="Group">
                <header class="GroupHeader">
                    <h3 class="GroupTitle">
                        {{ group.title }}
                    </h3>
                    <p class="GroupNote">
                        {{ group.note }}
                    </p>
                </header>
                <ul
                    class="Roles"
                    :class="`tone-${tone}`">
                    <li
                        v-for="role in group.roles"
                        :key="role.names[0]"
                        class="Role">
                        <span class="Swatches">
                            <span
                                v-for="name in role.names"
                                :key="name"
                                class="Swatch"
                                :style="{ background: `var(${name})` }" />
                        </span>
                        <code class="Names">{{ role.names.join(', ') }}</code>
                        <span class="Use">{{ role.use }}</span>
                    </li>
                </ul>
            </section>
        </div>
        <aside class="Example">
            <div class="ExampleHeader">
                <h3 class="GroupTitle">
                    A component of your own
                </h3>
                <div class="Tones">
                    <Chip
                        v-for="option in exampleTones"
                        :key="option"
                        :label="option"
                        :tone="option"
                        size="s"
                        :outline="option === tone"
                        @click="tone = option" />
                </div>
            </div>
            <div
                class="Plant"
                :class="`tone-${tone}`">
                <div class="PlantTop">
                    <span class="PlantName">Monstera</span>
                    <span class="PlantBadge">Thirsty</span>
                </div>
                <p class="PlantText">
                    Likes bright, indirect light and a dry spell between waterings.
                </p>
                <div class="PlantStats">
                    <div class="PlantStat">
                        <span class="PlantLabel">Watered</span>
                        <span>9 days ago</span>
                    </div>
                    <div class="PlantStat">
                        <span class="PlantLabel">Every</span>
                        <span>7 days</span>
                    </div>
                </div>
                <div class="PlantFoot">
                    <a class="PlantLink">Care notes</a>
                    <Btn
                        label="Water now"
                        icon="fas fa-droplet"
                        size="s" />
                </div>
            </div>
            <pre class="Source"><code>{{ source }}</code></pre>
        </aside>
    </div>
</template>

<script>
import { Btn, Chip } from '@nightshadeui/components';

const groups = [
    {
        id: 'canvas',
        title: 'Canvas',
        note: 'The neutral world, in three levels of nesting. A tone context never changes it.',
        roles: [
            {
                names: ['--surface-base', '--border-base'],
                use: 'Level 1: the page, and its edges.',
            },
            {
                names: ['--surface-shade', '--border-shade'],
                use: 'Level 2: a region inside it: cards, sidebars.',
            },
            {
                names: ['--surface-deep', '--border-deep'],
                use: 'Level 3: a well: fields, tracks, stats.',
            },
            {
                names: ['--surface-raised', '--border-raised'],
                use: 'Popups, menus, tooltips: anything that floats above.',
            },
            {
                names: ['--surface-knob'],
                use: 'Knobs: the moving part of a control.',
            },
            {
                names: ['--text-base', '--text-subtle', '--text-faint'],
                use: 'Body, secondary and hint text.',
            },
            {
                names: ['--shadow-light', '--shadow-medium', '--shadow-heavy'],
                use: 'Depth, from hairline to modal.',
            },
        ],
    },
    {
        id: 'tone',
        title: 'Tone',
        note: 'Follows the nearest .tone-* class. Pick a tone above to watch these change.',
        roles: [
            {
                names: ['--tone-text'],
                use: 'Tone-colored text and icons on the canvas.',
            },
            {
                names: ['--tone-tint', '--tone-tint-text'],
                use: 'A soft background and the text on it: chips, badges.',
            },
            {
                names: ['--tone-fill', '--tone-fill-top', '--tone-fill-bottom'],
                use: 'The solid fill of a control, and its bevel.',
            },
            {
                names: ['--tone-fill-text'],
                use: 'Text and icons on the fill.',
            },
            {
                names: ['--tone-border'],
                use: 'The edge of a control.',
            },
            {
                names: ['--tone-focus-outline', '--tone-focus-border'],
                use: 'The focus ring.',
            },
        ],
    },
    {
        id: 'ramp',
        title: 'Context ramp',
        note: 'The escape hatch: any step of the current tone, when no role names what you need.',
        roles: [
            {
                names: [
                    '--tone-0',
                    '--tone-100',
                    '--tone-200',
                    '--tone-300',
                    '--tone-500',
                    '--tone-700',
                    '--tone-900',
                    '--tone-950',
                ],
                use: 'Twelve steps, 0 to 950, and --tone-contrast.',
            },
        ],
    },
];

const source = `.Plant {
    background: var(--surface-base);
    border: 1px solid var(--border-base);
    color: var(--text-base);
}
.PlantBadge {
    background: var(--tone-tint);
    color: var(--tone-tint-text);
}
.PlantText { color: var(--text-subtle); }
.PlantStat {
    background: var(--surface-shade);
    border: 1px solid var(--border-shade);
}
.PlantLink { color: var(--tone-text); }`;

/**
 * The complete role vocabulary, and a component built from nothing else.
 */
export default {

    components: {
        Btn,
        Chip,
    },

    data() {
        return {
            groups,
            source,
            tone: 'primary',
            exampleTones: ['base', 'primary', 'secondary', 'success', 'danger'],
        };
    },

};
</script>

<style scoped>
.RoleVocabulary {
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
    align-items: start;
    gap: var(--sp4);
}

.Groups {
    display: flex;
    flex-flow: column;
    gap: var(--sp3);
}

.GroupHeader {
    margin-bottom: var(--sp1);
}

.GroupTitle {
    margin: 0;
    font: 600 var(--font-size-l)/1.3 var(--font-main);
}

.GroupNote {
    margin: var(--sp0-5) 0 0;
    font-size: var(--font-size-s);
    color: var(--text-subtle);
}

.Roles {
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid var(--border-base);
}

.Role {
    display: grid;
    grid-template-columns: var(--sp10) minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    gap: var(--sp2);
    padding: var(--sp1) 0;
    border-bottom: 1px solid var(--border-base);
    font-size: var(--font-size-s);
}

.Swatches {
    display: flex;
    gap: var(--sp0-5);
}

.Swatch {
    flex: 1;
    height: var(--sp3);
    border-radius: var(--radius-m);
    box-shadow: 0 0 0 1px color-mix(in oklab, var(--text-base), transparent 88%) inset;
}

.Names {
    font: 400 var(--font-size-xs)/1.4 var(--font-monospace);
    overflow-wrap: anywhere;
}

.Use {
    color: var(--text-subtle);
}

/* Example */

.Example {
    position: sticky;
    top: calc(var(--Site-header-height) + var(--sp3));
    display: flex;
    flex-flow: column;
    gap: var(--sp2);
    padding: var(--sp3);
    border: 1px solid var(--border-base);
    border-radius: calc(2 * var(--radius-l));
    background: var(--surface-shade);
}

.Tones {
    display: flex;
    flex-flow: row wrap;
    gap: var(--sp0-5);
    margin-top: var(--sp1);
}

.Plant {
    display: flex;
    flex-flow: column;
    gap: var(--sp1-5);
    padding: var(--sp2-5);
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
    background: var(--surface-base);
    box-shadow: 0 8px 24px -16px var(--shadow-medium);
    color: var(--text-base);
}

.PlantTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.PlantName {
    font: 600 24px/1.2 var(--font-alt);
}

.PlantBadge {
    padding: var(--sp0-25) var(--sp1);
    border-radius: var(--radius-m);
    background: var(--tone-tint);
    color: var(--tone-tint-text);
    font-size: var(--font-size-xs);
    font-weight: 600;
}

.PlantText {
    margin: 0;
    font-size: var(--font-size-s);
    color: var(--text-subtle);
}

.PlantStats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--sp1);
}

.PlantStat {
    display: flex;
    flex-flow: column;
    gap: 2px;
    padding: var(--sp1) var(--sp1-5);
    border: 1px solid var(--border-shade);
    border-radius: var(--radius-m);
    background: var(--surface-shade);
    font-size: var(--font-size-s);
}

.PlantLabel {
    font-size: var(--font-size-xs);
    color: var(--text-faint);
}

.PlantFoot {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.PlantLink {
    font-size: var(--font-size-s);
    font-weight: 600;
    color: var(--tone-text);
    cursor: pointer;
}

.Source {
    margin: 0;
    padding: var(--sp1-5) var(--sp2);
    border-radius: var(--radius-l);
    background: var(--surface-base);
    font: 400 12px/1.6 var(--font-monospace);
    color: var(--text-subtle);
    overflow-x: auto;
}

@media (max-width: 560px) {
    .Role {
        grid-template-columns: var(--sp6) minmax(0, 1fr);
        gap: var(--sp0-5) var(--sp1-5);
    }

    .Use {
        grid-column: 2;
    }
}

@media (max-width: 1024px) {
    .RoleVocabulary {
        grid-template-columns: minmax(0, 1fr);
    }

    .Example {
        position: static;
    }
}
</style>
