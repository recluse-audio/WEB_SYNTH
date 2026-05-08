# RD_DSP integration plan (WEB_SYNTH side)

Working plan for wiring `RD_DSP` into WEB_SYNTH as the wasm-bound DSP source. Cross-repo contract + incremental steps. Source of truth for "how WEB_SYNTH consumes RD_DSP" and "what's next on that integration".

Companion to `.claude/plan.md` (overall POC plan). Plan-level Inc 2 (wire submodule + paired `SynthProcessor`) decomposes into the steps below.

---

## Status legend

- `[ ]` not started
- `[~]` in progress
- `[x]` done
- `[!]` blocked / needs user input

After each step lands, flip status, append notes, surface anything that changes later steps.

---

## Top-of-file running notes

- 2026-05-07: Submodule added at `SUBMODULES/RD_DSP/` (commit b73a327). Root `CMakeLists.txt` does NOT yet `add_subdirectory` it — Step 1 below.
- 2026-05-07: Real RD_DSP API differs from earlier integration sketch. Block-rate via `RD_Buffer&` is the canonical hot-path call, not per-sample. Per-sample is achievable (e.g. via `Waveform::getInterpolatedSampleAtIndex`) but suboptimal — block-rate amortizes function-call + branch overhead and matches AudioWorklet's 128-sample render quantum. Plan assumes block-rate.
- 2026-05-07: Real `SOURCE/` layout = `SOURCE/<UPPER_COMPONENT>/<PascalFile>.h` (e.g. `OSCILLATOR/Oscillator.h`). Mirrors JUCE-side RD repo. NOT flat, NOT `rd_dsp/`-nested. Consumer include style: `#include "OSCILLATOR/Oscillator.h"`.
- 2026-05-07: WEB_SYNTH module renamed `ENGINE/SINE/` → `ENGINE/SYNTH/` (Step 2). Stub `add()` symbol still in place; gets replaced in Step 5.
- 2026-05-07: Step 1 build log confirmed RD_DSP cross-compiles clean under emcc — 4 TUs (Oscillator, Waveform, RD_Buffer, BufferFiller). `<string>`/`<fstream>` headers parse fine; real dead-strip test of BufferFiller's CSV path still pending at Step 3 when RD_DSP gets linked into the wasm target.

---

## Ground-truth snapshot of RD_DSP submodule (2026-05-07)

What's actually in `SUBMODULES/RD_DSP/` right now:

```
SOURCE/
  INTERPOLATOR/Interpolator.h            (header-only; static linearInterp)
  OSCILLATOR/Oscillator.{h,cpp}          (block-rate; owns unique_ptr<Waveform>)
  RD_BUFFER/RD_Buffer.{h,cpp}            (juce::AudioBuffer-shaped, float-only)
  RD_BUFFER/BufferFiller.{h,cpp}         (static helpers; one variant uses CSV/<string>)
  WAVEFORM/Waveform.{h,cpp}              (cyclic table; wSine/wTri/wSquare/wSaw)
TESTS/                                    (Catch2 v3; gated by BUILD_TESTS)
STANDALONE/                               (CLI demo; gated by BUILD_STANDALONE)
CMAKE/SOURCES.cmake                       (generated; lists SOURCE files)
CMAKE/TESTS.cmake                         (generated)
HELPER_SCRIPTS/                           (Python build drivers)
.claude/CLAUDE.md                         (mirrored zero-dep / WASM rules)
CMakeLists.txt                            (root; STATIC lib RD_DSP; PUBLIC include = SOURCE/)
VERSION.txt                               (0.0.1)
```

**Real `rd_dsp::Oscillator` API:**
```cpp
class Oscillator
{
public:
    Oscillator();                       // ctor allocates default 8096-sample sine Waveform
    ~Oscillator();
    void prepare(double sampleRate);
    void setFreq(float freq);
    void process(RD_Buffer& buffer);    // block-rate; no-ops if !mIsRunning
    void start();
    void stop();
};
```
- No `reset()`. No `setWaveform()` on Oscillator (Waveform has `setWaveType(WaveType)`).
- `prepare` takes `double`, not `float`.
- `start()` gates `process()` — must call before audio appears.
- Owns `std::unique_ptr<Waveform>` → ctor-time heap alloc (init-path, not hot-path; wasm-OK).

**Real `rd_dsp::RD_Buffer`:** non-copyable, non-movable. Owns `float**` + heap `mAllocatedData`. `setSize(numChannels, numSamples)` reallocates. Has `getReadPointer(int)` / `getWritePointer(int)`. **Always owns its memory** — no "view over external pointer" ctor today (relevant for zero-copy decision in Step 5).

