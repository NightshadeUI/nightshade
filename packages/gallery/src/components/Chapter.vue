<template>
    <article class="Chapter">
        <slot />
    </article>
</template>

<script setup>
</script>

<style scoped>
.Chapter {
    padding: var(--sp2);
}

.Chapter:deep(.DualTheme) {
    margin: 0 calc(-1 * var(--sp2));
}
</style>
