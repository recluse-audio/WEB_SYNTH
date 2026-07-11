#!/usr/bin/env python3
"""Recolor the current Ghostty window from the palette of the repo you are in.

Reads <repo>/.theme/rd_color_palette.csv, the same file Emacs reads, and falls
back to RD_CMD's palette when a repo carries none. One csv feeding both is what
keeps Ghostty and Emacs in agreement.

The terminal is told its colors with OSC (Operating System Command) escape
sequences: an ESC, then a number saying which color, then the value, then a BEL
to end it. The terminal swallows them, they never appear as text.

Usage:  python3 .theme/rd_refresh_ghostty_theme.py [-v]
        -v   report what was resolved (to stderr, so it cannot corrupt the escapes)
"""

import sys
from pathlib import Path

RD_CMD_PALETTE = Path.home() / "REPOS" / "RD_CMD" / ".theme" / "rd_color_palette.csv"

# Which Emacs face feeds each of the 16 ANSI color slots a terminal program
# expects. Each slot lists its candidates in order; the first key present in the
# csv wins, and a slot with no match is left at whatever Ghostty already had.
# Edit freely, this table is the whole mapping.
ANSI_MAP = [
    ("black",          ["default-BG"]),
    ("red",            ["error-FG", "font-lock-warning-face-FG"]),
    ("green",          ["success-FG", "font-lock-string-face-FG"]),
    ("yellow",         ["warning-FG"]),
    ("blue",           ["font-lock-keyword-face-FG"]),
    ("magenta",        ["default-FG"]),
    ("cyan",           ["font-lock-function-name-face-FG"]),
    ("white",          ["font-lock-variable-name-face-FG"]),
    ("bright black",   ["font-lock-comment-face-FG"]),
    ("bright red",     ["font-lock-warning-face-FG", "error-FG"]),
    ("bright green",   ["font-lock-string-face-FG", "success-FG"]),
    ("bright yellow",  ["warning-FG"]),
    ("bright blue",    ["font-lock-constant-face-FG"]),
    ("bright magenta", ["isearch-BG"]),
    ("bright cyan",    ["font-lock-type-face-FG"]),
    ("bright white",   ["show-paren-match-BG"]),
]

# The colors a terminal takes on their own, outside the 16 slots. The number is
# the OSC code: 10 foreground, 11 background, 12 cursor, 17 selection background.
SPECIAL_MAP = [
    (10, "foreground",           ["default-FG"]),
    (11, "background",           ["default-BG"]),
    (12, "cursor",               ["cursor-BG"]),
    (17, "selection background", ["region-BG"]),
]


def repo_root(start: Path):
    """Nearest ancestor of START holding a .git, or None.

    Nearest, not top-most: projectile picks the nearest one on the Emacs side,
    and the two must agree on which repo you are in or the colors will not match.
    """
    for directory in [start, *start.parents]:
        if (directory / ".git").exists():
            return directory
    return None


def read_palette(path: Path):
    """Parse PATH into {key: '#hex'}. Skips '#' comments, blanks, and junk rows."""
    palette = {}
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        key, _, value = line.partition(",")
        key, value = key.strip(), value.strip()
        if value.startswith("#"):
            palette[key] = value
    return palette


def first_match(palette, keys):
    for key in keys:
        if key in palette:
            return palette[key]
    return None


def main():
    verbose = "-v" in sys.argv

    root = repo_root(Path.cwd().resolve())
    palette_path = RD_CMD_PALETTE
    if root is not None:
        candidate = root / ".theme" / "rd_color_palette.csv"
        if candidate.is_file():
            palette_path = candidate

    if not palette_path.is_file():
        print(f"RD_ERROR: no palette at {palette_path}", file=sys.stderr)
        return 1

    # A repo's csv need only name the colors it cares about. Anything it leaves
    # out comes from RD_CMD, so every slot is always set and a window can never
    # inherit a stray color from whatever was on screen before it.
    palette = {}
    if RD_CMD_PALETTE.is_file():
        palette.update(read_palette(RD_CMD_PALETTE))
    palette.update(read_palette(palette_path))

    escapes, resolved, missing = [], [], []

    for index, (name, keys) in enumerate(ANSI_MAP):
        color = first_match(palette, keys)
        if color is None:
            missing.append(f"ansi {index} ({name})")
            continue
        escapes.append(f"\033]4;{index};{color}\007")
        resolved.append(f"  ansi {index:<2} {name:<15} {color}")

    for code, name, keys in SPECIAL_MAP:
        color = first_match(palette, keys)
        if color is None:
            missing.append(f"osc {code} ({name})")
            continue
        escapes.append(f"\033]{code};{color}\007")
        resolved.append(f"  osc  {code:<2} {name:<15} {color}")

    sys.stdout.write("".join(escapes))
    sys.stdout.flush()

    if verbose:
        print(f"repo:    {root or '<none, using RD_CMD>'}", file=sys.stderr)
        print(f"palette: {palette_path}", file=sys.stderr)
        print("\n".join(resolved), file=sys.stderr)
        if missing:
            print("unset (left as Ghostty had them):", file=sys.stderr)
            for item in missing:
                print(f"  {item}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
