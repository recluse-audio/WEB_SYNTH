# WEB_SYNTH — Pulsar Activity Flash Plan

**Mode:** `incremental_educational`. One increment per turn. Plan-first.

**Repo:** `WEB_SYNTH` (this repo). Integrator. Does NOT edit submodule source — only bumps pointers.

The tracked copy of this plan IS this file; update its checkboxes in place as work lands.

## Goal

Bridge `rd_dsp::PulsarTrain::isActive()` from the wasm to a boolean `active` prop on `<recluse-wavetable-display>` (embedded in `<recluse-pulsar-synth>`). Polling driven from `window.requestAnimationFrame` on the browser main thread. Throttle to ≤25 Hz redraws when emission rate > 30 Hz.

## Preconditions

- [ ] RD_DSP plan increment 5 landed (`PulsarTrain::isActive()` exposed and tagged).
- [ ] RECLUSE_UI plan landed (display element accepts `active` prop, pulsar-synth passes it through).

If either is `[ ]`, this plan stops at increment 0 and waits.

## Architecture

```
            main thread                                audio thread
 ┌─────────────────────────────────┐         ┌──────────────────────────────┐
 │ rd-pulsar.js                    │         │ AudioWorkletProcessor        │
 │   requestAnimationFrame loop:   │         │   process(): writes          │
 │     port.postMessage(           │         │     mTrain.processBlock(...) │
 │       'queryActive')            │────────►│   which writes the           │
 │   on reply 'active' message:    │◄────────│     atomic<bool> mIsActive   │
 │     if changed → forward to UI  │ port    │                              │
 │     skip when 40ms guard active │ message │   on 'queryActive' message:  │
 │                                 │         │     reads flag, posts        │
 │ <recluse-pulsar-synth>          │         │     {type:'active', on:bool} │
 │   .active = bool                │         └──────────────────────────────┘
 │   └─ <recluse-wavetable-display>│
 │        .active = bool           │
 └─────────────────────────────────┘
```

**Why this transport (MessagePort poll), not SharedArrayBuffer:** SharedArrayBuffer requires cross-origin isolation headers (COOP/COEP) on the page — extra deploy config. MessagePort posts are cheap (~µs) at 60 Hz. Audio-thread cost is just the read of one atomic. Keep it simple for v1; revisit if profiling shows port traffic mattering.

## Increments

### [ ] 0. Confirm preconditions, bump submodule pointers
- **FILES CHANGING:** `SUBMODULES/RD_DSP` (pointer), `PUBLIC/SUBMODULES/RECLUSE_UI` (pointer), commit message.
- **WHY:** Block on RD_DSP + RECLUSE_UI deliverables before touching shim code.
- `git submodule update --remote SUBMODULES/RD_DSP`
- `git submodule update --remote PUBLIC/SUBMODULES/RECLUSE_UI`
- Verify the new commits contain `PulsarTrain::isActive()` and `<recluse-wavetable-display>` `active` prop respectively.
- Commit pointer bumps with a clear message referencing both plans.

### [ ] 1. PULSAR shim — `pulsar_is_active` export
- **FILES CHANGING:** `ENGINE/PULSAR/pulsar.cpp`, `ENGINE/PULSAR/CMakeLists.txt`.
- **WHY:** Surface the DSP flag to JS.
- Add free function near other `extern "C"` exports:
  ```cpp
  extern "C" EMSCRIPTEN_KEEPALIVE
  int pulsar_is_active()
  {
      return g_pulsar && g_pulsar->mTrain.isActive() ? 1 : 0;
  }
  ```
  (Exact symbol shape matches existing pattern in `pulsar.cpp`; field name `mTrain` to confirm against file.)
- Add `_pulsar_is_active` to `EXPORTED_FUNCTIONS` in `ENGINE/PULSAR/CMakeLists.txt`.
- `python SCRIPTS/build_synth.py` succeeds; rebuilds `PUBLIC/pulsar.wasm`.

