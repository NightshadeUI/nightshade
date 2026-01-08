<template>
    <div class="ContentOutline">
        <template v-for="item in outline" :key="item.id">
            <a
                class="Link"
                :class="[
                    `Link-level-${item.level}`,
                    {
                        'Link-active': activeId === item.id
                    },
                ]"
                :href="'#' + item.id"
                @click.prevent="goto(item.id)">
                {{ item.title }}
            </a>
        </template>
    </div>
</template>

<script>
export default {

    data() {
        return {
            outline: [],
            activeId: '',
        };
    },

    mounted() {
        this.parseOutline();
        window.addEventListener('scroll', this.onScroll);
    },

    beforeUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    },

    methods: {

        parseOutline() {
            const cnt = document.querySelector('#page-content');
            if (!cnt) return;
            const headers = cnt.querySelectorAll('h2, h3');
            for (const h of headers) {
                this.outline.push({
                    level: h.tagName.replace(/[^0-9]/g, ''),
                    id: h.id,
                    title: h.textContent.trim(),
                });
            }
        },

        goto(id) {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        },

        updateActive() {
            this.activeId = '';
            for (const h of this.outline) {
                const el = document.getElementById(h.id ?? '');
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight / 2) {
                    this.activeId = h.id;
                } else {
                    break;
                }
            }
            if (this.activeId) {
                history.replaceState(null, '', '#' + this.activeId);
            }
        },

        onScroll(ev) {
            requestAnimationFrame(() => this.updateActive());
        }

    }

}
</script>

<style scoped>
.ContentOutline {
    display: flex;
    flex-flow: column;
}

.Link {
    display: block;
    padding: var(--sp) 0;
    line-height: 1.2;
}

.Link-active {
    color: var(--color-primary-500);
}

.Link-level-2 {
}

.Link-level-3 {
    font-size: var(--font-size-s);
    padding-left: var(--sp2);
}
</style>
