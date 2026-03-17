<template>
    <h3 id="context-popup">Context Popup</h3>

    <div class="DemoRoot">
        <VGroup>
            <HGroup>
                <Btn
                    ref="anchorButton"
                    label="Open popup"
                    kind="primary"
                    @click="openAtAnchor()" />
            </HGroup>
            <span class="Hint text-s color-subtle">
                Press <kbd>Escape</kbd> or click outside to close the popup.
            </span>
        </VGroup>

        <ContextPopup
            v-if="shown"
            anchorRef="anchorButton"
            @hide="hide()">
            <div class="Content text-s">
                Context popup
            </div>
        </ContextPopup>
    </div>
</template>

<script>
export default {

    data() {
        return {
            shown: false,
        };
    },

    methods: {

        openAtAnchor() {
            this.shown = true;
        },

        hide() {
            this.shown = false;
        },

    },

};
</script>

<style scoped>
.DemoRoot {
    position: relative;
}

.Content {
    padding: var(--sp);
    min-width: 160px;
}
</style>
