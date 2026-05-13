<template>
    <div class="ParticleSystem">
        <template
            v-for="particle in particleController.particles"
            :key="particle.index">
            <slot
                :particle="particle"
                :style="getParticleStyle(particle)" />
        </template>
    </div>
</template>

<script>
import { ParticleSystemController } from '../ParticleSystemController.js';

export default {

    props: {
        controller: { type: Object },
        config: { type: Object },
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
            eventCleanups: [],
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
            previousController?.unmount();
            this.unmountController();
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
        this.unmountController();
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

        unmountController() {
            if (!this.particleController) {
                return;
            }
            this.particleController.started.removeAll(this);
            this.particleController.paused.removeAll(this);
            this.particleController.resumed.removeAll(this);
            this.particleController.finished.removeAll(this);
            this.particleController.unmount();
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

        getParticleStyle(particle) {
            const size = Math.max(0, particle.size);
            return {
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'width': `${size}px`,
                'height': `${size}px`,
                'opacity': particle.opacity,
                'transform': `translate(${particle.position[0]}px, ${particle.position[1]}px) rotate(${particle.rotation}deg) scale(${particle.scale[0]}, ${particle.scale[1]})`,
                'transform-origin': 'center',
                'will-change': 'transform, opacity',
            };
        },
    },

};
</script>

<style scoped>
.ParticleSystem {
    position: relative;
}
</style>
