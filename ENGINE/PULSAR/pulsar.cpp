// ENGINE/PULSAR/pulsar.cpp
// Web-side equivalent of RD/PROCESSORS/PULSAR/PulsarProcessor.
// C-ABI shim wrapping rd_dsp::PulsarTrain. Mirrors SYNTH module shape:
// 128-sample block, zero-copy output via exported buffer pointer.
//
// PulsarTrain's Wavetable ctor already populates sine/tri/square/saw via
// fillWithBasicShapes — no CSV load needed; wave_position interpolates across them.

#include "PULSAR/PulsarTrain.h"
#include "WAVEFORM/Wavetable.h"

#include <vector>

class PulsarProcessor
{
public:
    static constexpr int kBlockSize   = 128;
    static constexpr int kDisplaySize = 128;

    void prepare(double sampleRate)
    {
        mTrain.prepare(sampleRate, kBlockSize);
        mGain = 0.3f;
        mDisplayBuf.assign(kDisplaySize, 0.f);
    }

    void setEmissionRate(float hz)   { mTrain.setEmissionRate(hz); }
    void setFormantFreq(float hz)    { mTrain.setFormantFreq(hz); }
    void setWavePosition(float pos)  { mTrain.setWavePosition(pos); }
    void setAmp(float amp)           { mTrain.setAmp(amp); }   // per-pulsar amplitude; distinct from master mGain
    void setGain(float g)            { mGain = g; }

    // Stochastic spread. At rest min=max + density 0 collapses to the center
    // setters above. RD_DSP now spreads emission, formant, wavePos, and amp.
    void setEmissionRange(float lo, float hi) { mTrain.setEmissionRange(lo, hi); }
    void setEmissionDensity(float d)          { mTrain.setEmissionDensity(d); }
    void setFormantRange(float lo, float hi)  { mTrain.setFormantRange(lo, hi); }
    void setFormantDensity(float d)           { mTrain.setFormantDensity(d); }
    void setWavePositionRange(float lo, float hi) { mTrain.setWavePositionRange(lo, hi); }
    void setWavePositionDensity(float d)          { mTrain.setWavePositionDensity(d); }
    void setAmpRange(float lo, float hi)      { mTrain.setAmpRange(lo, hi); }
    void setAmpDensity(float d)               { mTrain.setAmpDensity(d); }
    void start()                     { mTrain.start(); }
    void stop()                      { mTrain.stop(); }

    float* displayBufPtr()        { return mDisplayBuf.data(); }
    int    displayBufSize() const { return (int)mDisplayBuf.size(); }
    void   fillDisplayBuf()       { mTrain.getWavetable().fillDisplayBuffer(mDisplayBuf.data(), (int)mDisplayBuf.size()); }
    int    isActive() const       { return mTrain.isActive() ? 1 : 0; }
    int    consumeFlash()         { return mTrain.consumePulsarFlash() ? 1 : 0; }
    // Report-once latch: true if the (emitted or set) wave position moved since
    // the last poll. GUI uses it to regenerate the displayed waveform on change.
    int    consumeWavePosChanged() { return mTrain.consumeWavePositionChanged() ? 1 : 0; }

    void process(float* out)
    {
        float* writePtrs[1] = { out };
        const float* readPtrs[1] = { out };
        mTrain.process(readPtrs, writePtrs, 1, kBlockSize);

        const float g = mGain;
        for (int i = 0; i < kBlockSize; ++i)
            out[i] *= g;
    }

private:
    rd_dsp::PulsarTrain mTrain;
    float               mGain = 0.3f;
    std::vector<float>  mDisplayBuf;
};

static PulsarProcessor gPulsar;
static float           gOutBuf[PulsarProcessor::kBlockSize];

extern "C" void   pulsar_prepare(double sr)            { gPulsar.prepare(sr); }
extern "C" void   pulsar_set_emission_rate(float hz)   { gPulsar.setEmissionRate(hz); }
extern "C" void   pulsar_set_formant_freq(float hz)    { gPulsar.setFormantFreq(hz); }
extern "C" void   pulsar_set_wave_position(float pos)  { gPulsar.setWavePosition(pos); }
extern "C" void   pulsar_set_amp(float amp)            { gPulsar.setAmp(amp); }
extern "C" void   pulsar_set_gain(float g)             { gPulsar.setGain(g); }
extern "C" void   pulsar_set_emission_range(float lo, float hi) { gPulsar.setEmissionRange(lo, hi); }
extern "C" void   pulsar_set_emission_density(float d)          { gPulsar.setEmissionDensity(d); }
extern "C" void   pulsar_set_formant_range(float lo, float hi)  { gPulsar.setFormantRange(lo, hi); }
extern "C" void   pulsar_set_formant_density(float d)           { gPulsar.setFormantDensity(d); }
extern "C" void   pulsar_set_wave_position_range(float lo, float hi) { gPulsar.setWavePositionRange(lo, hi); }
extern "C" void   pulsar_set_wave_position_density(float d)          { gPulsar.setWavePositionDensity(d); }
extern "C" void   pulsar_set_amp_range(float lo, float hi)      { gPulsar.setAmpRange(lo, hi); }
extern "C" void   pulsar_set_amp_density(float d)               { gPulsar.setAmpDensity(d); }
extern "C" void   pulsar_start()                       { gPulsar.start(); }
extern "C" void   pulsar_stop()                        { gPulsar.stop(); }
extern "C" void   pulsar_process()                     { gPulsar.process(gOutBuf); }
extern "C" float* pulsar_get_output_buf()              { return gOutBuf; }
extern "C" float* pulsar_display_buf_ptr()             { return gPulsar.displayBufPtr(); }
extern "C" int    pulsar_display_buf_size()            { return gPulsar.displayBufSize(); }
extern "C" void   pulsar_fill_display_buf()            { gPulsar.fillDisplayBuf(); }
extern "C" int    pulsar_is_active()                   { return gPulsar.isActive(); }
extern "C" int    pulsar_consume_flash()               { return gPulsar.consumeFlash(); }
extern "C" int    pulsar_consume_wave_pos_changed()    { return gPulsar.consumeWavePosChanged(); }
