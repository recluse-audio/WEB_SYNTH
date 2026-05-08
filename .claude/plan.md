# WEB_SYNTH POC Plan — Path 3b (AudioWorklet + C++→Wasm via Emscripten)

**Goal:** Sine wave from a C++ DSP module compiled to wasm, running in an AudioWorkletProcessor, audible in a browser tab. End-to-end shape only.

**Pivot 2026-05-07:** Originally Rust→Wasm. Switched to C++→Wasm/Emscripten so existing JUCE C++ DSP code can be ported forward without rewriting in a new language. Rust↔C++ wasm interop too friction-heavy for a project whose existing IP is C++.

**Integration target:** `C:\REPOS\PROJECTS\RECLUSE_WEBSITE` — static site, plain HTML/JS, Cloudflare worker for auth. Build standalone here; integration is a later increment.

**Audience note:** User is C++/JUCE/DSP veteran. C++ side gets minimal hand-holding. Web stack (AudioWorklet, MessagePort, browser quirks) gets more.

---

## Status legend

- `[ ]` not started
- `[~]` in progress
- `[x]` done
- `[!]` blocked / needs user action

After every increment, this file is updated: status flipped, notes appended under the increment, anything learned that affects later steps surfaced near top.

---

## Top-of-file running notes

- 2026-05-06: Inc 0 (Rust toolchain) was completed before pivot. Now obsolete — superseded by Emscripten install.
- 2026-05-07: Pivoted Rust → Emscripten. Reason: user's existing DSP catalog is JUCE C++; want straight port path.
- 2026-05-07: Build invokes `python emcc.py` directly (not `emcc.bat`, not via `emsdk_env.sh`). Cleaner — no PATH mutation, no cmd.exe shim. Build script captures EMSDK_DIR + EMSDK_PYTHON as overridable env vars.
- 2026-05-07: Migrated build to CMake + Ninja. See Inc 1 notes.
- 2026-05-07: **Architecture pivot — DSP moves to RD_DSP repo.** WEB_SYNTH becomes web-glue + wasm shim layer; pure C++ DSP lives in standalone `RD_DSP` library, also consumed natively by JUCE plugins. WEB_SYNTH consumes RD_DSP via git submodule at `SUBMODULES/RD_DSP/`. Inc 2 reframed: no native test in WEB_SYNTH (DSP tests live in RD_DSP via Catch2 + JUCE harness). Integration contract + step-by-step wiring plan: see `.claude/rd_dsp_integration_plan.md`.
- 2026-05-08: **Inc 2 complete.** C++/wasm side ready for Inc 4 onward. Build: `python SCRIPTS/build_synth.py [--clean]`. Artifact: `PUBLIC/synth.wasm` (~13.6 KB). Six exports the JS side will call:
  - `synth_prepare(double sr)` — one-time init.
  - `synth_set_freq(float hz)` — parameter setter.
  - `synth_start()` / `synth_stop()` — run-state gate. Default = stopped (silence).
  - `synth_process()` — block-rate hot path; fills the internal output buffer.
  - `synth_get_output_buf() -> float*` — pointer into wasm linear memory; JS wraps with `Float32Array(memory.buffer, ptr, 128)` for zero-copy reads.
  Block size hardcoded to **128 samples** = AudioWorklet's W3C-spec render quantum. RD_DSP linked clean (no WASI imports; `BufferFiller`'s CSV path dead-stripped).

---

## Increment 0 — Emscripten install / verify  `[x]`

**Done 2026-05-07:** emsdk at `C:\emsdk`, emcc 5.0.7. Two Windows gotchas:
- `emsdk_env.sh` itself shells to `python` and hits Windows Store stub. Must `export EMSDK_PYTHON=/c/Users/rdeve/AppData/Local/Programs/Python/Python312/python.exe` **before** sourcing.
- Windows emsdk ships only `emcc.bat`/`.ps1`/`.py` — no bash/no-ext wrapper. Git Bash doesn't auto-resolve `.bat`. Use `emcc.bat` in scripts.

**What:** Install Emscripten SDK (emsdk) and confirm `emcc` on PATH.

**Why:** Emscripten = LLVM-based C++ → Wasm compiler. Wraps clang. Produces `.wasm` + optional JS glue.

**Install (Windows, Git Bash):**
```bash
cd /c/                              # or wherever you keep tools
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh               # per-shell; or add to .bashrc
```

