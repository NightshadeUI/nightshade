<template>
    <div class="DualTheme">
        <div class="Column Column-light">
            <slot />
        </div>
        <div class="Column Column-dark">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.DualTheme {
    display: flex;
    flex-flow: row nowrap;
    gap: var(--sp);
    margin: var(--sp) 0;
}

.Column {
    flex: 1;
    background: var(--color-base-0);
    color: var(--color-base-900);
    padding: var(--sp-m);
    border-radius: var(--border-radius);
    box-shadow: 0 0 3px var(--shadow-color-light) inset;
}

.Column-light {
    color-scheme: light;
}

.Column-dark {
    color-scheme: dark;
}

@container page-content (width < 640px) {
    .DualTheme {
        flex-flow: column;
    }
}
</style>
