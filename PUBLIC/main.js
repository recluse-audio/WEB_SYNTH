const startBtn = document.getElementById('start');

startBtn.addEventListener('click', async () =>
{
    const ctx = new AudioContext();
    await ctx.resume();
    console.log('AudioContext state:', ctx.state, 'sampleRate:', ctx.sampleRate);

    await ctx.audioWorklet.addModule('synth-worklet.js');
    const node = new AudioWorkletNode(ctx, 'synth');
    node.connect(ctx.destination);

    const bytes = await fetch('synth.wasm').then(r => r.arrayBuffer());
    node.port.postMessage({ type: 'wasm', bytes }, [bytes]);
});
