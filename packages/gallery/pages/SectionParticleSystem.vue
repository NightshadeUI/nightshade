<template>
    <div class="ParticleShowcase">

        <div class="Preview">
            <ParticleSystem
                class="Emitter ui-primary"
                :controller="particleController"
                :config="settings">
                <template #default="{ particle, style }">
                    <div
                        class="Spark"
                        :style="{ ...style, '--Spark-t': `${particle.t * 100}%` }" />
                </template>
            </ParticleSystem>
        </div>

        <div class="Panel">
            <HGroup align="stretch">
                <Btn
                    label="Reset"
                    size="s"
                    kind="primary"
                    @click="particleController.reset()" />
                <Btn
                    label="Pause"
                    size="s"
                    :disabled="!particleController.isRunning"
                    @click="particleController.pause()" />
                <Btn
                    label="Resume"
                    size="s"
                    :disabled="!particleController.isPaused"
                    @click="particleController.resume()" />
                <Btn
                    label="Stop"
                    size="s"
                    :disabled="particleController.isPaused && particleController.isDrained"
                    @click="particleController.stop()" />
            </HGroup>

            <div class="Controls">
                <label
                    v-for="control in controls"
                    :key="control.key"
                    class="Control"
                    :class="{ 'Control-vector': control.vector }">
                    <span>{{ control.label }}</span>
                    <template v-if="control.vector">
                        <div class="Axis">
                            <input
                                v-model.number="settings[control.key][0]"
                                type="range"
                                :min="control.min"
                                :max="control.max"
                                :step="control.step ?? 1" />
                            <output>{{ formatValue(settings[control.key][0]) }}</output>
                        </div>
                        <div class="Axis">
                            <input
                                v-model.number="settings[control.key][1]"
                                type="range"
                                :min="control.min"
                                :max="control.max"
                                :step="control.step ?? 1" />
                            <output>{{ formatValue(settings[control.key][1]) }}</output>
                        </div>
                    </template>
                    <template v-else>
                        <input
                            v-model.number="settings[control.key]"
                            type="range"
                            :min="control.min"
                            :max="control.max"
                            :step="control.step ?? 1" />
                        <output>{{ formatValue(settings[control.key]) }}</output>
                    </template>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
import { Btn, HGroup } from '@nightshadeui/core/src';
import { ParticleSystem, ParticleSystemController } from '@nightshadeui/particle-system/src';

export default {

    components: {
        Btn,
        HGroup,
        ParticleSystem,
    },

    data() {
        return {
            particleController: new ParticleSystemController(),
            settings: {
                seed: 42,
                startCount: 32,
                rateOverTime: 10,
                lifetime: 5,
                radius: 120,
                size: 32,
                sizeOverTime: -2,
                opacity: 0,
                opacityOverTime: .5,
                radialVelocity: 0,
                radialAcceleration: 0,
                rotation: 0,
                rotationOverTime: 120,
                scale: [1, 1],
                scaleOverTime: [0, 0],
                linearVelocity: [0, 0],
                linearAcceleration: [0, 0],
                turbulence: 120,
                noiseScale: 0.02,
            },
            controls: [
                { key: 'startCount', label: 'Start count', min: 0, max: 500 },
                { key: 'rateOverTime', label: 'Rate', min: 0, max: 80 },
                { key: 'lifetime', label: 'Lifetime', min: 0.1, max: 20, step: 0.1 },
                { key: 'radius', label: 'Radius', min: 0, max: 640 },
                { key: 'size', label: 'Size', min: 2, max: 120 },
                { key: 'sizeOverTime', label: 'Size over time', min: -60, max: 60 },
                { key: 'opacity', label: 'Opacity', min: 0, max: 1, step: 0.05 },
                { key: 'opacityOverTime', label: 'Opacity over time', min: -2, max: 2, step: 0.05 },
                { key: 'radialVelocity', label: 'Radial velocity', min: -360, max: 360 },
                { key: 'radialAcceleration', label: 'Radial acceleration', min: -360, max: 360 },
                { key: 'rotation', label: 'Rotation', min: -360, max: 360 },
                { key: 'rotationOverTime', label: 'Rotation over time', min: -360, max: 360 },
                { key: 'scale', label: 'Scale', min: 0.1, max: 5, step: 0.05, vector: true },
                { key: 'scaleOverTime', label: 'Scale over time', min: -2, max: 2, step: 0.02, vector: true },
                { key: 'linearVelocity', label: 'Linear velocity', min: -180, max: 180, vector: true },
                { key: 'linearAcceleration', label: 'Linear acceleration', min: -120, max: 120, vector: true },
                { key: 'turbulence', label: 'Turbulence', min: 0, max: 720 },
                { key: 'noiseScale', label: 'Noise scale', min: 0.001, max: 0.12, step: 0.001 },
            ],
        };
    },

    methods: {
        formatValue(value) {
            return Number.isInteger(value) ? value : value.toFixed(2);
        },
    },

};
</script>

<style scoped>
.ParticleShowcase {
    display: flex;
    flex-flow: row;
    gap: var(--sp2);
    margin: var(--sp2);
}

@media (max-width: 960px) {
    .ParticleShowcase {
        flex-flow: column;
        margin: var(--sp);
    }
}

.Preview {
    flex: 1;
    position: relative;
    min-height: 480px;
    overflow: hidden;
    border: var(--input-border-size) solid var(--color-base-200);
    border-radius: var(--border-radius);
}

.Emitter {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 0;
    height: 0;
}

.Spark {
    border-radius: 50%;
    background: radial-gradient(circle at 50% 50%,
        var(--color-secondary-400) 0%,
        var(--color-success-200) 50%,
        transparent 100%);
}

.Panel {
    display: grid;
    gap: var(--sp3);
    padding: var(--sp2);
    border: var(--input-border-size) solid var(--color-base-200);
    border-radius: var(--border-radius);
    background: var(--color-base-0);
}

.Controls {
    display: grid;
    gap: var(--sp2);
}

.Control {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(120px, 180px) minmax(44px, auto);
    gap: var(--sp);
    align-items: center;
    font-size: var(--font-size-s);
}

.Control-vector {
    grid-template-columns: minmax(0, 1fr) minmax(120px, 180px) minmax(120px, 180px);
}

.Axis {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(36px, auto);
    gap: var(--sp);
    align-items: center;
}

.Control output,
.Axis output {
    text-align: right;
    color: var(--color-base-600);
    font-variant-numeric: tabular-nums;
}

.Control input,
.Axis input {
    width: 100%;
}

@media (max-width: 800px) {
    .ParticleShowcase {
        grid-template-columns: 1fr;
    }

    .Preview {
        min-height: 420px;
    }
}
</style>
