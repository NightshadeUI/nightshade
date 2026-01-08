<template>
    <RouterLink
        v-slot="{ href, navigate, isActive, isExactActive }"
        :to="to"
        custom>
        <Btn
            tagName="a"
            :href="href"
            v-bind="actualProps(isActive, isExactActive)"
            @click="navigate" />
    </RouterLink>
</template>

<script>
import Btn from './Btn.vue';

export default {

    components: {
        Btn,
    },

    props: {
        ...Btn.props,
        to: { required: true },
        baseProps: { type: Object },
        activeProps: { type: Object },
        exactActiveProps: { type: Object },
    },

    methods: {

        actualProps(isActive, isExactActive) {
            return {
                ...this.$props,
                ...this.baseProps,
                ...(isActive ? this.activeProps : {}),
                ...(isExactActive ? this.exactActiveProps : {}),
            };
        }

    }

};
</script>
