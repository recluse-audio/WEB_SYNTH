# Handoff — RD_DSP (Pulsar Activity Flash)

Paste the block below as your first message in a Claude Code session opened **inside an RD_DSP clone** (not WEB_SYNTH). The user will be running this from `C:\REPOS\PLUGIN_PROJECTS\RD_DSP` (or wherever the standalone RD_DSP working copy lives — NOT from `C:\REPOS\PROJECTS\WEB_SYNTH\SUBMODULES\RD_DSP`).

---

## Paste this:

I am working on a cross-repo feature called **Pulsar Activity Flash**. Three repos are involved: `RD_DSP` (this one), `WEB_SYNTH`, and `RECLUSE_UI`. The integrator is WEB_SYNTH; you are working in RD_DSP and should not assume any knowledge of the other two beyond what is needed for the public API.

**Feature goal (full context):** The browser-side wavetable display in WEB_SYNTH needs to dim/flash on/off in sync with the pulsar's per-emission activity (`rd_dsp::Pulsar::mIsActive`). The browser GUI thread will poll a C-ABI export via `requestAnimationFrame` at ~60 Hz. To make that read thread-safe and to give consumers a clean accessor, RD_DSP needs to:

1. Promote `Pulsar::mIsActive` from plain `bool` to `std::atomic<bool>`.
2. Add `bool Pulsar::isActive() const noexcept`.
3. Add `bool PulsarTrain::isActive() const noexcept` as a pass-through.
4. Catch2 coverage of the transition.
5. Bump `VERSION.txt`, tag.

Audio thread continues to write the flag exactly as it does today — only the storage type changes (and the field name stays `mIsActive`). The single atomic write per state change costs nothing measurable on x86/ARM.

**Mode:** `incremental_educational`. One increment per turn, plan-first, real RED state (assertion failure, not compile failure).

**First-turn actions:**

1. Read `WEB_SYNTH`'s tracked plan file at this absolute path:
   `C:\REPOS\PROJECTS\WEB_SYNTH\.claude\PULSAR_ACTIVITY_FLASH_PLAN\RD_DSP_plan.md`
   (You have read permission on `C:\REPOS\PROJECTS\WEB_SYNTH` via standing external-source rules — confirm by reading.)
2. Read the cross-repo README in the same folder for context:
   `C:\REPOS\PROJECTS\WEB_SYNTH\.claude\PULSAR_ACTIVITY_FLASH_PLAN\README.md`
3. Create `.claude/PULSAR_ACTIVITY_FLASH_PLAN/` in **this** repo and copy `RD_DSP_plan.md` there as the local tracked copy. Update its checkboxes as increments land. Do not edit the WEB_SYNTH copy from here.
4. Confirm you have read both files, then ask me one question: which increment to start. Default suggestion: increment 1 (failing Catch2 test).

**Hard rules reminder (RD_DSP):**

- Zero third-party deps in `SOURCE/`.
- No allocation, no exceptions on the audio path.
- Allman braces in new code.
- No `README.md` or `NOTES/` edits.
- Atomic ops use `memory_order_relaxed` for this flag — it is independent state, no ordering required.

**Out of scope for this repo:** JS, wasm, UI, anything outside `SOURCE/PULSAR/` and the matching test file.

Begin.