**Real `rd_dsp::Waveform::WaveType`:** `{ wSine, wTri, wSquare, wSaw }` — note `w`-prefix and ordering (Sine, Tri, Square, Saw — Saw last, not Triangle).

---

## 1. Linkage shape

WEB_SYNTH consumes RD_DSP via:

```cmake
# WEB_SYNTH/CMakeLists.txt (after Step 1)
set(BUILD_TESTS      OFF CACHE BOOL "" FORCE)
set(BUILD_STANDALONE OFF CACHE BOOL "" FORCE)
add_subdirectory(SUBMODULES/RD_DSP)
add_subdirectory(ENGINE/SYNTH)
# ENGINE/SYNTH/CMakeLists.txt then: target_link_libraries(synth PRIVATE RD_DSP)
```

- Submodule path: `WEB_SYNTH/SUBMODULES/RD_DSP/`.
- `BUILD_TESTS=OFF` — skips Catch2 FetchContent. Wasm build must not download Catch2.
- `BUILD_STANDALONE=OFF` — skips CLI demo target, irrelevant for wasm.
- `target_link_libraries(<wasm-target> PRIVATE RD_DSP)` — emcc cross-compiles RD_DSP source into wasm objects, links into single `.wasm`. No DLL/shared-lib step.
- RD_DSP's `target_include_directories(... PUBLIC SOURCE)` propagates → consumer writes `#include "OSCILLATOR/Oscillator.h"`.

---

## 2. Wasm-compatibility constraints (RD_DSP source rules)

RD_DSP source consumed by WEB_SYNTH must compile under emcc.

**Forbidden in headers consumed by WEB_SYNTH (anything reachable from `SOURCE/`):**
- `#include <juce_*.h>` — already absent; keep it that way. JUCE only allowed in TESTS/STANDALONE (not exposed to consumers).
- `<thread>`, `<mutex>`, plus `<atomic>` synchronization primitives that assume threads (atomics for lock-free flags are OK).
- `<filesystem>` — not on emcc by default.
- `<chrono>` system clocks — fine on wasm but rarely needed in DSP; avoid as discipline.
- `<iostream>` — works but bloats binaries; prefer `<cstdio>` or no I/O.
- OS-specific headers (`windows.h`, POSIX-only).
- Inline assembly, x86/ARM intrinsics. SIMD via portable wrapper or `#if defined(__EMSCRIPTEN__)` branch with `<wasm_simd128.h>`.
- C++ exceptions in hot path. emcc disables exceptions by default; enabling adds 30 KB+ and runtime cost. Use error returns or `std::optional`.
- RTTI (`dynamic_cast`, `typeid`) — disabled by default.
- Heap allocation in `process()` / per-block hot path. Construction-time allocation (e.g. `RD_Buffer::setSize`, `unique_ptr<Waveform>` in `Oscillator` ctor) is fine.

**Required:**
- `#pragma once` (or include guards) in every header.
- All headers self-contained (compile when included alone).

**Audit findings against current RD_DSP `SOURCE/` (2026-05-07):**
- `Oscillator`, `Waveform`, `RD_Buffer`, `Interpolator` — clean. `<memory>`, `<cstddef>` only. No JUCE / threads / filesystem.
- `BufferFiller` — pulls `<string>`. The CSV-loading static methods (`fillFromCSV`) likely also pull `<fstream>` in their `.cpp`. **Risk:** if WEB_SYNTH never calls `fillFromCSV`, the linker should drop those symbols. **Verify in Step 3** that the wasm build doesn't drag in `<fstream>` / file-I/O syscalls. If it does, options: (a) `--gc-sections` / dead-strip, (b) split BufferFiller's CSV path into a separate TU gated by a macro, (c) move CSV helpers into `TESTS/` since they're test fixtures.

---

## 3. API style for state-bearing DSP modules

**Block-rate is canonical.** The hot-path call on a stateful DSP module is `process(RD_Buffer&)`, called once per audio block. Matches JUCE `dsp::` convention. Matches AudioWorklet's fixed 128-sample render quantum.

Per-sample is achievable (`Waveform::getInterpolatedSampleAtIndex` exists; `Oscillator` could expose one) but **not the default** — extra function-call overhead per sample, harder to vectorize, no upside for typical voice modules. Reserve per-sample APIs for cases where the consumer genuinely needs sample-by-sample control flow (e.g. polyBLEP edge correction, sample-rate conversion).

