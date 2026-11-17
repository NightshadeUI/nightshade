<template>
    <a
        :href="href"
        class="SiteBrand"
        :class="{ 'SiteBrand-withLogo': logo }">
        <img
            v-if="logo"
            :src="logo"
            alt=""
            class="Logo" />
        <span class="Wordmark">{{ name }}</span>
        <span
            v-if="version"
            class="Version">{{ version }}</span>
    </a>
</template>

<script>
/**
 * The site's logo, name and version, linking home. Without a logo the name is the wordmark, and larger.
 */
export default {

    props: {
        name: { type: String, required: true },
        logo: { type: String, default: '' },
        version: { type: String, default: '' },
        href: { type: String, default: '/' },
    },

};
</script>

<style scoped>
.SiteBrand {
    --SiteBrand-size: var(--sp3);
    --SiteBrand-logo-size: var(--sp4);

    display: flex;
    align-items: center;
    gap: var(--sp1);
    flex-shrink: 0;
    color: var(--text-base);
}

.SiteBrand-withLogo {
    --SiteBrand-size: var(--font-size-l);

    gap: var(--sp1-5);
}

.Logo {
    display: block;
    height: var(--SiteBrand-logo-size);
}

.Wordmark {
    font-family: var(--font-alt);
    font-size: var(--SiteBrand-size);
    font-weight: 600;
    line-height: var(--SiteBrand-size);
}

.Version {
    align-self: center;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    height: var(--sp2);
    padding: 0 var(--sp0-5);
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
    font: 600 var(--font-size-xxs) var(--font-main);
    line-height: var(--line-height-main);
    color: var(--text-subtle);
}
</style>
