# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Browser-based realtime web-audio synthesizer. Greenfield — currently a single README and an empty workspace. First milestone: a sine-wave POC end-to-end. Hardening happens after the shape is right.

The user has an external reference repo at `C:\REPOS\PLUGIN_PROJECTS\EXTERNAL\web-synth` (Ameobea's `web-synth`) that you have standing permission to read. Its `.claude/CLAUDE.md` describes a much larger system (Rust→Wasm DSP modules, AudioWorklets, React/Svelte UI, patch-network model). Treat it as a reference architecture for one of the POC paths, not as a target to copy wholesale.

## House rules

- **`README.md` is human-authored.** Do not create, edit, or reformat it without an explicit ask in the current turn. Reading is fine.
- **Claude instructions live in `.claude/`.** Never put rules, plans, or prompts in the README or other top-level docs.
- **Allman braces** for new code in any brace-using language.
- **One question at a time.** When asking the user something, ask a single question and keep the response short enough that scrolling is not needed.
- **POC mindset for now.** The user wants to see the shape end-to-end before hardening. Avoid premature abstraction, test scaffolding, or framework choice until the approach is locked in.

## POC approach — three paths under consideration

The user has explicitly framed the first build as a choice between three options. Do not silently pick one — surface the tradeoff and let the user decide.

1. **Plain WebAudio `OscillatorNode`** — minimal HTML + a few lines of JS; no build pipeline. Fastest to ship, zero learning curve, but bypasses the architecture the project will eventually need.
2. **AudioWorklet + JS DSP** — custom `AudioWorkletProcessor` generating samples in JS. Introduces the audio-thread boundary and message-port pattern without any Rust/Wasm toolchain. Middle ground.
3. **AudioWorklet + Rust→Wasm** — emulate the external repo's pattern: Rust crate compiled to `wasm32-unknown-unknown`, loaded by an AudioWorklet, driven from a TS/HTML frontend. Highest fidelity to the long-term target; highest setup cost. **If this path is chosen, work step-by-step and explain each step** — the user has asked for this explicitly.

## Reference repo — what to mine vs. what to ignore

When path 3 is chosen, the external repo provides battle-tested patterns for:

- AudioWorklet bootstrapping and `MessagePort` / `SharedArrayBuffer` wiring (`src/` worklet glue files in the external repo).
- Raw `wasm32-unknown-unknown` modules vs. `wasm-bindgen` modules — external repo uses both; for a POC, raw is simpler.
- `Justfile` recipes for the Rust→Wasm build pipeline.

Do **not** pull in the external repo's patch-network model, ViewContext system, jantix store, litegraph editor, Faust/Soul integration, or backend — those are post-POC concerns at the earliest, and likely never if a different architecture wins.

## Commands

No build pipeline exists yet. When one is added, document the canonical commands (dev server, build, typecheck, lint, test) here.

## Working directory layout

Currently:

- `README.md` — human-authored, off-limits without explicit ask.
- `WEB_SYNTH.code-workspace` — VS Code workspace file.
- `.claude/` — this file and any future plans/skills.

Update this section once real source directories exist.
