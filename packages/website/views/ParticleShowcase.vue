<template>
    <div class="ParticleShowcase">

        <div
            class="Preview"
            @pointermove="updateMouse"
            @pointerleave="clearMouse">
            <div
                v-if="mouse.active"
                class="MouseField"
                :style="mouseFieldStyle" />
            <ParticleSystem
                v-if="renderMode === 'html'"
                class="Emitter tone-primary"
                :controller="particleController"
                :config="particleSettings">
                <template #default="{ particle, htmlStyle }">
                    <div
                        class="Spark"
                        :style="{ ...htmlStyle, '--Spark-t': `${particle.t * 100}%` }" />
                </template>
            </ParticleSystem>
            <ParticleCanvas
                v-else
                :controller="particleController"
                :config="particleSettings"
                :draw="drawCanvasParticle" />
        </div>

        <div class="Panel">
            <HGroup
                justify="space-between"
                wrap>
                <InputGroup>
                    <Btn
                        v-for="mode in ['html', 'canvas']"
                        :key="mode"
                        :label="mode === 'html' ? 'HTML' : 'Canvas'"
                        size="s"
                        :tone="renderMode === mode ? 'primary' : undefined"
                        @click="renderMode = mode" />
                </InputGroup>
                <HGroup>
                    <Btn
                        label="Reset"
                        size="s"
                        tone="primary"
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
            </HGroup>

            <div class="Controls">
                <div
                    v-for="control in controls"
                    :key="control.key"
                    class="Control">
                    <span class="ControlLabel">{{ control.label }}</span>
                    <div
                        v-if="control.axes"
                        class="Axes">
                        <label
                            v-for="(axis, i) in control.axes"
                            :key="axis"
                            class="Axis">
                            <span class="AxisLabel">{{ axis }}</span>
                            <Slider
                                v-model="settings[control.key][i]"
                                tone="secondary"
                                size="s"
                                tooltip="dynamic"
                                :formatTooltip="formatValue"
                                :min="control.min"
                                :max="control.max"
                                :step="control.step ?? 1" />
                        </label>
                    </div>
                    <Slider
                        v-else
                        v-model="settings[control.key]"
                        tone="secondary"
                        size="s"
                        tooltip="dynamic"
                        :formatTooltip="formatValue"
                        :min="control.min"
                        :max="control.max"
                        :step="control.step ?? 1" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Btn, HGroup, InputGroup, Slider } from '@nightshadeui/components/src';
import { ParticleCanvas, ParticleSystem } from '@nightshadeui/particle-system/src';

