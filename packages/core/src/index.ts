import { useResponderEvents } from '@tamagui/react-native-use-responder-events'
import {
  StackProps,
  StackPropsBase,
  TamaguiComponent,
  TextProps,
  TextPropsBase,
  Stack as WebStack,
  Text as WebText,
  composeEventHandlers,
  isRSC,
  mergeEvent,
  setupHooks,
  styled,
} from '@tamagui/web'
import { RefObject } from 'react'
import type { Text as RNText, View as RNView } from 'react-native'

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

const T = styled(Stack, {
  backgroundColor: 'red',
  variants: {
    red: {
      true: {
        backgroundColor: 'red',
      },
    },
  },
})

const T2 = styled(T, {
  red: true,
})

// setup internal hooks:

setupHooks({
  getBaseViews() {
    const native = require('react-native')
    return {
      View: native.View || native.default.View,
      Text: native.Text || native.default.Text,
    }
  },

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

    // FOCUS
    // "focusable" indicates that an element may be a keyboard tab-stop.
    // ported from RNW: TODO move into getSplitStyles
    if (!viewProps.tabIndex) {
      const _focusable = focusable !== undefined ? focusable : accessible
      const role = viewProps.role
      if (_focusable === false) {
        viewProps.tabIndex = '-1'
      }
      if (
        // These native elements are focusable by default
        elementType === 'a' ||
        elementType === 'button' ||
        elementType === 'input' ||
        elementType === 'select' ||
        elementType === 'textarea'
      ) {
        if (_focusable === false || accessibilityDisabled === true) {
          viewProps.tabIndex = '-1'
        }
      } else if (
        // These roles are made focusable by default
        role === 'button' ||
        role === 'checkbox' ||
        role === 'link' ||
        role === 'radio' ||
        role === 'textbox' ||
        role === 'switch'
      ) {
        if (_focusable !== false) {
          viewProps.tabIndex = '0'
        }
      }
      // Everything else must explicitly set the prop
      if (_focusable === true) {
        viewProps.tabIndex = '0'
      }
    }

    return viewProps
  },

  useEvents(viewProps, events, { pseudos }, setStateShallow) {
    if (process.env.TAMAGUI_TARGET === 'native') {
      if (!events) return
      // add focus events
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
      if (events.onPress) {
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
