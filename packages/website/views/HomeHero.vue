<template>
    <section class="HomeHero">
        <ClientOnly>
            <HeroBackdrop />
        </ClientOnly>
        <div class="Inner">
            <div class="Copy">
                <div class="Eyebrow">
                    Nightshade 3.0 · a seed for design systems
                </div>
                <h1 class="Title">
                    Grow your own<br />
                    <span class="GradientText">design system</span>
                </h1>
                <p class="Lead">
                    Not a framework to fight, a seed to grow from: CSS variables first,
                    a naming system that snaps together, and an OKLCH palette generator.
                    Your app grows the rest, and owns all of it.
                </p>
                <div class="Ctas">
                    <Btn
                        tagName="a"
                        href="/studio"
                        label="Design your own"
                        tone="primary"
                        size="l"
                        icon="fas fa-palette" />
                    <Btn
                        tagName="a"
                        href="/philosophy/"
                        label="Read the philosophy"
                        size="l"
                        icon="fas fa-arrow-right"
                        iconPos="right" />
                </div>
                <button
                    class="Install"
                    title="Copy"
                    @click="copyInstall">
                    <span class="Prompt">$</span>
                    <code>npm i nightshade</code>
                    <i :class="copied ? 'fas fa-check' : 'far fa-copy'" />
                </button>
            </div>
            <div class="Specimen">
                <div class="Glass">
                    <div class="SpecimenHeader">
                        <span class="SpecimenTitle">Turn the hue</span>
                        <span class="HueValue">{{ hue }}°</span>
                    </div>
                    <Slider
                        class="HueSlider"
                        :modelValue="hue"
                        :min="0"
                        :max="360"
                        fillStyle="none"
                        @update:modelValue="setHue($event)" />
                    <div class="Ramp">
                        <div
                            v-for="step in steps"
                            :key="step"
                            class="RampStep"
                            :style="{ background: `var(--color-primary-${step})` }" />
                    </div>
                    <div class="Looks">
                        <Chip
                            v-for="look in playgroundManager.lookOptions"
                            :key="look.key"
                            :label="look.label"
                            :tone="playgroundManager.options[look.key] ? 'primary' : undefined"
                            size="s"
                            @click="playgroundManager.toggleOption(look.key)" />
                    </div>
                </div>
                <div class="Showcase">
                    <InputText
                        v-model="name"
                        label="Design system"
                        tone="primary" />
                    <div class="Row">
                        <Toggle
                            v-model="toggled"
                            tone="primary" />
                        <Checkbox
                            v-model="checked"
                            tone="primary" />
                        <Slider
                            v-model="level"
                            class="Level"
                            tone="primary" />
                    </div>
                    <div class="Row">
                        <Btn
                            label="Publish"
                            tone="primary"
                            icon="fas fa-seedling" />
                        <Btn
                            label="Preview"
                            tone="secondary" />
                        <Btn label="Cancel" />
                    </div>
                    <p class="Footnote">
                        The switches above set <code>$nightshade.defaults</code> for this whole site.
                        <a href="/components/#app-wide-defaults">Your app can do the same.</a>
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { RAMP_STEPS } from '@nightshadeui/palette-generator/src';

export default {

    inject: [
        'paletteManager',
        'playgroundManager',
    ],

    data() {
        return {
            name: 'Acme UI',
            toggled: true,
            checked: true,
            level: 64,
            copied: false,
            steps: RAMP_STEPS,
        };
    },

    computed: {

        hue() {
            return this.paletteManager.getRamp('primary').hue;
        },

    },

    methods: {

        setHue(hue) {
            this.paletteManager.updateRamp('primary', { hue });
        },

        copyInstall() {
            navigator.clipboard.writeText('npm i nightshade');
            this.copied = true;
            setTimeout(() => {
                this.copied = false;
            }, 1600);
        },

    },

};
</script>

<style scoped>
.HomeHero {
    position: relative;
    overflow: hidden;
    margin-top: calc(-1 * var(--Site-header-height));
    padding: calc(var(--Site-header-height) + var(--sp12)) var(--Site-gutter) var(--sp12);
    border-bottom: 1px solid var(--border-base);
}

