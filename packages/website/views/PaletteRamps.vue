<template>
    <div class="PaletteRamps">
        <RampSwatches
            v-for="ramp in paletteManager.spec.ramps"
            :key="ramp.name"
            :name="ramp.name"
            :note="noteOf(ramp)"
            :steps="paletteManager.getRampSteps(ramp.name)" />
    </div>
</template>

<script>
/**
 * Every ramp of the site palette, as generated.
 */
export default {

    inject: [
        'paletteManager',
    ],

    methods: {

        noteOf(ramp) {
            return [`hue ${ramp.hue}°`, `chroma ×${ramp.chroma}`, `lightness ×${ramp.lightness}`].join(' · ');
        },

    },

};
</script>

<style scoped>
.PaletteRamps {
    display: flex;
    flex-flow: column;
    gap: var(--sp2);
    margin: var(--sp3) 0;
}
</style>
