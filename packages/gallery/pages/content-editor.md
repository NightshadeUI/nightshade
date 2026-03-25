---
title: Content Editor
description: Content editor prototype playground
---

# Content Editor

<ContentEditor
    v-model="doc"
    @focus-node-change="focusedNode = $event" />

<p><strong>Focused block:</strong> {{ focusedNode?.type || 'none' }}</p>

<pre class="ContentEditorDoc">{{ serializedDoc }}</pre>

<script setup>
import { computed, ref } from 'vue';
import { ContentEditor } from '@nightshadeui/content-editor/src';

const doc = ref({
    nodes: [
        { id: 'intro', type: 'h2', content: [{ kind: 'text', text: 'Nightshade Content Editor' }] },
        { id: 'paragraph', type: 'p1', content: [{ kind: 'text', text: 'Edit this content and switch block types with the toolbar.' }] },
    ],
});

const focusedNode = ref(null);

const serializedDoc = computed(() => JSON.stringify(doc.value, null, 2));
</script>

<style scoped>
.ContentEditorDoc {
    max-width: 960px;
    padding: var(--sp);
    border-radius: var(--radius);
    border: 1px solid var(--color-base-200);
    background: var(--color-base-50);
    overflow: auto;
}
</style>
