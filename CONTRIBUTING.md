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
