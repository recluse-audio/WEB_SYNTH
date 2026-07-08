/** This was created by Ryan Devens in 2026*/

#include "OSCILLATOR/Oscillator.h"
#include "WAVEFORM/Wavetable.h"
#include "RD_BUFFER/RD_Buffer.h"

#include <vector>

// This class owns the RD_DSP classes and is
class SynthProcessor
{
public:
    static constexpr int kBlockSize     = 128;
    static constexpr int kWaveformSize  = 2048;
    static constexpr int kDisplaySize   = 128;  // waveformSize / 16

    SynthProcessor() : mOscillator(mWavetable) {}

    void prepare(double sampleRate)
    {
        mWavetable.fillWithBasicShapes(kWaveformSize);
        mProcessBuffer.setSize(1, kBlockSize);
        mOscillator.prepare(sampleRate, kBlockSize);
        mDisplayBuf.assign(kDisplaySize, 0.f);
    }

    float* displayBufPtr()        { return mDisplayBuf.data(); }
    int    displayBufSize() const { return (int)mDisplayBuf.size(); }
    void   fillDisplayBuf()       { mWavetable.fillDisplayBuffer(mDisplayBuf.data(), (int)mDisplayBuf.size()); }

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
    std::vector<float> mDisplayBuf;
};

static SynthProcessor gSynth;
static float          gOutBuf[SynthProcessor::kBlockSize];

extern "C" void   synth_prepare(double sr)   { gSynth.prepare(sr); }
extern "C" void   synth_set_freq(float hz)   { gSynth.setFreq(hz); }
extern "C" void   synth_start()              { gSynth.start(); }
extern "C" void   synth_stop()               { gSynth.stop(); }
extern "C" void   synth_process()            { gSynth.process(gOutBuf); }
extern "C" float* synth_get_output_buf()     { return gOutBuf; }
extern "C" float* synth_display_buf_ptr()    { return gSynth.displayBufPtr(); }
extern "C" int    synth_display_buf_size()   { return gSynth.displayBufSize(); }
extern "C" void   synth_fill_display_buf()   { gSynth.fillDisplayBuf(); }
