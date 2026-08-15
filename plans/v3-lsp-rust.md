# Tamagui language tooling: one Rust LSP server for every editor

Started 2026-08-15. Owner decision: own the editor story end to end, best in
class, Rust, with real attention to data structures and performance.

## The problem with what ships today

V3 moved styling into strings (`bg="background hover:background-hover"`), and
`plans/v3-static-types-feasibility.md` established that TypeScript cannot close
that grammar: the full cross product is 1.26M union members, which is `TS2590`
and returns **zero** completions. So correctness lives in tooling, and tooling
quality is now a product feature rather than a nicety.

Today that tooling is a **tsserver plugin**. That is the constraint to remove:

- it only reaches editors that run tsserver. Neovim, Helix, Zed, Emacs, Sublime
  and JetBrains users get nothing at all.
- it shares the editor's TypeScript process, so its cost is charged to the same
  thread that answers ordinary TS completions.
- it re-parses the compiler's config artifact as JavaScript objects.

## Decision: a standalone LSP server

LSP **is** the "one way to plug into every editor" abstraction. There is no
library above it worth adopting; every editor either speaks it natively or has
a first-party client. One Rust binary plus a small per-editor config covers:

| editor | integration cost |
| --- | --- |
| VS Code | thin extension that spawns the binary (we already ship an extension to convert) |
| Neovim | `vim.lsp.config` entry, no code |
| Helix | `languages.toml` entry, no code |
| Zed | small extension, or native LSP config |
| Emacs | `eglot` / `lsp-mode` entry |
| Sublime | `LSP` package config |
| JetBrains | LSP4IJ / their LSP API |

The tsserver plugin stays as an optional extra for VS Code users who want
completions inside the TS process, but it stops being the only path.

## Why the config artifact decides the architecture

Measured against the real artifact this repo generates
(`code/tamagui.dev/.tamagui/tamagui.config.json`):

| property | value |
| --- | --- |
| file size | 13.48 MB |
| themes | 1,152 |
| keys per theme | 236 |
| total theme entries | 271,872 |
| **distinct key-set signatures** | **1** |
| **distinct values** | **577** |

Two of those decide everything. Every theme declares the *identical* 236 keys,
so the theme table is perfectly rectangular. And 271,872 entries take only 577
distinct values, so a cell can be an index rather than a string.

### The layout

A dense `themes x keys` matrix of `ValueId(u32)` over an interned palette:

```
keys        236 interned names
theme_names 1,152 interned names
palette     578 values (577 + a missing sentinel), each raw text + parsed Rgba
cells       1,152 * 236 ValueId, row-major by theme
```

Row-major by theme because every access pattern reads several keys of **one**
theme (hover shows a token across a few preview themes; a swatch resolves one
key in the active theme), so a theme's row stays hot.

Lookup is one multiply and two indexed loads, with no hashing:

```rust
let idx = theme.0 as usize * key_count + key.0 as usize;
palette[cells[idx].0 as usize]
```

`ValueId` is `u32` rather than `u16` deliberately: `u16` would fit today's 577
values and halve the matrix, but it would be a correctness cliff for any config
that crosses 65,536 distinct values. At this scale the matrix is ~1 MB either
way and only a handful of cells are touched per request, so the cache argument
does not pay for the risk.

### Measured result

Apple M2, `cargo bench -p tamagui-config`, real 13.48 MB artifact:

| operation | time |
| --- | ---: |
| full artifact load (parse + intern + build matrix) | **45.1 ms** |
| theme lookup by id | **2.35 ns** |
| theme lookup by name (two hashes + matrix) | 25.9 ns |
| `ConfigHandle::load` (per request) | **5.23 ns** |

Resident form: **1,062 KB of cells**, 578 palette entries.

Baseline, same file, same machine — what the current tooling does:

| Node `JSON.parse` | value |
| --- | ---: |
| first parse | 94.3 ms |
| best of 5 | 52.7 ms |
| **retained heap** | **40.0 MB** |

