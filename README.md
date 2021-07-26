<h1 align="center">
  <img margin="auto" width="612px" src="https://raw.githubusercontent.com/snackui/snackui/master/website/static/img/snackui.svg" alt="SnackUI">
  <br>
</h1>

<h4 align="center">The faster style system for React Native & Web.</h4>

<p align="center">
  <a href="#setup">Setup</a> •
  <a href="#example">Example</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#issues">Issues</a> •
  <a href="#tradeoffs">Tradeoffs</a> •
  <a href="#license">License</a>
</p>

Style system for React Native and React Native Web building on ideas from [JSXStyle](https://github.com/jsxstyle/jsxstyle) and SwiftUI. Optimizes your inline styles into atomic CSS or StyleSheet.create(), and supports media queries and themes whether on web or native the same.  Outputs smaller bundle sizes and improves rendering performance. SnackUI is light (~10Kb gzipped for base views up to ~26Kb with Popover/Tooltip).

<div align="center">
  <img margin="auto" width="706px" src="https://raw.githubusercontent.com/snackui/snackui/master/website/static/img/diagram.png" alt="Illustration of <HStack spacing='md' /> <VStack spacing='lg' />">
</div>

## Features

- **Stack views** with flat style props, TypeScript types
  - Inspired by [SwiftUI stack views](https://learnappmaking.com/stacks-vstack-hstack-swiftui-how-to/)
- **Optimizing compiler** (forked from [JSXStyle](https://github.com/jsxstyle/jsxstyle))
  - Flattens `<View />` / `<Text />` into `<div />` / `<span />`.
  - Extracts inline styles to optimized [atomic CSS](https://css-tricks.com/lets-define-exactly-atomic-css/) stylesheets similar to [Facebook's internal style library](https://twitter.com/Daniel15/status/1160980442041896961).
  - Optimizes imports, conditionals, spreads and more
- **Pseudo styles**
  - Supports hoverStyle, pressStyle, and focusStyle
  - Normalizes native and web
- **Media Queries**
  - Supports native + web
  - Typed `useMedia` hook compiles away when possible, falls back gracefully
- **Themes**
  - Supports native + web
  - Typed `useTheme` hook compiles away when possible, falls back gracefully
  - Granular re-renders by tracking used theme keys
- **Development tools**
  - Output component name/line numbers in DOM
  - `// debug` pragma outputs detailed optimization info.

SnackUI flattens style props so there's no separate `style` object, if you want to read reasoning on why, [see why JSXStyle does it](https://github.com/jsxstyle/jsxstyle#why-write-styles-inline-with-jsxstyle).

## Example

```tsx
import { Text, VStack } from 'snackui'

export function Component() {
  return (
    <VStack
      marginHorizontal={10}
      backgroundColor="red"
      hoverStyle={{ backgroundColor: 'blue' }}
    >
      <Text color="green">Hello world</Text>
    </VStack>
  )
}
```

This will compile on the web to something like this:

```tsx
const _cn1 = 'r-1awozwy r-y47klf r-rs99b7 r-h-1udh08x'
const _cn2 = 'r-4qtqp9 r-1i10wst r-x376lf'
export function Component() {
  return (
    <div className={_cn1}>
      <span className={_cn2}>Hello world</span>
    </div>
  )
}
```

And on native:

```tsx
import { View, Text, StyleSheet } from 'react-native'

export function Component() {
  return (
    <View style={[sheet[0]]}>
      <Text style={[sheet[1]]}>Hello world</Text>
    </View>
  )
}

const sheet = StyleSheet.create({
  // ... styles for 0 and 1
})
```

Why do this? Beyond the joy and [many benefits](https://github.com/jsxstyle/jsxstyle#why-write-styles-inline-with-jsxstyle) of Stack views with inline styling, react-native-web views like `<View />` and `<Text />` aren't free. [Read the source of Text](https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/Text/index.js) for example. When you're rendering a large page with many text and view elements, SnackUI saves React from having to process all of that logic on every render, for every Text and View.

### Supported extractions

All the following code would be fully extracted to CSS, in cases where it can like this one, SnackUI flattes this VStack into a div:


```tsx
import { Text, VStack, useTheme, useMedia } from 'snackui'
import { redColor } from './colors'

// This entire component will be extracted to just a div + css!
// SnackUI will even remove the hooks

const height = 10

export function Component(props) {
  const theme = useTheme()
  const media = useMedia()
  return (
    <VStack
      // constant values
      height={height}
      // imported constants (using evaluateImportsWhitelist option)
      color={redColor}
      // theme values
      borderColor={theme.borderColor}
      // media queries inline conditional
      borderWidth={media.sm ? 1 : 2}
      // inline conditionals
      backgroundColor={props.highlight ? 'red' : 'blue'}
      // spread objects
      {...props.hoverable && {
        hoverStyle: { backgroundColor: 'blue' }
      }}
      // spread conditional objects
      {...props.condition ? {
          hoverStyle: { backgroundColor: 'blue' }
        } : {
          hoverStyle: { backgroundColor: 'red' }
        }
      }
      // media query spread conditional + themes
      {...media.lg && {
        hoverStyle: {
          backgroundColor: theme.backgroundColorAlt
        }
      }}
    />
  )
}
```

## Setup

Add to your project:

```bash
yarn add snackui snackui-loader @snackui/babel-plugin
```

For extraction to CSS on web, you'll need the Webpack plugin. If you don't need that (using a different bundler) or for React Native, use the babel plugin.

**Note:** Don't use *both* the Webpack and Babel plugin together as they will conflict.

### Webpack - CSS extraction

Only Webpack supported for now. Add the loader to your webpack config after `babel-loader`. Note, **make sure you don't also add the @snackui/babel-plugin to your babel config**, you only need the loader for Webpack.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: [
          // as of 0.14 snackui works with thread-loader (optional)
          'thread-loader',
          // optional, can use esbuild or none depending on need
          'babel-loader',
          {
            loader: 'snackui-loader',
            // snackui needs access to react-native-web
            exclude: /node_modules\/(?!react-native-web)/,
            // showing default values (besides exclude)
            options: {
              // use this to add files to be statically evaluated
              // full path or partial path supported
              // always use the ".js" extension (so colors.ts => colors.js)
              // default:
              evaluateImportsWhitelist: ['constants.js', 'colors.js'],
              // attempts to statically follow variables to compile
              evaluateVars: true

            },
          },
        ].filter(Boolean),
      },
    ],
  },
}
```

#### Notes

react-native-web is taking a stance against supporting className and removed support for it in v0.14. They also don't export any of the internal hooks necessary. To work around this we implemented logic in the snackui loaders that patch it to export the hooks. You need to be sure you allow either snackui-loader or @snackui/babel (depending on how you set it up) to ensure it is allowed to access react-native-web. Usually this just means not excluding `/node_modules/` or doing something like `/node_modules\/(?!react-native-web)/` instead.

To prevent issues with side effects, be sure to add `sideEffects: false` to your webpack css rule, something like:

```js
{
  test: /\.css$/i,
  use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
  sideEffects: true,
}
```

#### Deduping CSS (Production)

Using webpack 5, mini-css-extract-plugin, and css-minimizer-webpack-plugin you should dedupe the styles output. To create a single master CSS file with all styles dedupe, you can do something like the following. This works in dev mode with hot reloading as well.

```js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports  = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: `styles`,
          type: 'css/mini-extract',
          chunks: 'all',
          enforce: true,
        },
      },
    }
  },
  minimizer: [
    new CssMinimizerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isProduction ? '[name].[contenthash].css' : '[name].css',
    }),
  ]
}
```

### Babel

This is useful for Native apps or if not using Webpack.

Just add `@snackui/babel-plugin` as a babel plugin to your babel config. Instead of optimizing to CSS it extracts styles to StyleSheet.create(). This isn't as performant as going to CSS, but works with anything that supports babel.

#### Extra performance for React Native

To get a little more speed, add the following to your `metro.config.js`, which will allow SnackUI to "optimize itself". Basically, a few internal SnackUI views like Button can be optimized, but won't be by default as metro won't look for the SnackUI typescript files. To support this, just add `tsmain` to resolverMainFields like so:

```
module.exports = {
  ...config,
  resolver: {
    resolverMainFields: ['react-native', 'tsmain', 'browser', 'main'],
  },
}
```

## Documentation

### Extra props

SnackUI keeps things "close to the metal", we basically support all React Native StyleSheet props on the base stack views as they normally function. We've made one change though as of 0.6.0, which is to allow for flat transform props, much like [CSS Individual Transform Properties](https://webkit.org/blog/11420/css-individual-transform-properties/?utm_campaign=CSS%2BLayout%2BNews&utm_medium=email&utm_source=CSS_Layout_News_283).

Here's an example of flat transforms:

```tsx
import { VStack } from 'snackui'

