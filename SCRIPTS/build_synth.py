#!/usr/bin/env python
"""
Build ENGINE/SYNTH -> synth.wasm via CMake + Emscripten.

Configures BUILD/SYNTH/ with `emcmake cmake -G Ninja`, then builds.
Post-build copy of synth.wasm to PUBLIC/ is handled by CMake itself.

Override paths via env if your install differs:
    EMSDK_DIR=D:\\tools\\emsdk python SCRIPTS/build_synth.py

Flags:
    --clean   wipe BUILD/SYNTH/ before configuring
"""

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path

# Sibling script in SCRIPTS/. Python adds this script's dir to sys.path on launch,
# so plain import works.
import regenSource

REPO_ROOT = Path(__file__).resolve().parent.parent
SRC_DIR   = REPO_ROOT
BUILD_DIR = REPO_ROOT / "BUILD" / "SYNTH"

EMSDK_DIR = Path(os.environ.get("EMSDK_DIR", r"C:\emsdk"))
EMCMAKE_PY = EMSDK_DIR / "upstream" / "emscripten" / "emcmake.py"

# Ninja from winget lands here, not on PATH until shell restart.
NINJA_DIR = Path(os.environ.get("NINJA_DIR",
    r"C:\Users\rdeve\AppData\Local\Microsoft\WinGet\Packages\Ninja-build.Ninja_Microsoft.Winget.Source_8wekyb3d8bbwe"))


def fail(msg: str) -> None:
    print(f"build_synth: {msg}", file=sys.stderr)
    sys.exit(1)


def build_env() -> dict:
    """Augment PATH so cmake can find ninja even if it isn't on global PATH yet."""
    env = os.environ.copy()
    extra_paths = [str(NINJA_DIR)]
    env["PATH"] = os.pathsep.join(extra_paths + [env.get("PATH", "")])
    return env


def run(cmd: list[str], env: dict) -> None:
    print("$ " + " ".join(str(c) for c in cmd))
    subprocess.run(cmd, check=True, env=env)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--clean", action="store_true",
                        help="wipe BUILD/SYNTH/ before configuring")
    args = parser.parse_args()

    if not EMCMAKE_PY.is_file():
        fail(f"emcmake.py not found at {EMCMAKE_PY}\n"
             f"  set EMSDK_DIR to your emsdk install root.")

    if args.clean and BUILD_DIR.exists():
        print(f"cleaning {BUILD_DIR}")
        shutil.rmtree(BUILD_DIR)

    BUILD_DIR.mkdir(parents=True, exist_ok=True)

    # Always regenerate per-module source lists before configure so adding/removing
    # a file under ENGINE/<MODULE>/ doesn't require remembering to run regenSource.py.
    print("regenerating CMAKE/<MODULE>_SOURCES.cmake")
    regenSource.main()

    env = build_env()

    # Configure: emcmake.py wraps cmake, sets toolchain + compiler.
    configure_cmd = [
        sys.executable, str(EMCMAKE_PY),
        "cmake",
        "-S", str(SRC_DIR),
        "-B", str(BUILD_DIR),
        "-G", "Ninja",
        "-DCMAKE_BUILD_TYPE=Release",
    ]
    run(configure_cmd, env)

    # Build.
    build_cmd = ["cmake", "--build", str(BUILD_DIR)]
    run(build_cmd, env)

    out = REPO_ROOT / "PUBLIC" / "synth.wasm"
    if out.is_file():
        print(f"built: {out} ({out.stat().st_size} bytes)")
    else:
        fail(f"expected {out} after build")


if __name__ == "__main__":
    main()
