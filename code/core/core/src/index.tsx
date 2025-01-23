import { createMedia } from '@tamagui/react-native-media-driver'
import { useResponderEvents } from '@tamagui/react-native-use-responder-events'
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
import {
  Stack as WebStack,
  Text as WebText,
  View as WebView,
  composeEventHandlers,
  createTamagui as createTamaguiWeb,
  setupHooks,
} from '@tamagui/web'
import React from 'react'

import { createOptimizedView } from './createOptimizedView'
import { getBaseViews } from './getBaseViews'
import { getRect } from './helpers/getRect'
import { measureLayout, useElementLayout } from './hooks/useElementLayout'
import type { RNTextProps, RNViewProps } from './reactNativeTypes'
import { usePressability } from './vendor/Pressability'
import { addNativeValidStyles } from './addNativeValidStyles'

// add newer style props based on react native version
addNativeValidStyles()

// adds extra types to View/Stack/Text:

type RNExclusiveViewProps = Omit<RNViewProps, keyof StackNonStyleProps>
export interface RNTamaguiViewNonStyleProps
  extends StackNonStyleProps,
    RNExclusiveViewProps {}

type RNTamaguiView = TamaguiComponent<
  TamaDefer,
  TamaguiElement,
  RNTamaguiViewNonStyleProps,
  StackStyleBase,
  {}
>

type RNExclusiveTextProps = Omit<RNTextProps, keyof TextProps>
export interface RNTamaguiTextNonStyleProps
  extends TextNonStyleProps,
    RNExclusiveTextProps {}

type RNTamaguiText = TamaguiComponent<
  TamaDefer,
  TamaguiTextElement,
  RNTamaguiTextNonStyleProps,
  TextStylePropsBase,
  {}
>

// re-exports all of @tamagui/web just adds hooks
export * from '@tamagui/web'
// fixes issues with TS saying internal type usage is breaking
// see https://discord.com/channels/909986013848412191/1146150253490348112/1146150253490348112
export * from './reactNativeTypes'

// automate using the react native media driver
export const createTamagui: typeof createTamaguiWeb = (conf) => {
  if (process.env.TAMAGUI_TARGET === 'native') {
    if (conf.media) {
      conf.media = createMedia(conf.media)
    }
  }
  return createTamaguiWeb(conf)
}

const baseViews = getBaseViews()

// setup internal hooks:

setupHooks({
  getBaseViews,

  setElementProps: (node) => {
    // web only
    if (node && !node['measure']) {
      // @ts-ignore
      node.measure ||= (callback) => measureLayout(node, null, callback)
      // @ts-ignore
      node.measureLayout ||= (relativeToNode, success) =>
        measureLayout(node as HTMLElement, relativeToNode, success)
      // @ts-ignore
      node.measureInWindow ||= (callback) => {
        setTimeout(() => {
          const { height, left, top, width } = getRect(node as HTMLElement)!
          callback(left, top, width, height)
        }, 0)
      }
    }
  },

  usePropsTransform(elementType, propsIn, stateRef, willHydrate) {
    if (process.env.TAMAGUI_TARGET === 'web') {
      const isDOM = typeof elementType === 'string'

      // replicate react-native-web functionality
      const {
        // remove event props handles by useResponderEvents
        onMoveShouldSetResponder,
        onMoveShouldSetResponderCapture,
        onResponderEnd,
        onResponderGrant,
        onResponderMove,
        onResponderReject,
        onResponderRelease,
        onResponderStart,
        onResponderTerminate,
        onResponderTerminationRequest,
        onScrollShouldSetResponder,
        onScrollShouldSetResponderCapture,
        onSelectionChangeShouldSetResponder,
        onSelectionChangeShouldSetResponderCapture,
        onStartShouldSetResponder,
        onStartShouldSetResponderCapture,

        // android
        collapsable,
        focusable,

        // deprecated,
        accessible,
        accessibilityDisabled,

        onLayout,
        hrefAttrs,

        ...plainDOMProps
      } = propsIn

      if (willHydrate || isDOM) {
        useElementLayout(stateRef, !isDOM ? undefined : (onLayout as any))
        useResponderEvents(stateRef, !isDOM ? undefined : propsIn)
      }

      if (isDOM) {
        // TODO move into getSplitStyles
        if (plainDOMProps.href && hrefAttrs) {
          const { download, rel, target } = hrefAttrs
          if (download != null) {
            plainDOMProps.download = download
          }
          if (rel) {
            plainDOMProps.rel = rel
          }
          if (typeof target === 'string') {
            plainDOMProps.target = target.charAt(0) !== '_' ? `_${target}` : target
          }
        }
        return plainDOMProps
      }
    }
  },

  useEvents(viewProps, events, { pseudos }, setStateShallow, staticConfig) {
    if (process.env.TAMAGUI_TARGET === 'native') {
      if (events) {
        if (events.onFocus) {
          viewProps['onFocus'] = events.onFocus
        }
        if (events.onBlur) {
          viewProps['onBlur'] = events.onBlur
        }
      }

      if (staticConfig.isInput) {
        if (events) {
          const { onPressIn, onPressOut, onPress } = events
          const inputEvents = {
            onPressIn,
            onPressOut: onPressOut || onPress,
          }
          if (onPressOut && onPress) {
            // only supports onPressIn and onPressOut so combine them
            inputEvents.onPressOut = composeEventHandlers(onPress, onPressOut)
          }
          Object.assign(viewProps, inputEvents)
        }
      } else {
        // use Pressability to get smooth unPress when you press + hold + move out
        // only ever create once, use .configure() to update later
        if (events && viewProps.hitSlop) {
          events.hitSlop = viewProps.hitSlop
        }

        // note we do events checks more than we should because we need this hook to always run
        const pressability = usePressability(events)

        if (events) {
          if (process.env.NODE_ENV === 'development') {
            if (viewProps['debug']) {
              console.info(
                `Checking for press ${!!events.onPress} then applying pressability props: ${Object.keys(
                  pressability || {}
                )}`
              )
            }
          }

          if (events.onPress) {
            for (const key in pressability) {
              const og = viewProps[key]
              const val = pressability[key]
              viewProps[key] =
                og && !dontComposePressabilityKeys[key]
                  ? composeEventHandlers(og, val)
                  : val
            }
          }
        }
      }
    }
  },

  // attempt at properly fixing RN input, but <Pressable><TextInput /> just doesnt work on RN
  ...(process.env.TAMAGUI_TARGET === 'native' && {
    useChildren(elementType, children, viewProps) {
      if (process.env.NODE_ENV === 'test') {
        // test mode - just use regular views since optimizations cause weirdness
        return
      }

      if (elementType === baseViews.View) {
        // optimize view
        return createOptimizedView(children, viewProps, baseViews)
      }

      if (process.env.TAMAGUI_OPTIMIZE_NATIVE_VIEWS) {
        if (elementType === baseViews.Text) {
          // further optimize by not even caling elementType.render
          viewProps.children = children
          return React.createElement('RCTText', viewProps)
        }
      }
    },
  }),
})

