// <rd-synth> Web Component — embeddable synth instance.
// Each element owns one AudioWorkletNode. AudioContext + worklet module + wasm
// bytes are shared across instances when possible.

const WORKLET_URL = new URL('./synth-worklet.js', import.meta.url).href;
const WASM_URL    = new URL('./synth.wasm',        import.meta.url).href;

let defaultContext = null;
const workletLoaded = new WeakMap(); // ctx -> Promise<void>
let wasmBytesPromise = null;

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
    // Each instance needs its own copy because postMessage transfer detaches.
    return wasmBytesPromise.then(buf => buf.slice(0));
}

const TEMPLATE = `
<style>
    :host
    {
        --rd-bg:        #1a1a1a;
        --rd-fg:        #e8e8e8;
        --rd-accent:    #ff6b00;
        --rd-border:    #2a2a2a;
        --rd-radius:    8px;
        --rd-pad:       12px;
        --rd-width:     320px;

        display: inline-block;
        width: var(--rd-width);
        font-family: ui-sans-serif, system-ui, sans-serif;
        color: var(--rd-fg);
        background: var(--rd-bg);
        border: 1px solid var(--rd-border);
        border-radius: var(--rd-radius);
        padding: var(--rd-pad);
        box-sizing: border-box;
    }

    .row
    {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 8px;
    }

    button
    {
        background: var(--rd-accent);
        color: #000;
        border: 0;
        border-radius: 4px;
        padding: 6px 12px;
        font: inherit;
        cursor: pointer;
    }

    button[disabled]
    {
        opacity: 0.5;
        cursor: default;
    }

    label
    {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        width: 100%;
    }

    input[type="range"]
    {
        flex: 1;
        accent-color: var(--rd-accent);
    }

    output
    {
        min-width: 4ch;
        text-align: right;
        font-variant-numeric: tabular-nums;
    }
</style>

<div class="row">
    <button part="start" id="start">Start</button>
    <button part="stop"  id="stop" disabled>Stop</button>
</div>
<div class="row">
    <label part="freq-label">
        Freq
        <input part="freq-slider" type="range" id="freq" min="50" max="2000" value="440">
        <output id="freqOut">440</output> Hz
    </label>
</div>
`;

export class RdSynth extends HTMLElement
{
    constructor()
    {
        super();
        this._ctx     = null;
        this._node    = null;
        this._started = false;
        this.attachShadow({ mode: 'open' }).innerHTML = TEMPLATE;
    }

    set audioContext(ctx)
    {
        if (this._node) throw new Error('rd-synth: audioContext must be set before first start');
        this._ctx = ctx;
    }

    get audioContext()
    {
        return this._ctx;
    }

    connectedCallback()
    {
        const root      = this.shadowRoot;
        const startBtn  = root.getElementById('start');
        const stopBtn   = root.getElementById('stop');
        const freq      = root.getElementById('freq');
        const freqOut   = root.getElementById('freqOut');

        startBtn.addEventListener('click', async () =>
        {
            await this._ensureNode();
            this._node.port.postMessage({ type: 'start' });
            this._started = true;
            startBtn.disabled = true;
            stopBtn.disabled  = false;
        });

        stopBtn.addEventListener('click', () =>
        {
            if (!this._node) return;
            this._node.port.postMessage({ type: 'stop' });
            this._started = false;
            startBtn.disabled = false;
            stopBtn.disabled  = true;
        });

        freq.addEventListener('input', (e) =>
        {
            const value = +e.target.value;
            freqOut.value = value;
            if (this._node) this._node.port.postMessage({ type: 'freq', value });
        });
    }

    async _ensureNode()
    {
        if (this._node) return;

        if (!this._ctx) this._ctx = getDefaultContext();
        if (this._ctx.state === 'suspended') await this._ctx.resume();

        await ensureWorkletLoaded(this._ctx);

        this._node = new AudioWorkletNode(this._ctx, 'synth');
        this._node.connect(this._ctx.destination);

        const bytes = await getWasmBytes();
        this._node.port.postMessage({ type: 'wasm', bytes }, [bytes]);

        const initialFreq = +this.shadowRoot.getElementById('freq').value;
        this._node.port.postMessage({ type: 'freq', value: initialFreq });
    }
}

customElements.define('rd-synth', RdSynth);
