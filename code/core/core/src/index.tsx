// re-exports all of @tamagui/web just adds hooks
export * from '@tamagui/web'
export {
  SizeContext,
  createSizeContext,
  createSizeTable,
  defaultTokenSizePolicy,
  resolveSizeToken,
  resolveTokenSize,
} from '@tamagui/size'
export type * from '@tamagui/size'
export { createRefComponent, type RefProp } from '@tamagui/compose-refs'

import type {
  StackNonStyleProps,
  StackStyleBase,
  TamaDefer,
  TamaguiComponent,
  TamaguiElement,
  TamaguiTextElement,
  TextNonStyleProps,
  TextProps,
  TextStylePropsBase,
} from '@tamagui/web'
import { Text as WebText, View as WebView } from '@tamagui/web'
import type { RNTextProps, RNViewProps } from './reactNativeTypes'

// helpful for usage outside of tamagui
export {
  LayoutMeasurementController,
  registerLayoutNode,
  setOnLayoutStrategy,
  type LayoutEvent,
} from '@tamagui/use-element-layout'

// adds extra types to View/Stack/Text:

type RNExclusiveViewProps = Omit<RNViewProps, keyof StackNonStyleProps>
export interface RNTamaguiViewNonStyleProps
  extends StackNonStyleProps, RNExclusiveViewProps {}

type RNTamaguiView = TamaguiComponent<
  TamaDefer,
  TamaguiElement,
  RNTamaguiViewNonStyleProps,
  StackStyleBase,
  {}
>

type RNExclusiveTextProps = Omit<RNTextProps, keyof TextProps>
export interface RNTamaguiTextNonStyleProps
  extends TextNonStyleProps, RNExclusiveTextProps {}

type RNTamaguiText = TamaguiComponent<
  TamaDefer,
  TamaguiTextElement,
  RNTamaguiTextNonStyleProps,
  TextStylePropsBase,
  {}
>

// fixes issues with TS saying internal type usage is breaking
// see https://discord.com/channels/909986013848412191/1146150253490348112/1146150253490348112
export * from './reactNativeTypes'

// the one platform setup path, shared with `@tamagui/core/internal-runtime`
export { TamaguiProvider, createTamagui } from './runtime'

// overwrite web versions:
// putting at the end ensures it overwrites in dist/cjs/index.js
export const View = WebView as any as RNTamaguiView
export const Text = WebText as any as RNTamaguiText

// easily test type declaration output and if it gets messy:

// export const X = styled(WebView, {
//   variants: {
//     abc: {
//       true: {},
//     },
//   } as const,
// })

// export const Y = styled(X, {
//   variants: {
//     zys: {
//       true: {},
//     },
//   } as const,
// })

// export const Z = styled(Y, {
//   variants: {
//     xxx: {
//       true: {},
//     },
//   } as const,
// })

// export const A = styled(Z, {
//   variants: {} as const,
// })

// const zz = <A />

// import { TextInput } from 'react-native'
// export const InputFrame = styled(
//   TextInput,
//   {
//     name: 'Input',
//     backgroundColor: 'green',

//     variants: {
//       size: {
//         Size: () => ({}),
//       },

//       // disabled: {
//       //   boolean: () => ({})
//       // },
//     } as const,
//   },
//   {
//     isText: true,
//     accept: {
//       placeholderTextColor: 'color',
//     },
//   }
// )
