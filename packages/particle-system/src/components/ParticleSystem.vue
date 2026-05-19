<template>
    <component
        :is="tagName"
        class="ParticleSystem"
        :style="{ position: 'relative' }">
        <template
            v-for="particle in particleController.particles"
            :key="particle.index">
            <slot
                :particle="particle"
                :htmlStyle="getHtmlStyle(particle)"
                :svgStyle="getSvgStyle(particle)" />
        </template>
    </component>
</template>

<script>
import { ParticleSystemController } from '../ParticleSystemController.js';

export default {

    props: {
        controller: { type: Object },
        config: { type: Object },
        tagName: { type: String, default: 'div' },
    },

    emits: [
        'started',
        'paused',
        'resumed',
        'finished',
    ],

    expose: [
        'reset',
        'pause',
        'resume',
        'stop',
        'isRunning',
        'isPaused',
    ],

    data() {
        return {
            localController: null,
        };
    },

    computed: {
        particleController() {
            return this.controller ?? this.localController;
        },

        isRunning() {
            return this.particleController.isRunning;
        },

        isPaused() {
            return this.particleController.isPaused;
        },

    },

    watch: {
        config: {
            deep: true,
            handler(config) {
                if (config != null) {
                    this.particleController?.setConfig(config);
                }
            },
        },
        controller(controller, previousController) {
            this.unmountController(previousController ?? this.localController);
            this.mountController(controller ?? this.localController);
        },
    },

    created() {
        this.localController = new ParticleSystemController(this.config ?? {});
    },

    mounted() {
        this.mountController(this.particleController);
    },

    beforeUnmount() {
        this.unmountController(this.particleController);
    },

    methods: {

        mountController(controller) {
            if (this.config != null) {
                controller.setConfig(this.config);
            }
            controller.started.on(() => this.$emit('started'), this);
            controller.paused.on(() => this.$emit('paused'), this);
            controller.resumed.on(() => this.$emit('resumed'), this);
            controller.finished.on(() => this.$emit('finished'), this);
            controller.mount();
        },

        unmountController(controller) {
            if (!controller) {
                return;
            }
            controller.started.removeAll(this);
            controller.paused.removeAll(this);
            controller.resumed.removeAll(this);
            controller.finished.removeAll(this);
            controller.unmount();
        },

        reset() {
            this.particleController.reset();
        },

        pause() {
            this.particleController.pause();
        },

        resume() {
            this.particleController.resume();
        },

        stop() {
            this.particleController.stop();
        },

        getHtmlStyle(particle) {
            const size = Math.max(0, particle.size);
            return {
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${size}px`,
                height: `${size}px`,
                opacity: particle.opacity,
                transform: this.getTransform(particle),
                'transform-origin': 'center',
                'will-change': 'transform, opacity',
            };
        },

        getSvgStyle(particle) {
            return {
                opacity: particle.opacity,
                transform: this.getTransform(particle),
                'transform-origin': 'center',
                'transform-box': 'fill-box',
                'will-change': 'transform, opacity',
            };
        },

        getTransform(particle) {
            return `translate(${particle.position[0]}px, ${particle.position[1]}px) rotate(${particle.rotation}deg) scale(${particle.scale[0]}, ${particle.scale[1]})`;
        },
    },

};
</script>
