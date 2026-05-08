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

            this.exports.synth_set_freq(440);
            this.exports.synth_start();
            console.log('synth running, bufPtr:', bufPtr);
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
