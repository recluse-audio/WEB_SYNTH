# rd-pulsar.js walkthrough plan

Read-only educational tour. No code changes. One function per increment.

Status: [ ] not started  [~] in progress  [x] done  [!] blocked

## Increments

- [x] 1. Module-level constants and state (WORKLET_URL, WASM_URL, defaultContext, workletLoaded, wasmBytesPromise, PARAM_RANGES, denormalize)
- [x] 2. getDefaultContext()
- [ ] 3. ensureWorkletLoaded(ctx)
- [ ] 4. getWasmBytes()
- [ ] 5. RdPulsar constructor
- [ ] 6. audioContext getter/setter
- [~] 7. connectedCallback()
- [ ] 8. _requestDisplayFill()
- [ ] 9. _onDisplayBuffer(samples)
- [ ] 10. _startActivePolling()
- [ ] 11. _onActive(on)
- [ ] 12. disconnectedCallback()
- [~] 13. _ensureNode()
- [ ] 14. customElements.define registration
