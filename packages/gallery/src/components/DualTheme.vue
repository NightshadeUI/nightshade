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
}

.Column {
    flex: 1;
    background: var(--color-base-0);
    color: var(--color-base-900);
    padding: var(--sp-m);
}

.Column-light {
    color-scheme: light;
}

.Column-dark {
    color-scheme: dark;
}
</style>
