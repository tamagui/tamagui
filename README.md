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

SnackUI is light. It doesn't prescribe much beyond providing a few basic views that help you lay things out and providing the optimizing compiler.

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
- **Is Beta**: Will run into edge cases
- **Testing**: Needs to implement some testing helpers

## Features

SnackUI views flatten all style props onto the base props so there's no separate `style` prop to use, if you want to read reasoning on why, [see why JSXStyle does it](https://github.com/jsxstyle/jsxstyle#why-write-styles-inline-with-jsxstyle), SnackUI has all the same upsides listed there.

SnackUI features:

- **Stack views** with flat, simpler RN TypeScript types
  - VStack, HStack, ZStack
  - inspired by [SwiftUI stack views](https://learnappmaking.com/stacks-vstack-hstack-swiftui-how-to/)
- Optimizing compiler
  - fork of [JSXStyle](https://github.com/jsxstyle/jsxstyle)
  - flattens `<View />` and `<Text />` into `<div />` and `<span />` where possible, increasing render performance.
  - extracts inline styles to highly optimized [atomic CSS](https://css-tricks.com/lets-define-exactly-atomic-css/) stylesheets similar to [Facebook's internal style library](https://twitter.com/Daniel15/status/1160980442041896961).
  - supports imported constant files for compiling shared constants and colors to CSS as well.
  - supports simple conditionals like `color={isLarge ? 'red' : 'blue'}`
  - supports simple spreads like: `<Text {...isLarge && { color: 'red' }} />`
- Pseudo styles
  - supports hoverStyle, pressStyle, and focusStyle
  - normalizes tricky styling between native and web
- Development tools
  - shows component name in DOM elements.
  - add `// debug` to the top of file for detailed optimization info.

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

Add snackui to your project:

```bash
yarn add snackui @snackui/babel-plugin
```

You'll likely want to gitignore the outputted style files, though it's not necessary. In your `.gitignore`:

```
*__snack.css
```

### Babel - Native / Simple extraction (experimental)

For a simpler setup you can just add `@snackui/babel-plugin` as a babel plugin to your babel config to get extraction just to StyleSheet.create(). This isn't as performant as going to CSS, but works with anything that supports babel.

You can technically just use the babel plugin, but if you want much better flattening and CSS extraction, read on.

### Webpack - CSS extraction

For web apps to extract to CSS, SnackUI only supports Webpack for now (4 and 5). Add the loader to your webpack config after `babel-loader`:

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
            loader: require.resolve('@snackui/static/loader'),
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

react-native-web is currently taking a hard stance against supporting className and removed support for it in v0.14. We've opened an issue, but received pushback. We are going to try and work with them to see if there's a way they can enable a workaround now that we've published SnackUI. You'll have to use `patch-package` to restore className support for now.

- [Patch for react-native-web experimental](docs/react-native-web+0.0.0-466063b7e.patch) (includes a extra patch for faster Text styles)

## Issues

SnackUI is still early stage. It works well for us, and we've built a fairly large app with it, but it's needs wider testing and a couple more features before it really shines. Upcoming fixes:

- [ ] ZStack needs correct behavior to be similar to SwiftUI
  - Right now it doesn't position child elements as Absolute positioned

## Roadmap

### Media Query syntax support with compilation to CSS

Previously was thinking of doing a simple version, with potential for objects:

```tsx
<VStack color={['red', 'blue']} />
<VStack color={{ small: 'red', medium: 'blue' }} />
```

But there were a few downsides, especially with how it conflicts with existing React Native array style props. To fix that you'd have to deviate from the React Native style spec, which would then require runtime translation on every view.

New plan is to do this:

```tsx
import { useMedia } from 'snackui'

// can configure useMedia in one place

function Component() {
  const media = useMedia()
  return (
    <>
      <VStack
        color="red"
        {...(media.small && {
          color: 'blue',
        })}
      />
      <VStack color={media.small ? 'red' : 'blue'} />
    </>
  )
}
```

Reasons are:

- More flexible to use
- Far easier to build/support, already supported extractions using existing syntax
- Falls back gracefully without any need to transform
- Easy to use for any other logical purpose beside styling
- TypeScript support for media keys
- Can define as many media queries as you want
- Not order dependent

In the future it's potentially possible then to have it simplify and auto-insert the hook for you.

```tsx
import { Media } from 'snackui'

// can configure useMedia in one place

function Component() {
  return (
    <VStack
      color="red"
      {...(Media.small && {
        color: 'blue',
      })}
    />
  )
}
```

It also dovetails nicely with Themes:

### Themes:

```tsx
import { Theme, useTheme } from 'snackui'

// can configure useTheme in one place
// ProvideThemes at root

function Component() {
  const theme = useTheme()
  return (
    <Theme name="dark">
      <VStack color={theme.color} />
    </Theme>
  )
}
```

Has the same features as useMedia in that it will nicely not need any special fallback case when compilation is not possible.

### Improve static extraction

- [ ] Support <Stack spacing />
- [ ] Support <Input />, <Spacer flex />, <LinearGradient />, maybe <Image />
- [ ] Support a few logical HTML props: onPress, etc

## License

MIT License, see [LICENSE](https://github.com/natew/snackui/blob/master/LICENSE)