So the Rust load is faster than `JSON.parse` *alone* while additionally
building the queryable structure, and holds ~1 MB where Node holds 40 MB before
the TS layer builds anything on top of it.

## Instant config pickup, everywhere

Owner requirement: a config change is visible immediately, across every usage.

`ConfigHandle` wraps the snapshot in an `ArcSwap`:

- readers call `load()` and pay **5.23 ns**, lock-free and wait-free
- a reload builds the entire new snapshot off to the side, then swaps one
  pointer, so no reader ever observes a half-updated config
- requests already in flight keep the snapshot they started with, which is what
  makes a single request's results self-consistent
- a `notify` watcher on `.tamagui/tamagui.config.json` drives the reload, then
  republishes diagnostics for open documents

45 ms of rebuild happens off the request path, so the editor never blocks on it.

## Crate layout

```
code/lsp/
  crates/
    tamagui-config/    config artifact -> dense snapshot + ArcSwap handle   [DONE]
    tamagui-grammar/   flat value parser, vocabulary, completion, diagnostics
    tamagui-lsp/       the server: protocol, incremental sync, watching
```

`tamagui-config` is done, tested (14 tests) and benchmarked.

### Parser choice: tree-sitter, and why not oxc

The plan was `oxc_parser`, on the reasoning that the repo already depends on oxc
through oxlint, so the server and the lint rule would agree on what parses by
construction. **That was wrong, and the measurement is what changed it.**

oxc has no error recovery. On a parse error it returns an EMPTY program, not a
partial one. Replaying a realistic edit (typing one new component into a file
that already had two style props) one keystroke at a time:

| parser | states losing the already-valid sites |
| --- | --- |
| oxc, raw replay | 73 / 84 (87%) |
| oxc, modelling the editor's auto-closed brackets and quotes | 59 / 84 (70%) |
| tree-sitter | **0 / 84** |

A file being typed into is invalid most of the time, so every colour swatch and
completion in the untouched part of the file would blink out on most keystrokes.
Error tolerance is the requirement here, not a nicety, and it outranks sharing
an engine with the linter.

`biome_js_parser` was the other candidate, being both pure Rust and built for an
LSP, but the published 0.5.x crates are mutually incompatible (`biome_parser`
0.5.8 requires `biome_rowan` 0.5.8 while `biome_js_syntax` 0.5.7 requires
0.5.7), so it does not build.

tree-sitter costs a C dependency, which matters only for cross-compilation, and
the release already builds each platform on its own runner. In exchange it is
error-tolerant AND incremental by design.

One honest limitation: a string with no closing quote collapses its enclosing
element into a flat `ERROR` node with no `jsx_attribute` and no `string`, so
that one site is not reported. Recovering it would mean a second query against
ERROR-node internals. An editor that auto-closes quotes produces `bg=""`
instead, which does work, and the rest of the file is unaffected either way.
Both behaviours are tested.

### Vocabulary structure

Completion needs prefix queries over the candidate set (~3,842 base candidates
plus per-category token unions). An FST gives compact prefix iteration and,
through a Levenshtein automaton, cheap "did you mean" suggestions for the
diagnostic path, which a sorted `Vec` cannot do without a second structure.

### Incremental sync

`ropey` for document text so an edit is O(log n) rather than a full-string
rebuild. Style sites are held as a sorted `Vec<StyleSite>` of byte ranges, so
resolving the cursor is a binary search.

Measured whole-file parse plus query, release build:

| file | sites | time |
| --- | --- | --- |
| 14 lines / 497 B | 12 | 55 µs |
| 280 lines / 9.9 KB | 240 | 935 µs |
| 1,400 lines / 50 KB | 1,200 | 4.7 ms |
| 5,600 lines / 199 KB | 4,800 | 19 ms |

A typical component file is under a millisecond, so incrementality is currently
spent where it pays (the rope and the site index) rather than on partial
reparse. tree-sitter can reuse an old tree given an `InputEdit`, which is the
next lever if large files prove slow in practice; it is deliberately not taken
yet, because the bookkeeping is easy to get subtly wrong and the win is
invisible at the sizes measured above.

