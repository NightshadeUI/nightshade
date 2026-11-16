<template>
    <div class="DocsHome">
        <section
            v-if="hero"
            class="Hero"
            :class="{
                'Hero-backdrop': hero.backdrop,
                'Hero-aside': hero.aside,
            }">
            <ClientOnly v-if="hero.backdrop">
                <component :is="backdrop" />
            </ClientOnly>
            <div class="HeroInner">
                <div class="HeroCopy">
                    <img
                        v-if="hero.logo"
                        :src="hero.logo"
                        alt=""
                        class="HeroLogo" />
                    <p
                        v-if="hero.name"
                        class="HeroName">
                        {{ hero.name }}
                    </p>
                    <h1 class="HeroTitle">
                        {{ hero.title }}
                    </h1>
                    <p
                        v-if="hero.tagline"
                        class="HeroTagline">
                        {{ hero.tagline }}
                    </p>
                    <div
                        v-if="hero.actions"
                        class="HeroActions">
                        <Btn
                            v-for="(action, index) in hero.actions"
                            :key="action.link"
                            tagName="a"
                            :href="action.link"
                            :label="action.text"
                            :icon="action.icon"
                            :tone="index === 0 ? 'primary' : undefined"
                            size="l" />
                    </div>
                </div>
                <div
                    v-if="hero.aside"
                    class="HeroAside">
                    <component :is="hero.aside" />
                </div>
            </div>
        </section>
        <section
            v-if="features.length > 0"
            class="Features">
            <component
                :is="feature.link ? 'a' : 'div'"
                v-for="feature in features"
                :key="feature.title"
                :href="feature.link"
                class="Feature">
                <span
                    v-if="feature.icon"
                    class="FeatureIcon">
                    <i :class="feature.icon" />
                </span>
                <h3 class="FeatureTitle">
                    {{ feature.title }}
                </h3>
                <p class="FeatureDetails">
                    {{ feature.details }}
                </p>
            </component>
        </section>
    </div>
</template>

<script>
import { Btn } from '@nightshadeui/components';

/**
 * The landing, from the page's frontmatter: a `hero` (`logo`, `name`, `title`, `tagline`, `actions`;
 * `backdrop` for the name of a registered component behind it, `true` for `HeroBackdrop`;
 * `aside` for the name of a registered component to show beside it)
 * and `features` (`icon`, `title`, `details`, `link`). The page's own content follows it.
 */
export default {

    components: {
        Btn,
    },

    computed: {

        hero() {
            return this.$frontmatter.hero;
        },

        backdrop() {
            return this.hero.backdrop === true ? 'HeroBackdrop' : this.hero.backdrop;
        },

        features() {
            return this.$frontmatter.features ?? [];
        },

    },

};
</script>

<style scoped>
.Hero {
    position: relative;
    padding: var(--sp16) var(--Site-gutter) var(--sp10);
}

.Hero-backdrop {
    overflow: hidden;
    margin-top: calc(-1 * var(--Site-header-height));
    padding-top: calc(var(--Site-header-height) + var(--sp12));
    padding-bottom: var(--sp12);
    border-bottom: 1px solid var(--border-base);
}

.HeroInner {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: center;
    gap: var(--sp8);
    max-width: var(--Site-wide-width);
    margin: 0 auto;
}

.Hero-aside .HeroInner {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
}

.HeroCopy {
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    max-width: 860px;
}

.HeroLogo {
    height: var(--sp10);
    margin-bottom: var(--sp4);
}

.HeroName {
    margin: 0 0 var(--sp1);
    font-size: var(--font-size-l);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary-600);
}

.HeroTitle {
    margin: 0;
    font: 600 clamp(44px, 7vw, 80px)/1.04 var(--font-alt);
    letter-spacing: -0.025em;
}

.HeroTagline {
    max-width: 640px;
    margin: var(--sp3) 0 0;
    font-size: var(--font-size-xl);
    line-height: 1.5;
    color: var(--text-subtle);
}

.HeroActions {
    display: flex;
    flex-flow: row wrap;
    gap: var(--sp1-5);
    margin-top: var(--sp5);
}

/* The aside: a glass card over the backdrop, filled by the site's own component */

.HeroAside {
    padding: var(--sp3);
    border: 1px solid color-mix(in oklab, var(--border-base), transparent 20%);
    border-radius: calc(3 * var(--radius-m));
    background: color-mix(in oklab, var(--surface-base), transparent 40%);
    box-shadow:
        0 40px 80px -32px var(--shadow-heavy),
        0 1px 0 var(--translucency-highlight) inset;
    -webkit-backdrop-filter: blur(12px) saturate(2);
    backdrop-filter: blur(12px) saturate(2);
}

.Features {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: var(--sp2);
    max-width: calc(var(--Site-wide-width) + 2 * var(--Site-gutter));
    margin: 0 auto;
    padding: var(--sp6) var(--Site-gutter) var(--sp4);
}

.Feature {
    display: flex;
    flex-flow: column;
    gap: var(--sp1);
    padding: var(--sp3);
    border: 1px solid var(--border-base);
    border-radius: calc(2 * var(--radius-l));
    background: var(--surface-base);
    color: var(--text-base);
    transition: border-color .2s, background-color .2s;
}

a.Feature:hover {
    border-color: var(--border-deep);
    background: var(--surface-shade);
}

.FeatureIcon {
    display: grid;
    place-items: center;
    width: var(--sp5);
    height: var(--sp5);
    margin-bottom: var(--sp1);
    border-radius: var(--radius-l);
    background: var(--color-primary-100);
    color: var(--color-primary-600);
}

.FeatureTitle {
    margin: 0;
    font-size: var(--font-size-l);
    font-weight: var(--font-weight-bold);
}

.FeatureDetails {
    margin: 0;
    font-size: var(--font-size-s);
    line-height: 1.6;
    color: var(--text-subtle);
}

@media (max-width: 960px) {
    .Hero-aside .HeroInner {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
