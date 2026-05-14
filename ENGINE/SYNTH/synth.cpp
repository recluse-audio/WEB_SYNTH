// ENGINE/SYNTH/synth.cpp
// Step 6: SynthProcessor + internal output buffer exported for zero-copy JS access.
// JS calls synth_get_output_buf() once at init, wraps the pointer as a Float32Array
// view over wasm linear memory, then calls synth_process() per audio block.
//
// Block size hardcoded to 128 = AudioWorklet's fixed render quantum (W3C spec).
// Multi-voice / opaque-handle pattern arrives later (see rd_dsp_integration_plan.md §5).

#include "OSCILLATOR/Oscillator.h"
#include "WAVEFORM/Wavetable.h"
#include "RD_BUFFER/RD_Buffer.h"

class SynthProcessor
{
public:
    static constexpr int kBlockSize     = 128;
    static constexpr int kWaveformSize  = 2048;

    SynthProcessor() : mOscillator(mWavetable) {}

    void prepare(double sampleRate)
    {
        mWavetable.fillWithBasicShapes(kWaveformSize);
        mProcessBuffer.setSize(1, kBlockSize);
        mOscillator.prepare(sampleRate, kBlockSize);
    }

    void setFreq(float hz) { mOscillator.setFreq(hz); }
    void start()           { mOscillator.start(); }
    void stop()            { mOscillator.stop(); }

    // Block-rate hot path. When stopped, Oscillator::process is a no-op;
    // clear() guarantees silence regardless.
    void process(float* out)
    {
        mProcessBuffer.clear();
        mOscillator.process(mProcessBuffer);
        const float* src = mProcessBuffer.getReadPointer(0);
        for (int i = 0; i < kBlockSize; ++i)
            out[i] = src[i];
    }

private:
    rd_dsp::Wavetable  mWavetable;
    rd_dsp::Oscillator mOscillator;
    rd_dsp::RD_Buffer  mProcessBuffer;
};

static SynthProcessor gSynth;
static float          gOutBuf[SynthProcessor::kBlockSize];

extern "C" void   synth_prepare(double sr)   { gSynth.prepare(sr); }
extern "C" void   synth_set_freq(float hz)   { gSynth.setFreq(hz); }
extern "C" void   synth_start()              { gSynth.start(); }
extern "C" void   synth_stop()               { gSynth.stop(); }
extern "C" void   synth_process()            { gSynth.process(gOutBuf); }
extern "C" float* synth_get_output_buf()     { return gOutBuf; }
