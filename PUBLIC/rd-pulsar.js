// <rd-pulsar> Web Component — embeddable Pulsar instance.
// UI owned by <recluse-pulsar-synth> (RECLUSE_UI submodule).
// This file: AudioWorklet + wasm wiring only.
//
// Contract: <recluse-pulsar-synth> emits normalized values (0..1) in
// `paramchange`. Worklet expects real units. This shim owns the ranges
// and denormalizes before posting.

const WORKLET_URL = new URL('./pulsar-worklet.js', import.meta.url).href;
const WASM_URL    = new URL('./pulsar.wasm',        import.meta.url).href;

let defaultContext = null;
const workletLoaded = new WeakMap();
let wasmBytesPromise = null;

const PARAM_RANGES =
{
    emission: { min: 0.125, max: 150,  type: 'emissionRate' },
    formant:  { min: 150,   max: 2000, type: 'formantFreq'  },
    wavePos:  { min: 0,     max: 1,    type: 'wavePos'      },
    gain:     { min: 0,     max: 1,    type: 'gain'         }
};

const denormalize = (n, min, max) => min + n * (max - min);

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
        this._ctx           = null;
        this._node          = null;
        this._displayDirty  = false;
        this._rafId         = 0;
        this._activeRafId   = 0;
        this._lastActiveOn  = null;
        this._lastPaintAt   = 0;
        this._emissionRate  = PARAM_RANGES.emission.min;
        this.attachShadow({ mode: 'open' }).innerHTML = `
            <recluse-pulsar-synth
                emission-min="0.125" emission-max="150"  emission-unit="Hz"
                formant-min="150"    formant-max="2000"  formant-unit="Hz"
                wave-pos-min="0"     wave-pos-max="1"    wave-pos-unit=""
                gain-min="0"         gain-max="1"        gain-unit="">
            </recluse-pulsar-synth>`;
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
            const { param, value } = e.detail;
            const r = PARAM_RANGES[param];
            if (!r) return;
            const real = denormalize(value, r.min, r.max);
            this._node.port.postMessage({ type: r.type, value: real });

            if (param === 'emission') this._emissionRate = real;
            if (param === 'wavePos') this._requestDisplayFill();
        });
    }

    _requestDisplayFill()
    {
        if (!this._node) return;
        this._displayDirty = true;
        if (this._rafId) return;
        this._rafId = requestAnimationFrame(() =>
        {
            this._rafId = 0;
            if (!this._displayDirty || !this._node) return;
            this._displayDirty = false;
            this._node.port.postMessage({ type: 'fillDisplay' });
        });
    }

    _onDisplayBuffer(samples)
    {
        const ui = this.shadowRoot.querySelector('recluse-pulsar-synth');
        if (ui) ui.samples = samples;
    }

    _startActivePolling()
    {
        if (this._activeRafId) return;

        const tick = (now) =>
        {
            this._activeRafId = requestAnimationFrame(tick);
            if (!this._node) return;

            // When emission > 30 Hz, cap repaints at 25 Hz (40 ms guard).
            // Below that, query every frame (display-refresh limited).
            const cap = this._emissionRate > 30 ? 40 : 0;
            if (cap > 0 && (now - this._lastPaintAt) < cap) return;

            this._node.port.postMessage({ type: 'queryActive' });
        };

        this._activeRafId = requestAnimationFrame(tick);
    }

    _onActive(on)
    {
        if (on === this._lastActiveOn) return;
        this._lastActiveOn = on;
        this._lastPaintAt  = performance.now();
        const ui = this.shadowRoot.querySelector('recluse-pulsar-synth');
        if (ui) ui.active = on;
    }

    disconnectedCallback()
    {
        if (this._activeRafId)
        {
            cancelAnimationFrame(this._activeRafId);
            this._activeRafId = 0;
        }
    }

    async _ensureNode()
    {
        if (this._node) return;

        if (!this._ctx) this._ctx = getDefaultContext();
        if (this._ctx.state === 'suspended') await this._ctx.resume();

        await ensureWorkletLoaded(this._ctx);

        this._node = new AudioWorkletNode(this._ctx, 'pulsar');
        this._node.connect(this._ctx.destination);

        // Persistent listener — survives past the ready handshake.
        this._node.port.addEventListener('message', (e) =>
        {
            if (!e.data) return;
            if (e.data.type === 'displayBuffer')
            {
                this._onDisplayBuffer(e.data.samples);
            }
            else if (e.data.type === 'active')
            {
                this._onActive(e.data.on);
            }
        });

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

        // Initial param push — read normalized values off component, denormalize, post.
        const ui = this.shadowRoot.querySelector('recluse-pulsar-synth');
        for (const [param, r] of Object.entries(PARAM_RANGES))
        {
            const n = +ui[param];
            this._node.port.postMessage({ type: r.type, value: denormalize(n, r.min, r.max) });
        }

        // Initial display fill so the element renders even before user touches wave-pos.
        this._requestDisplayFill();

        // Start polling pulsar activity for the flash-on/off display state.
        this._startActivePolling();
    }
}

customElements.define('rd-pulsar', RdPulsar);
