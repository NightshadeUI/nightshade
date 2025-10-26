<template>
    <div class="Root">
        <h2><strong>Variables</strong></h2>
        <SectionColors />
        <h2><strong>Components</strong></h2>
        <SectionBtn />
    </div>
</template>

<script>

import SectionBtn from './SectionBtn.vue';
import SectionColors from './SectionColors.vue';

export default {

    components: {
        SectionColors,
        SectionBtn,
    },

};
</script>

<style scoped>
h2 {
    padding: 0 var(--sp2);
}
</style>
