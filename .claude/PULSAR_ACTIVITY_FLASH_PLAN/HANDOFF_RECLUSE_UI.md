# Handoff — RECLUSE_UI (Pulsar Activity Flash)

Paste the block below as your first message in a Claude Code session opened **inside a RECLUSE_UI clone** (not WEB_SYNTH). The user will be running this from RECLUSE_UI's standalone working copy — NOT from `C:\REPOS\PROJECTS\WEB_SYNTH\PUBLIC\SUBMODULES\RECLUSE_UI`.

---

## Paste this:

I am working on a cross-repo feature called **Pulsar Activity Flash**. Three repos are involved: `RD_DSP`, `WEB_SYNTH`, and `RECLUSE_UI` (this one). The integrator is WEB_SYNTH; you are working in RECLUSE_UI and only need to know the component contract, not the DSP details.

**Feature goal (full context):** The browser-side wavetable display in WEB_SYNTH needs to dim/flash on/off in sync with the pulsar's per-emission activity. WEB_SYNTH will compute a boolean each ~16 ms (one per `requestAnimationFrame` tick, edge-detected against the previous value, throttled to 25 Hz when emission rate exceeds 30 Hz). It will then set an `active` JS property on `<recluse-pulsar-synth>`, which must forward to its embedded `<recluse-wavetable-display>`.

Your job in this repo:

1. `<recluse-wavetable-display>` gains a JS property `active` (boolean, default `true`). When `false`, the waveform stroke renders at low opacity (~0.18). Zero-line stays normal.
2. `<recluse-pulsar-synth>` gains a JS property `active` that forwards to its embedded display (same pattern as the existing `samples` pass-through).
3. Storybook story updates for both components.
4. Build, commit `dist/`.

No DSP knowledge. No wasm. No audio. Just a boolean prop.

**Mode:** `incremental_educational`. One increment per turn, plan-first.

**First-turn actions:**

1. Read `WEB_SYNTH`'s tracked plan file at this absolute path:
   `C:\REPOS\PROJECTS\WEB_SYNTH\.claude\PULSAR_ACTIVITY_FLASH_PLAN\RECLUSE_UI_plan.md`
   (You have read permission on `C:\REPOS\PROJECTS\WEB_SYNTH` via standing external-source rules — confirm by reading.)
2. Read the cross-repo README in the same folder for context:
   `C:\REPOS\PROJECTS\WEB_SYNTH\.claude\PULSAR_ACTIVITY_FLASH_PLAN\README.md`
3. Create `.claude/PULSAR_ACTIVITY_FLASH_PLAN/` in **this** repo and copy `RECLUSE_UI_plan.md` there as the local tracked copy. Update its checkboxes as increments land. Do not edit the WEB_SYNTH copy from here.
4. Confirm you have read both files, then ask me one question: which increment to start. Default suggestion: increment 1 (add `active` prop to `WavetableDisplay.svelte`).

**Hard rules reminder (RECLUSE_UI):**

- Custom-element tag names start with `recluse-`.
- Use `--color-*` tokens for colors. Plain alpha literal is OK (it is a transparency multiplier, not a color).
- Allman braces in `.js` files. Svelte 4 customElement syntax in `.svelte`.
- Do not edit `README.md` or anything under `NOTES/`.
- `dist/` IS committed. Run `npm run build` and commit the resulting bundles.
- Claude never runs `git commit` / `git push` here — announce "ready to commit" with a suggested message and stop.

**Out of scope for this repo:** Animation/fade transitions on the alpha change (not in v1), tokenized alpha (not in v1), any DSP or wasm awareness.

Begin.
