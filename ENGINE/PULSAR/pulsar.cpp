// ENGINE/PULSAR/pulsar.cpp
// Web-side equivalent of RD/PROCESSORS/PULSAR/PulsarProcessor.
// C-ABI shim wrapping rd_dsp::PulsarTrain. Mirrors SYNTH module shape:
// 128-sample block, zero-copy output via exported buffer pointer.
//
// PulsarTrain's Wavetable ctor already populates sine/tri/square/saw via
// fillWithBasicShapes — no CSV load needed; wave_position interpolates across them.

#include "PULSAR/PulsarTrain.h"

class PulsarProcessor
{
public:
    static constexpr int kBlockSize = 128;

    void prepare(double sampleRate)
    {
        mTrain.prepare(sampleRate, kBlockSize);
        mGain = 0.3f;
    }

    void setEmissionRate(float hz)   { mTrain.setEmissionRate(hz); }
    void setFormantFreq(float hz)    { mTrain.setFormantFreq(hz); }
    void setWavePosition(float pos)  { mTrain.setWavePosition(pos); }
    void setGain(float g)            { mGain = g; }
    void start()                     { mTrain.start(); }
    void stop()                      { mTrain.stop(); }

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
    float mGain = 0.3f;
};

static PulsarProcessor gPulsar;
static float           gOutBuf[PulsarProcessor::kBlockSize];

extern "C" void   pulsar_prepare(double sr)            { gPulsar.prepare(sr); }
extern "C" void   pulsar_set_emission_rate(float hz)   { gPulsar.setEmissionRate(hz); }
extern "C" void   pulsar_set_formant_freq(float hz)    { gPulsar.setFormantFreq(hz); }
extern "C" void   pulsar_set_wave_position(float pos)  { gPulsar.setWavePosition(pos); }
extern "C" void   pulsar_set_gain(float g)             { gPulsar.setGain(g); }
extern "C" void   pulsar_start()                       { gPulsar.start(); }
extern "C" void   pulsar_stop()                        { gPulsar.stop(); }
extern "C" void   pulsar_process()                     { gPulsar.process(gOutBuf); }
extern "C" float* pulsar_get_output_buf()              { return gOutBuf; }
