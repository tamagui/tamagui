# SnackUI (beta)

SnackUI is a ui kit for react native and react native web that builds on the ideas of [JSXUI](https://github.com/jsxstyle/jsxstyle) and SwiftUI. It's a great way to build cross platform app UI's on React that scale well - with smaller bundle sizes and faster rendering performance than StyleSheet.create() on the web.

A few features:

- Stack views
  - VStack, HStack, ZStack, [much like SwiftUI](https://learnappmaking.com/stacks-vstack-hstack-swiftui-how-to/)
- Optimizing Compiler (forked from [JSXUI](https://github.com/jsxstyle/jsxstyle))
  - Webpack plugin for web
  - Extracts styles to highly optimized [atomic CSS](https://css-tricks.com/lets-define-exactly-atomic-css/) stylesheets similar to [Facebook's internal style library](https://twitter.com/Daniel15/status/1160980442041896961)
  - Flattens most base views down to `<div />` and `<span />` when possible, greatly increasing render performance
  - Supports imported constant files for compiling shared constants and colors to CSS as well
- Supports a few pseudo styles for native and web
  - hoverStyle, pressStyle, and focusStyle property on all Stacks
- Normalizes some styling between Native/Web to be more consistent
- Paragraph, Button and a few other low level views with helpful defaults

SnackUI is lightweight, it doesn't prescribe much beyond providing a few basic views that help you lay things out and providing an optimizing compiler.

SnackUI views flatten all style props onto the base props, if you want to read reasoning on why, [see why JSXStyle does it](https://github.com/jsxstyle/jsxstyle#why-write-styles-inline-with-jsxstyle):

- VStack, HStack, ZStack

```tsx
import { VStack, Text } from 'snackui'

export function Component() {
  return (
    <VStack
      marginHorizontal={10}
      backgroundColor="red"
      hoverStyle={{ backgroundColor: 'red' }}
    >
      <Text>Hello world</Text>
    </VStack>
  )
}
```

This will compile on the web to something like this:

```tsx
export function Component() {
  return (
    <div className="r-1awozwy r-y47klf r-rs99b7 r-h-1udh08x">
      <span className="r-4qtqp9 r-1i10wst">Hello world</span>
    </div>
  )
}
```

Why is this beneficial? React Native Web's views like `<View />` and `<Text />` are actually not so simple. [Read the source of Text](https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/Text/index.js), for example. When you're rendering a large page with many text and view elements that are simple, using snackui saves React from having to process all of that logic on every render, for every Text and View.

## Setup

Add snackui and snackui-static to your project:

```bash
npm i snackui snackui-static
```

Then add to your webpack config:

```js
const { UIStaticWebpackPlugin } = require('snackui-static')

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
      }
    ]
  }
  plugins: [
    new UIStaticWebpackPlugin()
  ]
}
```

## Current Issues

snackui is still early stage. It works well for us, and we've built a fairly large app with it, but it's needs wider testing and a couple more features before it really shines. Upcoming fixes:

- [ ] A few issues in compilation where it can fail on complex extractions
- [ ] Media Query syntax support with compilation to CSS
  - Plan is to have an array syntax if possible: `margin={[10, 20, 30]}`
- [ ] Themes with compilation to CSS
  - Plan is to use CSS Variables on web
- [ ] ZStack needs correct behavior to be similar to SwiftUI
  - Right now it doesn't position child elements as Absolute positioned

