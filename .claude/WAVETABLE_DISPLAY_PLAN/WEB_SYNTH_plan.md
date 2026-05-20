# WEB_SYNTH — Wavetable Display Plan

**Mode:** `incremental_educational`. One increment per turn. Plan-first.

**Repo:** `WEB_SYNTH` (this repo). Integrator. Does NOT edit submodule source — only bumps pointers.

The tracked copy of this plan IS this file; update its checkboxes in place as work lands.

## Goal

Bridge `rd_dsp::Wavetable::fillDisplayBuffer` (in the wasm) to a `<recluse-wavetable-display>` custom element (in the page). Main-thread driven, RAF-debounced, zero per-frame allocation past initial setup.

## Preconditions

- [x] RD_DSP increment 3 landed (also 4 — `fillDisplayBufferAveraged` available). Submodule HEAD `06ab633` == `origin/main`.
- [x] RECLUSE_UI increment 6 landed; `dist/wavetable-display.js` present. Submodule HEAD `c06db9e` == `origin/main`.

If either is `[ ]`, this plan stops at increment 1 and waits.

## Architecture

```
            main thread                                audio thread
 ┌─────────────────────────────────┐         ┌──────────────────────────────┐
 │ <recluse-wavetable-display>     │         │ AudioWorkletProcessor        │
 │   .samples = Float32Array(128)  │◄────────┤                              │
 │                                 │  port   │  wasm instance               │
 │ rd-pulsar.js  (host element)    │ message │  ┌────────────────────────┐  │
 │   on wavePos change → RAF →     │────────►│  │ extern "C" wasm exports│  │
 │     port.postMessage('fill', N) │         │  │  - fill_display_buf(N) │  │
 │                                 │         │  │  - display_buf_ptr()   │  │
 └─────────────────────────────────┘         │  └────────────────────────┘  │
                                             └──────────────────────────────┘
```

The display buffer is a fixed-size `std::vector<float>` owned by the C++ shim (sized once at init), exposed via a pointer export. The worklet receives a "fill" request over `MessagePort`, calls `fill_display_buf`, then posts back a `Float32Array` (copy of the wasm memory view — view itself cannot cross thread boundary safely after grow).

**Why not run the fill in the audio `process()` callback?** It would run hundreds of times per second when wave-pos hasn't changed. Display is human-rate. Main-thread driven keeps the audio thread clean.

## Increments

### [x] 1. Confirm preconditions
- **FILES CHANGING:** none (status check).
- **WHY:** Block on RD_DSP + RECLUSE_UI deliverables before touching shim code.
- Check submodule HEADs against the tagged commits referenced in each plan's increment 5/6.
- Bump submodule pointers:
  - `git submodule update --remote SUBMODULES/RD_DSP`
  - `git submodule update --remote PUBLIC/SUBMODULES/RECLUSE_UI`
- Commit the pointer bumps with a clear message referencing both plans.

### [x] 2. Shim — display buffer storage + exports (SYNTH module)
- **LANDED IN:** `ENGINE/SYNTH/synth.cpp`, `ENGINE/SYNTH/CMakeLists.txt`. Single-file shim (no separate header / `synth_c_api.cpp`); members + exports added inline.
- Added member: `std::vector<float> mDisplayBuf;` + `kDisplaySize = 128`. `prepare()` calls `mDisplayBuf.assign(kDisplaySize, 0.f);`.
- Exports: `synth_display_buf_ptr`, `synth_display_buf_size`, `synth_fill_display_buf` — wired into `EXPORTED_FUNCTIONS`. Build green, `PUBLIC/synth.wasm` rebuilt.
- **NOTE:** SYNTH has no wave-pos UI driver; this shim is dormant until a `synth_set_wave_pos` export + slider is added in a future increment, OR the work is mirrored to pulsar (see below).

### [x] 3. Worklet — handle fill message (SYNTH module)
- **LANDED IN:** `PUBLIC/synth-worklet.js` — `fillDisplay` case added. Calls export, reconstructs `Float32Array` view over wasm memory, copies to transferable, posts `displayBuffer`.

---

## Mid-plan correction (2026-05-20)

Original plan increment 4 named `rd-pulsar.js` as host element — correct, since wave-pos UI lives in pulsar (not synth). But:
- `PulsarTrain` owns its `Wavetable` privately (`std::unique_ptr<Wavetable>` in `SUBMODULES/RD_DSP/SOURCE/PULSAR/PulsarTrain.h:63`) with no public accessor.
- WEB_SYNTH rule: no edits to RD_DSP source from this repo — submodule pointer bumps only.

