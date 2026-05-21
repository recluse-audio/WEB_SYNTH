# RECLUSE_UI — Pulsar Activity Flash Plan

**Mode:** `incremental_educational`. One increment per turn. Plan-first.

**Repo:** `RECLUSE_UI` (executed in its own clone — not from WEB_SYNTH).

**On first turn:** create `.claude/PULSAR_ACTIVITY_FLASH_PLAN/` in this repo and copy this file there as `RECLUSE_UI_plan.md`. Update checkboxes in that copy as increments land.

## Goal

`<recluse-wavetable-display>` gains a boolean `active` prop. When `true`, the waveform renders at full opacity (current behavior). When `false`, the stroke dims to a low-opacity state. `<recluse-pulsar-synth>` exposes the same `active` prop and forwards it to its embedded display. No DSP knowledge.

## Component contract additions

- **`<recluse-wavetable-display>`** gains:
  - JS property `active` — boolean. Default `true`.
  - On prop change → redraw.
- **`<recluse-pulsar-synth>`** gains:
  - JS property `active` — boolean. Default `true`.
  - Forwards to embedded display same way `samples` is forwarded.

## Increments

### [ ] 1. `WavetableDisplay.svelte` — add `active` prop, gate stroke opacity
- **FILES CHANGING:** `src/WavetableDisplay.svelte`.
- **WHY:** Core behavior. Single prop, single conditional inside `draw()`.
- Add `export let active = true;` next to `export let samples = null;`.
- In `draw()`, before stroking the waveform path, set:
  ```js
  ctx.globalAlpha = active ? 1.0 : 0.18;
  ```
  (Pick the dim value with the user; `0.18` is a starting point. Apply only to the waveform stroke, not the zero line — restore alpha to default for the zero line.)
- Add reactive trigger: `$: if (active !== undefined && canvas) draw();` (alongside the existing `$: if (samples ...)`).
- **CONVENTION NOTES:** Svelte 4 reactive statements re-run when any of their referenced variables change. Two statements both calling `draw()` is fine — Svelte does not coalesce them, but `draw()` is cheap and idempotent.

### [ ] 2. Storybook story update
- **FILES CHANGING:** `stories/WavetableDisplay.stories.js`.
- **WHY:** Visual harness for the new state.
- Add two stories or a control:
  - "Active true" — same as current sine story.
  - "Active false" — same array, `active={false}`.
- `npm run dev`, visually confirm dim state looks right; refine the alpha if needed.

### [ ] 3. `PulsarSynth.svelte` — pass-through `active`
- **FILES CHANGING:** `src/PulsarSynth.svelte`.
- **WHY:** Consumer (`<rd-pulsar>` in WEB_SYNTH) sets `active` on the pulsar-synth element; pulsar-synth forwards to its embedded display.
- Add `export let active = true;`.
- In the existing `$: if (displayEl) displayEl.samples = samples;` block, add a sibling:
  ```js
  $: if (displayEl) displayEl.active = active;
  ```

### [ ] 4. Storybook story update for PulsarSynth
- **FILES CHANGING:** `stories/PulsarSynth.stories.js` (if it exists; otherwise skip).
- Add a story variant toggling `active` true/false. Verify the embedded display dims.

### [ ] 5. Build + dist commit
- **FILES CHANGING:** `dist/wavetable-display.js`, `dist/pulsar-synth.js` (and any new chunk hash files).
- `npm run build`; commit resulting `dist/` changes.

## Out of scope

- No knowledge of `Pulsar`, emission rate, atomics, audio. The component takes a boolean.
- No animation, no fade transitions on the alpha change (yet — could be a later enhancement; do not pre-build).
- No CSS-tokenized alpha value (yet); plain literal in JS for v1. If a token is wanted later, add `--color-accent-dim` or similar.

## Hard rules reminder

- Custom-element tag names start with `recluse-`.
- Use `--color-*` tokens for colors (alpha literal is OK; it's a transparency multiplier, not a color).
- Allman braces in `.js` files.
- Do not edit `README.md` or anything under `NOTES/`.
- `dist/` IS committed.
