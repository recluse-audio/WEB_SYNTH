# WEB_SYNTH — Stochastic Slider + PulsarSynth Layout Integration

**Mode:** `incremental_educational`. One increment per turn. Plan-first.

**Repo:** `WEB_SYNTH` (integrator). Consumes RECLUSE_UI via submodule; does NOT edit submodule source — only bumps the pointer.

---

## Status update 2026-05-26 — v2 unblocked, partially

**v1 (center-only layout) shipped** to the website (WEB_SYNTH commit `0bf3ec5`). Increments 0–2 landed; manual test (inc 3) effectively covered by the live deploy.

**v2 (stochastic spread into the DSP) is now started upstream but NOT yet drivable.** RD_DSP (submodule pin `3bf2e0a`) added the stochastic machinery — `RANDOMIZER/Randomizer`, `RANDOMIZER/RandomizedParam` (range / skew / **density** + atomic center), `RANGE/Range` (normalized range, ported from juce normalizable range), and `PULSAR/PulsarData` (a `RandomizedParam` per pulsar param: formantFreq / wavePosition / amp / pan). `PulsarTrain` embeds `mEmissionRateRandom` (train-level) + `mPulsarData` (per-emission).

**But the spread is not reachable from a host yet** (audited 2026-05-26):
- `PulsarTrain` exposes **no** public `setDensity` / `setRange` / `setSkew` — only `setEmissionRate` / `setFormantFreq`, which write the *center* of the embedded `RandomizedParam`. Emission range is hardcoded to `kMin/kMaxEmissionRate` in the ctor; emission density hardcoded `0.0f`.
- `setWavePosition` writes `mWavetable->setNormalizedWavePosition` **directly**, bypassing `mPulsarData.wavePosition` — that RandomizedParam is currently dead.
- `_emitPulsar()` consumes **only** `mPulsarData.resolve().formantFreq`. The drawn `wavePosition` / `amp` / `pan` are discarded.

⇒ v2 needs an **RD_DSP prereq** (public per-param density/range API + actually consuming the resolved draws) before WEB_SYNTH can wire the full `{min, center, max, density}` slider payload through. See "## v2 — wire stochastic spread" below.

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

- **Stochastic DSP spread.** Making `min`/`max`/`density` actually randomize per-emission requires RD_DSP API. ✅ **Now in scope — see "## v2 — wire stochastic spread" below.** RD_DSP @ `3bf2e0a` has the machinery; public API + WEB_SYNTH wiring remain.
- No RECLUSE_UI source edits (pointer bump only).
- No new build tooling.

---

## v2 — wire stochastic spread into the DSP

**Goal:** stop discarding `min`/`max`/`density` from `paramchange`. Forward the full per-param spread through the worklet → wasm shim → `PulsarTrain` so emissions actually randomize.

**Event payload already carries it** (v1 ignored it): `paramchange` detail = `{ param, min, center, max, density }` for each of the 4 params (emission, formant, wavePos, gain).

### Prereq (RD_DSP — cross-repo, blocks WEB_SYNTH wiring)

This is an RD_DSP plan/handoff, mirroring the activity-flash split. `PulsarTrain` must:
1. **Expose public per-param spread setters.** Suggested shape (per param: emission, formant, wavePos, amp):
   - `setEmissionRange(min, max)` / `setEmissionDensity(d)` (and optionally `setEmissionSkew`).
   - `setFormantRange/Density`, `setWavePosRange/Density`, `setAmpRange/Density`.
   These forward to the matching `RandomizedParam::setRange/setDensity` on `mEmissionRateRandom` / `mPulsarData.*`. Centers keep flowing through the existing `setEmissionRate`/`setFormantFreq`.
2. **Actually consume the resolved draws in `_emitPulsar()`.** Today only `resolve().formantFreq` is used. Apply drawn `wavePosition` (per-emission table lerp) and `amp` (per-pulsar gain). `pan` stays TODO (no panning ops yet, per `PulsarData.h`).
3. **Un-bypass wavePos.** `setWavePosition` currently writes the wavetable directly. Decide: keep direct (center) + add a separate density/range path, or route wavePos center through `mPulsarData.wavePosition` like formant. Resolve before exposing `setWavePosRange`.

DSP correctness (density gating, range mapping) is verified by RD_DSP's own Catch2 tests — not in WEB_SYNTH.

### WEB_SYNTH increments (after prereq lands + submodule bumped)

**[ ] v2.0 — bump RD_DSP submodule pointer** to the commit exposing the new setters. `git submodule update --remote SUBMODULES/RD_DSP`, then rebuild and sanity-check the new symbols are reachable.

**[ ] v2.1 — extend the C-ABI shim** (`ENGINE/PULSAR/pulsar.cpp`).
- Add `PulsarProcessor` methods + `extern "C"` exports per param for range + density, e.g.:
  - `pulsar_set_emission_range(float min, float max)`, `pulsar_set_emission_density(float d)`
  - same for `formant`, `wave_position`, and `amp`/`gain` (see open question).
- Add each new export to `EXPORTED_FUNCTIONS` in `ENGINE/PULSAR/CMakeLists.txt`.
- Rebuild: `python SCRIPTS/build_synth.py` → artifact `PUBLIC/pulsar.wasm`. (Confirm the build script targets the PULSAR module / both modules.)

**[ ] v2.2 — forward the spread in the worklet path** (`PUBLIC/rd-pulsar.js` + `PUBLIC/pulsar-worklet.js`).
- `paramchange` handler: stop dropping `min`/`max`/`density`. Denormalize each (same range table v1 uses for `center`) and `postMessage` them to the worklet alongside center.
- Worklet `onmessage`: call the new `pulsar_set_*_range` / `pulsar_set_*_density` exports.
- Keep center pushing through the existing setter (unchanged) so at-rest collapse (min=center=max, density 0) preserves v1 audio exactly.

**[ ] v2.3 — manual test.** Widen a slider's range + raise its density knob → emissions audibly scatter within the band; collapse range → back to steady v1 tone. No NaN, no clicks. Activity flash + wavetable display still work.

### Mapping table (UI param → RD_DSP target)

| UI param | center setter (exists) | spread target | notes |
|---|---|---|---|
| emission | `setEmissionRate` → `mEmissionRateRandom` center | `mEmissionRateRandom` range/density | range currently hardcoded `kMin/kMaxEmissionRate`; density hardcoded 0 |
| formant  | `setFormantFreq` → `mPulsarData.formantFreq` center | `mPulsarData.formantFreq` range/density | only param `_emitPulsar` consumes today |
| wavePos  | `setWavePosition` → wavetable **directly** | `mPulsarData.wavePosition` (dead) | prereq #3: un-bypass before spread works |
| gain     | shim `mGain` (WEB_SYNTH-only) | `mPulsarData.amp`? | see open question |

### Open question (resolve before v2.1)

UI "gain" today maps to the WEB_SYNTH shim's `mGain` (a post-multiply, no DSP param). `PulsarData` has an unused `amp` RandomizedParam. For stochastic gain, does "gain" become per-emission `amp` (drawn in `_emitPulsar`, stochastic-capable) — or stay a master post-gain (no spread, density knob inert)? Picks the v2.1 export shape for the gain slider.

## Hard rules reminder

- Allman braces in new JS.
- ALL-CAPS top-level dirs.
- `README.md` human-authored — don't touch.
- One question per turn.

## Open question (resolve before increment 1)

v1 center-only mapping (preserve audio, range/density are visual only) — or wire stochastic spread into the DSP now (bigger, needs an RD_DSP plan first)?
