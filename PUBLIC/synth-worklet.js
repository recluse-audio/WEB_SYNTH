class SynthProcessor extends AudioWorkletProcessor
{
    constructor()
    {
        super();
        this.exports = null;
        this.view = null;
        this.diagLogged = false;
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

        if (!this.diagLogged)
        {
            this.diagLogged = true;
            console.log('diag — outputs:', outputs.length, 'channels:', outputs[0].length,
                'block:', out.length, 'view[0..3]:', this.view[0], this.view[1], this.view[2], this.view[3],
                'out[0..3]:', out[0], out[1], out[2], out[3]);
        }

        return true;
    }
}

registerProcessor('synth', SynthProcessor);
