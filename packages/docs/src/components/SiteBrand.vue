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
    --SiteBrand-size: 26px;
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
    line-height: 1;
}

.Version {
    align-self: center;
    padding: 2px 6px;
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
    font: 600 var(--font-size-xxs)/1.2 var(--font-main);
    color: var(--text-subtle);
}
</style>
