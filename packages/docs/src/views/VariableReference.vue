<template>
    <div class="VariableReference">
        <header class="Header">
            <h1 class="Title">
                Variables
            </h1>
            <p
                v-if="usageView"
                class="Lead">
                The vocabulary of this system: what exists, which to read, and when. Context follows a class on a
                subtree; roles name a use. Speak them, and whatever you build stays coherent with the rest.
            </p>
            <p
                v-else
                class="Lead">
                The variables are the interface of your design system: a finite, layered set that everything reads,
                and a handful of knobs you set. Speak them, and whatever you build stays coherent with the rest.
            </p>
            <dl class="Stats">
                <div
                    v-for="stat in stats"
                    :key="stat.label"
                    class="Stat">
                    <dt>{{ stat.label }}</dt>
                    <dd>{{ stat.value }}</dd>
                </div>
            </dl>
        </header>

        <section
            v-if="!usageView"
            class="Guide">
            <h2 class="GuideTitle">
                Everything can be overridden, not everything should be
            </h2>
            <p class="GuideNote">
                Every entry says how it goes when you override it. Pick a card to see only those.
            </p>
            <div
                class="Stances"
                :style="{ '--VariableReference-cards': kinds.length }">
                <button
                    v-for="item in kinds"
                    :key="item.id"
                    class="StanceCard"
                    :class="[
                        `tone-${item.tone}`,
                        {
                            'StanceCard-active': kind === item.id,
                        },
                    ]"
                    @click="toggleKind(item.id)">
                    <span class="StanceHead">
                        <i :class="item.icon" />
                        <span class="StanceTitle">{{ item.title }}</span>
                        <span class="StanceCount">{{ kindCounts[item.id] }}</span>
                    </span>
                    <span class="StanceNote">{{ item.note }}</span>
                </button>
            </div>
        </section>

        <div class="Toolbar">
            <InputText
                v-model="query"
                class="Search"
                placeholder="Search names and meanings">
                <template #before>
                    <i class="fas fa-magnifying-glass SearchIcon" />
                </template>
                <template #after>
                    <kbd class="SearchKey">/</kbd>
                </template>
            </InputText>
            <div class="Tiers">
                <Chip
                    label="All tiers"
                    size="s"
                    :tone="tier === null ? 'primary' : undefined"
                    :ghost="tier !== null"
                    @click="tier = null" />
                <Chip
                    v-for="item in tiers"
                    :key="item.id"
                    :label="item.title"
                    size="s"
                    :tone="tier === item.id ? 'primary' : undefined"
                    :ghost="tier !== item.id"
                    @click="toggleTier(item.id)" />
            </div>
            <span
                v-if="copied"
                class="Copied">
                <i class="fas fa-check" /> Copied <code>{{ copied }}</code>
            </span>
        </div>

        <section
            v-for="section in sections"
            :key="section.tier.id"
            class="TierSection">
            <header class="TierHeader">
                <h2 class="TierTitle">
                    {{ section.tier.title }}
                </h2>
                <p class="TierNote">
                    {{ section.tier.note }}
                </p>
            </header>
            <div
                v-for="group in section.groups"
                :key="group.id"
                class="Group">
                <div class="GroupHeader">
                    <h3 class="GroupTitle">
                        {{ group.title }}
                    </h3>
                    <code class="GroupFile">{{ group.file }}</code>
                </div>
                <p class="GroupNote">
                    {{ group.note }}
                </p>
                <ul class="Rows">
                    <VariableRow
                        v-for="entry in group.entries"
                        :key="entry.name"
                        :entry="entry"
                        :values="entry.values"
                        :tier="section.tier"
                        :badge="usageView ? null : kindInfo[entry.stance]"
                        @copy="copyName" />
                </ul>
            </div>
        </section>

        <p
            v-if="sections.length === 0"
            class="Empty">
            Nothing matches <code>{{ query }}</code>. The vocabulary is short on purpose.
        </p>
    </div>
</template>

<script>
import { Chip, InputText } from '@nightshadeui/components';

import { readExampleNames, VARIABLE_GROUPS, VARIABLE_STANCES, VARIABLE_TIERS } from '../catalog/variables.js';

/**
 * The public token vocabulary on one page: by tier and category, searchable,
 * with specified values from the live sheets. Nightshade's docs add how far each
 * variable is meant to be overridden; a system's docs are the vocabulary itself.
 */
