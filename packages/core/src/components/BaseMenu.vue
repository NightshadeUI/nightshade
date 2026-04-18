<template>
    <VGroup
        class="BaseMenu"
        :class="[
            `input-size-${resolvedProps.size}`,
        ]"
        @keydown="onKeyDown">
        <template
            v-for="(item, i) of items"
            :key="i">

            <div
                v-if="getItemType(item) === 'header'"
                class="Header">
                {{ item.title }}
            </div>

            <div
                v-if="getItemType(item) === 'separator'"
                class="Separator" />

            <Btn
                v-if="getItemType(item) === 'normal'"
                class="Item"
                :class="{
                    'Item-checked': item.checked,
                }"
                :kind="item.kind || 'base'"
                :size="resolvedProps.size"
                :round="resolvedProps.round"
                :flat="true"
                :ghost="item.ghost ?? true"
                :outline="item.outline"
                :disabled="item.disabled"
                :icon="item.icon"
                @click="onItemClick(item, $event)">

                <template #label>
                    <div class="Title">
                        {{ item.title }}
                    </div>
                </template>

                <template #after>
                    <span
                        v-if="item.checked"
                        class="CheckIcon">
                        ✓
                    </span>
                </template>
            </Btn>

        </template>
    </VGroup>
</template>

<script>
import {
    nightshadeMixin,
} from '../utils/props';
import Btn from './Btn.vue';
import VGroup from './VGroup.vue';

export default {

    components: {
        Btn,
        VGroup,
    },

    mixins: [nightshadeMixin],

    props: {
        items: { type: Array, default: () => [] },
        size: { type: String, default: 'm' },
        round: { type: Boolean, default: false },
        autoFocus: { type: Boolean, default: false },
    },

    emits: [
        'activate',
    ],

    mounted() {
        if (this.resolvedProps.autoFocus) {
            this.$nextTick(() => {
                const first = this.getFocusableEls()[0];
                if (first) {
                    first.focus();
                }
            });
        }
    },

    methods: {

        getItemType(item) {
            return item.type || 'normal';
        },

        getFocusableEls() {
            return Array.from(this.$el.querySelectorAll('.Item:not(:disabled)'));
        },

        onKeyDown(ev) {
            if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
                ev.preventDefault();
                const focusableEls = this.getFocusableEls();
                if (!focusableEls.length) {
                    return;
                }
                const activeElement = document.activeElement;
                let activeIndex = focusableEls.findIndex(el => el === activeElement || el.contains(activeElement));
                if (ev.key === 'ArrowDown') {
                    activeIndex = (activeIndex + 1) % focusableEls.length;
                } else {
                    activeIndex = (activeIndex + focusableEls.length - 1) % focusableEls.length;
                }
                focusableEls[activeIndex]?.focus();
            }
        },

        onItemClick(item, ev) {
            if (item.disabled) {
                return;
            }
            if (typeof item.activate === 'function') {
                item.activate();
            }
            this.$emit('activate', item, ev);
        }

    }

};
</script>

<style scoped>
.BaseMenu {
    --BaseMenu-padding: var(--input-minor-padding) var(--input-major-padding);
    --BaseMenu-gap: var(--sp0-5);
    --BaseMenu-min-width: 192px;

    padding: var(--BaseMenu-padding);
    gap: var(--BaseMenu-gap);
    min-width: var(--BaseMenu-min-width);
}

.Header {
    padding: var(--sp) var(--input-major-padding) 0;
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    opacity: 0.5;
    user-select: none;
}

.Separator {
    height: var(--input-border-size);
    background: var(--color-base-100);
}

.Title {
    flex: 1;
    align-self: flex-start;
    text-align: left;
}

.Item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
