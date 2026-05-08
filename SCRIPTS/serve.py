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


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8080)
    args = parser.parse_args()

    if not PUBLIC_DIR.is_dir():
        print(f"PUBLIC/ missing: {PUBLIC_DIR}", file=sys.stderr)
        sys.exit(1)

    handler = partial(SimpleHTTPRequestHandler, directory=str(PUBLIC_DIR))
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
