<div align="center">
  <img margin="auto" width="572px" src="https://github.com/tamagui/tamagui/raw/master/apps/site/public/social.png" alt="Tamagui">
</div>

<h1 align="center">
  Unify React Native and Web styling with an optimizing compiler
</h1>

- `@tamagui/core` - Universal style system on top of React Native + Web.
- `@tamagui/static` - Optimizing compiler that works with `core` and `tamagui`.
- `tamagui` - Complete universal UI kit built on top of `@tamagui/core`.

See [tamagui.dev](https://tamagui.dev) for documentation.

Tamagui lets you **share more code between web and native apps while improving, rather than sacrificing, DX, performance, and code maintainability**.

It does this with an optimizing compiler that outputs platform-specific optimizations and understands a rich "CSS-in-JS" style system with support for turning even inline styles with logic into flattened nodes.

The compiler generates atomic CSS and partially evaluated code that gains significant runtime performance. It evaluates across module boundaries, flattening a large % of styled components in your app (with easy to follow rules and debug tools to know when its working and not)

Within the ~500x² responsive browser section on [the homepage](https://tamagui.dev), 49 inline styled components are flattened to their defined tags like `div`. The front page the site gains nearly 10-20% in Lighthouse scores depending on the weather.

[Learn more on the website](https://tamagui.dev/docs/intro/introduction).

## Contributing

Tamagui is a monorepo that makes it easy to contribute. Install:

```
yarn
```

While developing, you'll want to run the build watcher in a dedicated terminal:

```
yarn watch
```

It's easiest to use the `sandbox` project to test and develop things for web:

```
yarn sandbox
```

This runs a client-side only vite build of tamagui, with a complete configuration already set up.

To test on native, `kitchen-sink` is equally light weight and well set up:

```
yarn kitchen-sink
```

Once you've made changes, you can add tests. All compiler and CSS generation tests live in `packages/static`.

Before submitting a PR, check everything works across every combination of environments.

To do so, run the site, first in development to test if it works entirely at runtime:

```
# Make sure you have run `yarn watch` before you excute this command.

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