export default {

    components: {
        Chip,
        InputText,
    },

    inject: [
        'siteManager',
        'stylesManager',
    ],

    data() {
        return {
            tiers: VARIABLE_TIERS,
            query: '',
            tier: null,
            kind: null,
            copied: '',
        };
    },

    computed: {

        /**
         * A system's docs speak to the apps built on it. Nightshade's own docs set
         * `variableView: 'foundation'` and speak to authors of a system.
         */
        usageView() {
            return this.siteManager.config.variableView !== 'foundation';
        },

        kinds() {
            return VARIABLE_STANCES;
        },

        /** Nightshade's groups, then the system's own. Component knobs are not public tokens. */
        groups() {
            const groups = [
                ...VARIABLE_GROUPS,
                ...this.siteManager.config.variableGroups ?? [],
            ].filter(group => group.tier !== 'component');
            return groups.map(group => ({
                ...group,
                note: this.usageView ? group.usageNote ?? group.note : group.note,
                entries: group.entries.map(entry => ({
                    ...entry,
                    values: this.valuesFor(entry),
                })),
            }));
        },

        kindInfo() {
            return Object.fromEntries(this.kinds.map(item => [item.id, item]));
        },

        kindCounts() {
            const entries = this.groups.flatMap(group => group.entries);
            return Object.fromEntries(this.kinds.map(item => {
                return [item.id, entries.filter(entry => entry.stance === item.id).length];
            }));
        },

        stats() {
            const names = this.groups
                .flatMap(group => group.entries.flatMap(entry => entry.members ?? [entry.name]))
                .filter(name => !name.startsWith('--color-'));
            const stats = [
                {
                    label: 'variables in the styles',
                    value: names.length,
                },
                {
                    label: 'tiers, each reading the one before',
                    value: this.tiers.length,
                },
            ];
            if (!this.usageView) {
                stats.push({
                    label: 'knobs to specify',
                    value: this.kindCounts.specify,
                });
            }
            return stats;
        },

        sections() {
            return this.tiers
                .filter(tier => this.tier == null || this.tier === tier.id)
                .map(tier => ({
                    tier,
                    groups: this.findGroups(tier.id),
                }))
                .filter(section => section.groups.length > 0);
        },

    },

    mounted() {
        this.stylesManager.load();
        window.addEventListener('keydown', this.onKeyDown);
    },

    beforeUnmount() {
        window.removeEventListener('keydown', this.onKeyDown);
    },

    methods: {

        findGroups(tier) {
            return this.groups
                .filter(group => group.tier === tier)
                .map(group => ({
                    ...group,
                    entries: group.entries.filter(entry => this.matchesEntry(group, entry)),
                }))
                .filter(group => group.entries.length > 0);
        },

        matchesEntry(group, entry) {
            if (this.kind && entry.stance !== this.kind) {
                return false;
            }
            const query = this.query.trim().toLowerCase();
            const text = [
                entry.name,
                ...entry.members ?? [],
                ...entry.values.map(item => `${item.name} ${item.value}`),
                entry.about,
                entry.instead ?? '',
                group.title,
                group.file,
            ].join(' ').toLowerCase();
            return text.includes(query);
        },

        valuesFor(entry) {
            const source = this.usageView ? 'specified' : 'nightshade';
            const names = readExampleNames(entry);
            const keys = names.length ? names : [entry.name];
            return keys.map(name => ({
                name,
                value: this.stylesManager.readVariable(name, source) || entry.value || '',
            }));
        },

        toggleKind(kind) {
            this.kind = this.kind === kind ? null : kind;
        },

        toggleTier(tier) {
            this.tier = this.tier === tier ? null : tier;
        },

        copyName(name) {
            const text = name.includes('<') ? name : `var(${name})`;
            navigator.clipboard.writeText(text);
            this.copied = text;
            setTimeout(() => {
                this.copied = '';
            }, 1600);
        },

        onKeyDown(ev) {
            const typing = ev.target.closest?.('input, textarea, [contenteditable]');
            if (ev.key === '/' && !typing) {
                ev.preventDefault();
                this.$el.querySelector('.Search input').focus();
            }
        },

    },

};
</script>

<style scoped>
.VariableReference {
    max-width: calc(var(--Site-wide-width) + 2 * var(--Site-gutter));
    margin: 0 auto;
    padding: var(--sp8) var(--Site-gutter) var(--sp12);
}

:not(pre) > code {
    font-family: var(--font-monospace);
    font-size: var(--font-size-s);
}

/* Header */

.Header {
    max-width: 820px;
    margin-bottom: var(--sp6);
}

.Title {
    margin: 0 0 var(--sp2);
}

.Lead {
    margin: 0;
    font-size: var(--font-size-l);
    line-height: var(--line-height-prose);
    color: var(--text-subtle);
}

