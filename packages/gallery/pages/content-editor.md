---
title: Content Editor
description: Content editor prototype playground
---

# Content Editor

<ContentEditor v-model="doc" />

<pre class="ContentEditorDoc">{{ serializedDoc }}</pre>

<script setup>
import { computed, ref } from 'vue';
import { ContentEditor } from '@nightshadeui/content-editor/src';

const doc = ref([
    { type: 'h2', text: 'Nightshade Content Editor' },
    { type: 'p1', text: 'Edit this <strong>content</strong> and switch block types with the toolbar.' },
]);

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
