<template>
    <div
        class="RampEditor"
        :class="`tone-${ramp.name}`">
        <div class="Controls">
            <div class="Header">
                <span class="Dot" />
                <code class="Name">.tone-{{ ramp.name }}</code>
                <Chip
                    v-if="!standard"
                    label="custom"
                    size="xs"
                    flat />
                <span class="Spacer" />
                <Btn
                    v-if="!standard"
                    icon="fas fa-trash-can"
                    title="Delete tone"
                    size="xs"
                    square
                    ghost
                    @click="$emit('delete')" />
            </div>
            <label class="Field">
                <span class="FieldLabel">Hue</span>
                <Slider
                    class="HueSlider"
                    :modelValue="ramp.hue"
                    :min="0"
                    :max="360"
                    size="s"
                    tooltip="dynamic"
                    fillStyle="none"
                    @update:modelValue="$emit('update', { hue: $event })" />
            </label>
            <label class="Field">
                <span class="FieldLabel">Chroma ×</span>
                <Slider
                    :modelValue="ramp.chroma"
                    :min="0"
                    :max="2"
                    :step="0.01"
                    size="s"
                    tooltip="dynamic"
                    :formatTooltip="formatDecimal"
                    @update:modelValue="$emit('update', { chroma: $event })" />
            </label>
            <label class="Field">
                <span class="FieldLabel">Lightness ×</span>
                <Slider
                    :modelValue="ramp.lightness"
                    :min="0.5"
                    :max="1.5"
                    :step="0.01"
                    size="s"
                    tooltip="dynamic"
                    :formatTooltip="formatDecimal"
                    @update:modelValue="$emit('update', { lightness: $event })" />
            </label>
        </div>
        <div class="Preview">
            <RampSwatches
                :name="ramp.name"
                :steps="steps" />
            <div class="Specimen">
                <Btn
                    :label="ramp.name"
                    size="s" />
                <Btn
                    label="Outline"
                    size="s"
                    outline
                    flat />
                <Chip
                    label="Outline"
                    size="s"
                    outline />
                <Chip
                    label="Tint"
                    size="s" />
                <Toggle
                    :modelValue="true"
                    size="s" />
                <Checkbox
                    :modelValue="true"
                    size="s" />
                <span class="Text">Aa</span>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * One ramp: its three knobs beside what they produce, in its own tone context.
 */
export default {

    props: {
        ramp: { type: Object, required: true },
        steps: { type: Array, required: true },
        standard: { type: Boolean, default: true },
    },

    emits: [
        'update',
        'delete',
    ],

    methods: {

        formatDecimal(value) {
            return value.toFixed(2);
        },

    },

};
</script>

<style scoped>
.RampEditor {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
    gap: var(--sp4);
    padding: var(--sp3) 0;
    border-top: 1px solid var(--border-base);
}

.Controls {
    display: flex;
    flex-flow: column;
    gap: var(--sp1);
}

.Header {
    display: flex;
    align-items: center;
    gap: var(--sp1);
    min-height: var(--sp3);
}

.Dot {
    width: var(--sp2);
    height: var(--sp2);
    border-radius: 50%;
    background: var(--tone-fill);
}

.Name {
    font: 500 var(--font-size-s)/1 var(--font-monospace);
}

.Spacer {
    flex: 1;
}

.Field {
    display: grid;
    grid-template-columns: var(--sp10) minmax(0, 1fr);
    align-items: center;
    gap: var(--sp1);
}

.FieldLabel {
    font-size: var(--font-size-xs);
    color: var(--text-subtle);
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

.Preview {
    display: flex;
    flex-flow: column;
    gap: var(--sp2);
    min-width: 0;
}

.Specimen {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    gap: var(--sp1);
}

.Text {
    margin-left: auto;
    font: 400 24px/1 var(--font-alt);
    color: var(--tone-text);
}

@media (max-width: 860px) {
    .RampEditor {
        grid-template-columns: minmax(0, 1fr);
        gap: var(--sp2);
    }
}
</style>
