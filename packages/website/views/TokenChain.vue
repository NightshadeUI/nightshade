<template>
    <div class="TokenChain">
        <div class="Controls">
            <InputGroup class="Axis">
                <Btn
                    label="Tone axis"
                    size="s"
                    :tone="axis === 'tone' ? 'primary' : undefined"
                    @click="axis = 'tone'" />
                <Btn
                    label="Size axis"
                    size="s"
                    :tone="axis === 'size' ? 'primary' : undefined"
                    @click="axis = 'size'" />
            </InputGroup>
            <div class="Options">
                <Chip
                    v-for="option in options"
                    :key="option"
                    :label="option"
                    :tone="axis === 'tone' ? option : 'base'"
                    size="s"
                    :outline="option === current"
                    @click="select(option)" />
            </div>
        </div>
        <ol
            class="Steps"
            :style="{ '--TokenChain-count': steps.length }">
            <li
                v-for="(step, index) in steps"
                :key="step.tier"
                class="Step">
                <div class="StepHeader">
                    <span class="StepIndex">{{ index + 1 }}</span>
                    <span class="StepTier">{{ step.tier }}</span>
                </div>
                <code class="StepCode">
                    <span class="Line"><span class="Selector">{{ step.selector }}</span> {</span>
                    <span class="Line Line-indent">
                        <span class="Property">{{ step.property }}</span>:
                        <span class="Value">{{ step.value }}</span>;
                    </span>
                    <span class="Line">}</span>
                </code>
                <div class="StepFoot">
                    <span
                        v-if="axis === 'tone'"
                        class="Swatch"
                        :class="`tone-${current}`"
                        :style="{ background: `var(${step.swatch})` }" />
                    <span class="StepNote">{{ step.note }}</span>
                </div>
            </li>
            <li class="Step Step-result">
                <div class="StepHeader">
                    <span class="StepIndex">{{ steps.length + 1 }}</span>
                    <span class="StepTier">Result</span>
                </div>
                <div class="Result">
                    <Btn
                        :tone="axis === 'tone' ? current : 'primary'"
                        :size="axis === 'size' ? current : 'm'"
                        label="Button"
                        icon="fas fa-seedling" />
                </div>
            </li>
        </ol>
    </div>
</template>

<script>
import { inputSizes } from '@nightshadeui/docs/src';

const sizeScale = {
    xs: '--sp2-5',
    s: '--sp3',
    m: '--sp4',
    l: '--sp5',
    xl: '--sp6',
};

/** The ramp step each tone fills controls from. */
const fillStep = {
    base: 100,
    inverse: 0,
};

/**
 * Follows one tone or one input size from its scale to a rendered button.
 */
export default {

    inject: [
        'paletteManager',
        'stylesManager',
    ],

    data() {
        return {
            axis: 'tone',
            tone: 'primary',
            size: 'm',
        };
    },

    computed: {

        options() {
            return this.axis === 'tone' ? this.stylesManager.tones : inputSizes;
        },

        current() {
            return this.axis === 'tone' ? this.tone : this.size;
        },

        steps() {
            return this.axis === 'tone' ? this.toneSteps : this.sizeSteps;
        },

        toneSteps() {
            const tone = this.tone;
            const step = fillStep[tone] ?? 500;
            const ramp = tone === 'inverse' ? 'base' : tone;
            const scale = `--color-${ramp}-${tone === 'inverse' ? 950 : step}`;
            const neutral = tone in fillStep;
            return [
                {
                    tier: 'Scale',
                    selector: ':root',
                    property: scale,
                    value: this.describeScale(ramp, tone === 'inverse' ? 11 : this.indexOf(step)),
                    swatch: scale,
                    note: 'Raw value, for both schemes. No meaning yet.',
                },
                {
                    tier: 'Context',
                    selector: `.tone-${tone}`,
                    property: `--tone-${step}`,
                    value: `var(${scale})`,
                    swatch: `--tone-${step}`,
                    note: tone === 'inverse' ? 'The base ramp, mirrored.' : 'One ramp for the whole subtree.',
                },
                {
                    tier: 'Role',
                    selector: neutral ? `.tone-${tone}` : '.tone-*',
                    property: '--tone-fill',
                    value: `var(--tone-${step})`,
                    swatch: '--tone-fill',
                    note: neutral ? 'Neutral tones fill from the canvas end.' : 'What a fill is, in any tone.',
                },
                {
                    tier: 'Component',
                    selector: '.Btn',
                    property: '--Btn-fill',
                    value: 'var(--tone-fill)',
                    swatch: '--tone-fill',
                    note: 'Reads the role, never the ramp.',
                },
            ];
        },

        sizeSteps() {
            const size = this.size;
            const scale = sizeScale[size];
            return [
                {
                    tier: 'Scale',
                    selector: ':root',
                    property: `--input-size-${size}-major-height`,
                    value: `var(${scale})`,
                    note: 'The control size scale, on the 8px grid.',
                },
                {
                    tier: 'Context',
                    selector: `.input-size-${size}`,
                    property: '--input-major-height',
                    value: `var(--input-size-${size}-major-height)`,
                    note: 'One size for the whole subtree. The name is the role.',
                },
                {
                    tier: 'Component',
                    selector: '.Btn',
                    property: '--Btn-size',
                    value: 'var(--input-major-height)',
                    note: 'Reads the context, never the scale.',
                },
            ];
        },

    },

    methods: {

        select(option) {
            if (this.axis === 'tone') {
                this.tone = option;
            } else {
                this.size = option;
            }
        },

        indexOf(step) {
            return this.paletteManager.getRampSteps('base').findIndex(s => s.step === step);
        },

        describeScale(ramp, index) {
            const { lightness, chroma, hue } = this.paletteManager.getRampSteps(ramp)[index];
            return `light-dark(oklch(${lightness} ${chroma} ${hue}), …)`;
        },

    },

};
</script>

