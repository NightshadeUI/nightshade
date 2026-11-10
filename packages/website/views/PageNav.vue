<template>
    <nav class="PageNav">
        <a
            v-if="navigationManager.prevPage"
            :href="navigationManager.prevPage.link"
            class="Card Card-prev">
            <span class="Hint">Previous</span>
            <span class="Label">{{ navigationManager.prevPage.title }}</span>
        </a>
        <a
            v-if="navigationManager.nextPage"
            :href="navigationManager.nextPage.link"
            class="Card Card-next">
            <span class="Hint">Next</span>
            <span class="Label">{{ navigationManager.nextPage.title }}</span>
        </a>
    </nav>
</template>

<script>
export default {

    inject: [
        'navigationManager',
    ],

};
</script>

<style scoped>
.PageNav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sp2);
    margin-top: var(--sp10);
    padding-top: var(--sp4);
    border-top: 1px solid var(--border-base);
}

.Card {
    display: flex;
    flex-flow: column;
    gap: var(--sp0-5);
    padding: var(--sp2) var(--sp2-5);
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
    transition: border-color .2s, transform .2s;
}

.Card:hover {
    border-color: var(--color-primary-600);
    transform: translateY(-1px);
}

.Card-next {
    grid-column: 2;
    text-align: right;
}

.Hint {
    font-size: var(--font-size-xs);
    color: var(--text-faint);
}

.Label {
    font-weight: 500;
    color: var(--color-primary-500);
}
</style>
