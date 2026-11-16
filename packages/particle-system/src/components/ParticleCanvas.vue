<template>
    <canvas
        ref="canvas"
        class="ParticleCanvas"
        :style="canvasStyle" />
</template>

<script>
import { markRaw } from 'vue';

import { ParticleCanvasController } from '../ParticleCanvasController.js';
import { ParticleSystemController } from '../ParticleSystemController.js';

/**
 * Draws particle systems on one canvas, on one frame loop.
 * `controller`, `config`, `draw`, `beforeDraw` and `afterDraw` describe a single layer;
 * `layers` stacks several systems instead, each with its own controller and draw functions.
 */
export default {

    props: {
        controller: { type: Object },
        config: { type: Object },
        draw: { type: Function },
        beforeDraw: { type: Function },
        afterDraw: { type: Function },
        layers: { type: Array },
        clear: { type: Function },
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
            canvasController: markRaw(new ParticleCanvasController()),
        };
    },

    computed: {
        particleController() {
            return this.controller ?? this.localController;
        },

        effectiveLayers() {
            if (this.layers) {
                return this.layers;
            }
            return [{
                controller: this.particleController,
                draw: this.draw,
                beforeDraw: this.beforeDraw,
                afterDraw: this.afterDraw,
            }];
        },

        canvasOptions() {
            return {
                clear: this.clear,
                pixelRatio: this.pixelRatio,
            };
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
                    this.particleController.setConfig(config);
                }
            },
        },
        controller(controller, previousController) {
            this.unlistenController(previousController ?? this.localController);
            this.listenController(controller ?? this.localController);
        },
        effectiveLayers(layers) {
            this.canvasController.setLayers(layers);
        },
        canvasOptions(options) {
            this.canvasController.setOptions(options);
        },
    },

    created() {
        this.localController = markRaw(new ParticleSystemController(this.config ?? {}));
    },

    mounted() {
        this.listenController(this.particleController);
        this.canvasController.setOptions(this.canvasOptions);
        this.canvasController.setLayers(this.effectiveLayers);
        this.canvasController.mount(this.$refs.canvas);
    },

    beforeUnmount() {
        this.unlistenController(this.particleController);
        this.canvasController.unmount();
    },

    methods: {

        listenController(controller) {
            if (this.config != null) {
                controller.setConfig(this.config);
            }
            controller.started.on(() => this.$emit('started'), this);
            controller.paused.on(() => this.$emit('paused'), this);
            controller.resumed.on(() => this.$emit('resumed'), this);
            controller.finished.on(() => this.$emit('finished'), this);
        },

        unlistenController(controller) {
            controller.started.removeAll(this);
            controller.paused.removeAll(this);
            controller.resumed.removeAll(this);
            controller.finished.removeAll(this);
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

        drawFrame() {
            this.canvasController.drawFrame();
        },
    },

};
</script>
