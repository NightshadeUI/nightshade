<template>
    <section class="HomeSection">
        <header class="Header">
            <h2 class="Title">
                {{ title }}
            </h2>
            <p
                v-if="tagline"
                class="Tagline">
                {{ tagline }}
            </p>
            <p
                v-if="text"
                class="Text">
                {{ text }}
            </p>
        </header>
        <div class="Body">
            <slot />
        </div>
    </section>
</template>

<script>
export default {

    props: {
        title: { type: String, required: true },
        tagline: { type: String },
        text: { type: String },
    },

};
</script>

<style scoped>
.HomeSection {
    max-width: var(--Site-wide-width);
    margin: 0 auto;
    padding: var(--sp16) var(--Site-gutter) 0;
}

.Header {
    max-width: 720px;
    margin-bottom: var(--sp5);
}

.Title {
    margin: 0;
    font: 600 clamp(36px, 5vw, 56px)/1.05 var(--font-alt);
    letter-spacing: -0.02em;
}

.Tagline {
    margin: var(--sp1-5) 0 0;
    font-size: var(--font-size-xl);
    font-weight: 600;
    line-height: 1.3;
}

.Text {
    margin: var(--sp1-5) 0 0;
    line-height: 1.65;
    color: var(--text-subtle);
}

.HomeSection:last-of-type {
    padding-bottom: var(--sp16);
}

@media (max-width: 720px) {
    .HomeSection {
        padding-top: var(--sp10);
    }

    .HomeSection:last-of-type {
        padding-bottom: var(--sp10);
    }
}
</style>
