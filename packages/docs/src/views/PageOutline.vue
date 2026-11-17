<template>
    <nav
        v-if="items.length"
        class="PageOutline">
        <div class="Title">
            On this page
        </div>
        <a
            v-for="item in items"
            :key="item.id"
            :href="`#${item.id}`"
            class="Link"
            :class="[
                `Link-level${item.level}`,
                {
                    'Link-active': activeId === item.id,
                },
            ]">
            {{ item.title }}
        </a>
    </nav>
</template>

<script>
export default {

    data() {
        return {
            items: [],
            activeId: '',
        };
    },

    mounted() {
        requestAnimationFrame(() => this.readHeadings());
        window.addEventListener('scroll', this.onScroll, { passive: true });
    },

    beforeUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    },

    methods: {

        readHeadings() {
            const headings = document.querySelectorAll('.Prose h2[id], .Prose h3[id]');
            this.items = [...headings].map(heading => {
                return {
                    id: heading.id,
                    level: Number(heading.tagName.slice(1)),
                    title: heading.textContent.replace(/#$/, '').trim(),
                };
            });
            this.onScroll();
        },

        onScroll() {
            const threshold = window.innerHeight * 0.3;
            let activeId = this.items[0]?.id ?? '';
            for (const item of this.items) {
                const el = document.getElementById(item.id);
                if (el && el.getBoundingClientRect().top < threshold) {
                    activeId = item.id;
                }
            }
            this.activeId = activeId;
        },

    },

};
</script>

<style scoped>
.PageOutline {
    display: flex;
    flex-flow: column;
    font-size: var(--font-size-xs);
}

.Title {
    margin-bottom: var(--sp1);
    font-weight: 600;
    color: var(--text-base);
}

.Link {
    padding: var(--sp0-5) 0 var(--sp0-5) var(--sp1-5);
    border-left: 1px solid var(--border-base);
    color: var(--text-subtle);
    line-height: var(--line-height-main);
    transition: color .2s, border-color .2s;
}

.Link:hover {
    color: var(--text-base);
}

.Link-level3 {
    padding-left: var(--sp3);
}

.Link-active {
    border-left-color: var(--color-primary-500);
    color: var(--color-primary-500);
}
</style>
