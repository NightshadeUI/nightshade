<template>
    <div
        class="SiteLayout"
        :class="`SiteLayout-${layout}`">
        <PaletteStyle />
        <SiteHeader
            :menuShown="menuShown"
            @toggleMenu="menuShown = !menuShown" />
        <div
            v-if="layout === 'doc'"
            class="Doc">
            <aside class="Sidebar">
                <SiteSidebar />
            </aside>
            <main class="Main">
                <Content class="Prose" />
                <PageNav />
            </main>
            <aside class="Outline">
                <PageOutline :key="navigationManager.path" />
            </aside>
        </div>
        <main
            v-else
            class="Full">
            <Content />
        </main>
        <SiteFooter />
        <aside
            class="Drawer"
            :class="{ 'Drawer-shown': menuShown }">
            <nav class="DrawerLinks">
                <a
                    v-for="link in navigationManager.topLinks"
                    :key="link.link"
                    :href="link.link"
                    class="DrawerLink"
                    :class="{ 'DrawerLink-active': navigationManager.isActiveTopLink(link) }">
                    {{ link.title }}
                </a>
            </nav>
            <SiteSidebar />
        </aside>
        <div id="overlays" />
    </div>
</template>

<script>
export default {

    inject: [
        'navigationManager',
        'paletteManager',
        'appearanceManager',
        'playgroundManager',
    ],

    data() {
        return {
            menuShown: false,
        };
    },

    computed: {

        layout() {
            return this.$frontmatter.layout ?? 'doc';
        },

    },

    watch: {

        'navigationManager.path'() {
            this.menuShown = false;
        },

    },

    mounted() {
        this.paletteManager.load();
        this.appearanceManager.load();
        this.playgroundManager.load();
        document.addEventListener('click', this.onDocumentClick);
    },

    beforeUnmount() {
        document.removeEventListener('click', this.onDocumentClick);
    },

    methods: {

        onDocumentClick(ev) {
            const button = ev.target.closest('div[class*="language-"] > button.copy');
            if (!button) {
                return;
            }
            const code = button.parentElement.querySelector('pre')?.textContent ?? '';
            navigator.clipboard.writeText(code);
            button.classList.add('copied');
            setTimeout(() => button.classList.remove('copied'), 1600);
        },

    },

};
</script>

<style scoped>
.SiteLayout {
    min-height: 100vh;
    display: flex;
    flex-flow: column;
}

.Doc {
    flex: 1;
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr) 220px;
    gap: var(--sp6);
    width: 100%;
    max-width: calc(var(--Site-wide-width) + 2 * var(--Site-gutter));
    margin: 0 auto;
    padding: 0 var(--Site-gutter);
}

.Sidebar,
.Outline {
    position: sticky;
    top: var(--Site-header-height);
    align-self: start;
    max-height: calc(100vh - var(--Site-header-height));
    overflow-y: auto;
    padding: var(--sp5) 0;
    scrollbar-width: thin;
}

.Main {
    min-width: 0;
    max-width: var(--Site-content-width);
    padding: var(--sp6) 0 var(--sp12);
}

.Full {
    flex: 1;
}

@media (max-width: 1180px) {
    .Doc {
        grid-template-columns: 240px minmax(0, 1fr);
        gap: var(--sp5);
    }

    .Outline {
        display: none;
    }
}

/* Drawer: the whole navigation, below the width where the header nav fits */

.Drawer {
    display: none;
}

@media (max-width: 960px) {
    .Drawer {
        position: fixed;
        z-index: 40;
        top: var(--Site-header-height);
        left: 0;
        bottom: 0;
        display: flex;
        flex-flow: column;
        gap: var(--sp4);
        width: min(320px, 86vw);
        padding: var(--sp3) var(--Site-gutter);
        overflow-y: auto;
        border-right: 1px solid var(--border-base);
        background: var(--surface-base);
        box-shadow: 0 0 48px var(--shadow-medium);
        transform: translateX(-100%);
        visibility: hidden;
        transition: transform .3s, visibility .3s;
    }

    .Drawer-shown {
        transform: none;
        visibility: visible;
    }
}

.DrawerLinks {
    display: flex;
    flex-flow: column;
    gap: var(--sp0-5);
    padding-bottom: var(--sp3);
    border-bottom: 1px solid var(--border-base);
}

.DrawerLink {
    font-size: var(--font-size-l);
    font-weight: 600;
    color: var(--text-subtle);
}

.DrawerLink-active {
    color: var(--text-base);
}

@media (max-width: 860px) {
    .Doc {
        grid-template-columns: minmax(0, 1fr);
    }

    .Sidebar {
        display: none;
    }

    .Main {
        padding-top: var(--sp4);
    }
}
</style>
