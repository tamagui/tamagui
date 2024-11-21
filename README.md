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
  <a href="https://gurubase.io/g/tamagui">
    <img alt="Gurubase" src="https://img.shields.io/badge/Gurubase-Ask%20Tamagui%20Guru-006BFF" />
  </a>
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

## Installing Tamagui

To install Tamagui with all its components run:

```bash
npm install tamagui @tamagui/config
```

Next, create a Tamagui config file named `tamagui.config.ts`:

```ts
import { config } from '@tamagui/config/v3'

import { createTamagui } from 'tamagui'
const tamaguiConfig = createTamagui(config)
// this makes typescript properly type everything based on the config

type Conf = typeof tamaguiConfig

declare module 'tamagui' {

  interface TamaguiCustomConfig extends Conf {}

}
export default tamaguiConfig
// depending on if you chose tamagui, @tamagui/core, or @tamagui/web
// be sure the import and declare module lines both use that same name
```

**Note:** The `v3` config imports the `@tamagui/animations-css` driver on web and `@tamagui/animations-react-native` on native. You can change these as you please, we provide exports for `animationsCSS` and `animationsNative`. If you want to use Reanimated, you can [copy and paste this code](https://github.com/tamagui/tamagui/blob/c9adbbe4a45d2a728f06605b0e5e91382dd5b92d/packages/config/src/animationsReanimated.ts) and pass it as `animations` to `createTamagui`.

## Contributing

To contribute to Tamagui reference the [contributing guide](https://github.com/tamagui/tamagui/blob/master/CONTRIBUTING.md).

To contribute to documentation reference the [writing guide](https://github.com/tamagui/tamagui/blob/master/code/tamagui.dev/WRITING-GUIDE.md).
