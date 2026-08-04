# Contributing to `tamagui`

To set up your development environment you'll need [bun](https://bun.sh) installed, then clone and install:

```bash
git clone https://github.com/tamagui/tamagui
cd tamagui
bun install
```

The first install will automatically build all packages.

If you are developing actively you can run this to watch and rebuild js and types as you edit:

```bash
bun run watch
```

We compile out js to `dist` for "0-setup" installs by compiling a .native version of every file, and then in every web file we replace react-native with react-native-web. We also build our types out to ./types/\*.d.ts for a variety of reasons - it means we can't cause type issues for people with stricter configurations using our packages, it means we can track type regressions (the styled() type setup is impossible delicate to explosions of complexity), and it's generally faster for end users.

### Linking tamagui into your existing project

Most package managers have a `link` command that lets you link in the local tamagui to your project, we've built a package we found useful that works with `bun` or `yarn` depending on your configuration:

```bash
npm i -g lllink
lllink ~/path/to/tamagui
```

### Running native apps

There's a few ways to run code in the repo, generally for native, there's two ways:

```bash
bun run sandbox
```

Is a bit easier but runs on One (the One framework, `one dev`).

If you are ok to build the native apps, then:

```bash
bun run kitchen-sink
```

That requires building the native apps:

```bash
# Android
bun run kitchen-sink:build:android

# iOS
bun run kitchen-sink:build:ios
```

### Running web

You can run `bun run sandbox` or `bun run dev` (the tamagui website).

### Local Testing Setup

#### Rebuild before package tests

Test files often run from source while their workspace dependencies resolve
through built package exports. Native core tests also alias `@tamagui/core` to
the built `@tamagui/core/native-test` entry. After changing a package, run
`bun run build` in that package before trusting a dependent suite, or keep
`bun run watch` running at the repository root while you work. Otherwise the
test can exercise stale `dist` output instead of the source you just changed.

The [V3 final conformance matrix](./plans/v3-final-conformance-matrix.md)
records the source, dist, mixed, or artifact topology for each release gate.

#### Style value parsing: one parse per unique value

Treat a style value string as immutable input to the shared style grammar. A
runtime path may parse each unique string once, store the result in a bounded
cache keyed by that string, and evaluate the parsed conditions as often as the
component renders. It must not scan or parse the original string again to
answer another question about its structure. Extend the cached parsed result
with the needed predicate or metadata instead.

This is a parsing and performance constraint. It is separate from the
"single-forward-pass" rule in `plans/v3-evolution.md`, which defines authored
precedence and says that later output wins per property. That ordering rule
does not permit repeated parsing during the pass or in another render hook.

Three runtime costs found in the v3 native rich fixture show what this rule
prevents:

- `contributeStyleString` parsed the same conditional `borderColor` string on
  every render, then shorthand expansion resolved its one `rgba(...)`
  component four times. Caching the canonical parse and reusing the resolved
  single component reduced that Hermes hotspot from 36.189 ms to 18.416 ms
  across 600 interactions.
- `hasFlatModifier` rescanned every style string for lifecycle modifiers on
  every node render, costing 7.8 ms across 600 interactions in a fixture with
  no `enter:` modifiers. The cached parse now carries `modifierNames`, so the
  lifecycle check reads the result instead of implementing another scanner.
- `configuredValue` spent 3.9 ms across 600 interactions treating plain CSS
  calls such as `rgb(...)` as possible sigil-less tokens, followed by another
  0.8 ms in `resolveEmbeddedTokens`. Literal CSS calls now take the grammar's
  classified fast path rather than being scanned twice.

When adding a consumer of `@tamagui/style-grammar`, look for an existing cached
parse before calling `parseValue`. If the parsed form cannot answer the new
question, add that information to the shared parsed representation. Do not add
a local string scanner beside the grammar.

#### Playwright (web integration tests)

Install browser binaries before first run:

```bash
cd code/kitchen-sink
bun run test:web:setup   # installs chromium
bun run start:web        # start dev server (background)
bun run test:web         # run all web tests
```

#### Detox (iOS E2E tests)

Install dependencies:

```bash
npm install -g detox-cli
brew tap wix/brew && brew install applesimutils
```

The `run-detox.sh` script will automatically:
- Run `expo prebuild` if the `ios/` directory doesn't exist
- Build the Detox framework cache if missing (needed after Xcode updates)
- Start Metro if not already running
- Build the app if the binary is missing or outdated

```bash
cd code/kitchen-sink
bun run detox:run:ios                              # run all iOS tests
bun run detox:run:ios "Sheet"                      # filter by test name
DETOX_DEVICE="iPhone 16 Pro" bun run detox:run:ios # override simulator device
```

If the Detox framework cache gets corrupted after an Xcode update:

```bash
npx detox clean-framework-cache && npx detox build-framework-cache
```

### Fixing libraries

All compiler and CSS generation tests live in `code/compiler/static-tests`.

There are many native tests in `code/kitchen-sink/tests`.

A variety of core tests live in `code/core/core-test`.

Before submitting a PR, please check everything works across every combination of environments.

### Linting & Formatting

The project uses [oxfmt](https://oxc.rs) + [oxlint](https://oxc.rs) (Rust-based, fast):

```bash
# check formatting + lint
bun run lint

# auto-fix
bun run lint:fix

# format only
bun run format
```

## Other ways to Contribute

Join the [Discord](https://discord.gg/vhEKmdCZw6).
