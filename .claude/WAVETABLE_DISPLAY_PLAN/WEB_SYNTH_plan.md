# WEB_SYNTH — Wavetable Display Plan

**Mode:** `incremental_educational`. One increment per turn. Plan-first.

**Repo:** `WEB_SYNTH` (this repo). Integrator. Does NOT edit submodule source — only bumps pointers.

The tracked copy of this plan IS this file; update its checkboxes in place as work lands.

## Goal

Bridge `rd_dsp::Wavetable::fillDisplayBuffer` (in the wasm) to a `<recluse-wavetable-display>` custom element (in the page). Main-thread driven, RAF-debounced, zero per-frame allocation past initial setup.

## Preconditions

- [ ] RD_DSP increment 3 landed and tagged (see [`RD_DSP_plan.md`](./RD_DSP_plan.md)).
- [ ] RECLUSE_UI increment 6 landed and `dist/wavetable-display.js` committed (see [`RECLUSE_UI_plan.md`](./RECLUSE_UI_plan.md)).

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

### [ ] 1. Confirm preconditions
- **FILES CHANGING:** none (status check).
- **WHY:** Block on RD_DSP + RECLUSE_UI deliverables before touching shim code.
- Check submodule HEADs against the tagged commits referenced in each plan's increment 5/6.
- Bump submodule pointers:
  - `git submodule update --remote SUBMODULES/RD_DSP`
  - `git submodule update --remote PUBLIC/SUBMODULES/RECLUSE_UI`
- Commit the pointer bumps with a clear message referencing both plans.

### [ ] 2. Shim — display buffer storage + exports
- **FILES CHANGING:** `ENGINE/SYNTH/<host class>.h/.cpp` (whichever class currently owns the `rd_dsp::Wavetable` instance), `ENGINE/SYNTH/synth_c_api.cpp` (or wherever the `extern "C"` exports already live).
- **WHY:** Give JS a stable pointer + fill entry point.
- Add member: `std::vector<float> mDisplayBuf;`. Reserve in the shim's `prepare`-equivalent: `mDisplayBuf.assign(kDisplaySize, 0.f);` where `kDisplaySize = 128` (waveform size 2048 / 16).
- `extern "C"` exports:
  - `float* synth_display_buf_ptr()` — returns `mDisplayBuf.data()`.
  - `int synth_display_buf_size()` — returns `(int)mDisplayBuf.size()`.
  - `void synth_fill_display_buf()` — calls `mWavetable.fillDisplayBuffer(mDisplayBuf.data(), (int)mDisplayBuf.size())`.
- Add the three function names to the `EXPORTED_FUNCTIONS` list in `ENGINE/SYNTH/CMakeLists.txt` (`_synth_display_buf_ptr`, `_synth_display_buf_size`, `_synth_fill_display_buf` — leading underscore is the emscripten convention).
- **CONVENTION NOTES:** Standalone wasm + `EXPORTED_FUNCTIONS` is how we keep emcc from dead-stripping these symbols (they have no JS-glue caller). The leading underscore is the C-name-mangling artifact emscripten expects.
- `python SCRIPTS/build_synth.py` succeeds.

### [ ] 3. Worklet — handle fill message
- **FILES CHANGING:** `PUBLIC/synth-worklet.js`.
- **WHY:** Worklet is the only thing that can call wasm exports (it owns the instance).
- On `port.onmessage` with `{type: 'fillDisplay'}`:
  - Call `instance.exports.synth_fill_display_buf()`.
  - Read pointer + size: `const ptr = instance.exports.synth_display_buf_ptr();` `const n = instance.exports.synth_display_buf_size();`
  - Construct view: `new Float32Array(instance.exports.memory.buffer, ptr, n)`.
  - Copy to a transferable: `const copy = new Float32Array(view);`
  - `this.port.postMessage({type: 'displayBuffer', samples: copy}, [copy.buffer]);`
- **CONVENTION NOTES:** Transferable arrays move ownership rather than copy across the worklet boundary — cheap. We make ONE allocation per fill on the worklet side (the `copy`), which is fine: this runs at human-display rate, not audio rate.

### [ ] 4. Host element — request + paint
- **FILES CHANGING:** `PUBLIC/rd-pulsar.js` (or whichever element currently owns the wavetable UI — likely the same one that controls wave-pos).
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

### [ ] 5. End-to-end manual test
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
