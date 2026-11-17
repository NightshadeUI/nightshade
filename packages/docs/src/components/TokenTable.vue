<template>
    <div class="TokenTable">
        <div
            v-for="token in tokens"
            :key="token.name"
            class="Row">
            <span
                class="Preview"
                :class="`Preview-${preview}`"
                :style="previewStyle(token.name)" />
            <code class="Name">{{ token.name }}</code>
            <code
                v-if="token.value"
                class="Value">{{ token.value }}</code>
            <span
                v-if="token.note"
                class="Note">{{ token.note }}</span>
        </div>
    </div>
</template>

<script>
/**
 * Lists tokens with a live preview of each one, resolved where it renders.
 */
export default {

    props: {
        tokens: { type: Array, required: true },
        preview: {
            type: String,
            default: 'color',
            validator: value => ['color', 'length', 'radius', 'shadow', 'text', 'none'].includes(value),
        },
    },

    methods: {

        previewStyle(name) {
            switch (this.preview) {
                case 'color':
                    return { background: `var(${name})` };
                case 'length':
                    return { width: `var(${name})` };
                case 'radius':
                    return { borderRadius: `var(${name})` };
                case 'shadow':
                    return { boxShadow: `0 6px 16px var(${name})` };
                case 'text':
                    return { color: `var(${name})` };
                default:
                    return {};
            }
        },

    },

};
</script>

<style scoped>
.TokenTable {
    display: flex;
    flex-flow: column;
    margin: var(--sp3) 0;
    border-top: 1px solid var(--border-base);
}

.Row {
    display: grid;
    grid-template-columns: var(--sp5) minmax(180px, auto) 1fr;
    align-items: center;
    gap: var(--sp0-5) var(--sp2);
    padding: var(--sp1) 0;
    border-bottom: 1px solid var(--border-base);
    font-size: var(--font-size-s);
}

.Preview {
    grid-row: span 2;
    width: var(--sp4);
    height: var(--sp4);
}

.Preview-color {
    border-radius: var(--radius-m);
    box-shadow: 0 0 0 1px var(--border-base) inset;
}

.Preview-length {
    height: var(--sp1);
    max-width: var(--sp5);
    border-radius: var(--radius-s);
    background: var(--color-primary-500);
}

.Preview-radius {
    border: 2px solid var(--color-primary-600);
    border-right: 0;
    border-bottom: 0;
}

.Preview-shadow {
    border-radius: var(--radius-m);
    background: var(--surface-base);
}

.Preview-text::before {
    content: 'Aa';
    font: 600 var(--font-size-xl) var(--font-alt);
    line-height: var(--line-height-prose);
}

.Preview-none {
    display: none;
}

.Name {
    font: 500 var(--font-size-xs) var(--font-monospace);
    line-height: var(--line-height-main);
    color: var(--text-base);
}

.Value {
    font: 400 var(--font-size-xs) var(--font-monospace);
    line-height: var(--line-height-main);
    color: var(--text-subtle);
}

.Note {
    grid-column: 2 / -1;
    font-size: var(--font-size-xs);
    color: var(--text-faint);
}
</style>
