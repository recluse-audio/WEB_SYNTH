const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const freqSlider = document.getElementById('freq');
const freqOut = document.getElementById('freqOut');

let node = null;

startBtn.addEventListener('click', async () =>
{
    if (node)
    {
        node.port.postMessage({ type: 'start' });
        return;
    }

    const ctx = new AudioContext();
    await ctx.resume();
    console.log('AudioContext state:', ctx.state, 'sampleRate:', ctx.sampleRate);

    await ctx.audioWorklet.addModule('synth-worklet.js');
    node = new AudioWorkletNode(ctx, 'synth');
    node.connect(ctx.destination);

    const bytes = await fetch('synth.wasm').then(r => r.arrayBuffer());
    node.port.postMessage({ type: 'wasm', bytes }, [bytes]);

    freqSlider.addEventListener('input', (e) =>
    {
        const value = +e.target.value;
        freqOut.value = value;
        node.port.postMessage({ type: 'freq', value });
    });
});

stopBtn.addEventListener('click', () =>
{
    if (!node) return;
    node.port.postMessage({ type: 'stop' });
});
