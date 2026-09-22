<template>
    <h3 id="input-group">Input Group</h3>

    <DualTheme>
        <h4>Segments</h4>

        <InputGroup>
            <Btn
                v-for="option of options"
                :key="option"
                :label="capitalize(option)"
                :kind="selected === option ? 'primary' : 'base'"
                @click="selected = option" />
        </InputGroup>

        <h4>Icons</h4>

        <InputGroup>
            <Btn
                v-for="icon of icons"
                :key="icon"
                square
                :icon="icon"
                :kind="selectedIcon === icon ? 'primary' : 'base'"
                @click="selectedIcon = icon" />
        </InputGroup>

        <h4>Sizes</h4>

        <VGroup>
            <InputGroup
                v-for="size of inputSizes"
                :key="size">
                <Btn
                    v-for="option of options"
                    :key="option"
                    :label="capitalize(option)"
                    :size="size"
                    :kind="selected === option ? 'primary' : 'base'"
                    @click="selected = option" />
            </InputGroup>
        </VGroup>
    </DualTheme>
</template>

<script>
import { capitalize } from '../utils/capitalize.js';
import { inputSizes } from '../utils/commons.js';

export default {

    data() {
        return {
            selected: 'center',
            selectedIcon: 'fas fa-italic',
        };
    },

    computed: {

        options() {
            return ['left', 'center', 'right'];
        },

        icons() {
            return [
                'fas fa-bold',
                'fas fa-italic',
                'fas fa-underline',
            ];
        },

        inputSizes() {
            return inputSizes;
        },

    },

    methods: {
        capitalize,
    },

};
</script>
