# @nightshadeui/particle-system

Particle emitters with spawn rate, lifetime, velocity, acceleration and turbulence, rendered as HTML elements you style with CSS, or drawn on a canvas.

```bash
npm i @nightshadeui/particle-system
```

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