<style scoped>
.TokenChain {
    container-type: inline-size;
    display: flex;
    flex-flow: column;
    gap: var(--sp3);
}

.Controls {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    gap: var(--sp2);
}

.Options {
    display: flex;
    flex-flow: row wrap;
    gap: var(--sp0-5);
}

.Steps {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--sp2);
    margin: 0;
    padding: 0;
    list-style: none;
}

.Step {
    position: relative;
    display: flex;
    flex-flow: column;
    gap: var(--sp1-5);
    min-width: 0;
    padding: var(--sp2);
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
    background: var(--surface-base);
}

.Step:not(:last-child)::after {
    display: none;
    content: '';
    position: absolute;
    z-index: 1;
    top: 50%;
    right: calc(-1 * var(--sp2) - 1px);
    width: var(--sp2);
    height: 1px;
    background: var(--color-primary-600);
}

.StepHeader {
    display: flex;
    align-items: center;
    gap: var(--sp1);
}

.StepIndex {
    display: grid;
    place-items: center;
    width: var(--sp2-5);
    height: var(--sp2-5);
    border-radius: 50%;
    background: color-mix(in oklab, var(--color-primary-500), transparent 85%);
    font: 500 var(--font-size-xxs)/1 var(--font-monospace);
    color: var(--color-primary-500);
}

.StepTier {
    font: 600 var(--font-size-s)/1 var(--font-main);
    color: var(--text-subtle);
}

.StepCode {
    display: block;
    padding: var(--sp1-5);
    border-radius: var(--radius-m);
    background: var(--surface-shade);
    font: 400 11.5px/1.6 var(--font-monospace);
    overflow-wrap: anywhere;
    color: var(--text-subtle);
}

.Line {
    display: block;
}

.Line-indent {
    padding-left: 2ch;
}

.Selector {
    color: var(--color-secondary-500);
}

.Property {
    color: var(--color-primary-500);
}

.Value {
    color: var(--text-base);
}

.StepFoot {
    display: flex;
    align-items: center;
    gap: var(--sp1);
    margin-top: auto;
}

.Swatch {
    flex-shrink: 0;
    width: var(--sp2-5);
    height: var(--sp2-5);
    border-radius: var(--radius-m);
    box-shadow: 0 0 0 1px var(--border-base) inset;
}

.StepNote {
    font-size: var(--font-size-xs);
    color: var(--text-faint);
}

.Step-result {
    border-style: dashed;
    border-color: var(--color-primary-600);
}

.Result {
    flex: 1;
    display: grid;
    place-items: center;
    min-height: var(--sp10);
}

@container (min-width: 520px) {
    .Steps {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@container (min-width: 1100px) {
    .Steps {
        grid-template-columns: repeat(var(--TokenChain-count), minmax(0, 1fr)) minmax(0, 0.8fr);
    }

    .Step:not(:last-child)::after {
        display: block;
    }
}
</style>
