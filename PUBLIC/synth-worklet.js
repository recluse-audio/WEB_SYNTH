class SynthProcessor extends AudioWorkletProcessor
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
            this.exports.synth_prepare(sampleRate);

            const bufPtr = this.exports.synth_get_output_buf();
            this.view = new Float32Array(this.exports.memory.buffer, bufPtr, 128);

            this.port.postMessage({ type: 'ready' });
        }
        else if (msg.type === 'freq')
        {
            if (!this.exports) return;
            this.exports.synth_set_freq(msg.value);
        }
        else if (msg.type === 'start')
        {
            if (!this.exports) return;
            this.exports.synth_start();
        }
        else if (msg.type === 'stop')
        {
            if (!this.exports) return;
            this.exports.synth_stop();
        }
        else if (msg.type === 'fillDisplay')
        {
            if (!this.exports) return;
            this.exports.synth_fill_display_buf();
            const ptr  = this.exports.synth_display_buf_ptr();
            const n    = this.exports.synth_display_buf_size();
            const view = new Float32Array(this.exports.memory.buffer, ptr, n);
            const copy = new Float32Array(view);
            this.port.postMessage({ type: 'displayBuffer', samples: copy }, [copy.buffer]);
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

        this.exports.synth_process();
        out.set(this.view);
        return true;
    }
}

registerProcessor('synth', SynthProcessor);
