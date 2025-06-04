# Contributing to `tamagui`

To set up your development environment you'll first need clone the Tamagui repo:

```bash
git clone https://github.com/tamagui/tamagui
```

This might take some time depending on your internet speed. Once it's done run the following command to install the dependencies:

```bash
yarn install
```

And then build once:

```bash
yarn build:js
```

As you develop you should run this in a separate terminal:

```bash
yarn watch
```

### Running native apps

There's a few ways to run code in the repo, generally for native, there's two ways:


```bash
yarn sandbox
```

Is a bit easier but runs on One, it should work with Expo Go.

If you are ok to build the native apps, then:

```bash
yarn profile react-18
yarn kitchen-sink
```

Note that kitchen-sink needs react 18 so you do this profile switch first.
But if you're working on the sandbox you'll want to run `yarn` again to clear it.

But that requires building the native apps:

```bash
# Android
yarn kitchen-sink:build:android

# iOS
yarn kitchen-sink:build:ios
```

### Running web

You can run `yarn sandbox` or `yarn dev` (the tamagui website).

### Fixing libraries

All compiler and CSS generation tests live in `code/static/static-tests`.

There are many native tests in `code/kitchen-sink/tests`.

A variety of core tests live in `code/core/core-test`.

Before submitting a PR, please check everything works across every combination of environments.

## Other ways to Contribute

Join the [Discord](https://discord.gg/vhEKmdCZw6).
