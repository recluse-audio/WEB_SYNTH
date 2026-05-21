# Handoff — RD_DSP (Pulsar Activity Flash)

Paste the block below as your first message in a Claude Code session opened **inside an RD_DSP clone** (not WEB_SYNTH). The user will be running this from `C:\REPOS\PLUGIN_PROJECTS\RD_DSP` (or wherever the standalone RD_DSP working copy lives — NOT from `C:\REPOS\PROJECTS\WEB_SYNTH\SUBMODULES\RD_DSP`).

---

## Paste this:

I am working on a cross-repo feature called **Pulsar Activity Flash**. Three repos are involved: `RD_DSP` (this one), `WEB_SYNTH`, and `RECLUSE_UI`. The integrator is WEB_SYNTH; you are working in RD_DSP and should not assume any knowledge of the other two beyond what is needed for the public API.

**This is a REWORK.** An earlier round added `Pulsar::isActive()` / `PulsarTrain::isActive()` (landed at commit `3aa18c5`, `VERSION.txt` 0.0.4). That accessor stays — but it turned out unusable for the flash feature. `isActive()` is true for only one formant period per emission (≈ 2.3 ms at 440 Hz), shorter than any GUI poll interval, so polling it aliases into random catches and non-synchronous flicker. We are switching the flash to a per-emission **report-once latch** that draws each emitted pulsar exactly once, decoupled from the duty cycle.

**What to add (all in `PulsarTrain`, since `_emitPulsar()` is the only place a new pulsar fires):**

1. New member: `std::atomic<bool> mPulsarReportedToGUI { true };` (true = current pulsar already drawn).
2. In `_emitPulsar()`: `mPulsarReportedToGUI.store (false, std::memory_order_relaxed);` — a fresh pulsar is undrawn.
3. New public accessor:
   ```cpp
   bool consumePulsarFlash() noexcept
   {
       // true exactly once per emitted pulsar, then false until next emit.
       return ! mPulsarReportedToGUI.exchange (true, std::memory_order_relaxed);
   }
   ```
4. Catch2 coverage of the consume contract (true once after an emission, false on the immediate second call, true again after the next emission period).
5. Bump `VERSION.txt` → 0.0.5.

`exchange(true)` is the lock-free "take and clear" idiom: store `true`, return the previous value. Producer (`_emitPulsar`) and consumer (WEB_SYNTH worklet calling `consumePulsarFlash()` once per audio block) are the same thread in practice; the atomic keeps it correct regardless.

**Mode:** `incremental_educational`. One increment per turn, plan-first, real RED state (assertion failure, not compile failure).

**First-turn actions:**

1. Read `WEB_SYNTH`'s tracked plan file at this absolute path:
   `C:\REPOS\PROJECTS\WEB_SYNTH\.claude\PULSAR_ACTIVITY_FLASH_PLAN\RD_DSP_plan.md`
   The **REWORK** section + increments 6-8 are the live work. Increments 1-5 are done (`isActive()`); do not redo them.
   (You have read permission on `C:\REPOS\PROJECTS\WEB_SYNTH` via standing external-source rules — confirm by reading.)
2. Read the cross-repo README in the same folder for context:
   `C:\REPOS\PROJECTS\WEB_SYNTH\.claude\PULSAR_ACTIVITY_FLASH_PLAN\README.md`
3. If `.claude/PULSAR_ACTIVITY_FLASH_PLAN/RD_DSP_plan.md` already exists in **this** repo from the earlier round, refresh it from the WEB_SYNTH copy (it carries the REWORK section). Otherwise create it. Update its checkboxes as increments land. Do not edit the WEB_SYNTH copy from here.
4. Confirm you have read both files, then ask me one question: which increment to start. Default suggestion: increment 6 (failing Catch2 test for the latch).

**Hard rules reminder (RD_DSP):**

- Zero third-party deps in `SOURCE/`.
- No allocation, no exceptions on the audio path.
- Allman braces in new code.
- No `README.md` or `NOTES/` edits.
- Atomic ops use `memory_order_relaxed` for this flag — it is independent state, no ordering required.

**Out of scope for this repo:** JS, wasm, UI, anything outside `SOURCE/PULSAR/` and the matching test file.

Begin.