**Test:**
- `emcc --version` → prints version
- `emcc -v` → shows clang target `wasm32-unknown-emscripten`

**JUCE analogue:** Like setting up Projucer's exporter for a new platform — except instead of Xcode/VS, the "platform" is the browser sandbox.

---

## Increment 1 — C++ project skeleton + stub fn  `[x]`

**Done 2026-05-07:** `ENGINE/SINE/sine.cpp` (stub `extern "C" float add(float, float)`).

**Migrated to CMake 2026-05-07:**
- Root `CMakeLists.txt` (thin: `project(WEB_SYNTH CXX)`, C++20, `add_subdirectory(ENGINE/SINE)`).
- `ENGINE/SINE/CMakeLists.txt` defines `sine` as `add_executable` with wasm-only flags guarded by `if(EMSCRIPTEN)`. Suffix `.wasm`, `-sSTANDALONE_WASM=1 -sEXPORTED_FUNCTIONS=[_add] --no-entry`. Post-build `add_custom_command` copies to `PUBLIC/sine.wasm`.
- `CMAKE/SINE_SOURCES.cmake` (generated) — includes `${CMAKE_SOURCE_DIR}/ENGINE/SINE/sine.cpp`. Per-module variable name (`SINE_SOURCES`).
- `SCRIPTS/regenSource.py` — walks `ENGINE/<MODULE>/`, regenerates per-module `.cmake` source lists. Run by hand on file add/remove. Generated `.cmake` files are committed (contract between filesystem and CMake).
- `SCRIPTS/build_sine.py` rewritten — invokes `emcmake cmake -G Ninja -B BUILD/SINE` then `cmake --build`. `--clean` flag wipes build dir. Prepends Ninja path (winget package dir) to PATH for cmake subprocess since `winget install` doesn't refresh current shell PATH.
- `BUILD/` added to root `.gitignore`.

**Toolchain prereq:** Ninja 1.13.2 installed via `winget install Ninja-build.Ninja`. CMake 3.30.2 already present.

**Build:** `python SCRIPTS/build_sine.py` (from repo root). Output `BUILD/SINE/ENGINE/SINE/sine.wasm` → copied to `PUBLIC/sine.wasm` (215 bytes, `add` symbol verified).

**What:** Create `ENGINE/SINE/`. Single `sine.cpp` with stub `extern "C" float add(float a, float b)`. CMake or plain `emcc` — pick plain `emcc` for POC simplicity.

**Why:**
- `extern "C"` → no C++ name mangling; browser sees plain symbol `_add`.
- One source file, one command. CMake comes later if needed.
- Stub fn proves toolchain end-to-end before touching DSP.

**Files:**
```
ENGINE/SINE/sine.cpp
ENGINE/SINE/build.sh        (one-liner emcc invocation)
```

**emcc flags (POC):**
```
emcc sine.cpp -O3 \
  -s WASM=1 \
  -s STANDALONE_WASM=1 \
  -s EXPORTED_FUNCTIONS='["_add"]' \
  --no-entry \
  -o sine.wasm
```
- `STANDALONE_WASM=1` + `--no-entry` = pure `.wasm`, no JS glue. We'll instantiate manually in worklet (matches how reference repo does raw wasm).
- `-O3` = release optimization.

**Test:**
- `bash build.sh` produces `sine.wasm`, non-empty.
- `wasm2wat sine.wasm | grep export` shows `add` exported (skip if `wabt` not installed).

**JUCE analogue:** `extern "C"` works identically. emcc flags ≈ Projucer "Extra Compiler Flags". `STANDALONE_WASM` ≈ "freestanding" — no host runtime expected.

---

## Increment 2 — Wire RD_DSP submodule + paired `SynthProcessor` (C++ + JS)  `[x]`

**Done 2026-05-08.** C++ side complete; JS pairing happens in Inc 5–8. Decomposed into 7 sub-steps fully tracked in `.claude/rd_dsp_integration_plan.md` (all `[x]`).

**Architecture:** DSP code lives in standalone `RD_DSP` repo. WEB_SYNTH consumes via git submodule at `SUBMODULES/RD_DSP/`. `ENGINE/<MODULE>/` holds a C++ processor class owning `rd_dsp::` instances as members; matching JS `AudioWorkletProcessor` lives in `PUBLIC/`. Same conceptual name on both sides. Real Oscillator API is **block-rate** via `process(RD_Buffer&)` — per-sample is achievable but suboptimal.

