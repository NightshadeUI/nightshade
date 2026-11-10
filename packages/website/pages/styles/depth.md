---
title: Depth
---

# Depth

<p class="Lead">Shadows, translucency and overlays: the roles that put one surface above another.</p>

## Shadows

Shadow roles are colors, not full `box-shadow` values, so components decide geometry and the system decides strength.

<TokenTable
    preview="shadow"
    :tokens="[
        { name: '--shadow-light', value: 'black 10% / 20%', note: 'Inset wells, resting controls.' },
        { name: '--shadow-medium', value: 'black 20% / 40%', note: 'Raised controls, cards.' },
        { name: '--shadow-heavy', value: 'black 30% / 60%', note: 'Popovers and overlays.' },
    ]" />

Each tone adds its own tint: a primary button's shadow mixes `--tone-shadow` with `--shadow-medium`.

`--text-shadow-auto` is the one shadow that picks its own color: the inverse of the text it sits under, at 25%. Filled buttons and checkbox marks use it to lift their text off any tone. Where relative colors aren't supported, it's transparent.

## Translucency

Translucent controls blend their surface with what's behind them and blur it.

| Variable | Default | Use |
|----------|---------|-----|
| `--translucency-mix-light` | 15% | how much of the background shows through a surface |
| `--translucency-mix-medium` | 50% | |
| `--translucency-mix-heavy` | 75% | |
| `--translucency-blur` | 3px | backdrop blur |
| `--translucency-highlight` | white 50% / 16% | the inner rim light |

<Demo>
    <div class="TranslucentStage">
        <Btn label="Translucent" translucent />
        <Btn label="Primary" tone="primary" translucent />
        <Toggle :modelValue="true" tone="secondary" translucent />
    </div>
</Demo>

<style>
.TranslucentStage {
    display: flex;
    align-items: center;
    gap: var(--sp1-5);
    padding: var(--sp4);
    border-radius: var(--radius-l);
    background:
        radial-gradient(circle at 20% 30%, var(--color-primary-500), transparent 50%),
        radial-gradient(circle at 80% 70%, var(--color-secondary-500), transparent 50%),
        var(--surface-deep);
}
</style>

## Overlay

`--surface-overlay` is the scrim behind modals. [ModalOverlay](/components/overlays) uses it.

## Automatic text shadow

`--text-shadow-auto` is a faint shadow in the inverse of the current text color. It lifts text off a gradient surface without knowing which tone it's on. Browsers without relative color syntax get no shadow.

```css
.Label {
    text-shadow: 0 1px 1px var(--text-shadow-auto);
}
```
