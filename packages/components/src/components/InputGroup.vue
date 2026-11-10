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

.InputGroup:deep(> .InputElement:not(:first-child)) {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
}

.InputGroup:deep(> .InputElement:not(:last-child)) {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
}
</style>