export function Component(props) {
  return (
    <VStack
      x={100} // translateX
      y={50}  // translateY
      scale={2}
      rotate="180deg"
      perspective="1000"
    />
  )
}
```

### Media Queries

Early support for media queries has landed via the hook `useMedia`. It's designed to work much the same as the advanced conditional statements do above. If SnackUI extracts all media query statements, it will remove the hook for you.

Customizing the queries isn't supported quite yet, but planned to work without syntax changes. You'll have to make do with the defaults for the beta.

```tsx
import { useMedia, VStack } from 'snackui'

export function Component(props) {
  const media = useMedia()
  const { sm } = useMedia()
  return (
    <VStack
      height={media.xs ? 100 : 200}
      color={sm ? 'red' : 'blue'}
      {...media.lg && {
        hoverStyle: { backgroundColor: 'blue' }
      }}
    />
  )
}
```

Using the hook syntax has the nice benefit of falling back gracefully when it's not supported, without any change in syntax. Only width/height media queries work for now. To see if your media query extracted successfully, add `// debug` to the top of the file.

On native media queries are not extracted and left to parse at runtime.

### Themes

Early support for themes has also landed via the hook `useTheme`.

First, set up your themes in its own file:

```ts
// themes.ts

export type MyTheme = typeof dark
export type MyThemes = typeof themes

const dark = {
  backgroundColor: '#000',
  borderColor: '#222',
  color: '#fff',
}

const light: MyTheme = {
  backgroundColor: '#fff',
  borderColor: '#eee',
  color: '#000',
}

const themes = {
  dark,
  light,
}

export default themes
```

