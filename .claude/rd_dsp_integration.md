# RD_DSP integration guidelines (WEB_SYNTH side)

Contract between WEB_SYNTH and RD_DSP. WEB_SYNTH consumes RD_DSP as a git submodule, cross-compiled to wasm via Emscripten. RD_DSP also consumed natively by JUCE plugins and its own offline test/standalone harness.

This file is the WEB_SYNTH-side view of the contract. RD_DSP should mirror these constraints in its own `.claude/` (or treat this as authoritative — link from there).

---

## 1. Linkage shape

WEB_SYNTH consumes RD_DSP via:

```cmake
# WEB_SYNTH/CMakeLists.txt
set(BUILD_TESTS      OFF CACHE BOOL "" FORCE)
set(BUILD_STANDALONE OFF CACHE BOOL "" FORCE)
add_subdirectory(SUBMODULES/RD_DSP)
# ...
target_link_libraries(sine PRIVATE RD_DSP)
```

- Submodule path: `WEB_SYNTH/SUBMODULES/RD_DSP/`.
- `BUILD_TESTS=OFF` — skips Catch2 FetchContent. Wasm build must not download Catch2.
- `BUILD_STANDALONE=OFF` — skips CLI demo target, irrelevant for wasm.
- `target_link_libraries(<wasm-target> PRIVATE RD_DSP)` — emcc cross-compiles RD_DSP source into wasm objects, links into single `.wasm`. No DLL/shared-lib step (wasm has no shared-lib loader anyway).

## 2. Wasm-compatibility constraints (RD_DSP source rules)

RD_DSP source consumed publicly by WEB_SYNTH must compile under emcc. That means:

**Forbidden in headers consumed by WEB_SYNTH (i.e. anything under `SOURCE/`):**
- `#include <juce_*.h>` — JUCE only acceptable under `TESTS/` or `STANDALONE/` (private subdirs not exposed to consumers).
- `<thread>`, `<mutex>`, `<atomic>` synchronization primitives that assume threads (atomics for lock-free flags are OK).
- `<filesystem>` — not on emcc by default.
- `<chrono>` system clocks — fine on wasm but rarely needed in DSP; avoid as discipline.
- `<iostream>` — works but bloats wasm binaries; prefer `<cstdio>` or no I/O at all.
- OS-specific headers (`windows.h`, POSIX-only).
- Inline assembly, intrinsics tied to x86/ARM. SIMD via portable wrapper or `#if defined(__EMSCRIPTEN__)` branch with `<wasm_simd128.h>`.
- C++ exceptions in hot path. emcc disables exceptions by default; enabling adds 30 KB+ and runtime cost. Use error returns or `std::optional` instead.
- RTTI (`dynamic_cast`, `typeid`) — disabled by default in our builds.
- Heap allocation in `process()` / per-block hot path. Construction-time allocation is fine. STL containers OK in init path.

**Required:**
- `#pragma once` (or include guards) in every header.
- All headers must be self-contained (compile when included alone).
- `target_include_directories(RD_DSP PUBLIC SOURCE)` is the contract — consumers `#include "sine.h"` (or `#include "rd_dsp/sine.h"` if you nest, see §4).

## 3. API style for state-bearing DSP modules

A typical RD_DSP voice-level module exposes a **per-sample** API. The C++ wrapper in WEB_SYNTH (or any consumer) handles block iteration. Example:

```cpp
// SOURCE/rd_dsp/oscillator.h
#pragma once
namespace rd_dsp
{
    enum class Waveform { Sine, Saw, Square, Triangle };

    class Oscillator
    {
    public:
        void  init(float sample_rate);
        void  setWaveform(Waveform w);
        void  setFreq(float hz);
        void  reset();
        float getNextSample();          // per-sample; consumers loop

    private:
        float    mPhase    = 0.0f;
        float    mPhaseInc = 0.0f;
        float    mSr       = 48000.0f;
        Waveform mWaveform = Waveform::Sine;
    };
}
```

- **Class with state**, not file-scope statics. Consumers (WEB_SYNTH, RD JUCE plugin) instantiate per voice.
- **`getNextSample()`** is the canonical hot-path call for voice modules. Must be cheap, allocation-free, branch-light. Inlining-friendly (keep it small in the header or `inline`).
- **`init(float sr)`** captures sample rate. Called once before any sample call.
- **`setFreq(float)` / `setWaveform(Waveform)`** style for parameter setters. Can be called between samples; must be cheap. Sample-accurate automation comes later via SharedArrayBuffer.
- **`reset()`** clears phase / accumulators / one-pole state to a known starting point. Called on note-on, voice steal, etc.
- **Default-constructible** so consumers can declare `Oscillator mOscillator;` as a member then `mOscillator.init(sr)` later.
- **No virtual methods** unless polymorphism is genuinely needed. WEB_SYNTH wraps these in `extern "C"` shims; no vtable cost across the boundary.
- **`m`-prefix members** (`mPhase`, `mSr`) — matches user's JUCE convention.
- **Block-level processing** (`processBlock(float*, int)`) reserved for processors that genuinely need a window — FFT, convolution, lookahead limiters. Add as a separate method on those classes; do not retrofit voice modules.

## 4. Include layout — flat vs. nested

Two options for header layout under `SOURCE/`:

**Option A (current `target_include_directories` matches this):** flat headers.
```
SOURCE/sine.h
SOURCE/biquad.h
```
Consumer code: `#include "sine.h"`. Short. Risks name collisions with consumer's own `sine.h`.