Existing `rd_dsp::Oscillator` shape (block-rate):
```cpp
namespace rd_dsp
{
    class Oscillator
    {
    public:
        Oscillator();                    // default sine, default 8096-pt table
        ~Oscillator();
        void prepare(double sampleRate);
        void setFreq(float freq);
        void start();                    // gates process(); must be called
        void stop();
        void process(RD_Buffer& buffer); // hot path; allocation-free
    private:
        std::unique_ptr<Waveform> mWaveform;
        float  mCurrentIndex   = 0.f;
        float  mPhaseIncrement = 0.f;
        float  mFrequency      = 0.f;
        double mSampleRate     = 44100.0;
        bool   mIsRunning      = false;
        bool   mPhaseIncrementUpdateNeeded = false;
    };
}
```

**Conventions reaffirmed by ground truth:**
- Class with state, `m`-prefix members. ✓
- Default-constructible. ✓
- `prepare(double sr)` captures sample rate. (Doc earlier said `init(float)` — wrong. Real signature wins.)
- No virtual methods. ✓
- Block-rate `process(RD_Buffer&)` is the hot-path canonical call. (Doc earlier said `getNextSample()` — wrong.)
- `start()` / `stop()` — explicit run-state gate. No `reset()` method exists today.

**Open question (Step 4):** Does WEB_SYNTH need per-voice `reset()` (zero phase + clear pending updates) for clean restart from JS? If yes, add to `rd_dsp::Oscillator` as part of this integration work — small, mechanical change.

---

## 4. Include layout

Real layout: `SOURCE/<UPPER_COMPONENT>/<PascalFile>.h`. UPPERCASE component dirs match WEB_SYNTH's house rule and the JUCE-side RD repo. Consumers include via `#include "OSCILLATOR/Oscillator.h"`.

Earlier debate over flat vs. `rd_dsp/`-nested layout is moot — real code already chose a third path that mirrors RD. No restructure needed.