Then, add a `themesFile` property to your loader options. Please note, this means your themes file should be loadable by the node process.

```js
module: {
  rules: [
    {
      test: /\.[jt]sx?$/,
      use: [
        {
          loader: 'babel-loader',
        },
        {
          loader: require.resolve('snackui-loader'),
          options: {
            evaluateImportsWhitelist: ['constants.js', 'colors.js'],
            themesFile: require.resolve('./themes.ts'),
          },
        },
      ]
    }
  ]
}
```

Then, the root of your components:

```tsx
import { configureThemes, ThemeProvider } from 'snackui'
import themes, { MyTheme, MyThemes } from './themes'

// configure the types
declare module 'snackui' {
  interface ThemeObject extends MyTheme {}
  interface Themes extends MyThemes {}
}

configureThemes(themes)

export function App() {
  return (
    <ThemeProvider themes={themes} defaultTheme="light">
      <Component />
    </ThemeProvider>
  )
}
```

Finally, in any component below that:

```tsx
export function Component() {
  const theme = useTheme()
  return (
    <VStack color={theme.color} />
  )
}
```

SnackUI will extract this and other more complex use cases (logical expressions, ternaries), removing the hook. The CSS will be something like:

```css
.light {
  --color: #000;
  --backgroundColor: #fff;
  --borderColor: #eee;
}
.theme-color {
  color: var(--color);
}
```

And the output component:

```tsx
const _cn = `theme-color`
export function Component() {
  return (
    <div className={_cn} />
  )
}
```

## Tradeoffs

#### Pros

- **Nicer base views**: Stacks are easy to learn and use
- **Less up front time**: No more jumping between style/view, no time spent thinking about naming things.
- **Less long term maintenance**: No dead code to clean up, no thinking about merging shared styles.
- **Smaller bundle sizes**: Because everything is extracted to atomic CSS and theres no managing duplicate styles, you ship less JS and lighten your bundle.
- **Faster runtime performance**: Your browser can parse the CSS as it loads the page, view flattening means React trees are far more shallow.
- **Devtools**: Compiler outputs helpful information to DOM

#### Cons

- **More setup**: Need to configure a webpack plugin and babel plugin
- **Is Beta**: Will run into edge cases and bugs
- **Testing**: No testing library helpers as of yet
- **Must sanity check output**: Because we're analyzing somewhat complex statements to optimize, you'll have to keep an eye on the output to ensure it actually extracted. You can do so with the `// debug` pragma.

## Issues

SnackUI is still early stage. It works well for us, and we've built a fairly large app with it, but it's needs wider testing and a couple more features before it really shines. The compiler can be wonky in ways and occasional CSS bugs do exist, but generally it's not hard to quickly see if it's a Snack issue, and further, easy to deopt out when it does happen.

## Roadmap

See [the roadmap](ROADMAP.md) for details:

- [ ] ZStack
- [ ] [more universal popover](https://github.com/intergalacticspacehighway/react-native-popper#react-native-popper)
- [ ] Media Queries test coverage, docs and configuration
- [ ] Docs / docs site
- [ ] media query shorthands
  - [ ] maxWidth={{ sm: 10 }}
  - [ ] maxWidth={{ sm: x ? 10 : 0 }}
- [ ] Support extraction of custom components that extend lower level ones
  - [ ] Support user-defined components that just spread props onto simple child thats extractable
- [ ] [Variants/Scaling](ROADMAP.md#variants)
- [ ] Extraction - advanced traversals (see [plan](ROADMAP.md#advanced-traversal))
- [ ] Support `<Stack spacing />` extraction
- [ ] MaskView with web support

## License

MIT License, see [LICENSE](https://github.com/natew/snackui/blob/master/LICENSE)
