import { useResponderEvents } from '@tamagui/react-native-use-responder-events'
import type {
  GetProps,
  StackProps,
  StackPropsBase,
  TamaguiComponent,
  TamaguiElement,
  TamaguiTextElement,
  TextProps,
  TextPropsBase,
} from '@tamagui/web'
import {
  Stack as WebStack,
  Text as WebText,
  composeEventHandlers,
  setupHooks,
} from '@tamagui/web'
import type { RefObject } from 'react'

import { getBaseViews } from './getBaseViews'
import { useElementLayout } from './hooks/useElementLayout'
import { usePlatformMethods } from './hooks/usePlatformMethods'
import { RNTextProps, RNViewProps } from './reactNativeTypes'
import { usePressability } from './vendor/Pressability'

// re-exports all of @tamagui/web just adds hooks
export * from '@tamagui/web'
// fixes issues with TS saying internal type usage is breaking
// see https://discord.com/channels/909986013848412191/1146150253490348112/1146150253490348112
export * from './reactNativeTypes'

// adds extra types to Stack/Text:

type RNExclusiveViewProps = Omit<RNViewProps, keyof StackProps>

export const Stack = WebStack as any as TamaguiComponent<
  StackProps & RNExclusiveViewProps,
  TamaguiElement,
  StackPropsBase & RNExclusiveViewProps,
  void
>

type RNExclusiveTextProps = Omit<RNTextProps, keyof TextProps>

export const Text = WebText as any as TamaguiComponent<
  TextProps & RNExclusiveTextProps,
  TamaguiTextElement,
  TextPropsBase & RNExclusiveTextProps,
  void
>

// setup internal hooks:

setupHooks({
  getBaseViews,

  usePropsTransform(elementType, propsIn, hostRef) {
    // otherwise replicate react-native-web functionality
    const {
      // event props
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

      ...viewProps
    } = propsIn

    usePlatformMethods(hostRef as RefObject<Element>)
    useElementLayout(hostRef as RefObject<Element>, onLayout as any)
    useResponderEvents(hostRef, {
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
    } as any)

    // TODO move into getSplitStyles inital `if (process.env.TAMAGUI_TARGET === 'web')` block

    if (viewProps.href !== undefined && hrefAttrs !== undefined) {
      const { download, rel, target } = hrefAttrs
      if (download != null) {
        viewProps.download = download
      }
      if (rel != null) {
        viewProps.rel = rel
      }
      if (typeof target === 'string') {
        viewProps.target = target.charAt(0) !== '_' ? `_${target}` : target
      }
    }

    return viewProps
  },

  useEvents(viewProps, events, { pseudos }, setStateShallow, staticConfig) {
    if (process.env.TAMAGUI_TARGET === 'native') {
      if (events?.onFocus) {
        viewProps['onFocus'] = events.onFocus
      }
      if (events?.onBlur) {
        viewProps['onBlur'] = events.onBlur
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

        const pressability = usePressability(events || null)

        if (events) {
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
  // useChildren(children, viewProps, events, staticConfig) {
  //   if (process.env.TAMAGUI_TARGET === 'native') {
  //     if (staticConfig.isInput && !staticConfig.isHOC) {
  //       const Pressable = getBaseViews().Pressable
  //       console.log(
  //         'wrapping in pressable',
  //         events?.['onPressIn']?.toString(),
  //         viewProps['onPressIn']
  //       )
  //       // we need to wrap it in a view?
  //       return <Pressable {...events}>{children}</Pressable>
  //     }
  //   }
  // },
})

const dontComposePressabilityKeys = {
  onClick: true,
}
