#!/usr/bin/env python3
"""Serve PUBLIC/ over HTTP for AudioWorklet dev.

AudioWorklet modules cannot load from file:// URLs.
Default port 8080. Override with --port N.
Ctrl+C to stop.
"""
import argparse
import sys
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = REPO_ROOT / "PUBLIC"


class NoCacheHandler(SimpleHTTPRequestHandler):
    """Dev server: never let the browser cache JS/wasm.

    Without this, a stale rd-pulsar.js or pulsar.wasm survives a normal reload
    and silently runs against a mismatched build (e.g. an old PARAM_RANGES that
    reads a renamed prop -> NaN param -> silence). no-store forces a fresh fetch
    every load so a rebuild is always what runs.
    """

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8080)
    args = parser.parse_args()

    if not PUBLIC_DIR.is_dir():
        print(f"PUBLIC/ missing: {PUBLIC_DIR}", file=sys.stderr)
        sys.exit(1)

    handler = partial(NoCacheHandler, directory=str(PUBLIC_DIR))
    httpd = ThreadingHTTPServer(("", args.port), handler)

    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()

    print(f"Serving {PUBLIC_DIR} at http://localhost:{args.port}  (Ctrl+C to stop)")

    try:
        while thread.is_alive():
            thread.join(timeout=0.5)
    except KeyboardInterrupt:
        print("\nStopping...")
        httpd.shutdown()
        httpd.server_close()
        print("Stopped.")


if __name__ == "__main__":
    main()
