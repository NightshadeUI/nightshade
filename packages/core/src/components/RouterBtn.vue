<template>
    <RouterLink
        v-slot="{ href, navigate, isActive, isExactActive }"
        :to="resolvedProps.to"
        custom>
        <Btn
            tagName="a"
            :href="href"
            v-bind="actualProps(isActive, isExactActive)"
            @click="navigate" />
    </RouterLink>
</template>

<script>
import {
    collectProps,
    nightshadeMixin,
} from '../utils/props';
import Btn from './Btn.vue';

export default {

    components: {
        Btn,
    },

    mixins: [nightshadeMixin],

    props: {
        ...Btn.props,
        to: { required: true },
        baseProps: { type: Object },
        activeProps: { type: Object },
        exactActiveProps: { type: Object },
    },

    methods: {

        actualProps(isActive, isExactActive) {
            const btnProps = collectProps(this, Btn);
            return {
                ...btnProps,
                ...this.resolvedProps.baseProps,
                ...(isActive ? this.resolvedProps.activeProps : {}),
                ...(isExactActive ? this.resolvedProps.exactActiveProps : {}),
            };
        }

    }

};
</script>
