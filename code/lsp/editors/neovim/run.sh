#!/usr/bin/env bash
# Drives a REAL neovim against the language server, using exactly the config
# `tamagui-lsp setup neovim` prints. Nothing here is stubbed: neovim starts the
# process, negotiates capabilities, resolves the project root from its own
# root_markers, and issues the completion request through its own LSP client.
#
# This exists because every other check in this repo talks to the server with a
# hand-rolled client, which cannot catch the things that actually break an
# editor integration: a config snippet that names an unreachable command, a
# root_marker set that never matches, or a capability neovim declines to use.
#
#   ./run.sh [path-to-tamagui-lsp]
#
# Defaults to the release build. Needs neovim >= 0.11 for `vim.lsp.config`.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LSP_ROOT="$(cd "$HERE/../.." && pwd)"
REPO_ROOT="$(cd "$LSP_ROOT/../.." && pwd)"
BINARY="${1:-$LSP_ROOT/target/release/tamagui-lsp}"

if [ ! -x "$BINARY" ]; then
  echo "no binary at $BINARY"
  echo "build it first: cd $LSP_ROOT && cargo build --release -p tamagui-lsp"
  exit 1
fi

command -v nvim > /dev/null || { echo "neovim is not installed"; exit 1; }

# the fixture must live inside a real project so neovim's root_markers resolve
# and the server finds that project's compiled artifact
PROJECT="$REPO_ROOT/code/kitchen-sink"
if [ ! -f "$PROJECT/.tamagui/tamagui.config.json" ]; then
  echo "no config artifact at $PROJECT/.tamagui/tamagui.config.json"
  echo "run the dev server or 'tamagui generate' once so the compiler emits it"
  exit 1
fi

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"; rm -f "$PROJECT/.tamagui-nvim-probe.tsx"' EXIT

# the config under test is generated, never hand-copied, so this fails if
# `setup neovim` ever emits something neovim will not accept
"$BINARY" setup neovim | tail -n +3 > "$WORK/tamagui.lua"
cat > "$WORK/init.lua" <<LUA
vim.opt.runtimepath:append('$WORK')
dofile('$WORK/tamagui.lua')
LUA

PROBE="$PROJECT/.tamagui-nvim-probe.tsx"
cat > "$PROBE" <<'TSX'
import { View } from 'tamagui'
export default () => <View bg="background" p="4" />
TSX

PROBE_FILE="$PROBE" nvim --headless -u "$WORK/init.lua" -l "$HERE/integration.lua"
