# react-native-web-lite

A tree-shakeable fork of react-native-web that replaces the style engine with simple inline styles.

## What is this?

This package keeps **all** the API surfaces of react-native-web, but makes them fully tree-shakeable by replacing the style engine with a simple inline style system.

This is ideal if you're using an alternative style engine (like Tamagui, StyleX, etc.) and just want react-native API compatibility for non-style concerns.

## Trade-offs

Because the style engine is replaced with inline styles, **descendant-based styles are not supported**. This means things like `pointerEvents="box-none"` won't work as expected since they rely on react-native-web's CSS-based styling system.

If you need full react-native-web style support, use react-native-web directly.

## Features

- Full ESModule support
- Vite compatibility
- `sideEffects: false` + full tree shaking support
- TypeScript (converted from Flow)

## Setup

`@tamagui/next-plugin` and `@tamagui/vite-plugin` have an option `useReactNativeWebLite` to help automatically set this up.

With webpack, alias the following:

- `react-native-web$` => `react-native-web-lite`
- `react-native-svg` => `@tamagui/react-native-svg`
