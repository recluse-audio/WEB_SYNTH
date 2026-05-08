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
- 2026-05-07: **Architecture pivot — DSP moves to RD_DSP repo.** WEB_SYNTH becomes web-glue + wasm shim layer; pure C++ DSP lives in standalone `RD_DSP` library, also consumed natively by JUCE plugins. WEB_SYNTH consumes RD_DSP via git submodule at `SUBMODULES/RD_DSP/`. Inc 2 reframed: no native test in WEB_SYNTH (DSP tests live in RD_DSP via Catch2 + JUCE harness). Integration contract: see `.claude/rd_dsp_integration.md`.

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

## Increment 2 — Wire RD_DSP submodule + paired `SynthProcessor` (C++ + JS)  `[ ]`

**Architecture:** DSP code lives in standalone `RD_DSP` repo. WEB_SYNTH consumes via git submodule. `ENGINE/<MODULE>/` holds a C++ processor class owning `rd_dsp::` instances as members; matching JS `AudioWorkletProcessor` lives in `PUBLIC/`. Same conceptual name on both sides. See `.claude/rd_dsp_integration.md` for the full contract.

**What:**
1. RD_DSP must expose `rd_dsp::Oscillator` (header + source) per integration doc § 3.
   - Per-sample API: `init(float sr)`, `setWaveform(Waveform)`, `setFreq(float)`, `reset()`, `getNextSample()`.
   - Class with state (`mPhase`, `mPhaseInc`, `mSr`, `mWaveform`), `m`-prefix members.
   - `enum class Waveform { Sine, Saw, Square, Triangle }` in same header.
   - For Inc 2 only Sine path needs to actually generate; other waveforms can return 0.
   - `#pragma once`, namespace `rd_dsp`, no JUCE / threads / filesystem.
2. Rename WEB_SYNTH module: `ENGINE/SINE/` → `ENGINE/SYNTH/`. The wasm artifact becomes `synth.wasm`. (SINE was the stub-era name; once the C++ class is `SynthProcessor` and the JS is `synth-worklet.js`, "SYNTH" matches.)
3. Add submodule to WEB_SYNTH: `git submodule add ../RD_DSP SUBMODULES/RD_DSP`.
4. Update WEB_SYNTH root `CMakeLists.txt`:
   ```cmake
   set(BUILD_TESTS      OFF CACHE BOOL "" FORCE)
   set(BUILD_STANDALONE OFF CACHE BOOL "" FORCE)
   add_subdirectory(SUBMODULES/RD_DSP)
   add_subdirectory(ENGINE/SYNTH)
   ```
5. Rewrite `ENGINE/SYNTH/synth_processor.cpp` per integration doc § 5:
   - C++ class `SynthProcessor` with `rd_dsp::Oscillator mOscillator` member.
   - Methods: `prepare`, `setWaveform`, `setFreq`, `reset`, `process(float*, int)`.
   - File-scope `static SynthProcessor gSynth` for POC single-instance.
   - `extern "C"` shims: `prepare`, `set_waveform`, `set_freq`, `reset`, `process`.
6. Update `ENGINE/SYNTH/CMakeLists.txt`:
   - `target_link_libraries(synth PRIVATE RD_DSP)`.
   - `EXPORTED_FUNCTIONS=[_prepare,_set_waveform,_set_freq,_reset,_process]`.
   - Post-build copies to `PUBLIC/synth.wasm`.
7. Rename build script: `SCRIPTS/build_sine.py` → `SCRIPTS/build_synth.py`.
8. Run `python SCRIPTS/regenSource.py` → emits `CMAKE/SYNTH_SOURCES.cmake`.

**Why:** Decouples DSP correctness from web plumbing. RD_DSP's tests (Catch2 + JUCE harness) verify sine math offline; WEB_SYNTH only proves the wasm shim + AudioWorklet wiring.

