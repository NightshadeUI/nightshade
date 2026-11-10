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
            <a
                href="/"
                class="Brand">
                <span class="Wordmark">Nightshade</span>
                <span class="Version">3.0</span>
            </a>
            <nav class="Nav">
                <a
                    v-for="link in navigationManager.topLinks"
                    :key="link.link"
                    :href="link.link"
                    class="NavLink"
                    :class="{ 'NavLink-active': navigationManager.isActiveTopLink(link) }">
                    {{ link.title }}
                </a>
            </nav>
            <div class="Actions">
                <SchemeSwitch />
                <Btn
                    tagName="a"
                    href="https://github.com/NightshadeUI/nightshade"
                    icon="fab fa-github"
                    title="GitHub"
                    square
                    ghost
                    :outline="false" />
            </div>
        </div>
    </header>
</template>

<script>
export default {

    inject: [
        'navigationManager',
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

.Brand {
    display: flex;
    align-items: baseline;
    gap: var(--sp1);
    flex-shrink: 0;
}

.Wordmark {
    font-size: 26px;
    line-height: 1;
}

.Version {
    padding: 2px 6px;
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
    font: 600 var(--font-size-xxs)/1.2 var(--font-main);
    color: var(--text-subtle);
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

.NavLink-active .Actions {
    display: flex;
    align-items: center;
    gap: var(--sp0-5);
}

.MenuToggle {
    display: none;
}

@media (max-width: 960px) {
    .Nav {
        display: none;
    }

    .Actions {
        margin-left: auto;
    }

    .MenuToggle {
        display: inline-flex;
        margin-left: calc(-1 * var(--sp1));
    }
}
</style>