const dontComposePressabilityKeys = {
  onClick: true,
}

// overwrite web versions:
// putting at the end ensures it overwrites in dist/cjs/index.js
export const View = WebView as any as RNTamaguiView
export const Stack = WebStack as any as RNTamaguiView
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

// const variants = {
//   fullscreen: {
//     true: {},
//   },
//   elevation: {
//     '...size': () => ({}),
//     ':number': () => ({}),
//   },
// } as const

// export const YStack = styled(View, {
//   flexDirection: 'column',
//   variants,
// })

// import { TextInput } from 'react-native'
// export const InputFrame = styled(
//   TextInput,
//   {
//     name: 'Input',
//     backgroundColor: 'green',

//     variants: {
//       // unstyled: {
//       //   false: {},
//       // },

//       size: {
//         '...size': () => ({}),
//       },

//       // disabled: {
//       //   ':boolean': () => ({})
//       // },
//     } as const,

//     // defaultVariants: {
//     //   unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
//     // },
//   },
//   {
//     isText: true,
//     accept: {
//       placeholderTextColor: 'color',
//     },
//   }
// )

// export const StyledInputFrame = styled(InputFrame, {
//   fontSize: 16,
//   fontFamily: '$silkscreen',
//   color: '$color5',
//   minWidth: 0,
//   borderWidth: 0,
//   borderColor: 'transparent',

//   variants: {
//     unset: {
//       false: {
//         borderWidth: 2,
//         py: 12,
//         px: 14,
//         borderRadius: 6,
//         bg: '$color3',
//         focusStyle: {
//           bg: '$color4',
//           margin: 0,
//         },
//       },
//     },
//   } as const,

//   defaultVariants: {
//     unset: false,
//   },
// })

// export const StyledStyledInputFrame = styled(
//   StyledInputFrame,
//   {
//     fontSize: 16,
//     fontFamily: '$silkscreen',
//     color: '$color5',
//     minWidth: 0,
//     borderWidth: 0,
//     borderColor: 'transparent',

//     variants: {
//       unset: {
//         false: {
//           borderWidth: 2,
//           py: 12,
//           px: 14,
//           borderRadius: 6,
//           bg: '$color3',
//           focusStyle: {
//             bg: '$color4',
//             margin: 0,
//           },
//         },
//       },
//     } as const,

//     defaultVariants: {
//       unset: false,
//     },
//   },
//   {
//     inlineProps: new Set(['id', 'testID']),
//   }
// )
// export const DepthTest = () => <StyledStyledInputFrame placeholder="" />
