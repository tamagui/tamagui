<h1 align="center">
  <img margin="auto" width="612px" src="https://raw.githubusercontent.com/natew/snackui/master/docs/snackui.png" alt="SnackUI">
  <br>
</h1>

<h4 align="center">The smart SwiftUI-inspired UI kit for React Native & Web.</h4>

<p align="center">
  <a href="#setup">Setup</a> •
  <a href="#example">Example</a> •
  <a href="#media-queries">Media Queries</a> •
  <a href="#issues">Issues</a> •
  <a href="#tradeoffs">Tradeoffs</a> •
  <a href="#license">License</a>
</p>

SnackUI is a UI kit for react native and react native web that builds on the ideas of [JSXStyle](https://github.com/jsxstyle/jsxstyle) and SwiftUI. It's a great way to build cross platform app UI's on React that scale well - with smaller bundle sizes and faster rendering performance than StyleSheet.create() on the web. SnackUI is light; it doesn't prescribe much beyond basic views, hooks, and an optimizing compiler.

<div align="center">
  <img margin="auto" width="706px" src="https://raw.githubusercontent.com/natew/snackui/master/docs/diagram.png" alt="Illustration of <HStack spacing='md' /> <VStack spacing='lg' />">
</div>

## Features

- **Stack views** with flat, simpler RN TypeScript types
  - VStack, HStack, ZStack
  - Inspired by [SwiftUI stack views](https://learnappmaking.com/stacks-vstack-hstack-swiftui-how-to/)
- **Optimizing compiler** (forked from [JSXStyle](https://github.com/jsxstyle/jsxstyle))
  - Flatten `<View />` / `<Text />` into `<div />` / `<span />`.
  - Extract inline styles to optimized [atomic CSS](https://css-tricks.com/lets-define-exactly-atomic-css/) stylesheets similar to [Facebook's internal style library](https://twitter.com/Daniel15/status/1160980442041896961).
  - Support constant imports.
  - Support conditionals like `color={isLarge ? 'red' : 'blue'}` and `<Text {...isLarge && { color: 'red' }} />`
- **Pseudo styles**
  - Supports hoverStyle, pressStyle, and focusStyle
  - Normalizes tricky styling between native and web
- **Media Queries**
  - Universal support for native + web
  - Simple `useMedia` hook that with advanced optimization and graceful fallback
- **Development tools**
  - Shows component name in DOM elements.
  - Add `// debug` to the top of file for detailed optimization info.

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

Why do this? Beyond the joy and [many benefits](https://github.com/jsxstyle/jsxstyle#why-write-styles-inline-with-jsxstyle) of Stack views with inline styling, react-native-web views like `<View />` and `<Text />` aren't free. [Read the source of Text](https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/Text/index.js) for example. When you're rendering a large page with many text and view elements, snackui saves React from having to process all of that logic on every render, for every Text and View.

### Supported extractions

SnackUI has fairly advanced optimizations, it can extract this entire component to CSS and flatten the VStack into a div:


```tsx
import { Text, VStack } from 'snackui'
import { redColor } from './colors'

// this entire component can be extracted:

const height = 10

export function Component(props) {
  return (
    <VStack
      // constant values
      height={height}
      // imported constants (using evaluateImportsWhitelist option)
      color={redColor}
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
    />
  )
}
```

### Media Queries

**Beta**. Very early support for media queries has landed via the hook `useMedia`. It's designed to work much the same as the advanced conditional statements do above. If SnackUI extracts all media query statements, it will remove the hook for you.

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

## Setup

Add snackui to your project:

```bash
yarn add snackui @snackui/static @snackui/babel-plugin
```

You'll likely want to gitignore the outputted style files, though it's not necessary. We originally kept CSS in-memory, but ran into various issues, but would support re-implementing it if anyone knows a cleaner way. In your `.gitignore` add this:

```
*__snack.css
```

### Babel - Native / Simple extraction (experimental)

This is useful for Native apps or if you're not using Webpack.

For a simpler setup you can just add `@snackui/babel-plugin` as a babel plugin to your babel config to get extraction just to StyleSheet.create(). This isn't as performant as going to CSS, but works with anything that supports babel.

You can technically just use the babel plugin, but if you want much better flattening and CSS extraction, read on.

### Webpack - CSS extraction

To extract to CSS, SnackUI supports Webpack for now (v4 and v5). Add the loader to your webpack config after `babel-loader`. Note, **don't use the babel plugin if you are doing this**, you only need the loader for Webpack.

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
              // use this to add files to be statically evaluated
              // default:
              evaluateImportsWhitelist: ['constants.js', 'colors.js'],
              // exclude files from processing
              // default null
              exclude: /node_modules/,
              // attempts to statically follow variables to compile
              // default true
              evaluateVars: true

            },
          },
        ].filter(Boolean),
      },
    ],
  },
}
```

#### Caveat

react-native-web is currently taking a hard stance against supporting className and removed support for it in v0.14. We've opened an issue, but received pushback. We are going to try and work with them to see if there's a way they can enable a workaround now that we've published SnackUI. You'll have to use `patch-package` to restore className support for now.

- Example [patch for react-native-web experimental](docs/react-native-web+0.0.0-466063b7e.patch) (includes a extra patch for faster Text styles)

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
- **Requires checking output**: Because we're analyzing somewhat complex statements to optimize, you'll have to keep an eye on the output to ensure it actually extracted. You can do so with the `// debug` pragma.

