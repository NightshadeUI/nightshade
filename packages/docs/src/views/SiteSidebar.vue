<template>
    <nav class="SiteSidebar">
        <div
            v-for="section in siteManager.sections"
            :key="section.id"
            class="Section"
            :class="{ 'Section-current': siteManager.isInSection(section) }">
            <a
                :href="section.link"
                class="SectionTitle">
                {{ section.title }}
            </a>
            <a
                v-for="page in section.pages"
                :key="page.link"
                :href="page.link"
                class="PageLink"
                :class="{ 'PageLink-current': siteManager.isCurrent(page.link) }">
                {{ page.title }}
            </a>
        </div>
    </nav>
</template>

<script>
export default {

    inject: [
        'siteManager',
    ],

};
</script>

<style scoped>
.SiteSidebar {
    display: flex;
    flex-flow: column;
    gap: var(--sp4);
}

.Section {
    display: flex;
    flex-flow: column;
}

.SectionTitle {
    margin-bottom: var(--sp1);
    font-size: var(--font-size-s);
    font-weight: 700;
    line-height: var(--line-height-main);
    color: var(--text-base);
}

.PageLink {
    display: flex;
    align-items: center;
    min-height: var(--sp4);
    padding: 0 0 0 var(--sp1-5);
    border-left: 1px solid var(--border-base);
    font-size: var(--font-size-s);
    line-height: var(--line-height-main);
    color: var(--text-subtle);
    transition: color .2s, border-color .2s;
}

.PageLink:hover {
    color: var(--text-base);
}

.PageLink-current {
    border-left-color: var(--color-primary-500);
    color: var(--color-primary-600);
    font-weight: 600;
}
</style>
