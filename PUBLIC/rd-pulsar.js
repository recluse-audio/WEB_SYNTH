// <rd-pulsar> Web Component — embeddable Pulsar instance.
// Mirrors rd-synth.js. Each element owns one AudioWorkletNode.

const WORKLET_URL = new URL('./pulsar-worklet.js', import.meta.url).href;
const WASM_URL    = new URL('./pulsar.wasm',        import.meta.url).href;

let defaultContext = null;
const workletLoaded = new WeakMap();
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
    return wasmBytesPromise.then(buf => buf.slice(0));
}

const TEMPLATE = `
<style>
    :host
    {
        --rd-radius:    8px;
        --rd-pad:       12px;
        --rd-width:     360px;

        display: inline-block;
        width: var(--rd-width);
        font-family: 'BerlinSans', ui-sans-serif, system-ui, sans-serif;
        color: var(--color-text, #e8e8e8);
        background: var(--color-surface, #1a1a1a);
        border: 1px solid var(--color-border, #2a2a2a);
        border-radius: var(--rd-radius);
        padding: var(--rd-pad);
        box-sizing: border-box;
    }

    .bg-banner
    {
        display: block;
        margin: -12px -12px 12px -12px;
    }

    .bg-banner recluse-pulsar-background
    {
        display: block;
    }

    h3
    {
        margin: 0 0 8px 0;
        font-size: 14px;
        font-weight: 600;
        color: var(--color-accent, #ff6b00);
    }

    .gain-row
    {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 8px;
    }

    .gain-row recluse-knob
    {
        flex: 0 0 auto;
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
        background: var(--color-accent, #ff6b00);
        color: var(--color-bg, #000);
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
        font-size: 12px;
        width: 100%;
    }

    .lbl
    {
        min-width: 7ch;
    }

    input[type="range"]
    {
        flex: 1;
        accent-color: var(--color-accent, #ff6b00);
    }

    output
    {
        min-width: 6ch;
        text-align: right;
        font-variant-numeric: tabular-nums;
    }
</style>

<div class="bg-banner">
    <recluse-pulsar-background id="bg" width="336" height="36"></recluse-pulsar-background>
</div>

<h3>Pulsar</h3>
<div class="row">
    <button part="start" id="start">Start</button>
    <button part="stop"  id="stop" disabled>Stop</button>
</div>
<div class="row">
    <label>
        <span class="lbl">Emission</span>
        <input type="range" id="emission" min="0.125" max="150" step="0.125" value="10">
        <output id="emissionOut">10</output> Hz
    </label>
</div>
<div class="row">
    <label>
        <span class="lbl">Formant</span>
        <input type="range" id="formant" min="150" max="2000" step="1" value="440">
        <output id="formantOut">440</output> Hz
    </label>
</div>
<div class="row">
    <label>
        <span class="lbl">Wave Pos</span>
        <input type="range" id="wavePos" min="0" max="1" step="0.001" value="0">
        <output id="wavePosOut">0.00</output>
    </label>
</div>
<div class="gain-row">
    <recluse-knob id="gainKnob" value="0.3" label="Gain"></recluse-knob>
</div>
`;

export class RdPulsar extends HTMLElement
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
        if (this._node) throw new Error('rd-pulsar: audioContext must be set before first start');
        this._ctx = ctx;
    }

    get audioContext()
    {
        return this._ctx;
    }

    connectedCallback()
    {
        const root        = this.shadowRoot;
        const startBtn    = root.getElementById('start');
        const stopBtn     = root.getElementById('stop');
        const emission    = root.getElementById('emission');
        const emissionOut = root.getElementById('emissionOut');
        const formant     = root.getElementById('formant');
        const formantOut  = root.getElementById('formantOut');
        const wavePos     = root.getElementById('wavePos');
        const wavePosOut  = root.getElementById('wavePosOut');
        const gainKnob    = root.getElementById('gainKnob');

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

        emission.addEventListener('input', (e) =>
        {
            const value = +e.target.value;
            emissionOut.value = value;
            if (this._node) this._node.port.postMessage({ type: 'emissionRate', value });
        });

        formant.addEventListener('input', (e) =>
        {
            const value = +e.target.value;
            formantOut.value = value;
            if (this._node) this._node.port.postMessage({ type: 'formantFreq', value });
        });

        wavePos.addEventListener('input', (e) =>
        {
            const value = +e.target.value;
            wavePosOut.value = value.toFixed(2);
            if (this._node) this._node.port.postMessage({ type: 'wavePos', value });
        });

        gainKnob.addEventListener('change', (e) =>
        {
            const value = +e.detail.value;
            if (this._node) this._node.port.postMessage({ type: 'gain', value });
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

        const root = this.shadowRoot;
        this._node.port.postMessage({ type: 'emissionRate', value: +root.getElementById('emission').value });
        this._node.port.postMessage({ type: 'formantFreq',  value: +root.getElementById('formant').value });
        this._node.port.postMessage({ type: 'wavePos',      value: +root.getElementById('wavePos').value });
        this._node.port.postMessage({ type: 'gain',         value: +root.getElementById('gainKnob').value });
    }
}

customElements.define('rd-pulsar', RdPulsar);