.Stats {
    display: flex;
    flex-flow: row wrap;
    gap: var(--sp4);
    margin: var(--sp4) 0 0;
}

.Stat {
    display: flex;
    flex-flow: column-reverse;
}

.Stat dt {
    font-size: var(--font-size-s);
    color: var(--text-subtle);
}

.Stat dd {
    margin: 0 0 var(--sp1);
    font: 600 var(--font-size-xxl) var(--font-alt);
    font-variant-numeric: lining-nums;
    color: var(--color-primary-600);
}

/* Override guide */

.Guide {
    padding: var(--sp4) 0;
    border-top: 1px solid var(--border-base);
}

.GuideTitle {
    margin: 0;
    font: 600 var(--font-size-xxl) var(--font-alt);
}

.GuideNote {
    margin: var(--sp1) 0 var(--sp3);
    color: var(--text-subtle);
}

.Stances {
    --VariableReference-cards: 4;

    display: grid;
    grid-template-columns: repeat(var(--VariableReference-cards), minmax(0, 1fr));
    gap: var(--sp1-5);
}

.StanceCard {
    display: flex;
    flex-flow: column;
    gap: var(--sp1);
    padding: var(--sp2);
    border: 1px solid var(--border-base);
    border-top: 3px solid var(--tone-fill);
    border-radius: var(--radius-l);
    background: var(--surface-base);
    color: var(--text-base);
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: background-color .2s, border-color .2s;
}

.StanceCard:hover {
    background: var(--surface-shade);
}

.StanceCard:focus-visible {
    outline: var(--input-outline-size) solid var(--tone-focus-outline);
}

.StanceCard-active {
    border-color: var(--tone-border);
    background: var(--tone-tint);
    color: var(--tone-tint-text);
}

.StanceHead {
    display: flex;
    align-items: center;
    gap: var(--sp1);
}

.StanceHead i {
    color: var(--tone-text);
}

.StanceTitle {
    flex: 1;
    font-weight: var(--font-weight-heavy);
}

.StanceCount {
    font: 600 var(--font-size-xxl) var(--font-alt);
    line-height: var(--line-height-prose);
    font-variant-numeric: lining-nums;
    color: var(--tone-text);
}

.StanceNote {
    font-size: var(--font-size-s);
    line-height: var(--line-height-prose);
    color: var(--text-subtle);
}

.StanceCard-active .StanceNote {
    color: inherit;
}

/* Toolbar */

.Toolbar {
    position: sticky;
    z-index: 10;
    top: var(--Site-header-height);
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    gap: var(--sp1) var(--sp2);
    margin: var(--sp2) 0 0;
    padding: var(--sp1-5) 0 var(--sp1-5);
    border-bottom: 1px solid var(--border-base);
    background: color-mix(in oklab, var(--surface-base), transparent 10%);
    backdrop-filter: blur(12px);
}

.Search {
    flex: 0 1 320px;
}

.SearchIcon {
    color: var(--text-faint);
}

.SearchKey {
    font-size: var(--font-size-xs);
}

.Tiers {
    display: flex;
    flex-flow: row wrap;
    gap: var(--sp0-5);
}

.Copied {
    margin-left: auto;
    font-size: var(--font-size-s);
    color: var(--color-secondary-600, var(--color-primary-600));
}

/* Catalog */

.TierSection {
    padding-top: var(--sp6);
}

.TierHeader {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    gap: var(--sp0-5) var(--sp2);
    padding-bottom: var(--sp1);
    border-bottom: 2px solid var(--border-shade);
}

.TierTitle {
    margin: 0;
    font: 600 var(--font-size-xxl) var(--font-alt);
    line-height: var(--line-height-prose);
}

.TierNote {
    margin: 0;
    color: var(--text-subtle);
}

.Group {
    padding-top: var(--sp3);
    scroll-margin-top: calc(var(--Site-header-height) + var(--sp10));
}

.GroupHeader {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--sp1);
}

.GroupTitle {
    margin: 0;
    font: 600 var(--font-size-l) var(--font-main);
    line-height: var(--line-height-prose);
}

.GroupFile {
    font-size: var(--font-size-xs);
    color: var(--text-faint);
}

.GroupNote {
    margin: var(--sp0-5) 0 var(--sp1);
    font-size: var(--font-size-s);
    color: var(--text-subtle);
}

.Rows {
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid var(--border-base);
}

.Empty {
    padding: var(--sp8) 0;
    color: var(--text-subtle);
    text-align: center;
}

@media (max-width: 960px) {
    .Stances {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 560px) {
    .Stances {
        grid-template-columns: minmax(0, 1fr);
    }

    .Search {
        flex-basis: 100%;
    }
}
</style>
