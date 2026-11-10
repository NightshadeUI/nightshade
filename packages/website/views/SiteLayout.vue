<template>
    <PaletteStyle />
    <DocsLayout />
</template>

<script>
import { DocsLayout } from '@nightshadeui/docs/src';

/**
 * The docs frame, with this site's live palette and look playground loaded.
 */
export default {

    components: {
        DocsLayout,
    },

    inject: [
        'paletteManager',
        'playgroundManager',
    ],

    mounted() {
        this.paletteManager.load();
        this.playgroundManager.load();
    },

};
</script>
