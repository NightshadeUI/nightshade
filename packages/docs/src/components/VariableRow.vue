<template>
    <li
        :id="anchor"
        class="VariableRow"
        :class="`VariableRow-${entry.kind ?? entry.stance}`">
        <span
            class="Preview"
            :class="`Preview-${entry.preview}`"
            :style="previewStyle" />
        <div class="Identity">
            <button
                v-for="name in names"
                :key="name"
                class="Name"
                :title="`Copy ${name}`"
                @click="$emit('copy', name)">
                {{ name }}
            </button>
            <code class="Value">{{ entry.value }}</code>
            <span
                v-if="siteValue"
                class="SiteValue">
                This site: <code>{{ siteValue }}</code>
            </span>
        </div>
        <div class="Text">
            <p class="About">
                {{ entry.about }}
            </p>
            <p
                v-if="entry.instead"
                class="Instead">
                <i class="fas fa-arrow-turn-up fa-rotate-90" />
                {{ entry.instead }}
            </p>
        </div>
        <Chip
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
 * One catalog entry: a live preview, its names (click to copy), what it's for, and its stance or use.
 */
export default {

    components: {
        Chip,
    },

    props: {
        entry: { type: Object, required: true },
        /** How far to override it, or how to use it: a stance or a use, with its title, icon and tone. */
        badge: { type: Object, required: true },
        siteValue: { type: String, default: '' },
    },

    emits: [
        'copy',
    ],

    computed: {

        names() {
            const { name, members } = this.entry;
            return name.includes('<') || !members ? [name] : members;
        },

        anchor() {
            return `var${this.entry.name.replace(/[^a-zA-Z0-9]+/g, '-')}`;
        },

        previewStyle() {
            const value = `var(${this.entry.sample ?? this.entry.name})`;
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
    grid-template-columns: var(--sp6) minmax(0, 1fr) minmax(0, 1.3fr) var(--sp16);
    align-items: start;
    gap: var(--sp2);
    padding: var(--sp1-5) 0;
    border-bottom: 1px solid var(--border-base);
    scroll-margin-top: calc(var(--Site-header-height) + var(--sp10));
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
    font: 600 var(--font-size-l)/1 var(--font-alt);
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
    gap: var(--sp0-25);
    min-width: 0;
}

.Name {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-base);
    font: 600 var(--font-size-s)/1.5 var(--font-monospace);
    text-align: left;
    overflow-wrap: anywhere;
    cursor: copy;
}

.Name:hover {
    color: var(--color-primary-600);
}

.Value {
    font: 400 var(--font-size-xs)/1.5 var(--font-monospace);
    color: var(--text-subtle);
}

.SiteValue {
    font-size: var(--font-size-xs);
    color: var(--color-secondary-600, var(--color-primary-600));
}

.SiteValue code {
    font-family: var(--font-monospace);
}

.Text {
    min-width: 0;
}

.About,
.Instead {
    margin: 0;
    font-size: var(--font-size-s);
    line-height: 1.5;
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
    height: calc(1.5 * var(--font-size-s));
    font-size: var(--font-size-xxs);
    color: var(--text-faint);
}

.Stance {
    justify-self: end;
    pointer-events: none;
}

@media (max-width: 860px) {
    .VariableRow {
        grid-template-columns: var(--sp6) minmax(0, 1fr);
        gap: var(--sp1) var(--sp1-5);
    }

    .Text,
    .Stance {
        grid-column: 2;
    }

    .Stance {
        justify-self: start;
    }
}
</style>
