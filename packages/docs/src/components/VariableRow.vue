<template>
    <li
        :id="anchor"
        class="VariableRow"
        :class="{
            [`VariableRow-${entry.stance}`]: Boolean(badge),
            'VariableRow-bare': !badge,
        }">
        <span
            class="Preview"
            :class="`Preview-${entry.preview}`"
            :style="previewStyle" />
        <div class="Identity">
            <button
                v-if="heading"
                class="Name"
                :title="`Copy ${entry.name}`"
                @click="$emit('copy', entry.name)">
                {{ entry.name }}
            </button>
            <code
                v-if="single"
                class="Value">{{ values[0].value }}</code>
            <ul
                v-else
                class="Examples">
                <li
                    v-for="item in values"
                    :key="item.name"
                    class="Example">
                    <button
                        :class="heading ? 'ExampleName' : 'Name'"
                        :title="`Copy ${item.name}`"
                        @click="$emit('copy', item.name)">
                        {{ item.name }}
                    </button>
                    <code class="Value">{{ item.value }}</code>
                </li>
            </ul>
        </div>
        <div class="Text">
            <p class="About">
                {{ entry.about }}
            </p>
            <p
                v-if="entry.instead && badge"
                class="Instead">
                <i class="fas fa-arrow-turn-up fa-rotate-90" />
                {{ entry.instead }}
            </p>
        </div>
        <span class="Tier">{{ tier.short }}</span>
        <Chip
            v-if="badge"
            class="Stance"
            tagName="span"
            :label="badge.title"
            :icon="badge.icon"
            :tone="badge.tone"
            size="xs"
            :flat="true"
            :round="true"
            :outline="false"
            :translucent="false" />
    </li>
</template>

<script>
import { Chip } from '@nightshadeui/components';

/**
 * One catalog entry: a live preview, its name (click to copy), the specified value
 * or a couple of examples, what it's for, its tier, and on Nightshade's docs, its stance.
 */
export default {

    components: {
        Chip,
    },

    props: {
        entry: { type: Object, required: true },
        values: { type: Array, required: true },
        tier: { type: Object, required: true },
        /** How far to override it, on Nightshade's docs. Omitted on a system's docs. */
        badge: { type: Object, default: null },
    },

    emits: [
        'copy',
    ],

    computed: {

        family() {
            return this.entry.name.includes('<');
        },

        single() {
            return this.values.length === 1 && this.values[0].name === this.entry.name;
        },

        heading() {
            return this.family || this.single;
        },

        anchor() {
            return `var${this.entry.name.replace(/[^a-zA-Z0-9]+/g, '-')}`;
        },

        previewStyle() {
            const value = `var(${this.entry.sample ?? this.values[0]?.name ?? this.entry.name})`;
            switch (this.entry.preview) {
                case 'color':
                    return { background: value };
                case 'length':
                    return { '--VariableRow-length': value };
                case 'radius':
                    return { borderRadius: value };
                case 'shadow':
                    return { boxShadow: `0 6px 14px ${value}` };
                case 'text':
                    return { color: value };
                case 'font':
                    return { fontSize: value };
                default:
                    return {};
            }
        },

    },

};
</script>

<style scoped>
.VariableRow {
    display: grid;
    grid-template-columns: var(--sp6) minmax(0, 1fr) minmax(0, 1.3fr) var(--sp8) var(--sp16);
    align-items: start;
    gap: var(--sp2);
    padding: var(--sp1-5) 0;
    border-bottom: 1px solid var(--border-base);
    scroll-margin-top: calc(var(--Site-header-height) + var(--sp10));
}

.VariableRow-bare {
    grid-template-columns: var(--sp6) minmax(0, 1fr) minmax(0, 1.3fr) var(--sp8);
}

.VariableRow:target {
    background: var(--surface-shade);
}

.Preview {
    position: relative;
    display: grid;
    place-items: center;
    height: var(--sp4);
    border: 1px solid var(--border-base);
    border-radius: var(--radius-m);
    background: var(--surface-base);
    overflow: hidden;
}

.Preview-length::before {
    content: '';
    position: absolute;
    left: var(--sp0-5);
    width: min(var(--VariableRow-length), calc(100% - var(--sp1)));
    height: var(--sp1);
    border-radius: var(--radius-s);
    background: var(--color-primary-400);
}

.Preview-radius {
    border: 0;
    border-top: 2px solid var(--color-primary-500);
    border-left: 2px solid var(--color-primary-500);
    border-radius: 0;
}

.Preview-text::before,
.Preview-font::before {
    content: 'Aa';
    font: 600 var(--font-size-l) var(--font-alt);
    line-height: var(--line-height-prose);
}

.Preview-font::before {
    font-size: inherit;
}

.Preview-shadow {
    border-color: transparent;
}

.Preview-none {
    border-style: dashed;
    background: transparent;
}

.Identity {
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    min-width: 0;
}

.Name,
.ExampleName {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-base);
    font: 600 var(--font-size-s) var(--font-monospace);
    line-height: var(--line-height-prose);
    text-align: left;
    overflow-wrap: anywhere;
    cursor: copy;
}

.Name:hover,
.ExampleName:hover {
    color: var(--color-primary-600);
}

.Examples {
    margin: 0;
    padding: 0;
    list-style: none;
}

.Example {
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    margin-top: var(--sp0-5);
}

.ExampleName {
    font-weight: var(--font-weight-normal);
    color: var(--text-subtle);
}

.Value {
    font: 400 var(--font-size-xs) var(--font-monospace);
    line-height: var(--line-height-main);
    color: var(--text-subtle);
    overflow-wrap: anywhere;
}

.Text {
    min-width: 0;
}

.About,
.Instead {
    margin: 0;
    font-size: var(--font-size-s);
    line-height: var(--line-height-prose);
}

.Instead {
    display: flex;
    gap: var(--sp1);
    margin-top: var(--sp0-5);
    color: var(--text-subtle);
}

/* One line of the text tall, so it sits on the first line however many the text wraps to */
.Instead i {
    flex: none;
    align-self: flex-start;
    display: grid;
    place-items: center;
    height: var(--sp2);
    font-size: var(--font-size-xxs);
    color: var(--text-faint);
}

.Tier {
    justify-self: end;
    padding-top: var(--sp0-25);
    font-size: var(--font-size-xs);
    color: var(--text-faint);
    white-space: nowrap;
}

.Stance {
    justify-self: end;
    pointer-events: none;
}

@media (max-width: 860px) {
    .VariableRow,
    .VariableRow-bare {
        grid-template-columns: var(--sp6) minmax(0, 1fr);
        gap: var(--sp1) var(--sp1-5);
    }

    .Text,
    .Tier,
    .Stance {
        grid-column: 2;
    }

    .Tier,
    .Stance {
        justify-self: start;
    }
}
</style>