Collision risk (e.g. consumer's own `Oscillator.h`) is mitigated by the UPPERCASE component prefix in the include path. If a real collision ever surfaces, revisit then — not now.

---

## 5. WEB_SYNTH wrapper-layer convention — paired processor classes

WEB_SYNTH's `ENGINE/<MODULE>/` dir contains a **C++ processor class** that owns one or more `rd_dsp::` instances + `RD_Buffer` workspace, plus a thin `extern "C"` shim. The matching JS `AudioWorkletProcessor` lives in `PUBLIC/`. Both share the conceptual name (`SynthProcessor`).

**C++ side — `WEB_SYNTH/ENGINE/SYNTH/synth_processor.cpp`** (sketch — finalized in Step 5):
```cpp
#include "OSCILLATOR/Oscillator.h"
#include "RD_BUFFER/RD_Buffer.h"

class SynthProcessor
{
public:
    void prepare(double sr, int blockSize)
    {
        mWorkspace.setSize(1, blockSize);   // single-channel, blockSize samples
        mOscillator.prepare(sr);
        mOscillator.start();
    }

    void setFreq(float hz)  { mOscillator.setFreq(hz); }
    void start()            { mOscillator.start(); }
    void stop()             { mOscillator.stop(); }

    // Called once per audio block from the wasm-exported process() shim.
    // Fills wasm-exported output buffer; AudioWorklet's JS view reads it.
    void process(float* out, int n)
    {
        // Workspace must already be sized to n. POC: assume n == blockSize from prepare().
        mWorkspace.clear();                 // or skip if Oscillator overwrites every sample
        mOscillator.process(mWorkspace);
        const float* src = mWorkspace.getReadPointer(0);
        for (int i = 0; i < n; ++i)
            out[i] = src[i];
    }

private:
    rd_dsp::Oscillator mOscillator;
    rd_dsp::RD_Buffer  mWorkspace;          // sized in prepare(); reused every block
};

static SynthProcessor gSynth;               // single-instance for POC; opaque handle later

extern "C" void prepare(double sr, int n) { gSynth.prepare(sr, n); }
extern "C" void set_freq(float hz)        { gSynth.setFreq(hz); }
extern "C" void start_voice()             { gSynth.start(); }    // 'start' clashes with libc start
extern "C" void stop_voice()              { gSynth.stop(); }
extern "C" void process(float* out, int n) { gSynth.process(out, n); }
```

Conventions:
- DSP objects = class members with `m`-prefix Hungarian. No file-scope `static rd_dsp::Foo`.
- File-scope `static SynthProcessor gSynth` is a POC concession (single voice). Multi-voice → opaque handles via `extern "C" void* create()`.
- `extern "C"` shim names = snake_case (matches JS-side reading conventions). C++ class methods = camelCase.
- The C++ shim's `process()` adapts AudioWorklet's per-block call; internally an `RD_Buffer` workspace is filled via `Oscillator::process(buffer)` and copied to the wasm-exported flat output pointer that JS views as a `Float32Array`.

**Adapter strategy — block-rate buffer plumbing.** Three options exist for getting samples from `Oscillator::process(RD_Buffer&)` into the AudioWorklet's `Float32Array`:

| Option | Shape | Cost | RD_DSP change |
|---|---|---|---|
| **(a) Workspace + memcpy** *(POC default)* | `SynthProcessor` owns `RD_Buffer mWorkspace`. `process()` fills it, copies channel 0 to `out` ptr. | One memcpy per block (128 × 4 bytes = 512 B at 48 kHz). Negligible. | None. |
| (b) `RD_Buffer` view-over-external-pointer | Add ctor `RD_Buffer(float** externalChannels, int nCh, int nSamples)` that doesn't own. Wasm-exported buffer becomes channel 0 directly. | Zero-copy. | Small RD_Buffer addition. Affects all consumers. |
| (c) Per-sample on Oscillator | Expose `Oscillator::getNextSample()`. Shim loops. | No RD_Buffer involved on hot path. | Adds non-canonical API to Oscillator. Suboptimal (per running notes). |

Default to **(a)** for POC. (b) is the natural follow-up if/when zero-copy matters — `RD_Buffer` already has `getReadArray()`/`getWriteArray()` returning `float* const*`, so a non-owning view ctor is a small extension. (c) only if (a) and (b) prove unworkable.

**JS side — `WEB_SYNTH/PUBLIC/synth-worklet.js`** (sketch — finalized later in `.claude/plan.md` Inc 5–7):
```js
class SynthProcessor extends AudioWorkletProcessor
{
    constructor()
    {
        super();
        this.port.onmessage = e => this.onMessage(e.data);
    }

    process(inputs, outputs, params)
    {
        this.wasm.process(this.bufPtr, 128);
        outputs[0][0].set(this.view);
        return true;
    }
    // ...wasm bootstrap + control-plane handlers
}
registerProcessor('synth', SynthProcessor);
```

Same class name across the boundary. `extern "C"` exports use snake_case for natural JS reading; PascalCase / camelCase on the C++ class methods stays idiomatic for the JUCE-trained reader.

---

## 6. Versioning / submodule etiquette

- WEB_SYNTH pins RD_DSP at a specific commit via the submodule. Bump deliberately, not casually.
- Breaking API changes in RD_DSP: note in commit message clearly. Bump WEB_SYNTH submodule + adjust shims in same PR/commit when convenient.
- `VERSION.txt` is informational only; submodule pin is the real source of truth.

---

## 7. Testing boundary

- **DSP correctness tests live in RD_DSP**, run natively via Catch2 + (where useful) JUCE harness. WEB_SYNTH does not host DSP tests.
- **WEB_SYNTH testing** = browser audio output, AudioWorklet wiring, control-plane round-trips. Eventually headless audio capture / sample snapshots. Not a concern for POC.
- A regression in `rd_dsp::Oscillator` should be caught by RD_DSP's tests, not by listening for buzzes in WEB_SYNTH.

---

## Incremental steps

### Step 1 — Wire submodule into WEB_SYNTH CMake  `[x]`

**Done 2026-05-07.** Root `CMakeLists.txt` now sets `BUILD_TESTS=OFF`, `BUILD_STANDALONE=OFF`, then `add_subdirectory(SUBMODULES/RD_DSP)`. Build log:
- Configure 1.6s, no network activity (Catch2 not fetched).
- 7 ninja steps: 4 RD_DSP TUs (`Oscillator.cpp`, `Waveform.cpp`, `RD_Buffer.cpp`, `BufferFiller.cpp`) → `BUILD/SINE/SUBMODULES/RD_DSP/libRD_DSP.a`. `sine.wasm` still 215 bytes (RD_DSP archive built, not yet linked into wasm — by design).
- `BufferFiller.cpp` parsed clean under emcc → `<string>`/`<fstream>` compile fine. Real dead-strip test (does the linker drop the CSV path?) lands at Step 3.

---

### Step 2 — Rename `ENGINE/SINE/` → `ENGINE/SYNTH/`  `[x]`

**Done 2026-05-07.** Renames + edits in this pass:
- `git mv ENGINE/SINE ENGINE/SYNTH`, `git mv ENGINE/SYNTH/sine.cpp ENGINE/SYNTH/synth.cpp`, `git mv SCRIPTS/build_sine.py SCRIPTS/build_synth.py`, `git rm CMAKE/SINE_SOURCES.cmake`. Filesystem `PUBLIC/sine.wasm` deleted (gitignored, untracked).
- `ENGINE/SYNTH/CMakeLists.txt`, `SCRIPTS/build_synth.py`, `synth.cpp` rewritten with sine→synth substitutions. Internal target name `synth`, output `PUBLIC/synth.wasm`, build dir `BUILD/SYNTH/`.
- `CMAKE/SYNTH_SOURCES.cmake` written by hand (matches what `regenSource.py` would emit).
- Root `CMakeLists.txt`: `add_subdirectory(ENGINE/SINE)` → `add_subdirectory(ENGINE/SYNTH)`.
- `.claude/CLAUDE.md`: build script + module-name references updated.

Also: `build_synth.py` now invokes `regenSource.main()` as its first step, so source-list regen is no longer a manual step (mirrors RD_DSP's helper-script convention).

**Pending verification (your run):**
- `python SCRIPTS/build_synth.py --clean` — must produce `PUBLIC/synth.wasm` exporting `add`. RD_DSP must still compile (Step 1 carries forward). The hand-written `CMAKE/SYNTH_SOURCES.cmake` should remain unchanged after auto-regen (no-op diff).

**Why before linking:** Pure rename, no behavioral change. Easy to verify in isolation.

---

### Step 3 — Link RD_DSP into the wasm target (no usage yet)  `[x]`

**In progress 2026-05-07.** Done in this pass:
- `ENGINE/SYNTH/CMakeLists.txt`: added `target_link_libraries(synth PRIVATE RD_DSP)`.

**First attempt (held for record):** referenced `static rd_dsp::Oscillator gOsc; gOsc.setFreq(a);` from `add()`. Resulted in `synth.wasm == 215 bytes` (unchanged from pre-link baseline) — `-O3 + --gc-sections` saw `setFreq` had no externally observable effect and dead-stripped the whole gOsc subtree, including its constructor. Lesson: at -O3 the linker is aggressive enough that "reference a symbol" is not the same as "force its code in". Need an exported entry point whose return value depends on the symbol's runtime behavior.

**Second attempt (current):** added `extern "C" float rd_dsp_marker(double sr, float freq)` that constructs a local Oscillator + RD_Buffer per call, runs `prepare`/`setFreq`/`start`/`process`, and returns `buf.getSample(0, 0)`. Locals = per-call heap allocation (Waveform's table) which the optimizer cannot constant-fold. `rd_dsp_marker` added to `EXPORTED_FUNCTIONS=[_add,_rd_dsp_marker]`. Marker is throwaway — Step 5 deletes the whole file.

This forces the linker to keep: Oscillator (ctor + prepare + setFreq + start + process), Waveform (setSize + setWaveType + getSample + table fill), RD_Buffer (setSize + getSample + heap allocator), Interpolator (transitively via Waveform's interpolated read, if used). Does NOT reach `BufferFiller` — that's the dead-strip target for Step 3's main verification.

**Verified 2026-05-07:**
- Build clean. `PUBLIC/synth.wasm` = 13,407 B (was 215 B before linking). Delta ≈ Oscillator + Waveform + RD_Buffer + emscripten malloc/free for the heap-allocated Waveform table.
- `grep -aoE "__wasi_[a-z_]+" PUBLIC/synth.wasm` → empty. No WASI / file-syscall imports.
- `grep -aoE "BufferFiller|fillFromCSV|fopen|fclose|fread" PUBLIC/synth.wasm` → empty. CSV path dead-stripped cleanly. `BufferFiller` does not need to be split or moved — the `<fstream>`/`<string>` audit risk in §2 is resolved.
- Symbol-name grep returned no matches because -O3 strips internal names; only `EXPORTED_FUNCTIONS` symbols survive. Size delta is the positive evidence.

**Why isolated step:** Verifies the cross-compile contract (§ 1, § 2) without yet committing to API shape.

---

### Step 4 — Decide: add `Oscillator::reset()` to RD_DSP?  `[x]`

**Decided 2026-05-07: skip.** User has on/off needs covered by existing `Oscillator::start()` / `stop()` (exposed at Step 5 as `synth_start` / `synth_stop` shims). Phase-zero retrigger (note-on / voice-steal) is not in scope for the POC; revisit when polyphony or MIDI lands.

---

### Step 5 — Build `SynthProcessor` C++ class  `[x]`

**In progress 2026-05-07.** Done in this pass:
- `synth.cpp` rewritten — `SynthProcessor` class wraps `rd_dsp::Oscillator mOscillator` + `rd_dsp::RD_Buffer mWorkspace`. Adapter Option (a): per-block `mWorkspace.clear()` → `mOscillator.process(mWorkspace)` → copy channel 0 into caller's `float* out`. Old `add` + `rd_dsp_marker` symbols deleted.
- File-scope `static SynthProcessor gSynth;` for single-voice POC.
- `extern "C"` shims (all `synth_`-prefixed for collision-safety / clarity):
  - `synth_prepare(double sr, int n)` — sizes workspace, calls `Oscillator::prepare`. Does NOT auto-start (JS controls run state via shims below).
  - `synth_set_freq(float hz)`
  - `synth_start()` / `synth_stop()` — direct passthrough to `Oscillator::start/stop`. The on/off gate the user wanted available immediately.
  - `synth_process(float* out, int n)` — block-rate hot path.
- `ENGINE/SYNTH/CMakeLists.txt`: `EXPORTED_FUNCTIONS=[_synth_prepare,_synth_set_freq,_synth_start,_synth_stop,_synth_process]`.

**Verified 2026-05-07:** Build clean. `PUBLIC/synth.wasm` = 13,723 B (slight bump from Step 3's 13,407 — accounts for the four added shim functions). All 5 `synth_*` exports present in the binary. `__wasi_*` import grep empty. `add` / `rd_dsp_marker` gone.

---

### Step 6 — Export the audio output buffer for zero-copy JS access  `[x]`

**Decided 2026-05-07: internal buffer, C++ owns.** File-scope `static float gOutBuf[128]`. JS calls `synth_get_output_buf()` once at init to get the pointer, wraps as `Float32Array(memory.buffer, ptr, 128)`, then `synth_process()` takes no args and fills `gOutBuf`. Block size hardcoded to 128 (AudioWorklet's W3C-spec render quantum). External-buffer / `_malloc`-based approach deferred — adds plumbing without buying anything for single-voice POC.

**Done in this pass:**
- `synth.cpp`: `SynthProcessor::kBlockSize = 128` constexpr; `prepare(double sr)` no longer takes blockSize; `process(float* out)` no longer takes n; new `synth_get_output_buf()` returns `&gOutBuf[0]`.
- `ENGINE/SYNTH/CMakeLists.txt`: `EXPORTED_FUNCTIONS` adds `_synth_get_output_buf`.

**Verified 2026-05-08:** Build clean, `PUBLIC/synth.wasm` = 13,633 B. All 6 exports present including new `synth_get_output_buf`.

**Audible-sine end-to-end is `.claude/plan.md` Inc 4–7 territory** (HTML scaffold + AudioWorklet boot + wasm load + wire JS view). This step gets the wasm side ready for that plumbing.

---

### Step 7 — Verify RD_DSP's own native build still passes  `[x]`

**Verified 2026-05-08.** `cd SUBMODULES/RD_DSP; python HELPER_SCRIPTS/build_tests.py --run` green. WEB_SYNTH integration work confined to WEB_SYNTH side; no RD_DSP source edits made or implied.

---

## Plan complete

All 7 steps `[x]`. WEB_SYNTH wasm now consumes RD_DSP cleanly via submodule with all the contract guarantees from §1–§7. Wasm exports the 6-symbol public API ready for the AudioWorklet bootstrap (`.claude/plan.md` Inc 4–7).

---

## End-to-end build verification (after Steps 1–5)

1. `cd WEB_SYNTH; git submodule status` shows RD_DSP at expected commit.
2. `python SCRIPTS/build_synth.py --clean` configures + builds without:
   - Network requests (Catch2 not fetched — `BUILD_TESTS=OFF` honored).
   - Errors about JUCE / threads / filesystem (RD_DSP source clean of those).
   - File-syscall imports in the resulting wasm (BufferFiller CSV path not linked).
3. `PUBLIC/synth.wasm` produced. Exports: `prepare`, `set_freq`, `start_voice`, `stop_voice`, `process`. No `add` symbol.
4. RD_DSP own native build still passes (Step 7).
