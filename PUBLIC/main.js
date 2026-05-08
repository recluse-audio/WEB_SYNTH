const startBtn = document.getElementById('start');

startBtn.addEventListener('click', async () =>
{
    const ctx = new AudioContext();
    await ctx.resume();
    console.log('AudioContext state:', ctx.state, 'sampleRate:', ctx.sampleRate);
});
