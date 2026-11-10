<template>
    <div class="PaletteStudio">
        <header class="Header">
            <h1 class="Title">
                Palette Studio
            </h1>
            <p class="Lead">
                Two curves and one hue per tone. Everything you change here re-colors this whole site,
                then exports as the same CSS that <code>nightshade palette</code> writes.
            </p>
            <div class="Actions">
                <Btn
                    label="Copy CSS"
                    tone="primary"
                    icon="far fa-copy"
                    @click="copy(paletteManager.css, 'CSS')" />
                <Btn
                    label="Copy spec"
                    icon="fas fa-code"
                    @click="copy(paletteManager.json, 'spec')" />
                <Btn
                    label="Reset everything"
                    icon="fas fa-rotate-left"
                    ghost
                    :disabled="!paletteManager.customized"
                    @click="paletteManager.reset()" />
                <span
                    v-if="copied"
                    class="Copied">
                    <i class="fas fa-check" /> Copied {{ copied }}
                </span>
            </div>
        </header>

        <section class="Section">
            <div class="SectionHeader">
                <div>
                    <h2 class="SectionTitle">
                        Curves
                    </h2>
                    <p class="SectionNote">
                        Shared by every tone: twelve points, one per step from 0 to 950.
                        The dark scheme reads them mirrored, so step 0 is always the canvas end.
                    </p>
                </div>
            </div>
            <div class="CurvesLayout">
                <div class="Curves">
                    <CurveEditor
                        label="Lightness"
                        :values="paletteManager.spec.lightnessCurve"
                        :defaults="defaultLightnessCurve"
                        :steps="steps"
                        :min="0"
                        :max="1"
                        @update="(index, value) => paletteManager.updateCurve('lightnessCurve', index, value)"
                        @reset="paletteManager.resetCurve('lightnessCurve')" />
                    <CurveEditor
                        label="Chroma"
                        :values="paletteManager.spec.chromaCurve"
                        :defaults="defaultChromaCurve"
                        :steps="steps"
                        :min="0"
                        :max="0.2"
                        @update="(index, value) => paletteManager.updateCurve('chromaCurve', index, value)"
                        @reset="paletteManager.resetCurve('chromaCurve')" />
                </div>
                <PaletteRamps />
            </div>
        </section>

        <section class="Section">
            <div class="SectionHeader">
                <div>
                    <h2 class="SectionTitle">
                        Tones
                    </h2>
                    <p class="SectionNote">
                        Each ramp is a tone: the palette emits <code>.tone-&lt;name&gt;</code> for it,
                        and every component re-tones with that one class.
                    </p>
                </div>
            </div>
            <RampEditor
                v-for="ramp in paletteManager.spec.ramps"
                :key="ramp.name"
                :ramp="ramp"
                :steps="paletteManager.getRampSteps(ramp.name)"
                :standard="paletteManager.isStandardRamp(ramp.name)"
                @update="paletteManager.updateRamp(ramp.name, $event)"
                @delete="paletteManager.deleteRamp(ramp.name)" />
            <form
                class="AddTone"
                @submit.prevent="addRamp">
                <InputText
                    v-model="newRampName"
                    class="AddToneName"
                    placeholder="New tone, e.g. brand" />
                <Btn
                    tagName="button"
                    type="submit"
                    label="Add tone"
                    icon="fas fa-plus"
                    :disabled="!newRampValid" />
            </form>
        </section>

        <section class="Section">
            <div class="SectionHeader">
                <div>
                    <h2 class="SectionTitle">
                        On the grid
                    </h2>
                    <p class="SectionNote">
                        Control heights are multiples of <code>--sp</code>, and every control is
                        <code>border-box</code>. Whatever the tone, size or look, full-height controls land on the grid,
                        and smaller ones sit centered beside them.
                    </p>
                </div>
                <InputGroup>
                    <Btn
                        v-for="size in gridSizes"
                        :key="size"
                        :label="size"
                        size="s"
                        :tone="gridSize === size ? 'primary' : 'base'"
                        @click="gridSize = size" />
                </InputGroup>
            </div>
            <Demo
                dual
                grid>
                <div
                    class="GridSpecimen"
                    :class="`input-size-${gridSize}`">
                    <div class="GridRow">
                        <InputText
                            class="GridInput"
                            placeholder="Search tones" />
                        <Btn
                            label="Apply"
                            tone="primary" />
                    </div>
                    <div class="GridRow">
                        <Chip
                            v-for="tone in specimenTones"
                            :key="tone"
                            :label="tone"
                            :tone="tone"
                            :outline="tone === specimenTone"
                            @click="specimenTone = tone" />
                    </div>
                    <div
                        class="GridRow"
                        :class="`tone-${specimenTone}`">
                        <Toggle :modelValue="true" />
                        <Checkbox :modelValue="true" />
                        <Btn
                            label="Outline"
                            outline
                            flat />
                        <Btn
                            icon="fas fa-seedling"
                            square />
                    </div>
                </div>
            </Demo>
        </section>

        <section class="Section">
            <div class="SectionHeader">
                <h2 class="SectionTitle">
                    Export
                </h2>
                <InputGroup>
                    <Btn
                        v-for="format in formats"
                        :key="format.id"
                        :label="format.label"
                        size="s"
                        :tone="exportFormat === format.id ? 'primary' : 'base'"
                        @click="exportFormat = format.id" />
                </InputGroup>
            </div>
            <div class="Code">
                <Btn
                    class="CodeCopy"
                    icon="far fa-copy"
                    title="Copy"
                    size="s"
                    square
                    @click="copy(exportText, exportFormat)" />
                <pre><code>{{ exportText }}</code></pre>
            </div>
        </section>
    </div>
