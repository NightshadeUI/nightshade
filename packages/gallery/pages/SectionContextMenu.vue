<template>
    <h3 id="context-menu">Context Menu</h3>

    <div class="DemoRoot">
        <VGroup>
            <HGroup>
                <Btn
                    ref="anchorButton"
                    label="Open context menu"
                    kind="primary"
                    @click="openAtAnchor()" />
            </HGroup>
            <span class="Hint text-s color-subtle">
                Press <kbd>Escape</kbd>, click outside, or select an item to close the menu.
            </span>
        </VGroup>

        <ContextMenu
            v-if="shown"
            anchorRef="anchorButton"
            :items="menuItems"
            @hide="hide()"
            @activate="onActivate" />
    </div>
</template>

<script>
export default {

    data() {
        return {
            shown: false,
        };
    },

    computed: {
        menuItems() {
            return [
                { type: 'header', title: 'Actions' },
                { icon: 'fas fa-file', title: 'New File', subtitle: 'Create a new file' },
                { icon: 'fas fa-folder-open', title: 'Open...' },
                { type: 'separator' },
                { icon: 'fas fa-save', title: 'Save', checked: true },
                { icon: 'fas fa-save', title: 'Save As...', disabled: true },
                { type: 'header', title: 'Preferences' },
                { icon: 'fas fa-cog', title: 'Settings', kind: 'primary', ghost: false },
                { icon: 'fas fa-sign-out-alt', title: 'Logout', kind: 'danger' },
            ];
        },
    },

    methods: {

        openAtAnchor() {
            this.shown = true;
        },

        hide() {
            this.shown = false;
        },

        onActivate() {
            this.hide();
        }

    },

};
</script>
