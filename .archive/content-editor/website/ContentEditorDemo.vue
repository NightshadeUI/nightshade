<template>
    <div class="ContentEditorDemo">
        <div class="Editor">
            <ContentEditor v-model="doc" />
        </div>
        <pre class="Doc"><code>{{ serialized }}</code></pre>
    </div>
</template>

<script>
import { ContentEditor } from '@nightshadeui/content-editor/src';

export default {

    components: {
        ContentEditor,
    },

    data() {
        return {
            doc: [
                {
                    type: 'h2',
                    text: 'A block editor',
                },
                {
                    type: 'p',
                    text: 'Edit this <strong>content</strong>. The document on the right is what ' +
                        '<code>v-model</code> holds.',
                },
            ],
        };
    },

    computed: {

        serialized() {
            return JSON.stringify(this.doc, null, 2);
        },

    },

};
</script>

<style scoped>
.ContentEditorDemo {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--sp2);
    margin: var(--sp3) 0;
}

.Editor,
.Doc {
    margin: 0;
    padding: var(--sp2) var(--sp2-5);
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
}

.Editor {
    background: var(--surface-base);
}

.Doc {
    overflow: auto;
    background: var(--surface-shade);
    font: 400 12px/1.6 var(--font-monospace);
}

@media (max-width: 720px) {
    .ContentEditorDemo {
        grid-template-columns: minmax(0, 1fr);
    }
}
</style>
