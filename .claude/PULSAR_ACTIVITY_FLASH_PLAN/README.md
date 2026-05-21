# Pulsar Activity Flash — cross-repo plan

Make the wavetable display visually flash on/off in sync with the pulsar's per-emission activity (`Pulsar::mIsActive`). When the pulsar is in its duty-cycle (emitting a pulsaret) the display draws normally; when idle between emissions it dims.

## Behavior contract

- **Source of truth:** `rd_dsp::Pulsar::mIsActive` (per-emission boolean, audio-thread driven).
- **Audio thread does nothing extra.** Only writes an atomic flag. No `postMessage`, no allocation, no syscalls. Already writes the flag today — only change is making it `std::atomic<bool>`.
- **Reader thread (browser GUI):** `window.requestAnimationFrame` callback (~60 Hz, vsync-aligned, paused when tab hidden) polls the flag through a C-ABI export. Detects transitions (edge-push *of redraws*, not of audio-side messages).
- **Throttle rule:** when `PulsarTrain::getEmissionRate() > 30 Hz`, cap visible redraws at 25 Hz (≥40 ms between paints). Below 30 Hz emission, every transition paints (capped only by display refresh, typically 60 Hz).
- **Visual:** display dim (low-opacity stroke) when inactive, full opacity when active. No new geometry — same waveform render as today, just gated.

## Repos involved

1. **RD_DSP** (`SUBMODULES/RD_DSP/` — execute in its own clone)
   - Promote `Pulsar::mIsActive` to `std::atomic<bool>`. Add `bool isActive() const noexcept` getter. Add `PulsarTrain::isActive() const noexcept` pass-through (consumers only see `PulsarTrain`).
   - Catch2 coverage of the transition.
   - Plan: [`RD_DSP_plan.md`](./RD_DSP_plan.md)

2. **RECLUSE_UI** (`PUBLIC/SUBMODULES/RECLUSE_UI/` — execute in its own clone)
   - `<recluse-wavetable-display>` gains a boolean `active` prop. When false → reduce stroke opacity (token-driven). Pass-through prop on `<recluse-pulsar-synth>`.
   - Plan: [`RECLUSE_UI_plan.md`](./RECLUSE_UI_plan.md)

3. **WEB_SYNTH** (this repo)
   - C-ABI export `pulsar_is_active() -> int` (1/0). Worklet exposes it via direct `WebAssembly.Instance.exports` — no MessagePort traffic on the read path.
   - **Bridge:** worklet currently runs in audio thread context. To let the main thread read the wasm export without crossing threads, expose the flag in the wasm linear memory (already-shared) via a small global written every block, and read it from main via `SharedArrayBuffer`. **Decision deferred** (see WEB_SYNTH plan increment 0); a simpler v1 uses `MessagePort` poll at 60 Hz which keeps audio-thread cost = one atomic write.
   - `rd-pulsar.js` runs `requestAnimationFrame` loop, applies throttle when emission > 30 Hz, sets `active` prop on the embedded `<recluse-wavetable-display>` via `<recluse-pulsar-synth>`.
   - Plan: [`WEB_SYNTH_plan.md`](./WEB_SYNTH_plan.md)

## Execution order

```
RD_DSP  ──►  WEB_SYNTH  ──►  RECLUSE_UI integration (final wiring)
   │              │                  │
   │              └── bumps RD_DSP submodule pointer
   └── lib API stable before consumers wire up
```

RECLUSE_UI work can proceed in parallel with RD_DSP (no DSP dep — just adds a boolean prop).

## Per-repo progress tracking

Each consuming repo creates its own matching folder on first turn of execution:

- `SUBMODULES/RD_DSP/.claude/PULSAR_ACTIVITY_FLASH_PLAN/` — copy of `RD_DSP_plan.md`.
- `PUBLIC/SUBMODULES/RECLUSE_UI/.claude/PULSAR_ACTIVITY_FLASH_PLAN/` — copy of `RECLUSE_UI_plan.md`.
- WEB_SYNTH's tracked copy is the one already here.

## Mode

All three plans target the `incremental_educational` skill. One increment per turn, plan-first, status legend `[ ] [~] [x] [!]`.

## Status legend

- `[ ]` not started
- `[~]` in progress
- `[x]` done
- `[!]` blocked / needs decision
