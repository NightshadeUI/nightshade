<template>
    <header class="SiteHeader">
        <div class="Inner">
            <Btn
                class="MenuToggle"
                :icon="menuShown ? 'fas fa-xmark' : 'fas fa-bars'"
                title="Menu"
                square
                ghost
                :outline="false"
                @click="$emit('toggleMenu')" />
            <SiteBrand
                :name="siteManager.brand.name"
                :logo="siteManager.brand.logo"
                :version="siteManager.brand.version" />
            <nav class="Nav">
                <a
                    v-for="link in siteManager.topLinks"
                    :key="link.link"
                    :href="link.link"
                    class="NavLink"
                    :class="{ 'NavLink-active': siteManager.isActiveTopLink(link) }">
                    {{ link.title }}
                </a>
            </nav>
            <div class="Actions">
                <slot name="actions" />
                <SchemeSwitch />
                <Btn
                    v-for="item in siteManager.social"
                    :key="item.link"
                    tagName="a"
                    :href="item.link"
                    :icon="item.icon"
                    :title="item.title"
                    square
                    ghost
                    :outline="false" />
            </div>
        </div>
    </header>
</template>

<script>
import { Btn } from '@nightshadeui/components';

export default {

    components: {
        Btn,
    },

    inject: [
        'siteManager',
    ],

    props: {
        menuShown: { type: Boolean, default: false },
    },

    emits: [
        'toggleMenu',
    ],

};
</script>

<style scoped>
.SiteHeader {
    position: sticky;
    z-index: 50;
    top: 0;
    height: var(--Site-header-height);
    border-bottom: 1px solid color-mix(in oklab, var(--border-base), transparent 30%);
    background: color-mix(in oklab, var(--surface-base), transparent 22%);
    backdrop-filter: saturate(1.6) blur(14px);
}

.Inner {
    display: flex;
    align-items: center;
    gap: var(--sp3);
    height: 100%;
    max-width: calc(var(--Site-wide-width) + 2 * var(--Site-gutter));
    margin: 0 auto;
    padding: 0 var(--Site-gutter);
}

.Nav {
    flex: 1;
    display: flex;
    justify-content: center;
    gap: var(--sp0-5);
}

.NavLink {
    padding: var(--sp1) var(--sp1-5);
    border-radius: var(--radius-m);
    font-size: var(--font-size-s);
    color: var(--text-subtle);
    transition: color .2s, background-color .2s;
}

.NavLink:hover {
    color: var(--text-base);
    background: var(--surface-shade);
}

.NavLink-active {
    color: var(--text-base);
    font-weight: 600;
}

.Actions {
    display: flex;
    align-items: center;
    gap: var(--sp0-5);
}

.Inner .MenuToggle {
    display: none;
}

@media (max-width: 960px) {
    .Nav {
        display: none;
    }

    .Actions {
        margin-left: auto;
    }

    .Inner .MenuToggle {
        display: inline-flex;
        margin-left: calc(-1 * var(--sp1));
    }
}
</style>