export default {

    components: {
        Btn,
        HGroup,
        InputGroup,
        ParticleCanvas,
        ParticleSystem,
        Slider,
    },

    inject: [
        'particleDemoManager',
    ],

    // eslint-disable-next-line max-lines-per-function
    data() {
        return {
            renderMode: 'html',
            particleController: this.particleDemoManager.createController(),
            mouse: {
                active: false,
                position: [0, 0],
            },
            settings: {
                seed: 42,
                startCount: 32,
                rateOverTime: 10,
                lifetime: 5,
                shape: [180, 80],
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
                { key: 'shape', label: 'Shape', min: 0, max: 640, axes: ['w', 'h'] },
                { key: 'size', label: 'Size', min: 2, max: 120 },
                { key: 'sizeOverTime', label: 'Size over time', min: -60, max: 60 },
                { key: 'opacity', label: 'Opacity', min: 0, max: 1, step: 0.05 },
                { key: 'opacityOverTime', label: 'Opacity over time', min: -2, max: 2, step: 0.05 },
                { key: 'radialVelocity', label: 'Radial velocity', min: -360, max: 360 },
                { key: 'radialAcceleration', label: 'Radial acceleration', min: -360, max: 360 },
                { key: 'rotation', label: 'Rotation', min: -360, max: 360 },
                { key: 'rotationOverTime', label: 'Rotation over time', min: -360, max: 360 },
                { key: 'scale', label: 'Scale', min: 0.1, max: 5, step: 0.05, axes: ['x', 'y'] },
                { key: 'scaleOverTime', label: 'Scale over time', min: -2, max: 2, step: 0.02, axes: ['x', 'y'] },
                { key: 'linearVelocity', label: 'Linear velocity', min: -180, max: 180, axes: ['x', 'y'] },
                { key: 'linearAcceleration', label: 'Linear acceleration', min: -120, max: 120, axes: ['x', 'y'] },
                { key: 'turbulence', label: 'Turbulence', min: 0, max: 720 },
                { key: 'noiseScale', label: 'Noise scale', min: 0.001, max: 0.12, step: 0.001 },
            ],
        };
    },

    computed: {
        particleSettings() {
            return {
                ...this.settings,
                update: this.repelFromMouse,
            };
        },

        mouseFieldStyle() {
            return {
                transform: `translate(${this.mouse.position[0]}px, ${this.mouse.position[1]}px)`,
            };
        },
    },

    methods: {

        updateMouse(event) {
            const rect = event.currentTarget.getBoundingClientRect();
            this.mouse.active = true;
            this.mouse.position = [
                event.clientX - rect.left - rect.width * 0.5,
                event.clientY - rect.top - rect.height * 0.5,
            ];
        },

        clearMouse() {
            this.mouse.active = false;
        },

        repelFromMouse(particle, dt) {
            if (!this.mouse.active) {
                return;
            }
            const radius = 160;
            const dx = particle.position[0] - this.mouse.position[0];
            const dy = particle.position[1] - this.mouse.position[1];
            const distance = Math.hypot(dx, dy);
            if (distance >= radius) {
                return;
            }
            const force = (1 - distance / radius) * 1800 * dt;
            particle.velocity[0] += dx / Math.max(1, distance) * force;
            particle.velocity[1] += dy / Math.max(1, distance) * force;
        },

        drawCanvasParticle(ctx, particle, canvas) {
            const x = canvas.clientWidth * 0.5 + particle.position[0];
            const y = canvas.clientHeight * 0.5 + particle.position[1];
            const radius = Math.max(0, particle.size * 0.5);
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
            gradient.addColorStop(0, '#9ae6b4');
            gradient.addColorStop(0.5, '#f6e05e');
            gradient.addColorStop(1, 'rgba(246, 224, 94, 0)');
            ctx.save();
            ctx.globalAlpha = Math.max(0, particle.opacity);
            ctx.translate(x, y);
            ctx.rotate(particle.rotation * Math.PI / 180);
            ctx.scale(particle.scale[0], particle.scale[1]);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        },

        formatValue(value) {
            return Number.isInteger(value) ? value : value.toFixed(2);
        },
    },

};
</script>

<style scoped>
.ParticleShowcase {
    display: flex;
    flex-flow: column;
    gap: var(--sp2);
    margin: var(--sp3) 0;
}

.Preview {
    position: relative;
    height: 360px;
    overflow: hidden;
    border: var(--input-border-size) solid var(--border-base);
    border-radius: var(--radius-l);
}

.Emitter {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 0;
    height: 0;
}

.MouseField {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    width: 160px;
    height: 160px;
    margin: -80px 0 0 -80px;
    pointer-events: none;
    border: var(--input-border-size) solid var(--color-secondary-600);
    border-radius: 50%;
    opacity: 0.45;
}

.Spark {
    border-radius: 50%;
    background: radial-gradient(circle at 50% 50%,
        var(--color-secondary-400) 0%,
        var(--color-success-400) 50%,
        transparent 100%);
}

.Panel {
    display: flex;
    flex-flow: column;
    gap: var(--sp3);
    padding: var(--sp2);
    border: var(--input-border-size) solid var(--border-base);
    border-radius: var(--radius-l);
    background: var(--surface-base);
}

.Controls {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--sp2) var(--sp3);
}

.Control {
    display: flex;
    flex-flow: column;
    gap: var(--sp0-5);
    min-width: 0;
}

.ControlLabel {
    font-size: var(--font-size-s);
    color: var(--text-subtle);
}

.Axes {
    display: flex;
    gap: var(--sp1);
}

.Axis {
    display: flex;
    flex: 1;
    align-items: center;
    gap: var(--sp0-5);
    min-width: 0;
}

.AxisLabel {
    font: var(--font-size-xxs) var(--font-monospace);
    line-height: var(--line-height-main);
    color: var(--text-faint);
}

.Axis .Slider {
    flex: 1;
    min-width: 0;
}
</style>
