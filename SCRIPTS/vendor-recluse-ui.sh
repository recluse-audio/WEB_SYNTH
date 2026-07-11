#!/usr/bin/env bash
# Vendor RECLUSE_UI build output into WEB_SYNTH/PUBLIC/RECLUSE_UI/.
#
# Delete-then-copy each vendored subtree (dist, tokens, assets/fonts) so a
# removed/renamed source file never lingers in the target. RECLUSE_UI is no
# longer a git submodule here; this script is the refresh mechanism.
#
# Source repo: override with RECLUSE_UI_SRC, else default below.
# Usage: bash SCRIPTS/vendor-recluse-ui.sh

set -euo pipefail

SRC="${RECLUSE_UI_SRC:-$HOME/REPOS/PROJECTS/RECLUSE_UI}"

# Repo root = parent of this script's directory (SCRIPTS/..).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEST="$ROOT/PUBLIC/RECLUSE_UI"

# Each entry: source subpath == destination subpath.
SUBTREES=(dist tokens assets/fonts)

for sub in "${SUBTREES[@]}"
do
  src_dir="$SRC/$sub"
  dest_dir="$DEST/$sub"

  if [ ! -d "$src_dir" ]
  then
    echo "vendor-recluse-ui: missing source $src_dir" >&2
    exit 1
  fi

  rm -rf "$dest_dir"
  mkdir -p "$(dirname "$dest_dir")"
  cp -R "$src_dir" "$dest_dir"
  echo "vendored $sub"
done

echo "done: RECLUSE_UI vendored from $SRC into $DEST"
