# WEB_SYNTH POC Plan — Path 3 (AudioWorklet + Rust→Wasm sine)

**Goal:** Sine wave from a Rust DSP module, running in an AudioWorkletProcessor, audible in a browser tab. End-to-end shape only.

**Integration target:** `C:\REPOS\PROJECTS\RECLUSE_WEBSITE` — static site, plain HTML/JS, Cloudflare worker for auth. Build standalone here; integration is a later increment.

**Audience note:** User is a C++/DSP veteran, zero Rust. Each Rust-touching step gets a short C++/DSP analogue. Web stack gets slightly more hand-holding.

---

## Status legend

- `[ ]` not started
- `[~]` in progress
- `[x]` done
- `[!]` blocked / needs user action

After every increment, this file is updated: status flipped, notes appended under the increment, anything learned that affects later steps surfaced near the top.

---

## Top-of-file running notes

(Empty until first increment lands.)

---

## Increment 0 — Toolchain install / verify  `[ ]`

**What:** Confirm Rust nightly + `wasm32-unknown-unknown` target installed. Install if missing.

**Why:** Rust compiles to native by default. Need a wasm target so `cargo build --target wasm32-unknown-unknown` produces a `.wasm` file the browser can load.

**Install (only if missing):**
- `rustup` from https://rustup.rs (user runs interactive install)
- `rustup default stable` — stable is fine for POC; nightly only needed for SIMD intrinsics later
- `rustup target add wasm32-unknown-unknown`

**Test:**
- `rustc --version` → prints version
- `rustup target list --installed` → includes `wasm32-unknown-unknown`

**C++ analogue:** Like adding an embedded toolchain triple to your compiler — `arm-none-eabi-gcc` for ARM, except here it's `wasm32` for the browser sandbox.

---

## Increment 1 — Cargo project skeleton  `[ ]`

**What:** Create `engine/sine/` Rust crate. `Cargo.toml` declares `crate-type = ["cdylib"]`. `src/lib.rs` with one stub fn `extern "C" fn add(a: f32, b: f32) -> f32`.

**Why:**
- `cdylib` = produce a dynamic library (here, a `.wasm` file) instead of a Rust binary.
- `extern "C"` = C ABI, no Rust name mangling. Browser sees plain function names.
- Stub fn proves the toolchain end-to-end before any DSP.

**Install:** none (toolchain already covers it).

**Files:**
```
engine/sine/Cargo.toml
engine/sine/src/lib.rs
```

**Test:**
- `cd engine/sine && cargo build --release --target wasm32-unknown-unknown`
- `target/wasm32-unknown-unknown/release/sine.wasm` exists, non-empty
- `wasm2wat` (optional) shows exported `add` — skip if not installed

**C++ analogue:** `Cargo.toml` ≈ CMakeLists. `cdylib` ≈ `add_library(sine SHARED)`. `extern "C"` works the same as in C++.

---

## Increment 2 — Sine generator in pure Rust + unit test  `[ ]`

**What:** Replace stub with a sine oscillator. Phase-accumulator style. Functions exposed:
- `init(sample_rate: f32)`
- `set_freq(hz: f32)`
- `process(out_ptr: *mut f32, len: usize)` — fill buffer with sine samples.

State stored in a `static mut` block (single-instance for POC; revisit later).

**Why:** Get DSP correct in isolation before adding browser complexity. `*mut f32` + `len` is the raw shared-memory pattern used between worklet JS and wasm.

**Install:** none.

**Test (cargo, host-native, NOT wasm):**
- Add a `#[cfg(test)] mod tests` block.
- Test: init at 48000, set_freq 480, process 100 samples. Assert sample[0] ≈ 0, samples cross zero ~10 times (period = 100 samples). Tolerance ±0.05.
- `cargo test` — runs natively, no wasm needed.

**C++ analogue:** Identical to a JUCE-style `prepare`/`setFrequency`/`processBlock`. `*mut f32` ≈ `float*`. `static mut` ≈ file-scope global, with a Rust safety wart (must wrap in `unsafe`) — don't worry about it for POC.

---

## Increment 3 — Build script / copy step  `[ ]`

**What:** A one-liner script (`build.ps1` or `Justfile` recipe) that runs `cargo build --release --target wasm32-unknown-unknown` then copies the `.wasm` into `public/sine.wasm`.

**Why:** Browser fetches `.wasm` over HTTP. Convention: serve from a `public/` dir.

**Install:** optionally `cargo install just` if user wants `Justfile` style. PowerShell script works fine without it.

**Test:** Run script. Confirm `public/sine.wasm` exists and matches the `target/.../sine.wasm` byte-size.

---

## Increment 4 — Static server + HTML scaffold  `[ ]`

**What:**
- `public/index.html` — single button "Start", empty `<script type="module" src="main.js">`.
- `public/main.js` — stub: on click, create `AudioContext`, log "ctx running".
- Pick a static server: `npx serve public` (no install — uses npx) or Python `python -m http.server -d public 8080`.

