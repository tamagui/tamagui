<h1 align="center">
  <img margin="auto" width="612px" src="https://raw.githubusercontent.com/natew/snackui/master/snackui.jpg" alt="SnackUI">
  <br>
  SnackUI
  <br>
</h1>

<h4 align="center">A fast UI kit for React Native (+ web) with SwiftUI stacks.</h4>

<p align="center">
  <a href="#setup">Setup</a> •
  <a href="#example">Example</a> •
  <a href="#issues">Issues</a> •
  <a href="#license">License</a>
</p>

SnackUI is a UI kit for react native and react native web that builds on the ideas of [JSXStyle](https://github.com/jsxstyle/jsxstyle) and SwiftUI. It's a great way to build cross platform app UI's on React that scale well - with smaller bundle sizes and faster rendering performance than StyleSheet.create() on the web.

## Features

- **Negative overhead with rnw**
  - Better than no overhead, SnackUI actually reduces your bundle size significantly over using vanilla react-native-web
- **Stack views** fully typed in TypeScript
  - VStack, HStack, ZStack
  - Inspired by the great [SwiftUI stack views](https://learnappmaking.com/stacks-vstack-hstack-swiftui-how-to/)
- **Optimizing Compiler** (forked from [JSXStyle](https://github.com/jsxstyle/jsxstyle))
  - Flattens `<View />` and `<Text />` into `<div />` and `<span />` where possible, increasing render performance.
  - Extracts inline styles to highly optimized [atomic CSS](https://css-tricks.com/lets-define-exactly-atomic-css/) stylesheets similar to [Facebook's internal style library](https://twitter.com/Daniel15/status/1160980442041896961).
  - Supports imported constant files for compiling shared constants and colors to CSS as well.
  - Supports simple conditionals like `color={isLarge ? 'red' : 'blue'}`
  - Supports simple spreads like: `<Text {...isLarge && { color: 'red' }} />`
- **Pseudo styles** for native and web
  - hoverStyle, pressStyle, and focusStyle
- **Normalizes** styling between Native/Web
- **Helpful development features**
  - Add component name in DOM elements.
  - Add `// debug` to the top of file for detailed optimization info.

As far as components go, SnackUI is light. It doesn't prescribe much beyond providing a few basic views that help you lay things out and providing the optimizing compiler.

SnackUI views flatten all style props onto the base props so there's no separate `style` prop to use, if you want to read reasoning on why, [see why JSXStyle does it](https://github.com/jsxstyle/jsxstyle#why-write-styles-inline-with-jsxstyle), SnackUI has all the same upsides listed there.

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

Why is this beneficial? React Native Web's views like `<View />` and `<Text />` are actually not so simple. [Read the source of Text](https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/Text/index.js) for example. When you're rendering a large page with many text and view elements that can be statically extracted, using snackui saves React from having to process all of that logic on every render, for every Text and View.

## Setup

Add snackui and snackui-static to your project:

```bash
npm i snackui snackui-static
```

Then add to your webpack config:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: require.resolve('snackui-static/loader'),
            options: {
              // file names that you import for shared constants/colors extraction
              evaluateImportsWhitelist: ['constants.js', 'colors.js'],
            },
          },
        ].filter(Boolean),
      },
    ],
  },
}
```

You'll likely want to gitignore the outputted style files, though it's not necessary. In your `.gitignore`:

```
*__snack.css
```

Two big things to note before choosing this library. One is that react-native-web is currently taking a hard stance against supporting className and removed support for it in v0.14. We've opened an issue, but received pushback. We are going to try and work with them to see if there's a way they can enable a workaround now that we've published SnackUI. You'll have to use `patch-package` to restore className support for now.

- [Patch for react-native-web experimental](docs/react-native-web+0.0.0-466063b7e.patch) (includes a extra patch for faster Text styles)

## Issues

SnackUI is still early stage. It works well for us, and we've built a fairly large app with it, but it's needs wider testing and a couple more features before it really shines. Upcoming fixes:

- [ ] A few issues in compilation where it can fail on complex extractions
- [ ] ZStack needs correct behavior to be similar to SwiftUI
  - Right now it doesn't position child elements as Absolute positioned

## Roadmap

- [ ] Media Query syntax support with compilation to CSS
  - Plan is to have an array syntax if possible: `margin={[10, 20, 30]}`
- [ ] Themes with compilation to CSS
  - Plan is to use CSS Variables on web
- [ ] Statically extract spacing prop

## License

MIT License, see [LICENSE](https://github.com/natew/snackui/blob/master/LICENSE)
