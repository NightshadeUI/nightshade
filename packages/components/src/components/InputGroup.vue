<template>
    <component
        :is="resolvedProps.tagName"
        class="InputGroup">
        <slot />
    </component>
</template>

<script>
import { nightshadeMixin } from '../helpers/props.js';

export default {

    mixins: [nightshadeMixin],

    props: {
        tagName: { type: String, default: 'div' },
    }

};
</script>

<style scoped>
.InputGroup {
    display: flex;
    flex-flow: row nowrap;
    align-items: end;
    gap: var(--input-border-size);
}

/* Joined edges: a control's own frame, or the frame inside a wrapper (`InputText` frames its field in `.InputBase`) */
.InputGroup:deep(> .InputElement:not(:first-child)),
.InputGroup:deep(> :not(:first-child) > .InputElement) {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
}

.InputGroup:deep(> .InputElement:not(:last-child)),
.InputGroup:deep(> :not(:last-child) > .InputElement) {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
}
</style>
