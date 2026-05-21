
class PulsarProcessor extends AudioWorkletProcessor
{
    constructor()
    {
        super();
        this.exports = null;
        this.view = null;
        // Min-flash hold: latch display-on for >=1/15 s after activity so each
        // emission produces a visible, synchronous flash. Sampled per block
        // (audio thread) since the DSP active window is sub-frame-short.
        this.minFlashSamples = Math.round(sampleRate / 15);
        this.displayHold = 0;
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

            this.port.postMessage({ type: 'ready' });
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
        else if (msg.type === 'fillDisplay')
        {
            if (!this.exports) return;
            this.exports.pulsar_fill_display_buf();
            const ptr  = this.exports.pulsar_display_buf_ptr();
            const n    = this.exports.pulsar_display_buf_size();
            const view = new Float32Array(this.exports.memory.buffer, ptr, n);
            const copy = new Float32Array(view);
            this.port.postMessage({ type: 'displayBuffer', samples: copy }, [copy.buffer]);
        }
        else if (msg.type === 'queryActive')
        {
            this.port.postMessage({ type: 'active', on: this.displayHold > 0 });
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

        // Latch min-flash hold on activity; decrement per block otherwise.
        if (this.exports.pulsar_is_active() !== 0)
            this.displayHold = this.minFlashSamples;
        else if (this.displayHold > 0)
            this.displayHold -= out.length;

        return true;
    }
}

registerProcessor('pulsar', PulsarProcessor);
