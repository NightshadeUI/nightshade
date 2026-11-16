---
title: Content editor
---

# Content editor

<p class="Lead">A block editor that keeps a JSON document in sync with a <code>contenteditable</code> surface. It's a prototype, and isn't published yet.</p>

<ClientOnly>
    <ContentEditorDemo />
</ClientOnly>

## Usage

```html
<ContentEditor v-model="doc" />
```

```ts
const doc = [
    { type: 'h2', text: 'Title' },
    { type: 'p', text: 'Body with <strong>inline</strong> markup.' },
];
```

Inline markup is sanitized on the way in. The `ContentEditor` class does the work; the component binds it to `v-model`.
