# Plan — WEB_SYNTH integration of `<recluse-pulsar-synth>`

**Source:** Plan B from RECLUSE_UI (`C:\REPOS\PROJECTS\RECLUSE_UI\.claude\plan-B-web-synth-integration.md`), adapted to WEB_SYNTH house style.
**Run in:** `C:\REPOS\PROJECTS\WEB_SYNTH`.
**Prereq:** RECLUSE_UI Plan A done — `PUBLIC/SUBMODULES/RECLUSE_UI/dist/pulsar-synth.js` exists. As of 2026-05-15, `dist/` has `knob.js`, `meter.js`, `palette-controls.js`, `pulsar-background.js`, `range-slider.js`, `index-*.js` — **no `pulsar-synth.js` yet**. Block on RECLUSE_UI publish before Inc 2.

---

## Status legend

- `[ ]` not started
- `[~]` in progress
- `[x]` done
- `[!]` blocked / needs user action

After every increment, flip status, append notes under the increment, surface anything affecting later steps in top-of-file notes.

---

## Top-of-file running notes

- 2026-05-15: Plan seeded from RECLUSE_UI Plan B. `dist/pulsar-synth.js` not yet published — Inc 1 (submodule bump) is blocked until RECLUSE_UI ships it.
- Audience note: user is C++/DSP veteran, comfortable with web component / Custom Elements basics. Pedagogy bias: shadow DOM composition, CustomEvent bubbling across shadow boundary, submodule bump hygiene.

---

## Context

`PUBLIC/rd-pulsar.js` currently owns the entire Pulsar UI: shadow-DOM `TEMPLATE` (style + 3 range sliders + knob + start/stop buttons) AND worklet/wasm wiring. RECLUSE_UI now publishes `<recluse-pulsar-synth>` which owns the UI half. Goal: strip UI from `rd-pulsar.js`, keep audio wiring only. Layout changes thereafter live exclusively in RECLUSE_UI.

## Goal

`rd-pulsar.js` reduced to:
- instantiate `<recluse-pulsar-synth>` inside shadow root,
- listen for `paramchange` / `start` / `stop` events,
- route to AudioWorklet via existing `_ensureNode` + `port.postMessage`.

Visual parity with current build. `<rd-pulsar>` tag name + public API unchanged.

---

## Increments

### Inc 0 — Verify RECLUSE_UI publish  `[!]`

- Check `PUBLIC/SUBMODULES/RECLUSE_UI/dist/pulsar-synth.js` exists after submodule update.
- Inspect event contract: `paramchange` detail shape (`{ param, value }`), `start`, `stop` events, initial attribute names (`emission`, `formant`, `wave-pos`, `gain`).
- If missing or shape unclear: hand back to RECLUSE_UI session, block here.

### Inc 1 — Bump RECLUSE_UI submodule  `[ ]`

- `git submodule update --remote PUBLIC/SUBMODULES/RECLUSE_UI`
- Commit pointer bump separately from code change. Message: `bump RECLUSE_UI: pulsar-synth component`.

### Inc 2 — Load new bundles in `PUBLIC/index.html`  `[ ]`

- Add module script tags alongside existing `pulsar-background.js`:
  ```html
  <script type="module" src="./SUBMODULES/RECLUSE_UI/dist/knob.js"></script>
  <script type="module" src="./SUBMODULES/RECLUSE_UI/dist/pulsar-synth.js"></script>
  ```
- Order: load before `rd-pulsar.js` so `<recluse-pulsar-synth>` is defined when `rd-pulsar` upgrades.

### Inc 3 — Strip `TEMPLATE` from `rd-pulsar.js`  `[ ]`

- Delete `TEMPLATE` constant (lines 37–159) entirely.
- Replace `this.attachShadow({...}).innerHTML = TEMPLATE;` with:
  ```js
  this.attachShadow({ mode: 'open' }).innerHTML = '<recluse-pulsar-synth></recluse-pulsar-synth>';
  ```

### Inc 4 — Rewrite `connectedCallback` event wiring  `[ ]`

- Remove all `getElementById` lookups + per-control `addEventListener('input', ...)` handlers.
- Single query: `const ui = this.shadowRoot.querySelector('recluse-pulsar-synth');`
- Three listeners on `ui`:
  - `paramchange` → map `e.detail.param` (`emission` → `emissionRate`, `formant` → `formantFreq`, `wavePos` → `wavePos`, `gain` → `gain`), `port.postMessage({ type, value: e.detail.value })`.
  - `start` → `await this._ensureNode(); this._node.port.postMessage({ type: 'start' });`
  - `stop` → guard on `this._node`, then `port.postMessage({ type: 'stop' });`
- Drop `this._started` + button-disable bookkeeping — `<recluse-pulsar-synth>` owns button state.

### Inc 5 — Initial param push from new UI  `[ ]`

- In `_ensureNode`, replace tail-end `port.postMessage` block (lines 274–278) that reads old DOM inputs with reads from `<recluse-pulsar-synth>` attrs:
  ```js
  const ui = this.shadowRoot.querySelector('recluse-pulsar-synth');
  this._node.port.postMessage({ type: 'emissionRate', value: +ui.getAttribute('emission') });
  this._node.port.postMessage({ type: 'formantFreq',  value: +ui.getAttribute('formant') });
  this._node.port.postMessage({ type: 'wavePos',      value: +ui.getAttribute('wave-pos') });
  this._node.port.postMessage({ type: 'gain',         value: +ui.getAttribute('gain') });
  ```
- Alternative: skip if RECLUSE_UI defaults match worklet's compiled-in defaults. Decide after inspecting Inc 0 contract.

### Inc 6 — Keep untouched  `[ ]`

Sanity: `_ensureNode`, `getWasmBytes`, `ensureWorkletLoaded`, `WORKLET_URL`, `WASM_URL`, `defaultContext`, `workletLoaded`, `wasmBytesPromise`, `set audioContext` / `get audioContext` — unchanged.

### Inc 7 — Smoke test in browser  `[ ]`

- Serve `PUBLIC/` (existing dev workflow). AudioWorklet requires HTTP/HTTPS — no `file://`.
- Verify:
  - Start → audio engages.
  - Each slider drag → audible param change.
  - Knob drag → gain changes.
  - Stop → silence.
  - Page-level `data-color-palette="..."` swap recolors Pulsar UI without code change.
- If visual regression vs current build: file diff in RECLUSE_UI session, not here.

### Inc 8 — Dead code sweep  `[ ]`

- Strip unused CSS-var fallbacks / leftover refs in `rd-pulsar.js`.
- Confirm no `<style>` block remains in this file.

---

## Out of scope

- `pulsar-worklet.js`, `pulsar.wasm`, any DSP code.
- `<rd-pulsar>` tag rename / API surface change. External pages keep `<rd-pulsar>`.
- New parameters. Additive UI goes through RECLUSE_UI session.

## Risks

- **Initial value sync.** RECLUSE_UI defaults drift from worklet compiled-in defaults → first interaction jumps. Mitigation: explicit initial push in Inc 5.
- **Submodule HEAD lag.** WEB_SYNTH submodule pin must advance every RECLUSE_UI layout change. Document bump cmd: `git submodule update --remote PUBLIC/SUBMODULES/RECLUSE_UI`.
- **Event shape drift.** If RECLUSE_UI changes `paramchange` detail keys post-integration, silent breakage. Mitigation: pin submodule SHA; bump deliberately.
- **Shadow DOM event retargeting.** `<recluse-pulsar-synth>` inside `<rd-pulsar>`'s shadow root — events bubble within that root. Listening on the inner element directly (not document) avoids retargeting confusion.
