<template>
    <div
        v-if="canvas.boxSelect.isSelecting()"
        class="CanvasBoxSelect tone-primary">
        <div
            class="Box"
            :style="canvas.boxSelect.getSelectionStyle()" />
    </div>
</template>

<script>
export default {

    props: {
        canvas: { type: Object, required: true },
    },

};
</script>

<style scoped>
.CanvasBoxSelect {
    --CanvasBoxSelect-fill: var(--canvas-box-select-color, var(--tone-fill));
    --CanvasBoxSelect-opacity: var(--canvas-box-select-opacity, 0.1);

    position: absolute;
    inset: 0;
    z-index: 20;
    pointer-events: none;
}

.Box {
    position: absolute;
    border: 1px solid var(--CanvasBoxSelect-fill);
}

.Box::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--CanvasBoxSelect-fill);
    opacity: var(--CanvasBoxSelect-opacity);
}
</style>
