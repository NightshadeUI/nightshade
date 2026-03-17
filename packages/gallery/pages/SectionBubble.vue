<template>
    <h3 id="bubbles">Bubbles</h3>

    <DualTheme>
        <HGroup
            wrap
            gap="2">
            <div
                v-for="variant of bubbleVariants"
                :key="`${variant.dir}-${variant.align}`"
                class="BubbleCard">
                <span class="Anchor" />
                <Bubble
                    class="BubbleAtAnchor"
                    :dir="variant.dir"
                    :align="variant.align">
                    <div class="Content text-s">
                        {{ variant.dir }} / {{ variant.align }}
                    </div>
                </Bubble>
            </div>
        </HGroup>
    </DualTheme>
</template>

<script>
export default {

    computed: {

        directions() {
            return ['top', 'right', 'bottom', 'left'];
        },

        alignments() {
            return ['start', 'center', 'end'];
        },

        bubbleVariants() {
            return this.directions.flatMap(dir =>
                this.alignments.map(align => ({ dir, align })),
            );
        },

    },

};
</script>

<style scoped>
.BubbleCard {
    position: relative;
    width: 220px;
    min-height: 140px;
    border-radius: var(--border-radius);
    border: 1px dashed var(--color-base-300);
    background: var(--color-base-200);
    overflow: hidden;
}

.Anchor {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--sp1);
    height: var(--sp1);
    border-radius: 999px;
    transform: translate(-50%, -50%);
    background: var(--ui-secondary-text-color);
    opacity: .5;
}

.Content {
    padding: var(--sp);
    white-space: nowrap;
}

.BubbleAtAnchor {
    top: 50%;
    left: 50%;
}
</style>
