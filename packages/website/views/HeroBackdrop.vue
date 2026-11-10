<template>
    <div
        ref="backdrop"
        class="HeroBackdrop"
        aria-hidden="true">
        <ParticleSystem
            class="Emitter Emitter-bottomLeft tone-primary"
            :config="primaryBlobConfig">
            <template #default="{ particle, htmlStyle }">
                <div
                    class="Blob"
                    :style="centered(particle, htmlStyle)" />
            </template>
        </ParticleSystem>
        <ParticleSystem
            class="Emitter Emitter-topRight tone-secondary"
            :config="secondaryBlobConfig">
            <template #default="{ particle, htmlStyle }">
                <div
                    class="Blob"
                    :style="centered(particle, htmlStyle)" />
            </template>
        </ParticleSystem>
        <ParticleSystem
            class="Emitter Emitter-bottomRight tone-primary"
            :config="primarySparkConfig">
            <template #default="{ particle, htmlStyle }">
                <div
                    class="Spark"
                    :style="centered(particle, htmlStyle)" />
            </template>
        </ParticleSystem>
        <ParticleSystem
            class="Emitter Emitter-topLeft tone-secondary"
            :config="secondarySparkConfig">
            <template #default="{ particle, htmlStyle }">
                <div
                    class="Spark"
                    :style="centered(particle, htmlStyle)" />
            </template>
        </ParticleSystem>
    </div>
</template>

<script>
import { ParticleSystem } from '@nightshadeui/particle-system/src';
import { markRaw } from 'vue';

const REPEL_RADIUS = 140;
const REPEL_FORCE = 1600;
const DAMPING = 1.2;
/** Pull toward the center, in px/s². With damping, sparks settle at about 40 px/s. */
const NUDGE_FORCE = 48;
/** Within this distance of the center the pull fades out, so the two clouds almost meet. */
const NUDGE_FALLOFF = 240;

/**
 * The hero's backdrop: primary blobs from the bottom left, secondary from the top right,
 * and small sparks the other way around: primary from the bottom right, secondary from the top left.
 * Sparks drift toward the center and almost meet; the pointer pushes them away, which is the only way the tones mix.
 * Both are drawn with tone roles, so they follow the palette as it changes.
 */
export default {

    components: {
        ParticleSystem,
    },

    data() {
        const isPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return {
            primaryBlobConfig: markRaw(this.createBlobConfig(7, [14, -8], isPaused)),
            secondaryBlobConfig: markRaw(this.createBlobConfig(13, [-14, 8], isPaused)),
            primarySparkConfig: markRaw(this.createSparkConfig(11, [0.85, 0.85], isPaused)),
            secondarySparkConfig: markRaw(this.createSparkConfig(17, [0.15, 0.15], isPaused)),
        };
    },

    created() {
        this.pointer = null;
        this.bounds = [0, 0];
    },

    mounted() {
        this.resizeObserver = new ResizeObserver(([entry]) => {
            this.bounds = [entry.contentRect.width, entry.contentRect.height];
        });
        this.resizeObserver.observe(this.$refs.backdrop);
        window.addEventListener('pointermove', this.onPointerMove);
    },

    beforeUnmount() {
        this.resizeObserver.disconnect();
        window.removeEventListener('pointermove', this.onPointerMove);
    },

    methods: {

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

        centered(particle, htmlStyle) {
            const offset = `${-0.5 * Math.max(0, particle.size)}px`;
            return {
                ...htmlStyle,
                marginLeft: offset,
                marginTop: offset,
            };
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
    --HeroBackdrop-glow-secondary: color-mix(in oklab, var(--color-secondary-500), transparent 86%);
    background:
        radial-gradient(ellipse at 0% 100%, var(--HeroBackdrop-glow-primary), transparent 55%),
        radial-gradient(ellipse at 100% 0%, var(--HeroBackdrop-glow-secondary), transparent 55%);
}

.Emitter {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
}

.Emitter-bottomLeft {
    top: 88%;
    left: 12%;
}

.Emitter-topRight {
    top: 12%;
    left: 88%;
}

.Emitter-topLeft {
    top: 15%;
    left: 15%;
}

.Emitter-bottomRight {
    top: 85%;
    left: 85%;
}

.Blob {
    border-radius: 50%;
    background: radial-gradient(closest-side, var(--tone-fill), transparent);
}

.Spark {
    border-radius: 50%;
    background: var(--tone-fill);
}
</style>
