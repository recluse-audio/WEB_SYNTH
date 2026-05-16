// <rd-pulsar> Web Component — embeddable Pulsar instance.
// UI owned by <recluse-pulsar-synth> (RECLUSE_UI submodule).
// This file: AudioWorklet + wasm wiring only.

const WORKLET_URL = new URL('./pulsar-worklet.js', import.meta.url).href;
const WASM_URL    = new URL('./pulsar.wasm',        import.meta.url).href;

let defaultContext = null;
const workletLoaded = new WeakMap();
let wasmBytesPromise = null;

const PARAM_MAP =
{
    emission: 'emissionRate',
    formant:  'formantFreq',
    wavePos:  'wavePos',
    gain:     'gain'
};

function getDefaultContext()
{
    if (!defaultContext) defaultContext = new AudioContext();
    return defaultContext;
}

function ensureWorkletLoaded(ctx)
{
    let p = workletLoaded.get(ctx);
    if (!p)
    {
        p = ctx.audioWorklet.addModule(WORKLET_URL);
        workletLoaded.set(ctx, p);
    }
    return p;
}

function getWasmBytes()
{
    if (!wasmBytesPromise)
    {
        wasmBytesPromise = fetch(WASM_URL).then(r => r.arrayBuffer());
    }
    return wasmBytesPromise.then(buf => buf.slice(0));
}

export class RdPulsar extends HTMLElement
{
    constructor()
    {
        super();
        this._ctx  = null;
        this._node = null;
        this.attachShadow({ mode: 'open' }).innerHTML = '<recluse-pulsar-synth></recluse-pulsar-synth>';
    }

    set audioContext(ctx)
    {
        if (this._node) throw new Error('rd-pulsar: audioContext must be set before first start');
        this._ctx = ctx;
    }

    get audioContext()
    {
        return this._ctx;
    }

    connectedCallback()
    {
        const ui = this.shadowRoot.querySelector('recluse-pulsar-synth');

        ui.addEventListener('start', async () =>
        {
            await this._ensureNode();
            this._node.port.postMessage({ type: 'start' });
        });

        ui.addEventListener('stop', () =>
        {
            if (!this._node) return;
            this._node.port.postMessage({ type: 'stop' });
        });

        ui.addEventListener('paramchange', (e) =>
        {
            if (!this._node) return;
            const type = PARAM_MAP[e.detail.param];
            if (!type) return;
            this._node.port.postMessage({ type, value: e.detail.value });
        });
    }

    async _ensureNode()
    {
        if (this._node) return;

        if (!this._ctx) this._ctx = getDefaultContext();
        if (this._ctx.state === 'suspended') await this._ctx.resume();

        await ensureWorkletLoaded(this._ctx);

        this._node = new AudioWorkletNode(this._ctx, 'pulsar');
        this._node.connect(this._ctx.destination);

        // Worklet posts {type:'ready'} once wasm is instantiated and prepared.
        const ready = new Promise((resolve) =>
        {
            const onReady = (e) =>
            {
                if (e.data && e.data.type === 'ready')
                {
                    this._node.port.removeEventListener('message', onReady);
                    resolve();
                }
            };
            this._node.port.addEventListener('message', onReady);
            this._node.port.start();
        });

        const bytes = await getWasmBytes();
        this._node.port.postMessage({ type: 'wasm', bytes }, [bytes]);

        await ready;

        const ui = this.shadowRoot.querySelector('recluse-pulsar-synth');
        this._node.port.postMessage({ type: 'emissionRate', value: +ui.emission });
        this._node.port.postMessage({ type: 'formantFreq',  value: +ui.formant  });
        this._node.port.postMessage({ type: 'wavePos',      value: +ui.wavePos  });
        this._node.port.postMessage({ type: 'gain',         value: +ui.gain     });
    }
}

customElements.define('rd-pulsar', RdPulsar);
