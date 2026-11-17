<template>
    <div
        class="Filler"
        :class="[
            `Filler-${resolvedProps.fill}`,
        ]" />
</template>

<script>
import { nightshadeMixin } from '../helpers/props.js';

export default {

    mixins: [nightshadeMixin],

    props: {
        fill: { type: String, default: 'none' },
    }

};
</script>

<style scoped>
.Filler {
    --Filler-border: var(--border-base);

    flex: 1;
    min-width: 0;
    min-height: 0;
}

.Filler-dotted {
    border-bottom: 2px dotted var(--Filler-border);
}

.Filler-dashed {
    border-bottom: 2px dashed var(--Filler-border);
}

.Filler-solid {
    border-bottom: 2px solid var(--Filler-border);
}
</style>
