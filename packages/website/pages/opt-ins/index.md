---
title: Opt-ins
---

# Opt-ins

<p class="Lead">Packages that orbit your system. None of them is required: the styles stand on their own. Take one when it saves you work, replace it when it doesn't.</p>

## What makes an opt-in

- **Behavior lives in a controller**: a plain class with `mount` and `unmount` and reactive state. The component is a thin view over it, and you can skip it.
- **It speaks the grammar.** Controls inside an opt-in take `tone` and `size` like any other.
- **It brings no new colors.** Its own knobs are prefixed with its name and default to roles: `--canvas-grid-major-color`, not a hex.

## The opt-ins

| Package | What it does | Status |
|---------|--------------|--------|
| [`@nightshadeui/components`](/components/) | the standard controls: buttons, chips, inputs, toggles, sliders, overlays | stable |
| [`@nightshadeui/canvas`](/opt-ins/canvas) | an infinite, zoomable canvas with movable, resizable objects | stable |
| [`@nightshadeui/particle-system`](/opt-ins/particles) | particle emitters rendered as HTML or on a canvas | stable |
| [`@nightshadeui/scroller`](/opt-ins/scroller) | scroll progress of an element, from 0 to 1 | stable |
| [`@nightshadeui/content-editor`](/opt-ins/content-editor) | a block editor over a JSON document | prototype |
| [`@nightshadeui/docs`](/opt-ins/docs) | a documentation site for your own design system | new |

Your app is welcome to grow its own the same way. Anything built on the same variables snaps in.
