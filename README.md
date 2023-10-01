<div align="center">
  <img margin="auto" width="572px" src="https://github.com/tamagui/tamagui/raw/master/apps/site/public/social.png" alt="Tamagui">
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

It does this with an optimizing compiler that outputs platform-specific optimizations, turning even cross-module-imported, logic-infused, inline-styled components into clean, flat DOM + CSS on the web, or on native, hoisted style objects and View/Text. The compiler is also completely optional, as Tamagui also works entirely at runtime.

For example, within the ~500px² responsive browser section on [the homepage](https://tamagui.dev), 49 of the 55 or so inline styled components are flattened to a `div`. The homepage gains nearly 15% on Lighthouse just by turning on the compiler.

[Learn more on the website](https://tamagui.dev/docs/intro/introduction).

## Installing Tamagui

To install Tamagui with all it's components run:

```bash
npm install tamagui @tamagui/config @tamagui/theme-builder
```

Next, create a Tamagui config file named `tamagui.config.ts`:

```ts
// the v2 config imports the css driver on web and react-native on native

// for reanimated: @tamagui/config/v2-reanimated

// for react-native only: @tamagui/config/v2-native

import { config } from '@tamagui/config/v2'

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

### Usage

To use Tamagui in your Expo or Next.js projects, all you need to do is wrap your application in the `TamaguiProvider`:

```tsx
// this provides some helpful reset styles to ensure a more consistent look
// only import this from your web app, not native
import '@tamagui/core/reset.css'

import { TamaguiProvider } from 'tamagui'
import tamaguiConfig from './tamagui.config'

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      {/* your app here */}
    </TamaguiProvider>
  )
}
```

Done! Now try out some components:

```tsx
import { Button } from 'tamagui'

function Example() {
  return (
    <Button>
      My button
    </Button>
  );
}
```

## Contributing

We're welcoming and glad to have contributions to Tamagui. If you would like to contribute to Tamagui please check out our [contributing guide](https://github.com/tamagui/tamagui/blob/master/CONTRIBUTING.md) for how to do so. If you would like to contribute to the Tamagui documentation, then please read our [writing guide](https://github.com/tamagui/tamagui/apps/site/WRITING-GUIDE.md)

If these kinds of contributions don't suit your style, you can always contribute by writing articles, making videos or joining our [discord](https://discord.gg/vhEKmdCZw6) and helping other people solve problems.