<div align="center">
  <img margin="auto" width="572px" src="https://github.com/tamagui/tamagui/raw/master/apps/site/public/social.png" alt="Tamagui">
</div>

<h1 align="center">
  A style system, UI kit and optimizing compiler for React Native & Web
</h1>

- `@tamagui/core` - Independent minimal style system on top of React Native/Web.
- `tamagui` - Complete universal UI kit built on top of `@tamagui/core`.
- `@tamagui/static` - Optimizing compiler that works with `core` and `tamagui`.

See [tamagui.dev](https://tamagui.dev) for documentation.

Tamagui lets you **share more code between web and native apps while improving, rather than sacrificing, DX, performance, and code maintainability**.

It does this with an optimizing compiler that flattens your React trees and outputs platform-specific optimizations like generating atomic CSS and media queries on the web.

The compiler enables a **win-win-win**: more performance, easier to write, works on every platform. Typically you'd have to choose two of: performant, cross-platform, concise. With Tamagui, you don't!

The compiler actually partially evaluates code including imports, logic, spreads, and nested ternaries. Any fully analyzable JSX usage will be flattened entirely (to a `div` on web, or `View` on native, rather than your custom defined component), leading to large reductions in tree-size.

[Learn more on the website](https://tamagui.dev/docs/intro/introduction).

## Contributing

Tamagui is a monorepo that makes it easy to contribute.

As of now Tamagui has some encrypted files relating to upcoming features that you'll need to remove before install:

```
./scripts/ci-prepare.sh
```

Then install:

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
yarn site
```

You replace _app.tsx to return just your component/use case. If it looks good, try running again with the compiler on:

```
yarn site:extract
```

Finally, if that looks good, build to production and test that:

```
yarn site:prod
```

This flow ensures it works with Vite, Webpack, Metro, Next.js with SSR, and with the compiler both on and off.

Our plan is to add integration tests to cover all this and more soon!
