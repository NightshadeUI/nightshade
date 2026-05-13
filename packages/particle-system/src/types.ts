import type { Vector2 } from '@nightshadeui/util/vector2';

export type NumberRange = [number, number];
export type Vector2Range = [Vector2, Vector2];

export type NumberValue = number | NumberRange;
export type Vector2Value = Vector2 | Vector2Range;

export interface ParticleSystemConfig {
    seed?: number;
    isPaused?: boolean;
    startCount?: number;
    rateOverTime?: number;
    lifetime?: NumberValue;
    radius?: NumberValue;
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
}

export interface ParticleState {
    id: number;
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