</template>

<script>
import {
    DEFAULT_CHROMA_CURVE,
    DEFAULT_LIGHTNESS_CURVE,
    RAMP_NAME_PATTERN,
    RAMP_STEPS,
    RESERVED_RAMPS,
} from '@nightshadeui/palette-generator/src';

const formats = [
    {
        id: 'css',
        label: 'CSS',
    },
    {
        id: 'json',
        label: 'Spec JSON',
    },
    {
        id: 'cli',
        label: 'CLI',
    },
];

/**
 * Edits the site palette spec and exports it.
 */
export default {

    inject: [
        'paletteManager',
    ],

    data() {
        return {
            steps: RAMP_STEPS,
            defaultLightnessCurve: DEFAULT_LIGHTNESS_CURVE,
            defaultChromaCurve: DEFAULT_CHROMA_CURVE,
            formats,
            gridSizes: ['s', 'm', 'l'],
            gridSize: 'm',
            specimenTone: 'primary',
            newRampName: '',
            exportFormat: 'css',
            copied: '',
        };
    },

    computed: {

        specimenTones() {
            return this.paletteManager.spec.ramps.map(ramp => ramp.name).slice(1, 5);
        },

        newRampValid() {
            const name = this.newRampName;
            const taken = this.paletteManager.spec.ramps.some(ramp => ramp.name === name);
            return new RegExp(RAMP_NAME_PATTERN).test(name) && !RESERVED_RAMPS.includes(name) && !taken;
        },

        exportText() {
            switch (this.exportFormat) {
                case 'json':
                    return this.paletteManager.json;
                case 'cli':
                    return [
                        '# Save the spec as palette.json, then:',
                        'npx nightshade palette -f palette.json -o src/palette.css',
                    ].join('\n');
                default:
                    return this.paletteManager.css;
            }
        },

    },

    methods: {

        addRamp() {
            this.paletteManager.addRamp(this.newRampName);
            this.newRampName = '';
        },

        copy(text, what) {
            navigator.clipboard.writeText(text);
            this.copied = what;
            setTimeout(() => {
                this.copied = '';
            }, 1600);
        },

    },

};
</script>

<style scoped>
.PaletteStudio {
    max-width: calc(var(--Site-wide-width) + 2 * var(--Site-gutter));
    margin: 0 auto;
    padding: var(--sp8) var(--Site-gutter) var(--sp12);
}

.Header {
    max-width: 760px;
    margin-bottom: var(--sp6);
}

.Title {
    margin: 0 0 var(--sp2);
    font: 600 clamp(44px, 6vw, 72px)/1.05 var(--font-alt);
    letter-spacing: -0.02em;
}

.Lead {
    margin: 0 0 var(--sp3);
    font-size: var(--font-size-l);
    line-height: 1.6;
    color: var(--text-subtle);
}

code {
    font-family: var(--font-monospace);
    font-size: 0.88em;
}

.Actions {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    gap: var(--sp1);
}

.Copied {
    font-size: var(--font-size-s);
    color: var(--color-success-500);
}

.Section {
    padding: var(--sp6) 0;
    border-top: 1px solid var(--border-base);
}

.SectionHeader {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: flex-end;
    gap: var(--sp2);
    margin-bottom: var(--sp3);
}

.SectionTitle {
    margin: 0;
    font: 600 32px/1.1 var(--font-alt);
    letter-spacing: -0.01em;
}

.SectionNote {
    max-width: 640px;
    margin: var(--sp1) 0 0;
    color: var(--text-subtle);
}

.CurvesLayout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
    align-items: start;
    gap: var(--sp4);
}

.Curves {
    display: flex;
    flex-flow: column;
    gap: var(--sp3);
}

.AddTone {
    display: flex;
    gap: var(--sp1);
    max-width: 480px;
    padding-top: var(--sp3);
    border-top: 1px solid var(--border-base);
}

.AddToneName {
    flex: 1;
}

.GridSpecimen {
    display: flex;
    flex-flow: column;
    gap: var(--sp2);
}

.GridRow {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    gap: var(--sp1);
}

.GridInput {
    width: calc(28 * var(--sp));
}

.Code {
    position: relative;
    max-height: 480px;
    overflow: auto;
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
    background: var(--surface-shade);
}

.Code pre {
    margin: 0;
    padding: var(--sp2) var(--sp2-5);
    font: 400 13px/1.65 var(--font-monospace);
    color: var(--text-base);
}

.CodeCopy {
    position: sticky;
    float: right;
    top: var(--sp1);
    margin: var(--sp1) var(--sp1) 0 0;
}

@media (max-width: 960px) {
    .CurvesLayout {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
