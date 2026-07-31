/**
 * The one platform setup path for `@tamagui/core`: native base views, the element
 * layout/measure hooks, the react-native media driver, and the provider wrapper
 * that enables layout measurement.
 *
 * Importing this module runs `setupHooks` as a side effect. Both the regular root
 * (`@tamagui/core`) and the private `@tamagui/core/internal-runtime` entry import
 * it, so setup happens exactly once and import order never selects behavior.
 *
 * It reaches the shared runtime through `@tamagui/web/internal-runtime` rather than
 * the `@tamagui/web` root, so a frontend package that only needs setup does not also
 * pull in the regular inline-style frontend's public bindings.
 */
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import {
  createMeasure,
  createMeasureInWindow,
  createMeasureLayout,
  enable,
  useElementLayout,
} from '@tamagui/use-element-layout'
import type {
  TamaguiProviderProps,
  createTamagui as createTamaguiWebType,
} from '@tamagui/web'
import {
  TamaguiProvider as WebTamaguiProvider,
  createTamagui as createTamaguiWeb,
  setupHooks,
} from '@tamagui/web/internal-runtime'
import { createOptimizedView } from './createOptimizedView'
import { getBaseViews } from './getBaseViews'
import { setupMedia } from './setupMedia'

type GestureEnabledFreezeState = {
  frozen: boolean
  enabled: boolean
  warned: boolean
}

const GESTURE_STATE_KEY = '__tamagui_gesture__'
const GESTURE_ENABLED_FREEZE_KEY = '__tamagui_gesture_enabled_freeze__'

function freezeGestureHandlerEnabledMode() {
  const g = globalThis as typeof globalThis & {
    [GESTURE_STATE_KEY]?: { enabled?: boolean }
    [GESTURE_ENABLED_FREEZE_KEY]?: GestureEnabledFreezeState
  }

  const freezeState = (g[GESTURE_ENABLED_FREEZE_KEY] ??= {
    frozen: false,
    enabled: false,
    warned: false,
  })

  if (freezeState.frozen) {
    return
  }

  freezeState.frozen = true
  freezeState.enabled = Boolean(g[GESTURE_STATE_KEY]?.enabled)
  freezeState.warned = false
}

// adds useElementLayout enable
export const TamaguiProvider = (props: TamaguiProviderProps) => {
  if (process.env.TAMAGUI_TARGET === 'native') {
    freezeGestureHandlerEnabledMode()
  }

  useIsomorphicLayoutEffect(() => {
    enable()
  }, [])

  return <WebTamaguiProvider {...props} />
}

// automate using the react native media driver
export const createTamagui: typeof createTamaguiWebType = (conf) => {
  if (conf.media) {
    conf.media = setupMedia(conf.media)
  }
  return createTamaguiWeb(conf)
}

const baseViews = getBaseViews()

// setup internal hooks:

setupHooks({
  getBaseViews,

  setElementProps: (node) => {
    if (process.env.TAMAGUI_TARGET === 'web') {
      // web only
      if (node && !node['measure']) {
        node.measure ||= createMeasure(node)
        node.measureInWindow ||= createMeasureInWindow(node)
        node.measureLayout ||= createMeasureLayout(node)
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
        // responder events removed for web - use native pointer/touch events instead
        // the onResponder* props are stripped above and not passed to DOM
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

  // attempt at properly fixing RN input, but <Pressable><TextInput /> just doesnt work on RN
  ...(process.env.TAMAGUI_TARGET === 'native' && {
    useChildren(elementType, children, viewProps) {
      if (process.env.NODE_ENV === 'test') {
        // test mode - just use regular views since optimizations cause weirdness
        return
      }

      if (elementType === baseViews.View && baseViews.TextAncestor) {
        // optimize view
        return createOptimizedView(children, viewProps, baseViews)
      }
    },
  }),
})
