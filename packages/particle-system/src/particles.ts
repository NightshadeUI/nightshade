import { vector2 } from '@nightshadeui/util';
import type { Vector2 } from '@nightshadeui/util/vector2';
import { createNoise2D } from 'simplex-noise';

import type {
    NumberValue,
    ParticleState,
    ParticleSystemConfig,
    Vector2Range,
    Vector2Value,
} from './types.js';

export type ResolvedParticleSystemConfig = Required<ParticleSystemConfig>;

export const DEFAULT_PARTICLE_CONFIG: ResolvedParticleSystemConfig = {
    seed: 1,
    isPaused: false,
    startCount: 24,
    rateOverTime: 0,
    lifetime: 1,
    radius: 0,
    size: 16,
    sizeOverTime: 0,
    scale: [1, 1],
    scaleOverTime: [0, 0],
    opacity: 1,
    opacityOverTime: 0,
    linearVelocity: [0, 0],
    linearAcceleration: [0, 0],
    radialVelocity: 0,
    radialAcceleration: 0,
    rotation: 0,
    rotationOverTime: 0,
    turbulence: 0,
    noiseScale: 0.01,
};

export function resolveParticleConfig(config: ParticleSystemConfig = {}) {
    return {
        ...DEFAULT_PARTICLE_CONFIG,
        ...config,
    };
}

export function createRandom(seed: number) {
    let state = seed >>> 0;
    return () => {
        state += 0x6d2b79f5;
        let value = state;
        value = Math.imul(value ^ value >>> 15, value | 1);
        value ^= value + Math.imul(value ^ value >>> 7, value | 61);
        return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
}

export function createParticle(
    index: number,
    config: ReturnType<typeof resolveParticleConfig>,
    random: () => number,
): ParticleState {
    const radius = sampleNumber(config.radius, random);
    const angle = random() * Math.PI * 2;
    const distance = Math.sqrt(random()) * radius;
    const position = vector2.create(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
    );
    const radialDirection = distance === 0 ?
        vector2.create(Math.cos(angle), Math.sin(angle)) :
        vector2.normalize(position);
    const velocity = sampleVector(config.linearVelocity, random);
    const radialVelocity = sampleNumber(config.radialVelocity, random);
    const radialVelocityVector = vector2.scale(radialDirection, radialVelocity);
    return {
        index,
        age: 0,
        lifetime: Math.max(0.001, sampleNumber(config.lifetime, random)),
        position,
        velocity,
        effectiveVelocity: vector2.add(velocity, radialVelocityVector),
        radialDirection,
        size: sampleNumber(config.size, random),
        sizeOverTime: sampleNumber(config.sizeOverTime, random),
        scale: sampleVector(config.scale, random),
        scaleOverTime: sampleVector(config.scaleOverTime, random),
        opacity: sampleNumber(config.opacity, random),
        opacityOverTime: sampleNumber(config.opacityOverTime, random),
        linearAcceleration: sampleVector(config.linearAcceleration, random),
        radialVelocity,
        radialAcceleration: sampleNumber(config.radialAcceleration, random),
        rotation: sampleNumber(config.rotation, random),
        rotationOverTime: sampleNumber(config.rotationOverTime, random),
        turbulence: sampleNumber(config.turbulence, random),
        noiseScale: sampleNumber(config.noiseScale, random),
        t: 0,
    };
}

export function stepParticle(
    particle: ParticleState,
    dt: number,
    noise: ReturnType<typeof createNoise2D>,
) {
    particle.age += dt;
    particle.radialVelocity += particle.radialAcceleration * dt;
    particle.velocity[0] += (
        particle.linearAcceleration[0] +
        noise(
            particle.position[0] * particle.noiseScale,
            particle.position[1] * particle.noiseScale,
        ) * particle.turbulence
    ) * dt;
    particle.velocity[1] += (
        particle.linearAcceleration[1] +
        noise(
            particle.position[0] * particle.noiseScale + 100,
            particle.position[1] * particle.noiseScale - 100,
        ) * particle.turbulence
    ) * dt;
    const radialVelocity = vector2.scale(particle.radialDirection, particle.radialVelocity);
    particle.effectiveVelocity = vector2.add(particle.velocity, radialVelocity);
    particle.position[0] += particle.effectiveVelocity[0] * dt;
    particle.position[1] += particle.effectiveVelocity[1] * dt;
    particle.size += particle.sizeOverTime * dt;
    particle.scale[0] += particle.scaleOverTime[0] * dt;
    particle.scale[1] += particle.scaleOverTime[1] * dt;
    particle.opacity += particle.opacityOverTime * dt;
    particle.rotation += particle.rotationOverTime * dt;
    particle.t = Math.min(1, particle.age / particle.lifetime);
}

export function createNoise(random: () => number) {
    return createNoise2D(random);
}

function sampleNumber(value: NumberValue, random: () => number) {
    if (Array.isArray(value)) {
        return value[0] + (value[1] - value[0]) * random();
    }
    return value;
}

function sampleVector(value: Vector2Value, random: () => number): Vector2 {
    if (isVector2Range(value)) {
        const [min, max] = value;
        return vector2.create(
            min[0] + (max[0] - min[0]) * random(),
            min[1] + (max[1] - min[1]) * random(),
        );
    }
    return vector2.create(value[0], value[1]);
}

function isVector2Range(value: Vector2Value): value is Vector2Range {
    return Array.isArray(value[0]);
}
