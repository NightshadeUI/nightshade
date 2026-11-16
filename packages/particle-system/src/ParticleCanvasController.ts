import { ParticleSystemController } from './ParticleSystemController.js';
import { ParticleCanvasOptions, ParticleLayer } from './types.js';

/**
 * Draws one or more particle systems on one canvas, on one frame loop.
 *
 * The layers' controllers are driven by this loop: it resets them when they are added
 * and ticks them all before drawing a frame, so they must not be mounted elsewhere.
 * The loop runs while any layer is running and the canvas is on screen.
 */
export class ParticleCanvasController {

    private canvas: HTMLCanvasElement | null = null;
    private layers: ParticleLayer[] = [];
    private options: ParticleCanvasOptions = {};
    private frame = 0;
    private ticking = false;
    private visible = true;
    private resizeObserver: ResizeObserver | null = null;
    private intersectionObserver: IntersectionObserver | null = null;

    get isRunning() {
        return this.layers.some(layer => layer.controller.isRunning);
    }

    mount(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
        this.resizeObserver.observe(canvas);
        this.intersectionObserver = new IntersectionObserver(([entry]) => this.setVisible(entry.isIntersecting));
        this.intersectionObserver.observe(canvas);
        for (const layer of this.layers) {
            this.attachController(layer.controller);
        }
        this.resizeCanvas();
    }

    unmount() {
        for (const layer of this.layers) {
            this.detachController(layer.controller);
        }
        this.resizeObserver?.disconnect();
        this.intersectionObserver?.disconnect();
        this.resizeObserver = null;
        this.intersectionObserver = null;
        this.canvas = null;
        cancelAnimationFrame(this.frame);
        this.frame = 0;
    }

    setOptions(options: ParticleCanvasOptions) {
        this.options = { ...options };
        this.resizeCanvas();
    }

    /**
     * Replaces the layers. Controllers that were already on the canvas keep running;
     * new ones are reset, and removed ones are released.
     */
    setLayers(layers: ParticleLayer[]) {
        const previous = new Set(this.layers.map(layer => layer.controller));
        const next = new Set(layers.map(layer => layer.controller));
        this.layers = [...layers];
        if (!this.canvas) {
            return;
        }
        for (const controller of previous) {
            if (!next.has(controller)) {
                this.detachController(controller);
            }
        }
        for (const controller of next) {
            if (!previous.has(controller)) {
                this.attachController(controller);
            }
        }
        this.requestFrame();
    }

    drawFrame() {
        const canvas = this.canvas;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) {
            return;
        }
        const ratio = this.getPixelRatio();
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        this.clearFrame(ctx, canvas);
        for (const layer of this.layers) {
            const particles = layer.controller.particles;
            layer.beforeDraw?.(ctx, particles, canvas);
            for (const particle of particles) {
                layer.draw(ctx, particle, canvas);
            }
            layer.afterDraw?.(ctx, particles, canvas);
        }
    }

    private attachController(controller: ParticleSystemController) {
        controller.started.on(() => this.requestFrame(), this);
        controller.resumed.on(() => this.requestFrame(), this);
        controller.updated.on(() => this.requestFrame(), this);
        controller.reset(controller.config.isPaused);
    }

    private detachController(controller: ParticleSystemController) {
        controller.started.removeAll(this);
        controller.resumed.removeAll(this);
        controller.updated.removeAll(this);
    }

    private setVisible(visible: boolean) {
        this.visible = visible;
        this.requestFrame();
    }

    private requestFrame() {
        if (this.frame || this.ticking || !this.canvas || !this.visible) {
            return;
        }
        this.frame = requestAnimationFrame(time => this.renderFrame(time));
    }

    private renderFrame(time: number) {
        this.frame = 0;
        this.ticking = true;
        for (const layer of this.layers) {
            layer.controller.tick(time);
        }
        this.ticking = false;
        this.drawFrame();
        if (this.isRunning) {
            this.requestFrame();
        }
    }

    private resizeCanvas() {
        const canvas = this.canvas;
        if (!canvas) {
            return;
        }
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
    }

    private clearFrame(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        if (this.options.clear) {
            this.options.clear(ctx, canvas);
            return;
        }
        const ratio = this.getPixelRatio();
        ctx.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);
    }

    private getPixelRatio() {
        return Math.max(1, this.options.pixelRatio ?? window.devicePixelRatio ?? 1);
    }

}
