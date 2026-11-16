import { Vector2 } from '@nightshadeui/util/vector2';

import { ParticleSystemController } from './ParticleSystemController.js';

export type NumberRange = [number, number];
export type Vector2Range = [Vector2, Vector2];

export type NumberValue = number | NumberRange;
export type Vector2Value = Vector2 | Vector2Range;
export type ParticleUpdate = (particle: ParticleState, dt: number) => void;

export interface ParticleSystemConfig {
    seed?: number;
    isPaused?: boolean;
    startCount?: number;
    rateOverTime?: number;
    lifetime?: NumberValue;
    shape?: Vector2Value;
    size?: NumberValue;
    sizeOverTime?: NumberValue;
    scale?: Vector2Value;
    scaleOverTime?: Vector2Value;
    opacity?: NumberValue;
    opacityOverTime?: NumberValue;
    linearVelocity?: Vector2Value;
    linearAcceleration?: Vector2Value;
    radialVelocity?: NumberValue;
    radialAcceleration?: NumberValue;
    rotation?: NumberValue;
    rotationOverTime?: NumberValue;
    turbulence?: NumberValue;
    noiseScale?: NumberValue;
    update?: ParticleUpdate;
}

export interface ParticleState {
    index: number;
    age: number;
    lifetime: number;
    position: Vector2;
    velocity: Vector2;
    effectiveVelocity: Vector2;
    radialDirection: Vector2;
    size: number;
    sizeOverTime: number;
    scale: Vector2;
    scaleOverTime: Vector2;
    opacity: number;
    opacityOverTime: number;
    linearAcceleration: Vector2;
    radialVelocity: number;
    radialAcceleration: number;
    rotation: number;
    rotationOverTime: number;
    turbulence: number;
    noiseScale: number;
    t: number;
}

export type ParticleDraw = (ctx: CanvasRenderingContext2D, particle: ParticleState, canvas: HTMLCanvasElement) => void;
export type ParticleLayerDraw = (
    ctx: CanvasRenderingContext2D,
    particles: ParticleState[],
    canvas: HTMLCanvasElement,
) => void;
export type ParticleCanvasClear = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;

/**
 * One particle system drawn on a shared canvas. Layers draw in order, so the last one is on top.
 */
export interface ParticleLayer {
    controller: ParticleSystemController;
    draw: ParticleDraw;
    beforeDraw?: ParticleLayerDraw;
    afterDraw?: ParticleLayerDraw;
}

export interface ParticleCanvasOptions {
    clear?: ParticleCanvasClear;
    pixelRatio?: number;
}
