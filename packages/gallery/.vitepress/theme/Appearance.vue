<template>
    <VGroup class="Appearance">
        <h4>Appearance</h4>
        <HGroup tagName="label"
            justify="space-between">
            <div>Round</div>
            <Toggle v-model="commonOptions.round"
                round
                size="small"
                kind="primary" />
        </HGroup>
        <HGroup tagName="label"
            justify="space-between">
            <div>Flat</div>
            <Toggle v-model="commonOptions.flat"
                flat
                size="small"
                kind="primary" />
        </HGroup>
        <HGroup tagName="label"
            justify="space-between">
            <div>Outline</div>
            <Toggle v-model="commonOptions.outline"
                outline
                size="small"
                kind="primary" />
        </HGroup>
        <hr />
        <HGroup tagName="label"
            justify="space-between">
            <div>Disabled</div>
            <Toggle v-model="commonOptions.disabled"
                size="small"
                kind="tertiary" />
        </HGroup>
        <HGroup tagName="label"
            justify="space-between">
            <div>Focus</div>
            <Toggle v-model="commonOptions.forceFocus"
                size="small"
                kind="secondary" />
        </HGroup>
        <HGroup tagName="label"
            justify="space-between">
            <div>Hover</div>
            <Toggle v-model="commonOptions.forceHover"
                size="small"
                kind="secondary" />
        </HGroup>
        <HGroup tagName="label"
            justify="space-between">
            <div>Active</div>
            <Toggle v-model="commonOptions.forceActive"
                size="small"
                kind="secondary" />
        </HGroup>
    </VGroup>
</template>

<script>
export default {

    inject: [
        'commonOptions'
    ],

};
</script>

<style scoped>
.Appearance {
    margin: var(--sp2) 0;
    padding: var(--sp2);
    border-radius: var(--border-radius-m);
    background: var(--color-base-50);
    border: 1px solid var(--color-base-100);
}

h4 {
    margin: 0;
}
</style>