## Distribution

The esbuild / swc / biome model: an npm package with `optionalDependencies` on
per-platform binary packages gated by `os` and `cpu`, so npm installs exactly
one. This is being validated alongside the question of whether the whole
toolchain collapses into a single package
(see `plans/v3-tooling-package-consolidation.md`).

## Status

- [x] `tamagui-config`: dense theme matrix, streaming loader, `ArcSwap` handle,
      benchmarked against the real artifact
- [x] `tamagui-grammar`: flat value parse, FST vocabulary, completion,
      Levenshtein "did you mean" diagnostics
- [x] `tamagui-lsp`: stdio server, incremental sync, config watcher, completion,
      hover, document colours, colour presentation, diagnostics.
      **1.1 MB release binary, 85 tests.**
- [x] distribution: `@tamagui/lsp` umbrella with per-platform
      `optionalDependencies`, a launcher, `TAMAGUI_LSP_BINARY` for source
      builds, and editor setup docs for VS Code, Neovim, Helix, Zed, Emacs,
      Sublime and JetBrains
- [x] site extraction on a real parser: tree-sitter, not oxc, for the measured
      reason above
- [x] the VS Code extension spawns the binary; the tsserver plugin and its
      sucrase extractor are gone, so VS Code cannot drift from other editors
- [ ] cross-compile the seven non-host targets in CI and publish the leaves

### Distribution, verified

`node build-platform-packages.mjs` builds the host leaf and asserts the
umbrella's `optionalDependencies` still match the target list, so a platform
whose leaf was never published cannot silently resolve to nothing.

Proven against a real `node_modules` layout rather than a dry run:

```
leaf: {"name":"@tamagui/lsp-darwin-arm64","os":["darwin"],"cpu":["arm64"],"files":["tamagui-lsp"]}
binaryPath -> node_modules/@tamagui/lsp-darwin-arm64/tamagui-lsp
LSP handshake through bin.js -> exit 0, textDocumentSync: 2 = Incremental
```

**Open release-plumbing gap.** `code/lsp/` is outside the bun workspace globs in
the root `package.json`, which is correct (a Rust workspace has no business in
the JS one) but means the release script does not bump
`code/lsp/npm/tamagui-lsp/package.json`. Its version is currently pinned by
hand at 2.7.7 and will drift. Either add it to the release script's explicit
list or generate its version at publish time. Do this before the first publish,
not after.

### Verified end to end

Driving the release binary over stdio against the real
`code/tamagui.dev/.tamagui/tamagui.config.json`:

```
tamagui-lsp: loaded 1152 themes x 236 keys, 578 distinct values, 1062 KB resident cells
COMPLETION: 15 items -> background, background-focus, background-hover, background-press, ...
  textEdit range 10..20 (the clause, not the whole literal)
HOVER: **background** - Tamagui theme value | dark: rgba(20, 20, 20, 1) | light: rgba(247, 247, 247, 1)
COLORS: 1
DIAGNOSTICS: 0
```

The hover line is the part with no Tailwind analogue: one token resolved across
themes, which is only cheap because of the dense matrix.

### Transport: `lsp-server`, not `async-lsp`

Revised from the initial sketch after checking dependencies. `lsp-server` is
transport only (crossbeam plus serde, no tokio and no tower). LSP requires
notifications to be processed in order, which a single synchronous loop gives
for free where an async framework has to reimpose it, and startup cost is
user-visible every time an editor opens a project. The result is a 1.1 MB
binary.

## Notes worth keeping

**A real-data bug the benchmark caught.** The token comparator mixed numeric and
lexical ordering per comparison, which is intransitive (`2 < 10` numerically,
`10 < "1a"` lexically, yet `2 > "1a"` lexically). Rust's sort detects this and
panics; it surfaced only against the real artifact, never against the unit
fixtures. Numeric keys now sort as numbers and ahead of all non-numeric keys.
There is an exhaustive total-order test over a mixed key set.
