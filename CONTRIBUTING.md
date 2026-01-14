# Contributing to `tamagui`

To set up your development environment you'll first need clone the Tamagui repo:

```bash
git clone https://github.com/tamagui/tamagui
```

This might take some time depending on your internet speed. Once it's done run the following command to install the dependencies:

```bash
bun install
```

And then build once:

```bash
bun run build:js
```

As you develop you should run this in a separate terminal, we use `bun` as a quick ts runner:

```bash
npm i -g bun
bun run watch
```

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

Is a bit easier but runs on One, it should work with Expo Go.

If you are ok to build the native apps, then:

```bash
bun run kitchen-sink
```

Note that kitchen-sink needs react 18 so you do this profile switch first.
But if you're working on the sandbox you'll want to run `bun install` again to clear it.

But that requires building the native apps:

```bash
# Android
bun run kitchen-sink:build:android

# iOS
bun run kitchen-sink:build:ios
```

### Running web

You can run `bun run sandbox` or `bun run dev` (the tamagui website).

### Fixing libraries

All compiler and CSS generation tests live in `code/static/static-tests`.

There are many native tests in `code/kitchen-sink/tests`.

A variety of core tests live in `code/core/core-test`.

Before submitting a PR, please check everything works across every combination of environments.

## Other ways to Contribute

Join the [Discord](https://discord.gg/vhEKmdCZw6).