## Issues

SnackUI is still early stage. It works well for us, and we've built a fairly large app with it, but it's needs wider testing and a couple more features before it really shines. Upcoming fixes:

- [ ] ZStack has incorrect behavior. It doesn't position child elements as Absolute positioned.

## Roadmap

See [the roadmap](roadmap.md):

- [ ] Support extraction of custom components that extend lower level ones
- [ ] Media Queries test coverage, docs and configuration
- [ ] Themes
- [ ] [Scaling](#roadmap-scaling)
- [ ] Extraction - advanced traversals (see [plan](#roadmap-advanced-traversal-plan))
- [ ] Support `<Stack spacing />`
- [ ] Support `<Input />`, `<Spacer flex />`, `<LinearGradient />`, maybe `<Image />`
- [ ] Support a few logical HTML props: onPress, etc
- [ ] Test performance of useMemo calls / splitProps
- [ ] Support reloading constants/themes during watch
- [ ] Extract default styles to StyleSheet.create() for better fallback runtime speed
- [ ] Explore using `babel-plugin-minify-dead-code-elimination` instead of internal hook code

#### Roadmap - Advanced traversal plan

Complex example:

```tsx
function Component() {
  const media = useMedia()

  // support extracting this to CSS entirely
  const color = media.xs ? 'red' : 'blue'
  const styles = {
    maxWidth: media.sm ? 100 : 200
    // ... other extaction semantics support as well
  }

  return (
    <>
      <VStack {...styles} color={color} />
      <VStack width={styles.maxWidth} />
    </>
  )
}
```

#### Roadmap - Scaling

One of the biggest needs in a UI is the ability to scale components to different sizes. This is not like Media Queries in that this simply having different size buttons, cards, and text on the same media/device.

The problem can be handled similarly to Media Queries and Themes in that it likely wants to be used like a hook/prop that most of the time can be extracted, but easily falls back to runtime for complex cases.

The hard part is it likley has a combinatorial effect with Media queries, where you want to scale things differently based on the media query. This section is just a thought experiment on how scaling could work.

Difficulties:

- Scale props may be different across components, would require understanding types or require a pragma comment for js
- Combining with media query explodes complexity a bit, but limiting the use cases could be confusing.


```tsx
// idea 1
// flexible, hard to extract
function Component(props: { scale: 'sm' | 'md' | 'lg' }) {
  const media = useMedia()
  const fontSize = useScale(props.scale, {
    sm: 12,
    md: 14,
    lg: 16
  })

  return (
    <>
      <Text fontSize={fontSize * media.sm ? 0.5 : 1} />
    </>
  )
}

// idea 2
// less flexible, easier to extract
const useScale = createScale({
  // media query outside (optional?)
  default: {
    // scale inside
    sm: 12,
    md: 14,
    lg: 16
  },
  sm: {
    sm: 10,
    md: 12,
    lg: 14
  }
})

function Component(props: { scale: 'sm' | 'md' | 'lg' }) {
  const fontSize = useScale(props.scale)
  return (
    <>
      <Text fontSize={fontSize} />
    </>
  )
}
```


## License

MIT License, see [LICENSE](https://github.com/natew/snackui/blob/master/LICENSE)