**Final shape:** see top-of-file running notes for the 6-symbol export list + buffer convention. Source: `ENGINE/SYNTH/synth.cpp`, `ENGINE/SYNTH/CMakeLists.txt`. Build: `python SCRIPTS/build_synth.py [--clean]` (auto-runs `regenSource.py` first).

**Sub-step decisions worth carrying forward** (full detail in integration plan):
- Adapter pattern: `SynthProcessor` owns an `RD_Buffer mWorkspace`; per block it calls `Oscillator::process(mWorkspace)` then copies channel 0 into the static `gOutBuf[128]`. One memcpy per block — negligible.
- `Oscillator::reset()` not added (skipped — `start`/`stop` gate is enough for POC).
- Internal output buffer (C++ owns) chosen over external (`_malloc`-based) — simpler JS, no `_malloc`/`_free` exports needed.

**JUCE analogue:** RD_DSP plays the role JUCE's `dsp::` namespace does — pure DSP math, framework-agnostic. WEB_SYNTH's shim ≈ a JUCE plugin's `AudioProcessor::processBlock` wrapper adapting the host's buffer format.

---

## Increment 3 — Build script  `[x]`

**Done 2026-05-07:** Folded into Inc 1 (CMake migration). `SCRIPTS/build_sine.py` configures + builds via `emcmake cmake -G Ninja`; CMake post-build copies to `PUBLIC/sine.wasm`.

---

## Increment 4 — Static server + HTML scaffold  `[ ]`

**What:**
- `PUBLIC/index.html` — single "Start" button, `<script type="module" src="main.js">`.
- `PUBLIC/main.js` — stub: on click, create `AudioContext`, log `state`.
- Static server: `npx serve PUBLIC` (no install) or `python -m http.server -d PUBLIC 8080`.

**Why:** Browsers block `AudioContext` until user gesture (autoplay policy). `file://` URLs cannot load AudioWorklet modules — must be served over HTTP/HTTPS.

**Test:** Open `http://localhost:<port>`. Click button. DevTools console shows `state: "running"`.

---

## Increment 5 — AudioWorklet skeleton (silent)  `[ ]`

**What:**
- `PUBLIC/synth-worklet.js` — `class SynthProcessor extends AudioWorkletProcessor`. `process(inputs, outputs, params)` writes zeros to `outputs[0][0]` and returns `true`. Bottom of file: `registerProcessor('synth', SynthProcessor)`.
- `main.js` — `await ctx.audioWorklet.addModule('synth-worklet.js')`, `new AudioWorkletNode(ctx, 'synth')`, connect to `ctx.destination`.

**Why:** Decouple audio-thread plumbing from wasm loading. If silence renders without errors, the worklet is wired correctly. C++/wasm side stays out of the picture this increment.

**Concept primer (worth knowing before writing code):**
- The worklet `process()` runs on a dedicated **audio thread**, not the main thread. No DOM access. No `console.log` reliability quirks (logs do appear in DevTools, just from a different scope). No `setTimeout`. No `fetch`.
- `process(inputs, outputs, params)` is called every render quantum (128 samples). Return `true` to keep the node alive; `false` shuts it down.
- The C++ class on our side is also called `SynthProcessor`. Deliberate pairing — C++ side already exists (`ENGINE/SYNTH/synth.cpp`); JS side is what this increment creates.

**Test:** Click Start. No console errors. Add a `console.log("worklet alive")` once on first `process` call (gate with a flag) to confirm scheduling.

---

## Increment 6 — Load wasm inside worklet  `[ ]`

**What:**
- Main thread (`main.js`): `fetch('synth.wasm') -> arrayBuffer()`, then `node.port.postMessage({ type: 'wasm', bytes })`.
- Worklet (`synth-worklet.js`): `this.port.onmessage = e => { ... }`. On `'wasm'` message: `WebAssembly.instantiate(bytes, imports)`. Store `instance.exports`. Call `exports.synth_prepare(sampleRate)` once.
- `process()` still writes zeros — wasm loaded but not yet driving audio.

**Why AudioWorklets can't `fetch` themselves:** No `window`, no `self.fetch`. Main thread does the network work, ships the bytes via `MessagePort` (the bidirectional message channel between main thread and worklet, accessible as `node.port` on main side and `this.port` inside the worklet). Standard pattern for any worklet that needs file data.

