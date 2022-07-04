<h1 align="center">
  <img margin="auto" width="612px" src="https://github.com/tamagui/tamagui/raw/master/packages/site/public/social.jpg" alt="Tamagui">
  <br>
</h1>

<h4 align="center">The faster, more complete style system for React Native & Web.</h4>

See [tamagui.dev](https://tamagui.dev) for documentation.

---

Tamagui lets you **share more code between web and native apps while improving, rather than sacrificing, DX, performance, and code maintainability**.

It does this by compiling typed inline styles - even ones containing conditional logic, themes, or responsivity - into efficient atomic CSS (or a hoisted StyleSheet on native).

This is a **win-win-win**: more performant, easier to write/maintain, and works on every platform. Typically you'd have to trade performance for DX, or both for cross-platform compatibility. With Tamagui, you don't!

In exchange you add some complexity with the compiler - but - it's both optional and very easy to granularly introspect or turn off.

The compiler does a lot, too - it analyzes logic, spreads, and nested ternaries, even flattening fully analyzable components to reduce tree depth signficantly.

[Read more on the website](https://tamagui.dev/docs/intro/introduction).

---

## Contributing

Tamagui is a monorepo that makes it easy to contribute.

As of now Tamagui has some encrypted files relating to upcoming features that you'll need to remove before install:

```
./script/ci-prepare.sh
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
