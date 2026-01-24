<template>
    <div class="RootLayout">
        <template v-if="frontmatter.preamble === 'Jumbo'">
            <Jumbo />
        </template>
        <div class="Layout">
            <div class="Sidebar">
                <ContentOutline />
                <Appearance v-if="frontmatter.showAppearance" />
            </div>
            <article
                id="page-content"
                class="Content">
                <Content />
            </article>
        </div>
    </div>
</template>

<script>
import { useData } from 'vitepress';
import Jumbo from './Jumbo.vue';
import ContentOutline from './ContentOutline.vue';
import Appearance from './Appearance.vue';

export default {

    components: {
        Jumbo,
        ContentOutline,
        Appearance,
    },

    setup() {
        const { frontmatter, page } = useData();
        return { frontmatter, page };
    }

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
