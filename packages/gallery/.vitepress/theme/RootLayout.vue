<template>
    <div class="RootLayout">
        <GalleryPaletteInject />
        <div id="overlays" />

        <template v-if="!useCustomLayout">
            <template v-if="frontmatter.preamble === 'Jumbo'">
                <Jumbo />
            </template>
            <div class="Layout">
                <div class="Sidebar">
                    <ContentOutline />
                    <Appearance v-if="frontmatter.showAppearance" />
                    <PaletteBuilder v-if="frontmatter.showAppearance" />
                </div>
                <article
                    id="page-content"
                    class="Content">
                    <Content />
                </article>
            </div>
        </template>

        <template v-if="useCustomLayout">
            <Content />
        </template>

    </div>
</template>

<script>
import { useData } from 'vitepress';
import Jumbo from './Jumbo.vue';
import ContentOutline from './ContentOutline.vue';
import Appearance from './Appearance.vue';
import PaletteBuilder from './PaletteBuilder.vue';
import GalleryPaletteInject from './GalleryPaletteInject.vue';

export default {

    components: {
        PaletteBuilder,
        GalleryPaletteInject,
        Jumbo,
        ContentOutline,
        Appearance,
    },

    setup() {
        const { frontmatter, page } = useData();
        return { frontmatter, page };
    },

    computed: {

        useCustomLayout() {
            return this.frontmatter.useCustomLayout;
        },

    },

}
</script>

<style scoped>
.Layout {
    position: relative;
    display: flex;
}

.Sidebar {
    align-self: flex-start;
    position: sticky;
    top: 0;
    left: 0;
    bottom: 0;
    overflow-y: auto;

    padding: var(--sp);
    width: 240px;
    max-height: 100vh;

    display: flex;
    flex-flow: column;
}

.Content {
    container-name: page-content;
    container-type: inline-size;
    flex: 1;
    padding: 0 var(--sp);
    min-height: 100vh;
}

@media (max-width: 960px) {
    .Sidebar {
        display: none;
    }
}
</style>
