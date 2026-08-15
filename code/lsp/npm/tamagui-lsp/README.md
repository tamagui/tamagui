# @tamagui/lsp

The Tamagui language server. One binary, every editor.

Tamagui v3 moves conditional styling into the value (`bg="background hover:background-hover"`),
and TypeScript cannot close that grammar: the full cross product is 1.26M union
members, which is `TS2590` and returns zero completions. So the vocabulary lives
here instead, and every editor gets the same engine.

- **Completions** for theme values, tokens and modifiers, filtered as you type,
  replacing only the clause under the cursor rather than the whole string
- **Diagnostics** for unknown modifiers and misspelled values, with "did you
  mean" suggestions
- **Hover** showing a token's resolved value **per theme**, and a media
  modifier's actual query
- **Inline color decorators** for theme values, color tokens and `/50` opacity
  suffixes

It reads `.tamagui/tamagui.config.json`, the artifact the compiler writes, and
picks up changes the moment they land: a rebuild is republished to every open
file without restarting the editor.

## Install

```sh
npm install --save-dev @tamagui/lsp
```

The binary ships as a prebuilt platform package (the esbuild model), so there is
no download step and no postinstall. npm installs exactly the one matching your
platform.

> Installing with `--omit=optional` skips the binary. The launcher says so
> explicitly if that happens.

## Editor setup

The server speaks stdio LSP, so every editor needs a few lines and no plugin
code.

### VS Code

Install the **Tamagui** extension. It spawns this binary for you.

### Neovim

```lua
vim.lsp.config.tamagui = {
  cmd = { 'tamagui-lsp' },
  filetypes = { 'typescriptreact', 'javascriptreact' },
  root_markers = { 'tamagui.config.ts', 'package.json' },
}
vim.lsp.enable('tamagui')
```

### Helix

```toml
# languages.toml
[language-server.tamagui]
command = "tamagui-lsp"

[[language]]
name = "tsx"
language-servers = ["typescript-language-server", "tamagui"]
```

### Zed

```json
// settings.json
{
  "lsp": { "tamagui": { "binary": { "path": "tamagui-lsp" } } }
}
```

### Emacs (eglot)

```elisp
(add-to-list 'eglot-server-programs
             '((tsx-ts-mode typescript-ts-mode) . ("tamagui-lsp")))
```

### Sublime Text (LSP)

```json
{
  "clients": {
    "tamagui": {
      "enabled": true,
      "command": ["tamagui-lsp"],
      "selector": "source.tsx | source.jsx"
    }
  }
}
```

### JetBrains

Use [LSP4IJ](https://plugins.jetbrains.com/plugin/23257-lsp4ij) and add
`tamagui-lsp` as a new language server for TSX and JSX files.

## Programmatic use

```js
import { binaryPath, platformKey } from '@tamagui/lsp'

binaryPath() // absolute path to the executable, or throws with a fix
platformKey() // e.g. "darwin arm64", "linux x64 glibc"
```

## Troubleshooting

**No completions.** The server needs the compiler's config artifact. Run your
dev server or `tamagui generate` once so `.tamagui/tamagui.config.json` exists.
The server logs to stderr, which your editor's LSP log will show, and it says
plainly when it is waiting for that file.

**Nothing after editing the config.** There is nothing to do; the server watches
the artifact and republishes automatically. If it did not, the log records the
reload failure and the previous config stays active rather than blanking every
diagnostic.
