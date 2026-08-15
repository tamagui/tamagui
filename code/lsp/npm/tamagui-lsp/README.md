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

## Monorepos

Open the repository root. The server finds every app under it and keeps them
separate, so a file in `apps/native` completes against the native config and a
file in `apps/web` against the web one. Each app reloads independently when its
own build finishes.

An app is recognised by its `tamagui.build.ts` or its built
`.tamagui/tamagui.config.json`, so a freshly cloned app is registered before the
compiler has ever run and starts answering as soon as you run the dev server.
`node_modules` is never searched: installed packages ship their own artifacts,
and treating one as your project points the whole editor at a dependency's
theme.

A file that belongs to no app gets no completions rather than another app's.
Guessing there is worse than silence, because a sibling's config reports your
real theme values as unknown ones.

## Install

```sh
npm install --save-dev @tamagui/lsp
```

Then wire up your editor with one command; see [Editor setup](#editor-setup).
VS Code needs neither: install the **Tamagui** extension and it resolves this
package itself.

The binary ships as a prebuilt platform package (the esbuild model), so there is
no download step and no postinstall. npm installs exactly the one matching your
platform.

> Installing with `--omit=optional` skips the binary. The launcher says so
> explicitly if that happens.

## Editor setup

One command, every editor:

```sh
npx tamagui-lsp setup neovim
```

It prints the configuration for that editor with this binary's **absolute path
already filled in**, which is the part that otherwise goes wrong: the config has
to name a command, and `node_modules/.bin` is not on your `PATH`. Run it with no
editor to see the list:

```
neovim     Neovim
helix      Helix
zed        Zed
sublime    Sublime Text (LSP package)
emacs      Emacs (eglot)
jetbrains  JetBrains (LSP4IJ)
```

Paste the output into the file it names. VS Code needs none of this: install the
**Tamagui** extension and it resolves this package itself.

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
The editor config names a bare command, and `node_modules/.bin` is not on your
`PATH`. Re-run `npx tamagui-lsp setup <editor>` and use its output, which names
an absolute path.

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