/* Content */

.Inner {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    align-items: center;
    gap: var(--sp10);
    max-width: var(--Site-wide-width);
    margin: 0 auto;
}

.Eyebrow {
    font-size: var(--font-size-s);
    font-weight: 600;
    color: var(--color-primary-600);
}

.Title {
    margin: var(--sp3) 0 var(--sp3);
    font: 400 clamp(44px, 8vw, 100px)/0.98 var(--font-alt);
    letter-spacing: -0.02em;
}

.Title .GradientText {
    padding-right: 0.08em;
}

.Lead {
    max-width: 560px;
    margin: 0 0 var(--sp5);
    font-size: var(--font-size-l);
    line-height: 1.6;
    color: var(--text-subtle);
}

.Ctas {
    display: flex;
    flex-flow: row wrap;
    gap: var(--sp1-5);
}

.Install {
    display: inline-flex;
    align-items: center;
    gap: var(--sp1-5);
    margin-top: var(--sp4);
    padding: var(--sp1) var(--sp2);
    border: 1px solid var(--border-deep);
    border-radius: var(--radius-l);
    background: color-mix(in oklab, var(--surface-base), transparent 40%);
    color: var(--text-subtle);
    font-size: var(--font-size-s);
    transition: border-color .2s, color .2s;
}

.Install:hover {
    border-color: var(--color-primary-600);
    color: var(--text-base);
}

.Install code {
    font-family: var(--font-monospace);
    color: var(--text-base);
}

.Prompt {
    font-family: var(--font-monospace);
    color: var(--color-primary-500);
}

/* Specimen: a glass half over the backdrop, and a solid half below it */

.Specimen {
    border: 1px solid color-mix(in oklab, var(--border-base), transparent 20%);
    border-radius: calc(3 * var(--radius-m));
    overflow: hidden;
    box-shadow: 0 40px 80px -32px var(--shadow-heavy);
}

.Glass {
    display: flex;
    flex-flow: column;
    gap: var(--sp2);
    padding: var(--sp3);
    background: color-mix(in oklab, var(--surface-base), transparent 60%);
    -webkit-backdrop-filter: blur(12px) saturate(2);
    backdrop-filter: blur(12px) saturate(2);
    box-shadow: 0 1px 0 var(--translucency-highlight) inset;
}

.Showcase {
    display: flex;
    flex-flow: column;
    gap: var(--sp2);
    padding: var(--sp3);
    border-top: 1px solid var(--border-base);
    background: var(--surface-base);
}

.Looks {
    display: flex;
    flex-flow: row wrap;
    gap: var(--sp0-5);
}

.SpecimenHeader {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

.SpecimenTitle {
    font: 400 26px/1 var(--font-alt);
}

.HueValue {
    font: 500 var(--font-size-s)/1 var(--font-monospace);
    color: var(--color-primary-500);
}

.HueSlider {
    --Slider-track-background: linear-gradient(
        to right,
        oklch(0.64 0.15 0),
        oklch(0.64 0.15 60),
        oklch(0.64 0.15 120),
        oklch(0.64 0.15 180),
        oklch(0.64 0.15 240),
        oklch(0.64 0.15 300),
        oklch(0.64 0.15 360)
    );
}

.Ramp {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 2px;
    height: var(--sp4);
}

.RampStep {
    border-radius: var(--radius-s);
    box-shadow: 0 0 0 1px color-mix(in oklab, var(--text-base), transparent 90%) inset;
}

.Row {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    gap: var(--sp1-5);
}

.Level {
    flex: 1;
}

.Footnote {
    margin: 0;
    font-size: var(--font-size-xs);
    color: var(--text-faint);
}

.Footnote code {
    font-family: var(--font-monospace);
    font-size: 0.92em;
}

.Footnote a {
    color: var(--color-primary-500);
}

@media (max-width: 1024px) {
    .Inner {
        grid-template-columns: minmax(0, 1fr);
        gap: var(--sp6);
    }

    .Specimen {
        max-width: 520px;
    }
}
</style>
