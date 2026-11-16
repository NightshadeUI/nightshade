<template>
    <div class="VariableReference">
        <header class="Header">
            <h1 class="Title">
                Variables
            </h1>
            <p class="Lead">
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

        <section class="Guide">
            <h2 class="GuideTitle">
                Everything can be overridden, not everything should be
            </h2>
            <p class="GuideNote">
                Every entry says how it goes when you override it. Pick a card to see only those.
            </p>
            <div class="Stances">
                <button
                    v-for="item in stances"
                    :key="item.id"
                    class="StanceCard"
                    :class="[
                        `tone-${item.tone}`,
                        {
                            'StanceCard-active': stance === item.id,
                        },
                    ]"
                    @click="toggleStance(item.id)">
                    <span class="StanceHead">
                        <i :class="item.icon" />
                        <span class="StanceTitle">{{ item.title }}</span>
                        <span class="StanceCount">{{ stanceCounts[item.id] }}</span>
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
                    @click="tier = null" />
                <Chip
                    v-for="item in tiers"
                    :key="item.id"
                    :label="item.title"
                    size="s"
                    :tone="tier === item.id ? 'primary' : undefined"
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
                        :stance="stanceInfo[entry.stance]"
                        :siteValue="siteValues[entry.name]"
                        @copy="copyName" />
                </ul>
            </div>
        </section>

        <p
            v-if="sections.length === 0"
            class="Empty">
            Nothing matches <code>{{ query }}</code>. The vocabulary is short on purpose: if you're missing a word,
            it may belong in your own system.
        </p>
    </div>
</template>

<script>
import { Chip, InputText } from '@nightshadeui/components';

import { VARIABLE_GROUPS, VARIABLE_STANCES, VARIABLE_TIERS } from '../catalog/variables.js';

/**
 * The whole variable vocabulary on one page, with the site's own groups: by tier, searchable,
 * with how far each variable is meant to be overridden.
 */
export default {

    components: {
        Chip,
        InputText,
    },

    inject: [
        'siteManager',
    ],

    data() {
        return {
            tiers: VARIABLE_TIERS,
            stances: VARIABLE_STANCES,
            query: '',
            tier: null,
            stance: null,
            copied: '',
            siteValues: {},
        };
    },

    computed: {

        /** Nightshade's groups, then the system's own. */
        groups() {
            return [
                ...VARIABLE_GROUPS,
                ...this.siteManager.config.variableGroups ?? [],
            ];
        },

        stanceInfo() {
            return Object.fromEntries(this.stances.map(item => [item.id, item]));
        },

        stanceCounts() {
            const entries = this.groups.flatMap(group => group.entries);
            return Object.fromEntries(this.stances.map(item => {
                return [item.id, entries.filter(entry => entry.stance === item.id).length];
            }));
        },

        stats() {
            const names = this.groups
                .filter(group => group.tier !== 'component')
                .flatMap(group => group.entries.flatMap(entry => entry.members ?? [entry.name]))
                .filter(name => !name.startsWith('--color-'));
            return [
                {
                    label: 'variables in the styles',
                    value: names.length,
                },
                {
                    label: 'tiers, each reading the one before',
                    value: this.tiers.length,
                },
                {
                    label: 'knobs made for you',
                    value: this.stanceCounts.yours,
                },
            ];
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
        this.readSiteValues();
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
            if (this.stance && entry.stance !== this.stance) {
                return false;
            }
            const query = this.query.trim().toLowerCase();
            const text = [
                entry.name,
                ...entry.members ?? [],
                entry.value,
                entry.about,
                entry.instead ?? '',
                group.title,
            ].join(' ').toLowerCase();
            return text.includes(query);
        },

        toggleStance(stance) {
            this.stance = this.stance === stance ? null : stance;
        },

        toggleTier(tier) {
            this.tier = this.tier === tier ? null : tier;
        },

        /** The knobs this site sets differently, read from the live page. */
        readSiteValues() {
            const style = getComputedStyle(document.documentElement);
            const entries = this.groups.flatMap(group => group.entries)
                .filter(entry => entry.stance === 'yours' && !entry.name.includes('<'));
            for (const entry of entries) {
                const value = style.getPropertyValue(entry.name).trim();
                if (value && value !== entry.value) {
                    this.siteValues[entry.name] = value;
                }
            }
        },

        copyName(name) {
            navigator.clipboard.writeText(`var(${name})`);
            this.copied = `var(${name})`;
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

code {
    font-family: var(--font-monospace);
    font-size: .88em;
}

/* Header */

.Header {
    max-width: 820px;
    margin-bottom: var(--sp6);
}

.Title {
    margin: 0 0 var(--sp2);
    font: 600 clamp(44px, 6vw, 72px)/1.05 var(--font-alt);
    letter-spacing: -0.02em;
}

.Lead {
    margin: 0;
    font-size: var(--font-size-l);
    line-height: 1.6;
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
    font: 600 64px/1 var(--font-alt);
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
    font: 600 32px/1.15 var(--font-alt);
}

.GuideNote {
    margin: var(--sp1) 0 var(--sp3);
    color: var(--text-subtle);
}

.Stances {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
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
    font: 600 var(--font-size-xxl)/1 var(--font-alt);
    font-variant-numeric: lining-nums;
    color: var(--tone-text);
}

.StanceNote {
    font-size: var(--font-size-s);
    line-height: 1.5;
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
    padding: var(--sp1-5) 0;
    border-bottom: 1px solid var(--border-base);
    background: color-mix(in oklab, var(--surface-base), transparent 10%);
    backdrop-filter: blur(12px);
}

.Search {
    flex: 0 1 calc(40 * var(--sp));
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
    color: var(--color-secondary-600);
}

/* Catalog */

.TierSection {
    padding-top: var(--sp6);
}

.TierHeader {
    display: flex;
    flex-flow: row wrap;
    align-items: baseline;
    gap: var(--sp0-5) var(--sp2);
    padding-bottom: var(--sp1);
    border-bottom: 2px solid var(--border-shade);
}

.TierTitle {
    margin: 0;
    font: 600 36px/1.1 var(--font-alt);
}

.TierNote {
    margin: 0;
    color: var(--text-subtle);
}

.Group {
    padding-top: var(--sp3);
}

.GroupHeader {
    display: flex;
    flex-flow: row wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--sp1);
}

.GroupTitle {
    margin: 0;
    font: 600 var(--font-size-l)/1.3 var(--font-main);
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
