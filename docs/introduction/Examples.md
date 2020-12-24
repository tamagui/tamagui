---
id: examples
title: Examples
description: 'Introduction > Examples: SnackUI example apps'
hide_title: true
---

# Examples

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


## Next.js

Run the [Next.js](https://github.com/natew/snackui/tree/master/examples/nextjs) example:

```sh
git clone https://github.com/natew/snackui.git

cd snackui/examples/nextjs
yarn install
yarn start
```