**Option B:** nested under a `rd_dsp/` subdir.
```
SOURCE/rd_dsp/sine.h
SOURCE/rd_dsp/biquad.h
```
Consumer code: `#include "rd_dsp/sine.h"` or `#include <rd_dsp/sine.h>`. No collisions. Conventional for libraries that may sit next to other libraries' headers.

WEB_SYNTH prefers **Option B** for collision safety and convention. RD_DSP should restructure to `SOURCE/rd_dsp/` and update `regenSource.py` accordingly. The cost is one mkdir; no consumer impact yet since WEB_SYNTH isn't including anything yet.

## 5. WEB_SYNTH wrapper-layer convention — paired processor classes

WEB_SYNTH's `ENGINE/<MODULE>/` dirs contain a **C++ processor class** that owns one or more `rd_dsp::` instances as members, plus a thin `extern "C"` shim. The matching JS `AudioWorkletProcessor` subclass lives in `PUBLIC/`. Both classes share the same conceptual name (e.g. `SynthProcessor`) — C++ side handles DSP composition, JS side handles audio-thread wiring.

**C++ side — WEB_SYNTH/ENGINE/SYNTH/synth_processor.cpp:**
```cpp
#include "rd_dsp/oscillator.h"

class SynthProcessor
{
public:
    void prepare(float sr)            { mOscillator.init(sr); }
    void setWaveform(int w)           { mOscillator.setWaveform((rd_dsp::Waveform)w); }
    void setFreq(float hz)            { mOscillator.setFreq(hz); }
    void reset()                      { mOscillator.reset(); }

    void process(float* out, int n)
    {
        for (int i = 0; i < n; ++i)
            out[i] = mOscillator.getNextSample();
    }

private:
    rd_dsp::Oscillator mOscillator;   // member, NOT file-scope static
};

static SynthProcessor gSynth;          // single-instance for POC; opaque handle later

extern "C" void prepare(float sr)         { gSynth.prepare(sr); }
extern "C" void set_waveform(int w)       { gSynth.setWaveform(w); }
extern "C" void set_freq(float hz)        { gSynth.setFreq(hz); }
extern "C" void reset()                   { gSynth.reset(); }
extern "C" void process(float* out, int n) { gSynth.process(out, n); }
```

- DSP objects are **class members** with `m`-prefix Hungarian (`mOscillator`, `mEnvelope`, `mFilter`). Matches user's JUCE convention. No file-scope `static rd_dsp::Foo g_foo` — that pattern is rejected.
- The C++ processor class composes multiple `rd_dsp::` modules (oscillator + envelope + filter) into one logical voice or synth.
- One `extern "C"` shim per public method — translates name-mangled C++ member calls into the C ABI the wasm module exports.
- File-scope `static SynthProcessor gSynth` is a POC concession (single voice). Multi-voice → return opaque handles from `extern "C" void* create()` and accept them in subsequent calls.

**JS side — WEB_SYNTH/PUBLIC/synth-worklet.js:**
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

- Same class name across the boundary — `SynthProcessor` (C++) and `SynthProcessor` (JS) are deliberately paired.
- Naming convention: snake_case `extern "C"` exports (`set_freq`, `set_waveform`) so JS reads naturally; PascalCase / camelCase on the C++ class methods (`setFreq`, `setWaveform`) keeps it idiomatic for the JUCE-trained reader.

**Sample API style — single-sample vs. block:**

`rd_dsp::Oscillator` exposes `getNextSample()` (per-sample), not `processBlock()`. The C++ shim turns AudioWorklet's per-block call into a per-sample loop. No overhead — `getNextSample` inlines through `process`. This is the canonical RD_DSP shape: per-sample for voice-level modules, per-block reserved for FFT/convolution-style processors that genuinely need bigger windows.

## 6. Versioning / submodule etiquette

- WEB_SYNTH pins RD_DSP at a specific commit via the submodule. Bump deliberately, not casually.
- Breaking API changes in RD_DSP: note in commit message clearly. Bump WEB_SYNTH submodule + adjust shims in same PR/commit when convenient.
- RD_DSP `VERSION.txt` is informational only; submodule pin is the real source of truth.

## 7. Build verification (after wiring submodule)

End-to-end check:

1. `cd WEB_SYNTH; git submodule status` shows RD_DSP at expected commit.
2. `python SCRIPTS/build_sine.py --clean` configures + builds without:
   - Network requests (Catch2 not fetched — `BUILD_TESTS=OFF` honored).
   - Errors about JUCE / threads / filesystem (RD_DSP source clean of those).
3. `PUBLIC/sine.wasm` produced; `add` symbol replaced by `init`/`set_freq`/`process` (verify with `grep -ao "[a-zA-Z_][a-zA-Z_0-9]*" PUBLIC/sine.wasm | grep -E "^(init|set_freq|process)$"`).
4. RD_DSP own native build still passes: `cd ../RD_DSP; <its build flow>` — submodule consumption hasn't broken native side.

## 8. Testing boundary

- **DSP correctness tests live in RD_DSP**, run natively via Catch2 + JUCE harness. WEB_SYNTH does not host DSP tests.
- **WEB_SYNTH testing** = browser audio output, AudioWorklet wiring, control-plane round-trips. Eventually headless audio capture / sample snapshots. Not a concern for POC.
- A regression in `rd_dsp::Sine` should be caught by RD_DSP's tests, not by listening for buzzes in WEB_SYNTH.
