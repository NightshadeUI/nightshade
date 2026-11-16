<template>
    <div
        ref="backdrop"
        class="HeroBackdrop"
        aria-hidden="true">
        <span
            ref="primary"
            class="Swatch tone-primary" />
        <span
            ref="secondary"
            class="Swatch Swatch-secondary" />
        <ParticleCanvas
            ref="particles"
            :layers="layers" />
    </div>
</template>

<script>
import { ParticleCanvas, ParticleSystemController } from '@nightshadeui/particle-system/src';
import { markRaw } from 'vue';

const REPEL_RADIUS = 140;
const REPEL_FORCE = 1600;
const DAMPING = 1.2;
/** Pull toward the center, in px/s². With damping, sparks settle at about 40 px/s. */
const NUDGE_FORCE = 48;
/** Within this distance of the center the pull fades out, so the two clouds almost meet. */
const NUDGE_FALLOFF = 240;
/** Sprites in px: blobs are soft discs that scale up well, sparks are solid ones drawn much smaller. */
const BLOB_SPRITE = {
    size: 256,
    soft: true,
};
const SPARK_SPRITE = {
    size: 32,
    soft: false,
};

/**
 * A hero's backdrop: primary blobs from the bottom left, secondary from the top right,
 * and small sparks the other way around: primary from the bottom right, secondary from the top left.
 * Sparks drift toward the center and almost meet; the pointer pushes them away, which is the only way the tones mix.
 * All four systems share one canvas and one frame loop. Each draws a sprite painted in its tone's `--tone-fill`,
 * read from a swatch every frame, so the particles follow the palette and the color scheme as they change.
 */
