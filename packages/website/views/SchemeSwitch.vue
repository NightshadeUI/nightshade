<template>
    <Btn
        :icon="current.icon"
        :title="`Color scheme: ${current.label}`"
        square
        ghost
        :outline="false"
        @click="appearanceManager.setScheme(current.next)" />
</template>

<script>
const schemes = {
    auto: {
        label: 'auto',
        icon: 'fas fa-circle-half-stroke',
        next: 'light',
    },
    light: {
        label: 'light',
        icon: 'fas fa-sun',
        next: 'dark',
    },
    dark: {
        label: 'dark',
        icon: 'fas fa-moon',
        next: 'auto',
    },
};

export default {

    inject: [
        'appearanceManager',
    ],

    computed: {

        current() {
            return schemes[this.appearanceManager.scheme];
        },

    },

};
</script>
