import { Event } from 'nanoevent';
import { reactive } from 'vue';

import {
    createNoise,
    createParticle,
    createRandom,
    resolveParticleConfig,
    stepParticle,
    stepParticleTime,
} from './particles.js';
import type { ParticleState, ParticleSystemConfig } from './types.js';

const MAX_PARTICLE_INDEX = Number.MAX_SAFE_INTEGER;

export class ParticleSystemController {

    started = new Event<void>();
    paused = new Event<void>();
    resumed = new Event<void>();
    finished = new Event<void>();
    updated = new Event<void>();

    particles = reactive<ParticleState[]>([]);
    config = resolveParticleConfig();

    private index = 0;
    private spawnAccumulator = 0;
    private random = createRandom(this.config.seed);
    private noise = createNoise(this.random);
    private lastTime = 0;
    private frame = 0;
    private mounted = false;
    private state = reactive({
        isPaused: this.config.isPaused,
    });

    constructor(config: ParticleSystemConfig = {}) {
        this.setConfig(config);
    }

    get isDrained() {
        return this.config.rateOverTime === 0 && this.particles.length === 0;
    }

    get isRunning() {
        return !this.state.isPaused;
    }

    get isPaused() {
        return this.state.isPaused;
    }

    setConfig(config: ParticleSystemConfig = {}) {
        const previousSeed = this.config.seed;
        this.config = resolveParticleConfig(config);
        if (this.config.seed !== previousSeed) {
            this.random = createRandom(this.config.seed);
            this.noise = createNoise(this.random);
        }
    }

    mount() {
        this.mounted = true;
        this.reset(this.config.isPaused);
    }

    unmount() {
        this.mounted = false;
        cancelAnimationFrame(this.frame);
    }

    reset(isPaused = this.isPaused) {
        this.particles.splice(0);
        this.index = 0;
        this.spawnAccumulator = 0;
        this.lastTime = performance.now();
        this.state.isPaused = isPaused;
        this.random = createRandom(this.config.seed);
        this.noise = createNoise(this.random);
        this.spawn(this.config.startCount);
        this.updated.emit();
        this.started.emit();
        this.finishIfDrained();
        this.startFrame();
    }

    pause() {
        if (this.isPaused) {
            return;
        }
        this.state.isPaused = true;
        this.paused.emit();
    }

    resume() {
        if (!this.isPaused) {
            return;
        }
        this.state.isPaused = false;
        this.lastTime = performance.now();
        this.resumed.emit();
        this.startFrame();
    }

    stop() {
        this.reset(true);
    }

    finish() {
        if (this.isPaused) {
            return;
        }
        this.state.isPaused = true;
        cancelAnimationFrame(this.frame);
        this.finished.emit();
    }

    tick(time = performance.now()) {
        if (this.isPaused) {
            this.lastTime = time;
            return;
        }
        const dt = Math.min(0.05, Math.max(0, (time - this.lastTime) / 1000));
        this.lastTime = time;
        this.spawnOverTime(dt);
        this.step(dt);
        this.updated.emit();
        this.finishIfDrained();
    }

    private startFrame() {
        if (!this.mounted || this.isPaused) {
            return;
        }
        cancelAnimationFrame(this.frame);
        this.frame = requestAnimationFrame(time => {
            this.tick(time);
            this.startFrame();
        });
    }

    private spawnOverTime(dt: number) {
        this.spawnAccumulator += this.config.rateOverTime * dt;
        const count = Math.floor(this.spawnAccumulator);
        this.spawnAccumulator -= count;
        this.spawn(count);
    }

    private spawn(count: number) {
        for (let i = 0; i < count; i++) {
            this.particles.push(createParticle(
                this.nextIndex(),
                this.config,
                this.random,
            ));
        }
    }

    private nextIndex() {
        const index = this.index;
        this.index = index === MAX_PARTICLE_INDEX ? 0 : index + 1;
        return index;
    }

    private step(dt: number) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            stepParticleTime(particle, dt);
            this.config.update(particle, dt);
            stepParticle(particle, dt, this.noise);
            if (particle.age >= particle.lifetime) {
                this.particles.splice(i, 1);
            }
        }
    }

    private finishIfDrained() {
        if (this.isRunning && this.isDrained) {
            this.finish();
        }
    }

}
