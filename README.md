<div align="center">
  <img margin="auto" width="572px" src="https://github.com/tamagui/tamagui/raw/master/code/tamagui.dev/public/social.png" alt="Tamagui">
</div>

<h3 align="center">
  Style and UI for React (web and native) meet an optimizing compiler
</h3>

<div align="center">
  <img alt="NPM downloads" src="https://img.shields.io/npm/dw/@tamagui/core?logo=npm&label=NPM%20downloads&cacheSeconds=3600"/>
  <img alt="Discord users online" src="https://img.shields.io/github/commit-activity/m/tamagui/tamagui?label=Commits&logo=git" />
  <img alt="Commits per month" src="https://img.shields.io/discord/909986013848412191?logo=discord&label=Discord&cacheSeconds=3600" />
</div>

<br />
<br />

- `@tamagui/core` - Universal style library for React.
- `@tamagui/static` - Optimizing compiler that works with `core` and `tamagui`.
- `tamagui` - UI kit that adapts to every platform.

<br />

**See [tamagui.dev](https://tamagui.dev) for documentation.**

Tamagui lets you share more code between web and native apps without sacrificing the two things that typically suffer when you do: performance and code quality.

It does this with an optimizing compiler that outputs platform-specific optimizations - it turns styled components, even with complex logic or cross-module imports, into a simple `div` alongside atomic CSS on the web, or a View with its style objects hoisted on native.

The entirety of Tamagui works at compile time and runtime, and can be set up gradually, with initial usage as simple as importing it and using the base views and styled function.

We recommend checking out the starters with `npm create tamagui@latest`, they range from a simple learning example to a production-ready monorepo.

The compiler optimizes most and ultimately flattens a majority of styled components. In the [~500px² responsive browser section](https://tamagui.dev) of the Tamagui website, 49 of the 55 or so [inline styled components](https://github.com/tamagui/tamagui/blob/master/code/tamagui.dev/components/HeroResponsive.tsx) are flattened to a `div`. The homepage gains nearly 15% on Lighthouse with the compiler on.

[Learn more on the website](https://tamagui.dev/docs/intro/introduction).


## Contributing

To contribute to Tamagui reference the [contributing guide](https://github.com/tamagui/tamagui/blob/master/CONTRIBUTING.md).

To contribute to documentation reference the [writing guide](https://github.com/tamagui/tamagui/blob/master/code/tamagui.dev/WRITING-GUIDE.md).
