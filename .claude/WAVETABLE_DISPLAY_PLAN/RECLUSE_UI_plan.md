# RECLUSE_UI — Wavetable Display Plan

**Mode:** `incremental_educational`. One increment per turn. Plan-first.

**Repo:** `RECLUSE_UI` (executed in its own clone — not from WEB_SYNTH).

**On first turn:** create `.claude/WAVETABLE_DISPLAY_PLAN/` in this repo and copy this file there as `RECLUSE_UI_plan.md`. Update checkboxes in that copy as increments land.

## Goal

A framework-agnostic custom element that draws a single-cycle waveform from a `Float32Array` of samples. No DSP knowledge. No knowledge of wavetables, wave-position, interpolation. It just renders the float array it is given.

## Component contract

- **Tag:** `<recluse-wavetable-display>`
- **JS property:** `samples` — accepts `Float32Array` (or any typed array of numeric values in `[-1.0, 1.0]` nominal range, but does not clamp; values outside are drawn clipped to the viewport).
- **Attribute:** `width`, `height` (CSS pixels, optional — element fills container by default).
- **CSS tokens used:**
  - `--color-bg-*` for canvas background
  - `--color-accent-*` for the waveform stroke
  - `--color-grid-*` (optional) for a center zero line
- **Repaint trigger:** setting `samples` to a new array. No internal polling. No animation loop.

## Increments

### [ ] 1. Entry file + skeleton component
- **FILES CHANGING:**
  - `src/WavetableDisplay.svelte` (new)
  - `src/entries/wavetable-display.js` (new — Vite multi-entry hook)
- **WHY:** Wire the custom-element tag into the build pipeline before drawing logic. Lets us confirm `dist/wavetable-display.js` emits cleanly.
- **CONVENTION NOTES:** Svelte 4 customElement syntax — `<svelte:options customElement="recluse-wavetable-display" />` at top of `.svelte`. Mirrors existing components (e.g. `Knob.svelte`, `Meter.svelte`).
- Skeleton: a `<canvas>` element in a shadow root with a small reactive prop `export let samples = null;`. No draw yet — render a placeholder background.
- `npm run build` succeeds.

### [ ] 2. Vite entry registered
- **FILES CHANGING:** `vite.config.js`.
- **WHY:** Multi-entry library build only picks up declared entry points.
- Add `'wavetable-display': 'src/entries/wavetable-display.js'` to the entries object.
- `dist/wavetable-display.js` produced; sibling shared-runtime chunk reused (do not inline).

### [ ] 3. Storybook story
- **FILES CHANGING:** `stories/WavetableDisplay.stories.js` (new).
- **WHY:** Visual harness before pulling into a consumer. Lets the user iterate the look on a known input without firing up WEB_SYNTH.
- Stories:
  - Sine (computed in story JS) at 2048 samples
  - Sine at 128 samples (the post-decimation size WEB_SYNTH will send)
  - Saw
  - Empty / null
- `npm run dev` → see four panels.

### [ ] 4. Canvas draw
- **FILES CHANGING:** `src/WavetableDisplay.svelte`.
- **WHY:** Core feature. Plain canvas 2D `lineTo` polyline from `samples`.
- Math: x-axis `i / (samples.length - 1) * width`. y-axis `(1 - (s + 1) / 2) * height` (so `+1` is top, `-1` is bottom).
- Reactive: `$: if (samples && canvas) draw();`.
- Resize observer on the canvas → redraw on size change. `devicePixelRatio` scaling.
- **CONVENTION NOTES:** This is the standard "fit-and-draw to backing store" pattern. Set `canvas.width = clientWidth * dpr`, `canvas.height = clientHeight * dpr`, scale ctx by dpr, draw in CSS pixel space.

### [ ] 5. CSS tokens + center zero line
- **FILES CHANGING:** `src/WavetableDisplay.svelte` (style block).
- **WHY:** Match other RECLUSE_UI components. No hex literals.
- Use `var(--color-bg-1)`, `var(--color-accent-primary)`, etc.
- Optional faint zero line at `y = height / 2`.

### [ ] 6. Build + dist commit
- **FILES CHANGING:** `dist/wavetable-display.js` (+ any new chunk hash files).
- **WHY:** `dist/` is committed — consumers pull bundles directly, no build step on their end.
- `npm run build` and commit the resulting `dist/` changes.

## Out of scope

- No knowledge of `Wavetable`, wave-position, interpolation, audio.
- No wasm. No worklet. No DSP math.
- No animation; redraws are caller-driven via prop set.
- No anti-aliasing beyond canvas defaults; decimation quality is the producer's problem.

## Hard rules reminder

- Custom-element tag must start with `recluse-`.
- Use `--color-*` tokens, not hex literals.
- Allman braces in `.js` files.
- Do not edit `README.md` or anything under `NOTES/`.
- `dist/` IS committed.
