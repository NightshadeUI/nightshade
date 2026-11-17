<template>
    <footer class="SiteFooter">
        <div
            class="Inner"
            :style="{ '--SiteFooter-columns': siteManager.sections.length }">
            <div class="Brand">
                <SiteBrand
                    class="FooterBrand"
                    :name="siteManager.brand.name"
                    :logo="siteManager.brand.logo" />
                <p
                    v-if="siteManager.footer.note"
                    class="Note">
                    {{ siteManager.footer.note }}
                </p>
            </div>
            <div
                v-for="section in siteManager.sections"
                :key="section.id"
                class="Column">
                <a
                    :href="section.link"
                    class="ColumnTitle">
                    {{ section.title }}
                </a>
                <a
                    v-for="page in section.pages"
                    :key="page.link"
                    :href="page.link"
                    class="Link">
                    {{ page.title }}
                </a>
            </div>
        </div>
        <div
            v-if="siteManager.footer.legal"
            class="Legal">
            {{ siteManager.footer.legal }}
        </div>
    </footer>
</template>

<script>
export default {

    inject: [
        'siteManager',
    ],

};
</script>

<style scoped>
.SiteFooter {
    border-top: 1px solid var(--border-base);
    background: var(--surface-shade);
    font-size: var(--font-size-s);
}

.Inner {
    display: grid;
    grid-template-columns: 2fr repeat(var(--SiteFooter-columns), minmax(0, 1fr));
    gap: var(--sp4);
    max-width: calc(var(--Site-wide-width) + 2 * var(--Site-gutter));
    margin: 0 auto;
    padding: var(--sp8) var(--Site-gutter) var(--sp5);
}

.FooterBrand:not(.SiteBrand-withLogo) {
    --SiteBrand-size: var(--sp4);
}

.Note {
    max-width: 280px;
    margin: var(--sp2) 0 0;
    color: var(--text-subtle);
}

.Column {
    display: flex;
    flex-flow: column;
    gap: var(--sp1);
}

.ColumnTitle {
    margin-bottom: var(--sp0-5);
    font-weight: 600;
}

.Link {
    color: var(--text-subtle);
    transition: color .2s;
}

.Link:hover {
    color: var(--text-base);
}

.Legal {
    max-width: calc(var(--Site-wide-width) + 2 * var(--Site-gutter));
    margin: 0 auto;
    padding: var(--sp3) var(--Site-gutter) var(--sp5);
    font-size: var(--font-size-xs);
    color: var(--text-faint);
}

@media (max-width: 960px) {
    .Inner {
        grid-template-columns: repeat(3, 1fr);
    }

    .Brand {
        grid-column: 1 / -1;
    }
}

@media (max-width: 560px) {
    .Inner {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
