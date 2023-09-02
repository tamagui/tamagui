<div align="center">
  <img margin="auto" width="572px" src="https://github.com/tamagui/tamagui/raw/master/apps/site/public/social.png" alt="Tamagui">
</div>

<br/>

<div align="center">
  <img alt="NPM downloads" src="https://img.shields.io/npm/dw/@tamagui/core?logo=npm&label=NPM%20downloads&cacheSeconds=3600"/>
  <img alt="Discord users online" src="https://img.shields.io/github/commit-activity/m/tamagui/tamagui?label=Commits&logo=git" />
  <img alt="Commits per month" src="https://img.shields.io/discord/909986013848412191?logo=discord&label=Discord&cacheSeconds=3600" />
</div>

<br/>

<h1 align="center">
  Style and UI for React (web + native), with an optimizing compiler
</h1>


- `@tamagui/core` - Universal style library for React (web and native).
- `@tamagui/static` - Optimizing compiler that works with `core` and `tamagui`.
- `tamagui` - Complete UI kit that adapts to each platform.

See [tamagui.dev](https://tamagui.dev) for documentation.

Tamagui lets you share more code between web and native apps at once making your code simpler and performance better - things that typically get worse as you share more code between platforms.

It does this with an optimizing compiler that outputs platform-specific optimizations, plus a rich CSS in JS style system that can turn even dense logic into clean, flat DOM (or on native, hoisted style objects and View/Text).

The compiler generates atomic CSS and nets significant runtime performance. It can evaluate across module boundaries, adding helpful debugging information to your emitted code. It's also completely optional, as Tamagui also works entirely at runtime.

Within the ~500px² responsive browser section on [the homepage](https://tamagui.dev), 49 inline styled components are flattened to their defined tags like `div`. The front page the site gains nearly 10-20% in Lighthouse scores depending on the weather.

[Learn more on the website](https://tamagui.dev/docs/intro/introduction).

## Contributing

Tamagui is a monorepo that makes it easy to contribute. Install:

```
yarn
```

While developing, you'll want to run the build watcher in a dedicated terminal:

```
yarn watch:build
```

It's easiest to use the `sandbox` project to test and develop things for web:

```
yarn sandbox
```

This runs a client-side only vite build of tamagui, with a complete configuration already set up.

To test on native, `kitchen-sink` is equally light weight and well set up.

You'll need to create a [development build](https://docs.expo.dev/develop/development-builds/create-a-build/) to run this.

```
# Android
yarn kitchen-sink:build:android

# iOS
yarn kitchen-sink:build:ios
```

After the build has been completed, run:

```
yarn kitchen-sink
```

Once you've made changes, you can add tests. All compiler and CSS generation tests live in `packages/static`.

Before submitting a PR, check everything works across every combination of environments.

To do so, run the site, first in development to test if it works entirely at runtime:

```
# Make sure you have run `yarn watch:build` before you execute this command.

yarn site
```

You replace \_app.tsx to return just your component/use case. If it looks good, try running again with the compiler on:

```
yarn site:extract
```

Finally, if that looks good, build to production and test that:

```
yarn site:prod
```

This flow ensures it works with Vite, Webpack, Metro, Next.js with SSR, and with the compiler both on and off.

Our plan is to add integration tests to cover all this and more soon!
