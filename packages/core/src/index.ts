import { useResponderEvents } from '@tamagui/react-native-use-responder-events'
import type {
  StackProps,
  StackPropsBase,
  TamaguiComponent,
  TextProps,
  TextPropsBase,
} from '@tamagui/web'
import {
  Stack as WebStack,
  Text as WebText,
  composeEventHandlers,
  isRSC,
  mergeEvent,
  setupHooks,
} from '@tamagui/web'
import type { RefObject } from 'react'
import type { Text as RNText, View as RNView } from 'react-native'

import { getBaseViews } from './getBaseViews'
import { useElementLayout } from './hooks/useElementLayout'
import { usePlatformMethods } from './hooks/usePlatformMethods'
import type { RNTextProps, RNViewProps } from './reactNativeTypes'
import { usePressability } from './vendor/Pressability'

// re-exports all of @tamagui/web just adds hooks
export * from '@tamagui/web'

// adds extra types to Stack/Text:

export const Stack = WebStack as TamaguiComponent<
  StackProps & RNViewProps,
  RNView,
  StackPropsBase & RNViewProps
>

export const Text = WebText as TamaguiComponent<
  TextProps & RNTextProps,
  RNText,
  TextPropsBase & RNTextProps
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

    if (!isRSC) {
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
    }

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

  useEvents(viewProps, events, { pseudos }, setStateShallow) {
    if (process.env.TAMAGUI_TARGET === 'native') {
      const attachFocus = !!pseudos?.focusStyle
      if (attachFocus) {
        viewProps.onFocus = mergeEvent(viewProps.onFocus, () => {
          setStateShallow({ focus: true })
        })
        viewProps.onBlur = mergeEvent(viewProps.onBlur, () => {
          setStateShallow({ focus: false })
        })
      }

      // use Pressability to get smooth unPress when you press + hold + move out
      // only ever create once, use .configure() to update later
      const pressability = usePressability(
        events ? { ...events, hitSlop: viewProps.hitSlop } : {}
      )
      if (events?.onPress) {
        for (const key in pressability) {
          const og = viewProps[key]
          const val = pressability[key]
          viewProps[key] =
            og && !dontComposePressabilityKeys[key] ? composeEventHandlers(og, val) : val
        }
      }
    }
  },
})

const dontComposePressabilityKeys = {
  onClick: true,
}
