<template>
    <canvas
        ref="canvas"
        class="ParticleCanvas"
        :style="canvasStyle" />
</template>

<script>
import { ParticleSystemController } from '../ParticleSystemController.js';

export default {

    props: {
        controller: { type: Object },
        config: { type: Object },
        draw: { type: Function, required: true },
        clear: { type: Function },
        beforeDraw: { type: Function },
        afterDraw: { type: Function },
        pixelRatio: { type: Number },
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
        'drawFrame',
        'isRunning',
        'isPaused',
    ],

    data() {
        return {
            localController: null,
            resizeObserver: null,
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

        canvasStyle() {
            return {
                display: 'block',
                width: '100%',
                height: '100%',
            };
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
            this.drawFrame();
        },
    },

    created() {
        this.localController = new ParticleSystemController(this.config ?? {});
    },

    mounted() {
        this.mountCanvas();
        this.mountController(this.particleController);
    },

    beforeUnmount() {
        this.unmountController(this.particleController);
        this.unmountCanvas();
    },

    methods: {

        mountCanvas() {
            this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
            this.resizeObserver.observe(this.$refs.canvas);
            this.resizeCanvas();
        },

        unmountCanvas() {
            this.resizeObserver?.disconnect();
            this.resizeObserver = null;
        },

        mountController(controller) {
            if (this.config != null) {
                controller.setConfig(this.config);
            }
            controller.started.on(() => this.$emit('started'), this);
            controller.paused.on(() => this.$emit('paused'), this);
            controller.resumed.on(() => this.$emit('resumed'), this);
            controller.finished.on(() => this.$emit('finished'), this);
            controller.updated.on(() => this.drawFrame(), this);
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
            controller.updated.removeAll(this);
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

        resizeCanvas() {
            const canvas = this.$refs.canvas;
            const rect = canvas.getBoundingClientRect();
            const ratio = this.getPixelRatio();
            const width = Math.max(1, Math.round(rect.width * ratio));
            const height = Math.max(1, Math.round(rect.height * ratio));
            if (canvas.width !== width) {
                canvas.width = width;
            }
            if (canvas.height !== height) {
                canvas.height = height;
            }
            this.drawFrame();
        },

        drawFrame() {
            const canvas = this.$refs.canvas;
            if (!canvas) {
                return;
            }
            const ctx = canvas.getContext('2d');
            const particles = this.particleController.particles;
            if (!ctx) {
                return;
            }
            const ratio = this.getPixelRatio();
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            this.clearFrame(ctx, canvas);
            this.beforeDraw?.(ctx, particles, canvas);
            for (const particle of particles) {
                this.draw(ctx, particle, canvas);
            }
            this.afterDraw?.(ctx, particles, canvas);
        },

        clearFrame(ctx, canvas) {
            if (this.clear) {
                this.clear(ctx, canvas);
                return;
            }
            const ratio = this.getPixelRatio();
            ctx.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);
        },

        getPixelRatio() {
            return Math.max(1, this.pixelRatio ?? window.devicePixelRatio ?? 1);
        },
    },

};
</script>