export default {

    components: {
        ParticleCanvas,
    },

    data() {
        return {
            layers: markRaw(this.createLayers()),
        };
    },

    created() {
        this.pointer = null;
        this.bounds = [0, 0];
    },

    mounted() {
        this.resizeObserver = new ResizeObserver(([entry]) => {
            this.bounds = [entry.contentRect.width, entry.contentRect.height];
            this.$refs.particles.drawFrame();
        });
        this.resizeObserver.observe(this.$refs.backdrop);
        window.addEventListener('pointermove', this.onPointerMove);
    },

    beforeUnmount() {
        this.resizeObserver.disconnect();
        window.removeEventListener('pointermove', this.onPointerMove);
    },

    methods: {

        /** Blobs first, then sparks on top. Anchors are emitter origins as fractions of the backdrop. */
        createLayers() {
            const isPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const primaryBlobs = this.createBlobConfig(7, [14, -8], isPaused);
            const secondaryBlobs = this.createBlobConfig(13, [-14, 8], isPaused);
            const primarySparks = this.createSparkConfig(11, [0.85, 0.85], isPaused);
            const secondarySparks = this.createSparkConfig(17, [0.15, 0.15], isPaused);
            return [
                this.createLayer('primary', BLOB_SPRITE, [0.12, 0.88], primaryBlobs),
                this.createLayer('secondary', BLOB_SPRITE, [0.88, 0.12], secondaryBlobs),
                this.createLayer('primary', SPARK_SPRITE, [0.85, 0.85], primarySparks),
                this.createLayer('secondary', SPARK_SPRITE, [0.15, 0.15], secondarySparks),
            ];
        },

        createLayer(tone, shape, anchor, config) {
            const sprite = {
                tone,
                soft: shape.soft,
                color: '',
                image: document.createElement('canvas'),
            };
            sprite.image.width = shape.size;
            sprite.image.height = shape.size;
            return {
                controller: new ParticleSystemController(config),
                beforeDraw: () => this.paintSprite(sprite),
                draw: (ctx, particle) => this.drawParticle(ctx, particle, sprite.image, anchor),
            };
        },

        /** Blobs of one tone, drifting from a corner toward the center and fading out before they get there. */
        createBlobConfig(seed, velocity, isPaused) {
            return {
                seed,
                isPaused,
                startCount: 4,
                rateOverTime: 0.18,
                lifetime: [22, 32],
                shape: [220, 140],
                size: [320, 520],
                linearVelocity: [velocity, velocity.map(v => v * 1.4)],
                turbulence: 8,
                noiseScale: 0.002,
                update: particle => this.fade(particle, 0.28),
            };
        },

        /**
         * Sparks of one tone, from a corner. `anchor` is the emitter's origin as a fraction of the backdrop,
         * so the center and the pointer can be found from it.
         */
        createSparkConfig(seed, anchor, isPaused) {
            return {
                seed,
                isPaused,
                startCount: 192,
                rateOverTime: 24,
                lifetime: [8, 16],
                shape: [280, 200],
                size: [3, 7],
                linearVelocity: [[-8, -8], [8, 8]],
                turbulence: 36,
                noiseScale: 0.004,
                update: (particle, dt) => {
                    this.damp(particle, dt);
                    this.nudge(particle, dt, anchor);
                    this.repel(particle, dt, anchor);
                    this.fade(particle, 0.3 + particle.index % 4 * 0.1);
                },
            };
        },

        /**
         * Repaints a sprite when its tone's fill changes: a white disc (soft-edged for blobs) recolored in place,
         * so any color the browser resolves works.
         */
        paintSprite(sprite) {
            const color = getComputedStyle(this.$refs[sprite.tone]).color;
            if (color === sprite.color) {
                return;
            }
            sprite.color = color;
            const size = sprite.image.width;
            const radius = size / 2;
            const ctx = sprite.image.getContext('2d');
            ctx.globalCompositeOperation = 'source-over';
            ctx.clearRect(0, 0, size, size);
            if (sprite.soft) {
                const gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
                gradient.addColorStop(0, 'rgb(255 255 255 / 1)');
                gradient.addColorStop(1, 'rgb(255 255 255 / 0)');
                ctx.fillStyle = gradient;
            } else {
                ctx.fillStyle = 'rgb(255 255 255)';
            }
            ctx.beginPath();
            ctx.arc(radius, radius, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = 'source-in';
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, size, size);
        },

        drawParticle(ctx, particle, image, anchor) {
            const size = Math.max(0, particle.size);
            const x = anchor[0] * this.bounds[0] + particle.position[0];
            const y = anchor[1] * this.bounds[1] + particle.position[1];
            ctx.globalAlpha = Math.min(1, Math.max(0, particle.opacity));
            ctx.drawImage(image, x - size / 2, y - size / 2, size, size);
        },

        fade(particle, peak) {
            particle.opacity = Math.sin(Math.PI * particle.t) * peak;
        },

        damp(particle, dt) {
            const damping = 1 - DAMPING * dt;
            particle.velocity[0] *= damping;
            particle.velocity[1] *= damping;
        },

        nudge(particle, dt, anchor) {
            const [width, height] = this.bounds;
            const dx = (0.5 - anchor[0]) * width - particle.position[0];
            const dy = (0.5 - anchor[1]) * height - particle.position[1];
            const distance = Math.max(1, Math.hypot(dx, dy));
            const force = Math.min(1, distance / NUDGE_FALLOFF) * NUDGE_FORCE * dt / distance;
            particle.velocity[0] += dx * force;
            particle.velocity[1] += dy * force;
        },

        repel(particle, dt, anchor) {
            if (!this.pointer) {
                return;
            }
            const [width, height] = this.bounds;
            const dx = particle.position[0] - (this.pointer[0] - anchor[0] * width);
            const dy = particle.position[1] - (this.pointer[1] - anchor[1] * height);
            const distance = Math.hypot(dx, dy);
            if (distance >= REPEL_RADIUS) {
                return;
            }
            const force = (1 - distance / REPEL_RADIUS) * REPEL_FORCE * dt / Math.max(1, distance);
            particle.velocity[0] += dx * force;
            particle.velocity[1] += dy * force;
        },

        onPointerMove(ev) {
            const rect = this.$refs.backdrop.getBoundingClientRect();
            const inside = ev.clientY >= rect.top && ev.clientY <= rect.bottom;
            this.pointer = inside ? [ev.clientX - rect.left, ev.clientY - rect.top] : null;
        },

    },

};
</script>

<style scoped>
.HeroBackdrop {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
    --HeroBackdrop-glow-primary: color-mix(in oklab, var(--color-primary-500), transparent 82%);
    --HeroBackdrop-secondary: var(--color-secondary-500, var(--color-primary-500));
    --HeroBackdrop-glow-secondary: color-mix(in oklab, var(--HeroBackdrop-secondary), transparent 86%);
    background:
        radial-gradient(ellipse at 0% 100%, var(--HeroBackdrop-glow-primary), transparent 55%),
        radial-gradient(ellipse at 100% 0%, var(--HeroBackdrop-glow-secondary), transparent 55%);
}

.Swatch {
    position: absolute;
    color: var(--tone-fill);
}

.Swatch-secondary {
    color: var(--HeroBackdrop-secondary);
}
</style>