**Why:** Browsers block `AudioContext` until user gesture (autoplay policy). `file://` URLs cannot load `AudioWorklet` modules — must be served over HTTP/HTTPS.

**Install:** Node (likely already present) or Python (already present).

**Test:** Open `http://localhost:<port>`. Click button. DevTools console shows `state: "running"`.

---

## Increment 5 — AudioWorklet skeleton (silent)  `[ ]`

**What:**
- `public/sine-worklet.js` — defines `class SineProcessor extends AudioWorkletProcessor` with a `process(inputs, outputs, params)` that writes zeros (silence). `registerProcessor('sine', SineProcessor)`.
- `main.js` — `await ctx.audioWorklet.addModule('sine-worklet.js')`, `new AudioWorkletNode(ctx, 'sine')`, connect to `ctx.destination`.

**Why:** Decouples the audio-thread plumbing from wasm loading. If silence works, the worklet is wired correctly. If it doesn't, the wasm step would only confuse.

**Install:** none.

**Test:** Click Start. No errors in console. CPU meter shows the worklet is alive (or add a `console.log` once on first `process` call — note: worklet `console.log` shows in main devtools).

---

## Increment 6 — Load wasm inside worklet  `[ ]`

**What:**
- Main thread fetches `sine.wasm` as `ArrayBuffer`, posts it to the worklet via `node.port.postMessage({ wasm })`.
- Worklet receives, `WebAssembly.instantiate(wasm)`, stores `exports`, calls `init(sampleRate)`.
- `process()` still writes zeros — wasm just loaded, not driving samples yet.

**Why:** AudioWorklets cannot use `fetch` directly (no `window`). Main thread fetches, ships bytes via `MessagePort`. Standard pattern.

**Install:** none.

**Test:** Console log on successful instantiation: `"wasm loaded, exports: [init, set_freq, process]"`. No audio change yet.

---

## Increment 7 — Drive samples from wasm  `[ ]`

**What:**
- Allocate a wasm-memory buffer once (write a Rust `alloc(len)` fn returning `*mut f32`, OR reuse a fixed static buffer of 128 samples — POC pick: static buffer, simpler).
- Each `process()` call: call wasm `process(ptr, 128)`, read 128 floats out of `wasm.memory.buffer` via a `Float32Array` view, copy into `outputs[0][0]`.

**Why:** This is the hot path. 128-sample blocks at 48 kHz = ~2.7 ms. No allocation, no message-passing per block.

**Install:** none.

**Test:** Click Start → continuous tone audible. Set Rust default freq to 440 Hz. Confirm by ear (or oscilloscope in DevTools → Web Audio panel if installed).

---

## Increment 8 — Frequency control from UI  `[ ]`

**What:**
- HTML `<input type="range" min="50" max="2000" value="440">`.
- On `input` event, `node.port.postMessage({ type: 'freq', value: hz })`.
- Worklet `port.onmessage` calls wasm `set_freq(hz)`.

**Why:** Proves bidirectional control plane works. Slider → main → port → worklet → wasm.

**Install:** none.

**Test:** Drag slider, pitch tracks smoothly. No clicks (phase continuity is preserved because phase accumulator persists across blocks).

---

## Increment 9 — Recluse website integration sketch  `[ ]`

**What:** Decide where this lives on `recluse.tools`. Options:
- (a) New page `/SYNTH/index.html` in `RECLUSE_WEBSITE` repo, copy `public/` contents in.
- (b) Subdomain `synth.recluse.tools`, deploy this repo's `public/` separately.
- (c) Cloudflare Worker route serves wasm/JS from this repo.

Pick one with the user. Document choice here. No code yet — this is a planning checkpoint.

**Why:** Don't pre-commit deployment shape until POC sounds correct.

**Test:** N/A — design decision.

---

## Increment 10 — Hardening review (post-POC)  `[ ]`

Punch list to revisit once sine is audible end-to-end:

- Replace `static mut` with a proper instance-per-worklet pattern.
- Decide raw wasm vs. `wasm-bindgen` (raw is fine for now).
- `SharedArrayBuffer` for sample-accurate parameter automation (needs COOP/COEP headers).
- Multi-voice / polyphony architecture.
- Build pipeline: `wasm-opt`, watch mode, source maps for wasm.
- Module structure: how does a second DSP node (e.g. filter) plug in?
- Test strategy beyond hand-checks: headless audio capture? snapshot of first N samples?

---

## Open questions to resolve as we go

- Build runner: PowerShell script vs. `just`? (Default to `.ps1` until friction appears.)
- Bundler: keep raw `<script type="module">` or introduce Vite when complexity grows? (Default: raw until it hurts.)
- Where does `engine/` live — top-level of WEB_SYNTH repo, yes. Confirmed.
