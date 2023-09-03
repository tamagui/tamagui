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

<h2 align="center">
  A faster style system for React with an optimizing compiler
</h2>

<h5 align="center">
  Style and UI for React Native and Web, without downsides
</h5>


- `@tamagui/core` - Universal style library for React (web and native).
- `@tamagui/static` - Optimizing compiler that works with `core` and `tamagui`.
- `tamagui` - Complete UI kit that adapts to each platform.

See [tamagui.dev](https://tamagui.dev) for documentation.

Tamagui lets you share more code between web and native apps without sacrificing the two things that typically suffer: performance or code quality.

It does this with an optimizing compiler that outputs platform-specific optimizations, turning even cross-module-imported, logic-infused inline styled components into clean, flat DOM + CSS on the web, or on native, hoisted style objects and View/Text. The compiler also completely optional, as Tamagui also works entirely at runtime.

For example, within the ~500px² responsive browser section on [the homepage](https://tamagui.dev), 49 of the 55 or so inline styled components are flattened to a `div`. The homepage gains nearly 15% on the Lighthouse score just by turning on the compiler.

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

Note: you may see some errors around "studio" as you run build - this is fine, we encrypt some of the non-open-source projects in the repo. The errors shouldn't block anything.

It's easiest to use the `sandbox` project to test and develop things for web:

```
yarn sandbox
```

This runs a client-side only vite build of tamagui, with a complete configuration already set up.

To test on native, `kitchen-sink` is equally well set up.

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

Once you've made changes, you can add tests. All compiler and CSS generation tests live in `packages/static-tests`, other tests live in `apps/kitchen-sink/tests` or in other `-tests` packages.

Before submitting a PR, please check everything works across every combination of environments.

To do so, run the site, first in development to test if it works entirely at runtime:

```
# Make sure you have run `yarn watch:build` before you execute this command.

yarn site
```

You use `pages/test.tsx` as an easy way to load things. If it looks good, try running again with the compiler on:

```
yarn site:extract
```

Finally, if that looks good, build to production and test that:

```
yarn site:prod
```

This flow ensures it works with Vite, Webpack, Metro, Next.js with SSR, and with the compiler both on and off.
