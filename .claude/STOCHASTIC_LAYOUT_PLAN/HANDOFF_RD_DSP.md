# Handoff — RD_DSP (Stochastic Spread for PulsarTrain)

Paste the block below as your first message in a Claude Code session opened **inside an RD_DSP clone** (not WEB_SYNTH). The user runs this from the standalone RD_DSP working copy (e.g. `C:\REPOS\PLUGIN_PROJECTS\RD_DSP`) — NOT from `C:\REPOS\PROJECTS\WEB_SYNTH\SUBMODULES\RD_DSP`.

---

## Paste this:

I am working on a cross-repo feature called **Stochastic Spread** (per-emission parameter randomization for the pulsar synth). Repos involved: `RD_DSP` (this one), `WEB_SYNTH`, and `RECLUSE_UI`. The integrator is WEB_SYNTH; you work in RD_DSP and should not assume knowledge of the other two beyond the public API contract.

**Context — what already landed (do not redo).** A prior round added the stochastic machinery: `SOURCE/RANDOMIZER/Randomizer`, `SOURCE/RANDOMIZER/RandomizedParam` (range / skew / **density** + atomic center; `getRandomizedValue()` is density-gated), `SOURCE/RANGE/Range` (normalized range ported from juce normalizable range), and `SOURCE/PULSAR/PulsarData` (a `RandomizedParam` per param: `formantFreq` / `wavePosition` / `amp` / `pan`, plus `resolve()` drawing all four). `PulsarTrain` already embeds `mEmissionRateRandom` (train-level) and `mPulsarData` (per-emission). This is at/around commit `3bf2e0a`.

**The gap (what this task fixes).** The spread is built but **not reachable or applied**:

1. **No public spread API on `PulsarTrain`.** Only `setEmissionRate` / `setFormantFreq` exist — they write the *center* of the embedded `RandomizedParam`. There is no public `setRange` / `setDensity` / `setSkew` for any param. Emission range is hardcoded to `kMin/kMaxEmissionRate` in the ctor; emission density hardcoded `0.0f`.
2. **`_emitPulsar()` discards most draws.** It uses only `mPulsarData.resolve().formantFreq`. The drawn `wavePosition` and `amp` are thrown away. `pan` stays TODO (no panning ops yet — leave it).
3. **`setWavePosition` bypasses its RandomizedParam.** It writes `mWavetable->setNormalizedWavePosition(...)` directly, so `mPulsarData.wavePosition` is dead. Decide: route the wavePos *center* through `mPulsarData.wavePosition` like formant (then apply the resolved draw per emission), vs. keep a direct-center path plus a separate spread path. Resolve this before exposing a wavePos range setter.

**What to add (all in `SOURCE/PULSAR/PulsarTrain.{h,cpp}`):**

1. **Public per-param spread setters**, forwarding to the matching `RandomizedParam::setRange/setDensity` (and optionally `setSkew`) on `mEmissionRateRandom` / `mPulsarData.*`. Centers keep flowing through the existing `setEmissionRate` / `setFormantFreq` setters. Suggested names (confirm with the user):
   - `setEmissionRange(float min, float max)`, `setEmissionDensity(float d)`
   - `setFormantRange(min,max)`, `setFormantDensity(d)`
   - `setWavePosRange(min,max)`, `setWavePosDensity(d)` — gated on the #3 decision above
   - `setAmpRange(min,max)`, `setAmpDensity(d)` — see gain/amp open question below
2. **Apply the resolved draws in `_emitPulsar()`.** Consume `resolve().wavePosition` (per-emission table lerp) and `resolve().amp` (per-pulsar gain) in addition to `formantFreq`. Keep the density-0 ⇒ "returns center unchanged" collapse so existing behavior is byte-identical until a density is dialed up.
3. **Catch2 coverage**: density 0 ⇒ every emission resolves to the center (no spread); density 1 + a widened range ⇒ draws land within `[min,max]` and vary across emissions; setters move the underlying `RandomizedParam` state. Mirror the existing PulsarTrain test style.
4. **Bump `VERSION.txt`.**

**Open question to raise with the user (decides the amp setter):** WEB_SYNTH's "gain" slider currently maps to a WEB_SYNTH-side post-multiply, not a DSP param. `PulsarData.amp` is the unused per-emission gain RandomizedParam. Does "gain" become per-emission `amp` (stochastic-capable, drawn in `_emitPulsar`) or stay a master post-gain (no spread)? If the latter, skip `setAmpRange/Density` entirely.

**Mode:** `incremental_educational`. One increment per turn, plan-first, real RED state (assertion failure, not compile failure).

**First-turn actions:**

1. Read WEB_SYNTH's tracked plan, the **"## v2 — wire stochastic spread"** section, at this absolute path:
   `C:\REPOS\PROJECTS\WEB_SYNTH\.claude\STOCHASTIC_LAYOUT_PLAN\WEB_SYNTH_plan.md`
   That section's "Prereq (RD_DSP …)" + mapping table are the source of truth for what WEB_SYNTH needs back from you. (You have read permission on `C:\REPOS\PROJECTS\WEB_SYNTH` via standing external-source rules — confirm by reading.)
2. Create `.claude/STOCHASTIC_LAYOUT_PLAN/RD_DSP_plan.md` in **this** repo from the spec above (the WEB_SYNTH copy stays the cross-repo contract; do not edit it from here). Track increment checkboxes there as work lands.
3. Confirm you have read the WEB_SYNTH v2 section, then ask me one question: the gain/amp decision above (it gates the setter list). Default suggestion: start with the emission + formant setters (machinery already wired for those), defer wavePos/amp until #3 and the gain decision are settled.

**Hard rules reminder (RD_DSP):**

- Zero third-party deps in `SOURCE/`.
- No allocation, no exceptions on the audio path. `RandomizedParam` draws must stay allocation-free (they already are).
- Atomic param state uses `memory_order_relaxed` (control-thread write, audio-thread read — independent values, no ordering required).
- Allman braces in new code.
- No `README.md` or `NOTES/` edits.

**Out of scope for this repo:** JS, wasm, UI, the WEB_SYNTH C-ABI shim, RECLUSE_UI events. Anything outside `SOURCE/PULSAR/`, `SOURCE/RANDOMIZER/`, `SOURCE/RANGE/`, and the matching test files.

Begin.
