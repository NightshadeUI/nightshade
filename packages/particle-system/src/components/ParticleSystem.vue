<template>
    <div class="ParticleSystem">
        <div
            v-for="particle in particleController.particles"
            :key="particle.id"
            class="Particle"
            :style="getParticleStyle(particle)">
            <slot :particle="particle" />
        </div>
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
                '--particle-t': particle.t,
                '--particle-position-x': particle.position[0],
                '--particle-position-y': particle.position[1],
                '--particle-rotation': particle.rotation,
                '--particle-velocity-x': particle.effectiveVelocity[0],
                '--particle-velocity-y': particle.effectiveVelocity[1],
                '--particle-scale-x': particle.scale[0],
                '--particle-scale-y': particle.scale[1],
                '--particle-lifetime': particle.lifetime,
                '--particle-age': particle.age,
                '--particle-size': size,
                '--particle-opacity': particle.opacity,
                'transform': `translate(${particle.position[0]}px, ${particle.position[1]}px) rotate(${particle.rotation}deg) scale(${particle.scale[0]}, ${particle.scale[1]})`,
                'width': `${size}px`,
                'height': `${size}px`,
                'opacity': particle.opacity,
            };
        },
    },

};
</script>

<style scoped>
.ParticleSystem {
    position: relative;
    pointer-events: none;
}

.Particle {
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    place-items: center;
    transform-origin: center;
    will-change: transform, opacity;
}

.Particle:deep(> *) {
    width: 100%;
    height: 100%;
}
</style>
