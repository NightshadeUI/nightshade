<template>
    <section class="HomeSection">
        <header class="Header">
            <h2>
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
            <div
                v-if="$slots.text"
                class="Text">
                <slot name="text" />
            </div>
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

h2 {
    margin: 0;
}

.Tagline {
    margin: var(--sp1-5) 0 0;
    font-size: var(--font-size-xl);
    font-weight: 600;
}

.Text {
    margin: var(--sp1-5) 0 0;
    line-height: var(--line-height-prose);
    color: var(--text-subtle);
}

.Text :deep(p) {
    margin: 0;
}

.Text :deep(code) {
    font: 500 var(--font-size-s) var(--font-monospace);
    letter-spacing: 0;
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
