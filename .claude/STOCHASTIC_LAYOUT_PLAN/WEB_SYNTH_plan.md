# WEB_SYNTH — Stochastic Slider + PulsarSynth Layout Integration

**Mode:** `incremental_educational`. One increment per turn. Plan-first.

**Repo:** `WEB_SYNTH` (integrator). Consumes RECLUSE_UI via submodule; does NOT edit submodule source — only bumps the pointer.

## Goal

Adopt RECLUSE_UI's reworked `<recluse-pulsar-synth>` (now built from four `recluse-stochastic-slider` controls + embedded wavetable display). Re-wire `rd-pulsar.js` to the new `paramchange` event shape so audio still tracks the controls.

## What changed upstream (RECLUSE_UI @ 4f389ba)

New components shipped: `recluse-stochastic-slider`, `recluse-range-slider` (+ existing `recluse-knob`, `recluse-wavetable-display`). `PulsarSynth.svelte` rebuilt around them.

**A stochastic slider = a range slider (min / center / max) + a density knob (0..1).** Each of the 4 params (emission, formant, wavePos, gain) is now a stochastic control. At rest min = center = max (seeded from props), so behavior collapses to a single value until the user widens the range.

**Event contract change (the breaking part):**
- OLD: `paramchange` detail = `{ param, value }`.
- NEW: `paramchange` detail = `{ param, min, center, max, density }`. Fired on both `rangechange` and `densitychange`.

Props on the element are unchanged names (`emission`, `formant`, `wavePos`, `gain`) plus new `*Density` props; each seeds the center / density. So the initial-push path in `rd-pulsar.js` (`+ui[param]`) still reads the center value.

## Current consumer state (what breaks)

`PUBLIC/rd-pulsar.js` `paramchange` handler destructures `const { param, value } = e.detail;` → `value` is now `undefined` → `denormalize(undefined,…)` = NaN posted to worklet. Must switch to `center`.

`PUBLIC/index.html` loads `dist/knob.js` + `dist/pulsar-synth.js`. Whether the nested `recluse-stochastic-slider` / `recluse-range-slider` custom elements auto-register from the pulsar-synth bundle (Svelte runs `customElements.define` on import) or need their own `<script>` tags is unverified — increment 0 checks.

## Scope decision (v1)

**v1 = center-only mapping.** Send `center` to the existing single-value DSP setters (`setEmissionRate`, etc.). `min` / `max` / `density` are UI-visual only for now — the DSP has no stochastic spread input yet. Audio behavior is preserved; the new layout lights up. Wiring the stochastic spread into the DSP is a separate, later RD_DSP plan (see Out of scope).

*(Confirmed by user 2026-05-21: center-only.)*

## Increments

### [x] 0. Bump submodule pointer + register nested elements
- **LANDED:** gitlink staged `28660cc`→`4f389ba`. Build splits each component into its own bundle — `pulsar-synth.js` defines ONLY `recluse-pulsar-synth`; nested elements need their own bundles loaded. Chain: pulsar-synth → stochastic-slider → {knob, range-slider}; pulsar-synth → wavetable-display.
- `index.html` was missing `range-slider.js`, `stochastic-slider.js`, `wavetable-display.js` — added all three (knob.js already present). Browser test pending in increment 3.

### [x] 1. Re-wire `paramchange` to the new event shape
- **LANDED:** `PUBLIC/rd-pulsar.js` `paramchange` listener destructures `{ param, center }` (was `{ param, value }`); `denormalize(center, …)`. `_emissionRate` cache + wavePos display-fill trigger unchanged (they sit after, keyed on `param`). `min`/`max`/`density` ignored in v1.

### [x] 2. Confirm initial param push still valid
- **VERIFIED (no edit):** `_ensureNode()` loops `PARAM_RANGES` (emission/formant/wavePos/gain), reads `+ui[param]`. `PulsarSynth.svelte` still exports those props (seed center) → numeric, no NaN. Densities ignored in v1.

### [ ] 3. Manual test
- **FILES CHANGING:** none.
- Layout renders (PULSARELLO, 4 stochastic sliders, Start/Stop, wavetable display).
- Drag a slider center → audio param tracks. Start/Stop works. Wave-pos drag refills the display. Activity flash still works (prior feature, unaffected).
- No NaN / console errors.

## Out of scope (v1)

- **Stochastic DSP spread.** Making `min`/`max`/`density` actually randomize per-emission requires RD_DSP API (e.g. `setEmissionRange(min,max)` + density distribution). Separate cross-repo plan, like the activity-flash one. Not now.
- No RECLUSE_UI source edits (pointer bump only).
- No new build tooling.

## Hard rules reminder

- Allman braces in new JS.
- ALL-CAPS top-level dirs.
- `README.md` human-authored — don't touch.
- One question per turn.

## Open question (resolve before increment 1)

v1 center-only mapping (preserve audio, range/density are visual only) — or wire stochastic spread into the DSP now (bigger, needs an RD_DSP plan first)?