So pulsar wiring is **blocked on a new RD_DSP increment**. Increments 2/3 above landed in SYNTH and remain valid (synth shim works, just not yet driven). Real display loop will mirror the same shape into pulsar once RD_DSP exposes its wavetable.

### [ ] 3a. RD_DSP — expose PulsarTrain wavetable (DO IN RD_DSP REPO)
- **FILES CHANGING:** `SOURCE/PULSAR/PulsarTrain.h`, `.cpp` (in RD_DSP repo).
- **WHY:** Pulsar shim needs access to the live wavetable to call `fillDisplayBuffer` against its current wave-pos.
- Add `const Wavetable& getWavetable() const noexcept { return *mWavetable; }` (or equivalent).
- Bump RD_DSP `VERSION.txt`, tag, push.

### [x] 3b. WEB_SYNTH — bump RD_DSP submodule pointer
- Done in commit `4b8ec24`. Pointer now at `070f0e4` (contains `PulsarTrain::getWavetable()`).

### [x] 3c. PULSAR shim — display buffer storage + exports
- **FILES CHANGING:** `ENGINE/PULSAR/pulsar.cpp`, `ENGINE/PULSAR/CMakeLists.txt`.
- Mirror synth shim work: `mDisplayBuf` member, `pulsar_display_buf_ptr` / `_size` / `pulsar_fill_display_buf` exports. `fillDisplayBuf()` calls `mTrain.getWavetable().fillDisplayBuffer(...)`.
- Add three exports to PULSAR `EXPORTED_FUNCTIONS`.
- `python SCRIPTS/build_synth.py` succeeds (rebuilds pulsar.wasm).

### [x] 3d. PULSAR worklet — handle fill message
- **FILES CHANGING:** `PUBLIC/pulsar-worklet.js`. Same `fillDisplay` pattern as `synth-worklet.js`.

### [x] 4. Host element — request + paint
- **FILES CHANGING:** `PUBLIC/rd-pulsar.js` (host of wave-pos slider) + `index.html` (script tag for `wavetable-display.js`).
- **WHY:** Drive the request from the consumer of the wave-pos control.
- On wave-pos change (existing event/handler):
  - Set a `dirty` flag.
  - Schedule via `requestAnimationFrame` (only one pending at a time).
  - On RAF, if dirty, `port.postMessage({type: 'fillDisplay'})` and clear flag.
- On worklet reply `{type: 'displayBuffer', samples}`:
  - Find the `<recluse-wavetable-display>` in the shadow root.
  - Assign `el.samples = samples;`.
- Add `<recluse-wavetable-display>` to the shadow DOM template alongside the existing controls.
- Import the bundle: `<script type="module" src="SUBMODULES/RECLUSE_UI/dist/wavetable-display.js"></script>` in `index.html` (or `import` from inside the host element if already module-loading siblings).

### [x] 5. End-to-end manual test
- **FILES CHANGING:** none.
- **WHY:** Confirm the loop closes.
- `python SCRIPTS/build_synth.py`, serve `PUBLIC/`, open the page.
- Move wave-pos slider through 0 → 1: display should redraw with the interpolated mix shape between adjacent wavetable slots.
- Confirm no console errors, no audio dropouts, no rAF backlog on rapid slider drags.

### [ ] 6. (Optional) Anti-alias upgrade
- **TRIGGER:** Only if visual quality is poor on square/saw at 128 samples.
- Either: ask RD_DSP for `fillDisplayBufferAveraged` (RD_DSP plan increment 4) and switch the shim call to use it; or apply canvas-side smoothing in RECLUSE_UI.
- Decide based on what looks best at the chosen output size. Document the decision in the tracked copy of this plan.

## Out of scope

- No changes to RD_DSP or RECLUSE_UI source from this repo. Submodule pointer bumps only.
- No new build tooling.
- No backend, no persistence — display state is fully derived from wave-pos.

## Hard rules reminder

- Allman braces in new C++/JS code.
- ALL-CAPS top-level dirs.
- Python for any new build/dev script under `SCRIPTS/`.
- Standalone wasm shape preserved (`STANDALONE_WASM=1`, `--no-entry`, no emcc JS glue).
