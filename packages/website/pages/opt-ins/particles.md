---
title: Particle system
---

# Particle system

<p class="Lead">Emitters with spawn rate, lifetime, velocity, acceleration and turbulence, rendered as HTML elements you style with CSS, or drawn on a canvas.</p>

```bash
npm i @nightshadeui/particle-system
```

<ClientOnly>
    <ParticleShowcase />
</ClientOnly>

## Usage

```html
<ParticleSystem :controller="particles" :config="config">
    <template #default="{ particle, htmlStyle }">
        <div class="Spark" :style="htmlStyle" />
    </template>
</ParticleSystem>
```

```ts
import { ParticleSystemController } from '@nightshadeui/particle-system';

const particles = new ParticleSystemController();
```

The controller runs the simulation; `ParticleSystem` and `ParticleCanvas` only render it. `reset`, `pause`, `resume` and `stop` control the run.


## Layers on one canvas

`ParticleCanvas` stacks several systems on one canvas with `layers`: one frame loop ticks them all and draws them in order, so the last layer is on top. Each layer has its own controller and draw function; the canvas drives those controllers, so don't mount them elsewhere. The loop stops while every layer is paused or the canvas is off screen.

```html
<ParticleCanvas :layers="layers" />
```

```ts
const layers = [
    { controller: new ParticleSystemController(blobs), draw: drawBlob },
    { controller: new ParticleSystemController(sparks), draw: drawSpark },
];
```

`ParticleCanvasController` is the same renderer without Vue: `mount(canvas)`, `setLayers(layers)`, `unmount()`.
