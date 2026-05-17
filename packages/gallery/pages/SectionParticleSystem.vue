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
                class="Emitter ui-primary"
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
            <HGroup align="stretch">
                <Btn
                    label="HTML"
                    size="s"
                    :kind="renderMode === 'html' ? 'primary' : 'base'"
                    @click="setRenderMode('html')" />
                <Btn
                    label="Canvas"
                    size="s"
                    :kind="renderMode === 'canvas' ? 'primary' : 'base'"
                    @click="setRenderMode('canvas')" />
            </HGroup>

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
                        <Slider
                            v-model="settings[control.key][0]"
                            kind="secondary"
                            size="s"
                            tooltip="dynamic"
                            :formatTooltip="formatValue"
                            :min="control.min"
                            :max="control.max"
                            :step="control.step ?? 1" />
                        <Slider
                            v-model="settings[control.key][1]"
                            kind="secondary"
                            size="s"
                            tooltip="dynamic"
                            :formatTooltip="formatValue"
                            :min="control.min"
                            :max="control.max"
                            :step="control.step ?? 1" />
                    </template>
                    <template v-else>
                        <Slider
                            v-model="settings[control.key]"
                            kind="secondary"
                            size="s"
                            flat
                            tooltip="dynamic"
                            :formatTooltip="formatValue"
                            :min="control.min"
                            :max="control.max"
                            :step="control.step ?? 1" />
                    </template>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
import { Btn, HGroup } from '@nightshadeui/core/src';
import { ParticleCanvas, ParticleSystem, ParticleSystemController } from '@nightshadeui/particle-system/src';

export default {

    components: {
        Btn,
        HGroup,
        ParticleCanvas,
        ParticleSystem,
    },

    // eslint-disable-next-line max-lines-per-function
    data() {
        return {
            renderMode: 'html',
            particleController: new ParticleSystemController(),
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
                { key: 'shape', label: 'Shape', min: 0, max: 640, vector: true },
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
        setRenderMode(renderMode) {
            if (this.renderMode === renderMode) {
                return;
            }
            this.renderMode = renderMode;
        },

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

.MouseField {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    width: 160px;
    height: 160px;
    margin: -80px 0 0 -80px;
    pointer-events: none;
    border: var(--input-border-size) solid var(--color-secondary-300);
    border-radius: 50%;
    opacity: 0.45;
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
    grid-template-columns: minmax(0, 1fr) minmax(120px, 180px);
    gap: var(--sp);
    align-items: center;
    font-size: var(--font-size-s);
}

.Control-vector {
    grid-template-columns: minmax(0, 1fr) minmax(120px, 180px) minmax(120px, 180px);
}

.Control .Slider {
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
