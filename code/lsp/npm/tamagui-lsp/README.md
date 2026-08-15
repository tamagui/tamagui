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

VS Code needs nothing here; install the **Tamagui** extension and it resolves
this package itself.

Every other editor spawns the binary by name, so install it globally:

```sh
npm install -g @tamagui/lsp
```

That puts `tamagui-lsp` on your `PATH`, which is what the editor configs below
assume.

A project-local install works too, and is the better choice if you want the
server version pinned per project:

```sh
npm install --save-dev @tamagui/lsp
```

but npm only links it into `node_modules/.bin`, which is **not** on your `PATH`
outside npm scripts. So point your editor at the full path instead of the bare
name:

```
./node_modules/.bin/tamagui-lsp
```

Whether a relative path resolves depends on the editor's working directory; an
absolute path always works.

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

## Building from source

Set `TAMAGUI_LSP_BINARY` to point every editor and `binaryPath()` at your own
build. This is also the answer for a platform with no prebuilt binary.

```sh
cd code/lsp && cargo build --release -p tamagui-lsp
export TAMAGUI_LSP_BINARY="$PWD/target/release/tamagui-lsp"
```

A path that does not exist throws, rather than quietly falling back to the
packaged binary, so a typo shows up immediately instead of looking like your
change had no effect.

## Troubleshooting

**`tamagui-lsp: command not found`, or the editor never starts the server.**
The package is installed as a devDependency rather than globally. npm puts it in
`node_modules/.bin`, which your editor does not search. Either install it
globally or give the editor the full path; see [Install](#install).

**Completions ignore the prop, or a prop offers nothing.** Both come from an
old config artifact. The server learns which props take which token scale from
`propCategories` and `styleProps`, which the compiler started emitting in v3
beta 3. Rebuild once and the artifact gains them.

**No completions.** The server needs the compiler's config artifact. Run your
dev server or `tamagui generate` once so `.tamagui/tamagui.config.json` exists.
The server logs to stderr, which your editor's LSP log will show, and it says
plainly when it is waiting for that file.

**Nothing after editing the config.** There is nothing to do; the server watches
the artifact and republishes automatically. If it did not, the log records the
reload failure and the previous config stays active rather than blanking every
diagnostic.
