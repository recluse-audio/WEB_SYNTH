# Wavetable Display — cross-repo plan

Render the live interpolated wavetable shape (the wave that audio is actually drawing samples from) into a UI element. Not an oscilloscope; the source of truth is the wavetable + interpolated wave position, not the audio output.

## Repos involved

Three repos, one plan each. Each repo executes in its own session, in its own working directory. **WEB_SYNTH is the integrator — submodules are NOT edited from here.**

1. **RD_DSP** (`SUBMODULES/RD_DSP/` — execute in its own clone)
   - Adds a `fillDisplayBuffer(float* out, int outSize)` method to `Wavetable`.
   - Allocation-free, no third-party deps, Catch2 test.
   - Plan: [`RD_DSP_plan.md`](./RD_DSP_plan.md)

2. **RECLUSE_UI** (`PUBLIC/SUBMODULES/RECLUSE_UI/` — execute in its own clone)
   - Adds a `<recluse-wavetable-display>` custom-element. Accepts a `Float32Array` via JS property `samples` (or attribute equivalent). Renders to canvas. Uses `--color-*` tokens.
   - Plan: [`RECLUSE_UI_plan.md`](./RECLUSE_UI_plan.md)

3. **WEB_SYNTH** (this repo)
   - C-ABI shim: `extern "C"` exports `fill_display_buffer(int outSize)` returning pointer into wasm linear memory. Owns a `std::vector<float>` of display samples.
   - JS: main-thread requests fill via `MessagePort` on wave-pos change (RAF-debounced), copies `Float32Array` view, sets it on the custom-element.
   - Plan: [`WEB_SYNTH_plan.md`](./WEB_SYNTH_plan.md)

## Execution order

Strict dependency chain:

```
RD_DSP  ──►  WEB_SYNTH  ──►  RECLUSE_UI integration
   │              │                  │
   │              └── bumps RD_DSP submodule pointer
   └── lib API stable before consumers wire up
```

RECLUSE_UI's custom-element work can proceed in parallel with RD_DSP (no DSP dep — it just renders a `Float32Array`). Final wiring in WEB_SYNTH bumps both submodule pointers.

## Per-repo progress tracking

Each consuming repo creates its own matching folder on first turn of execution:

- `SUBMODULES/RD_DSP/.claude/WAVETABLE_DISPLAY_PLAN/` — copy the per-repo plan there as `RD_DSP_plan.md`, update its checkboxes as work lands.
- `PUBLIC/SUBMODULES/RECLUSE_UI/.claude/WAVETABLE_DISPLAY_PLAN/` — same shape for `RECLUSE_UI_plan.md`.
- WEB_SYNTH's tracked copy is the one already here.

## Mode

All three plans target the `incremental_educational` skill. One increment per turn, plan-first, status legend `[ ] [~] [x] [!]`.

## Status legend

- `[ ]` not started
- `[~]` in progress
- `[x]` done
- `[!]` blocked / needs decision
