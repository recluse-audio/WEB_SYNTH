class PulsarProcessor extends AudioWorkletProcessor
{
    constructor()
    {
        super();
        this.exports = null;
        this.view = null;
        this.port.onmessage = (e) => this._onMessage(e.data);
    }

    async _onMessage(msg)
    {
        if (msg.type === 'wasm')
        {
            const { instance } = await WebAssembly.instantiate(msg.bytes, {});
            this.exports = instance.exports;
            this.exports._initialize();
            this.exports.pulsar_prepare(sampleRate);

            const bufPtr = this.exports.pulsar_get_output_buf();
            this.view = new Float32Array(this.exports.memory.buffer, bufPtr, 128);

            this.exports.pulsar_set_emission_rate(10);
            this.exports.pulsar_set_formant_freq(440);
            this.exports.pulsar_set_wave_position(0);
            this.exports.pulsar_set_gain(0.3);
            console.log('pulsar ready, bufPtr:', bufPtr);
        }
        else if (msg.type === 'emissionRate')
        {
            if (!this.exports) return;
            this.exports.pulsar_set_emission_rate(msg.value);
        }
        else if (msg.type === 'formantFreq')
        {
            if (!this.exports) return;
            this.exports.pulsar_set_formant_freq(msg.value);
        }
        else if (msg.type === 'wavePos')
        {
            if (!this.exports) return;
            this.exports.pulsar_set_wave_position(msg.value);
        }
        else if (msg.type === 'gain')
        {
            if (!this.exports) return;
            this.exports.pulsar_set_gain(msg.value);
        }
        else if (msg.type === 'start')
        {
            if (!this.exports) return;
            this.exports.pulsar_start();
        }
        else if (msg.type === 'stop')
        {
            if (!this.exports) return;
            this.exports.pulsar_stop();
        }
    }

    process(inputs, outputs, params)
    {
        const out = outputs[0][0];

        if (!this.exports)
        {
            out.fill(0);
            return true;
        }

        this.exports.pulsar_process();
        out.set(this.view);
        return true;
    }
}

registerProcessor('pulsar', PulsarProcessor);
