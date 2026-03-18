<template>
    <h3 id="base-menu">Base Menu</h3>

    <DualTheme>

        <HGroup
            gap="1"
            align="start"
            wrap>
            <BaseMenu
                v-for="size of ['s', 'm', 'l']"
                :key="size"
                :size="size"
                :items="menuItems"
                :outline="commonOptions.outline"
                :round="commonOptions.round"
                class="MenuWrapper" />
        </HGroup>

    </DualTheme>

</template>

<script>
export default {

    inject: [
        'commonOptions'
    ],

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

};
</script>

<style scoped>
.MenuWrapper {
    background: var(--ui-surface-color);
    border-radius: var(--input-radius);
    border: var(--input-border-size) solid var(--color-base-100);
}
</style>
