<template>
    <div class="Jumbo">
        <h1>Nightshade</h1>
        <div class="Tagline">
            Scalable Design System for Vue
        </div>
    </div>
</template>

<style scoped>
.Jumbo {
    height: 100vh;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
}

.Tagline {
    margin: .5em 0;
    text-align: center;
    font: var(--font-weight-light) var(--font-size-xl)/1.2 var(--font-main);
}

h1 {
    padding: 0 1em;
    color: var(--color-primary-500);
    background: linear-gradient(
        to top right,
        var(--color-secondary-500) 0%,
        light-dark(var(--color-primary-600), var(--color-primary-500)) 40%,
        light-dark(var(--color-primary-500), var(--color-primary-400)) 60%,
        var(--color-danger-400) 100%
    );
    background-clip: text;
    color: transparent;
    text-shadow:
        64px -32px 96px var(--color-primary-500),
        -64px 32px 96px var(--color-secondary-500),
        0 2px 4px light-dark(rgba(255,255,255,.5), rgba(0,0,0,.5));
}
</style>