**Imports object** — second arg to `WebAssembly.instantiate`. Standalone wasm from emcc with `--no-entry` typically needs nothing; pass `{}` and see if it errors. If something like `env.emscripten_*` is missing, provide stubs as the error names them.

**Test:** Console log the keys of `exports` after instantiate — should include all six `synth_*` symbols plus `memory`. No audio change yet.

---

## Increment 7 — Drive samples from wasm  `[ ]`

**C++ side already done.** The wasm exports `synth_get_output_buf()` returning a pointer to the internal 128-float `gOutBuf`, and `synth_process()` fills it. This increment is JS-only.

**What (JS):**
- After `synth_prepare(sampleRate)` in Inc 6, also call:
  ```js
  this.bufPtr = this.exports.synth_get_output_buf();
  this.view   = new Float32Array(this.exports.memory.buffer, this.bufPtr, 128);
  this.exports.synth_start();   // gate the run-state on
  ```
- In `process(inputs, outputs, params)`:
  ```js
  this.exports.synth_process();
  outputs[0][0].set(this.view);
  return true;
  ```

**Why this is zero-copy:** `Float32Array(memory.buffer, ptr, 128)` is a *view*, not a new allocation. JS is reading the same bytes the wasm just wrote — no memcpy across the language boundary. `outputs[0][0].set(view)` does memcpy *within JS* into the worklet's actual output, which is unavoidable.

**Why explicit `synth_start()`:** the C++ `Oscillator` defaults to stopped (`mIsRunning = false`). Without `synth_start()` the buffer stays zeroed every block. Hooking `synth_start()` to the page's "Start" button (matching browser autoplay policy) is one option; calling it once at init is simpler for now.

**Render-quantum math:** 128 samples at 48 kHz = ~2.67 ms per block. Worklet calls `process()` ~375× per second.

**Test:** Click Start → continuous 440 Hz tone audible (Oscillator's default freq via `_calculatePhaseIncrement`). Confirm by ear.

---

## Increment 8 — Frequency control from UI  `[ ]`

**What:**
- HTML: `<input type="range" min="50" max="2000" value="440" id="freq">`.
- `main.js`: `freq.addEventListener('input', e => node.port.postMessage({ type: 'freq', value: +e.target.value }))`.
- Worklet `port.onmessage`: on `'freq'` message → `this.exports.synth_set_freq(msg.value)`.

**Why bidirectional `MessagePort`:** UI events fire on the main thread. Audio-thread state (the wasm `Oscillator`) lives in the worklet. The port is the only path between them. Sending a message is fire-and-forget; no return value, no blocking.

**Test:** Drag slider, pitch tracks smoothly. No audible clicks at boundaries — `Oscillator`'s phase accumulator persists across `setFreq` calls (it just updates `mPhaseIncrement` on the next sample).

---

## Increment 9 — Recluse website integration sketch  `[ ]`

**What:** Decide where this lives on `recluse.tools`:
- (a) New page `/SYNTH/index.html` in `RECLUSE_WEBSITE` repo.
- (b) Subdomain `synth.recluse.tools`, deploy `PUBLIC/` separately.
- (c) Cloudflare Worker route.

Pick with user. Document. No code yet.

---

## Increment 10 — Hardening review (post-POC)  `[ ]`

Punch list once sine audible end-to-end:

- File-scope statics → instance-per-worklet pattern (C++ class, allocate via `new` in `init`, store opaque handle).
- Decide raw wasm vs. emcc default JS glue (raw fine for now; default glue useful if `malloc`/exceptions/threading needed later).
- `SharedArrayBuffer` for sample-accurate parameter automation (needs COOP/COEP headers).
- Multi-voice / polyphony architecture.
- Build pipeline: `wasm-opt` (already in emsdk), watch mode, source maps.
- How a second DSP node (e.g. filter) plugs in.
- Test strategy: headless audio capture, snapshot first N samples.
- Porting JUCE `dsp::` modules — what extracts cleanly, what is host-coupled.

---

## Open questions to resolve as we go

- Bundler: keep raw `<script type="module">` or introduce Vite when complexity grows? Default raw until it hurts.
- TypeScript: stay in plain JS for POC; revisit if file count or complexity demands.
- Static server choice for Inc 4: `python -m http.server -d PUBLIC 8080` (zero deps, fine for local dev) vs. `npx serve PUBLIC` (richer dev features, needs Node). Default to Python until friction.