### [ ] 2. PULSAR worklet — answer `queryActive` messages
- **FILES CHANGING:** `PUBLIC/pulsar-worklet.js`.
- **WHY:** Worklet owns the wasm instance; only it can call exports. Main thread asks via MessagePort.
- In the existing `port.onmessage` handler, add a case:
  ```js
  case 'queryActive':
  {
      const on = !!instance.exports.pulsar_is_active();
      port.postMessage({ type: 'active', on });
      break;
  }
  ```
- No audio-thread work added inside `process()`. The query handler runs on the worklet's task loop, not in the audio render callback.

### [ ] 3. `rd-pulsar.js` — requestAnimationFrame poll + throttle + edge detect
- **FILES CHANGING:** `PUBLIC/rd-pulsar.js`.
- **WHY:** Browser-side polling loop. Decides when to ask. Forwards to UI on change.
- State on the host element:
  - `this._activeRafId = 0;`
  - `this._lastActiveOn = null;` (tri-state: null = not yet known)
  - `this._lastPaintAt = 0;` (timestamp in ms)
  - `this._emissionRate = 0.125;` (cache current emission rate; already known when `emission` param is set — capture there)
- In `_ensureNode()` after wasm `ready`, start the poll loop:
  ```js
  const tick = (now) =>
  {
      this._activeRafId = requestAnimationFrame(tick);
      // Throttle: when emission > 30 Hz, cap repaints to 25 Hz (40 ms).
      const cap = this._emissionRate > 30 ? 40 : 0;
      if (cap > 0 && (now - this._lastPaintAt) < cap) return;
      this._node.port.postMessage({ type: 'queryActive' });
  };
  this._activeRafId = requestAnimationFrame(tick);
  ```
- In the port `message` listener, add an `active` case:
  ```js
  if (e.data && e.data.type === 'active')
  {
      if (e.data.on !== this._lastActiveOn)
      {
          this._lastActiveOn = e.data.on;
          this._lastPaintAt = performance.now();
          const ui = this.shadowRoot.querySelector('recluse-pulsar-synth');
          if (ui) ui.active = e.data.on;
      }
  }
  ```
- In `paramchange` handler, when `param === 'emission'`, update `this._emissionRate = denormalize(value, r.min, r.max);`.
- Stop the loop on disconnect: add `disconnectedCallback() { if (this._activeRafId) cancelAnimationFrame(this._activeRafId); }`.
- **CONVENTION NOTES:** Pattern = "render-thread polls, audio thread answers". Same shape as `_requestDisplayFill` already in this file, but on a steady cadence instead of dirty-flag triggered.

### [ ] 4. End-to-end manual test
- **FILES CHANGING:** none.
- **WHY:** Confirm the loop closes and the throttle behaves.
- Test matrix:
  - Emission = 1 Hz → display flashes once per second, clearly visible.
  - Emission = 5 Hz → flashes 5x/sec, still visibly discrete.
  - Emission = 30 Hz → strobe-y but unthrottled (≤30 transitions/sec; below the 30 Hz threshold).
  - Emission = 50 Hz → throttle engages; display appears steady or coarse-flicker, never paints faster than 25 Hz. Verify with DevTools performance trace.
  - Tab backgrounded → loop pauses (requestAnimationFrame behavior); resumes on refocus.
  - No audio dropouts, no console errors, no rAF backlog.

### [ ] 5. (Optional) Reduce port traffic
- **TRIGGER:** Only if 60 Hz port polling shows up in profiling.
- Two options:
  - Have the worklet only post `active` when value changes (worklet caches `_lastPosted`). Cuts 60 → ~2 msgs/sec at low emission.
  - SharedArrayBuffer + `Atomics.load`. Requires COOP/COEP headers on the dev server.
- Decide based on profile data.

## Out of scope

- No changes to RD_DSP or RECLUSE_UI source from this repo. Submodule pointer bumps only.
- No new build tooling.
- No persistence; state derives from current emission cycle.

## Hard rules reminder

- Allman braces in new C++/JS code.
- ALL-CAPS top-level dirs.
- Python for any new build/dev script under `SCRIPTS/`.
- Standalone wasm shape preserved (`STANDALONE_WASM=1`, `--no-entry`, no emcc JS glue).