**Test:**
- DSP correctness: `cd RD_DSP; <build + run Tests>` (Catch2 unit tests pass for `Oscillator` Sine path).
- Integration: `python SCRIPTS/build_synth.py --clean` produces `PUBLIC/synth.wasm` with `prepare`, `set_waveform`, `set_freq`, `reset`, `process` exports. `add` symbol gone. No Catch2 fetched during wasm build.

**JUCE analogue:** RD_DSP plays the role JUCE's `dsp::` namespace does — pure DSP math, framework-agnostic. WEB_SYNTH's shim is the equivalent of a JUCE plugin's `AudioProcessor::processBlock` wrapper that adapts the host's buffer format.

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
- `PUBLIC/sine-worklet.js` — `class SineProcessor extends AudioWorkletProcessor`. `process(inputs, outputs, params)` writes zeros. `registerProcessor('sine', SineProcessor)`.
- `main.js` — `await ctx.audioWorklet.addModule('sine-worklet.js')`, `new AudioWorkletNode(ctx, 'sine')`, connect to `ctx.destination`.

**Why:** Decouple audio-thread plumbing from wasm loading. If silence works, worklet wired correctly.

**Test:** Click Start. No console errors. `console.log` once on first `process` call (logs from worklet appear in main devtools).

---

## Increment 6 — Load wasm inside worklet  `[ ]`

**What:**
- Main thread fetches `sine.wasm` as `ArrayBuffer`, posts to worklet via `node.port.postMessage({ wasm })`.
- Worklet `port.onmessage`: `WebAssembly.instantiate(wasm, imports)`, store `exports`, call `init(sampleRate)`.
- `process()` still writes zeros.

**Imports object:** standalone wasm from emcc with no libc usage needs nothing. If `<cmath>` pulls in any imports (rare with `STANDALONE_WASM`), provide `env.emscripten_*` stubs as needed — discovered empirically.

**Why:** AudioWorklets cannot use `fetch` (no `window`). Main thread fetches, ships bytes via `MessagePort`. Standard pattern.

**Test:** Console log `"wasm loaded, exports: [init, set_freq, process, memory, ...]"`. No audio change yet.

---

## Increment 7 — Drive samples from wasm  `[ ]`

**What:**
- In C++, declare a static buffer `float g_buf[128];` with an exported getter `extern "C" float* get_buf() { return g_buf; }`.
- Worklet on init: `bufPtr = exports.get_buf()`, then construct `view = new Float32Array(exports.memory.buffer, bufPtr, 128)`.
- Each `process()`: call `exports.process(bufPtr, 128)`, copy `view` into `outputs[0][0]`.

**Why:** Hot path. 128-sample blocks at 48 kHz = ~2.7 ms. No allocation, no message-passing per block. `Float32Array` view is a zero-copy peek into wasm linear memory.

**Test:** Click Start → continuous tone audible. C++ default 440 Hz. Confirm by ear.

---

## Increment 8 — Frequency control from UI  `[ ]`

**What:**
- HTML `<input type="range" min="50" max="2000" value="440">`.
- On `input`: `node.port.postMessage({ type: 'freq', value: hz })`.
- Worklet `port.onmessage` calls `exports.set_freq(hz)`.

**Why:** Bidirectional control plane works. Slider → main → port → worklet → wasm.

**Test:** Drag slider, pitch tracks smoothly. No clicks (phase accumulator persists across blocks).

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

- Build runner: bash script vs. CMake/Emscripten-CMake? Default to `build.sh` until friction.
- emsdk PATH scoping: build scripts self-source `$EMSDK_DIR/emsdk_env.sh` (default `/c/emsdk`). No global PATH mutation, no `.bashrc` edit, no `--permanent`. Confirmed 2026-05-07.
- Bundler: keep raw `<script type="module">` or introduce Vite when complexity grows? Default raw until it hurts.
- `ENGINE/` lives top-level of WEB_SYNTH repo. Confirmed.
- Naming: ALL CAPS for top-level dirs (`ENGINE/`, `PUBLIC/`). Confirmed 2026-05-06.
