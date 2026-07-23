import { AdaptCapabilities, useAdaptContext, useAdaptIsActive } from '@tamagui/adapt'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import {
  createRefComponent,
  createStyledHOC,
  styled,
  View,
  type TamaguiElement,
  type ViewProps,
} from '@tamagui/core'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { resolveViewZIndex } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { XStack, YStack } from '@tamagui/stacks'
import { useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import { StackZIndexContext } from '@tamagui/z-index-stack'
import type { FunctionComponent, Ref } from 'react'
import { useContext, useEffect, useMemo, useRef } from 'react'
import type { View as RNView } from 'react-native'
import { Platform } from 'react-native'
import {
  SHEET_BACKGROUND_NAME,
  SHEET_CONTAINER_NAME,
  SHEET_HANDLE_NAME,
  SHEET_OVERLAY_NAME,
} from './constants'
import { getNativeSheet } from './nativeSheet'
import {
  SheetOverlayLayerContext,
  useAnimatedPosition,
  useSheetContext,
} from './SheetContext'
import { SheetImplementationCustom } from './SheetImplementationCustom'
import { SheetScrollView } from './SheetScrollView'
import type { SheetProps, SheetScopedProps } from './types'
import { useSheetController } from './useSheetController'
import { useSheetOffscreenSize } from './useSheetOffscreenSize'
import { getMaxViewportHeight } from './webViewport'

export * from './types'

type SheetStyleShorthandProps = {
  h?: ViewProps['height']
  o?: ViewProps['opacity']
  pos?: ViewProps['position']
}

type SheetViewProps<ExtraProps extends object = {}> = SheetScopedProps<
  ViewProps & SheetStyleShorthandProps & ExtraProps
>

const SheetHandleFrame = styled(XStack, {
  name: SHEET_HANDLE_NAME,

  // the behavior Handle ships no opacity rules; open/close aesthetics (fade in
  // when open, dim when idle) live in the copied skin. see the canonical skin.
  variants: {
    open: {
      true: {
        pointerEvents: 'auto',
      },
      false: {
        pointerEvents: 'none',
      },
    },
  } as const,
})

const SheetOverlayFrame = styled(YStack, {
  name: SHEET_OVERLAY_NAME,
  inset: 0,
  position: 'absolute',
  zIndex: 100_000 - 1,
  pointerEvents: 'auto',

  variants: {
    open: {
      true: {
        pointerEvents: 'auto',
      },
      false: {
        pointerEvents: 'none',
      },
    },
  } as const,
})

const SheetContainerFrame = styled(YStack, {
  name: SHEET_CONTAINER_NAME,
  flex: 1,
  position: 'relative',
  zIndex: 0,
  width: '100%',
  maxHeight: '100%',
})

const SheetBackgroundFrame = styled(YStack, {
  name: SHEET_BACKGROUND_NAME,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: -1,
  pointerEvents: 'none',
})

export const SheetHandle = createStyledHOC(SheetHandleFrame)<SheetViewProps>(
  ({ scope, ...props }, forwardedRef) => {
    const context = useSheetContext(scope)
    const composedRef = useComposedRefs<TamaguiElement>(context.handleRef, forwardedRef)
    const wasDraggingRef = useRef(false)

    useEffect(() => {
      if (!context.scrollBridge) return
      return context.scrollBridge.onParentDragging((isDragging: boolean) => {
        if (isDragging) {
          wasDraggingRef.current = true
        }
      })
    }, [context.scrollBridge])

    if (context.onlyShowContainer) {
      return null
    }

    return (
      <SheetHandleFrame
        ref={composedRef}
        onPressIn={() => {
          wasDraggingRef.current = false
        }}
        onPress={() => {
          if (wasDraggingRef.current) {
            wasDraggingRef.current = false
            return
          }
          const max = context.snapPoints.length + (context.dismissOnSnapToBottom ? -1 : 0)
          const nextPos = (context.position + 1) % max
          context.setPosition(nextPos)
        }}
        open={context.open}
        {...props}
      />
    )
  }
)

export const SheetOverlay = createStyledHOC(SheetOverlayFrame)<SheetViewProps>(
  (propsIn, ref) => {
    const { scope, ...props } = propsIn
    const context = useSheetContext(scope)
    const isInOverlayLayer = useContext(SheetOverlayLayerContext)
    const didWarn = useRef(false)

    if (context.onlyShowContainer) {
      return null
    }

    if (!isInOverlayLayer) {
      if (process.env.NODE_ENV === 'development' && !didWarn.current) {
        didWarn.current = true
        console.error(
          'Sheet.Overlay must be a direct child of Sheet. Move it next to Sheet.Handle and Sheet.Container.'
        )
      }

      return null
    }

    return (
      <SheetOverlayFrame
        {...props}
        ref={ref}
        onPress={composeEventHandlers(
          props.onPress,
          context.dismissOnOverlayPress
            ? () => {
                context.setOpen(false)
              }
            : undefined
        )}
      />
    )
  }
)

type ExtraContainerProps = {
  /**
   * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
   * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
   * turned on, the inner content is always set to the max height of the sheet.
   */
  adjustPaddingForOffscreenContent?: boolean
}

export const SheetContainer = createStyledHOC(SheetContainerFrame)<
  SheetViewProps<ExtraContainerProps>
>(({ scope, adjustPaddingForOffscreenContent, children, ...props }, forwardedRef) => {
  const context = useSheetContext(scope)
  const { hasFit, disableRemoveScroll, frameSize, contentRef, open } = context
  const composedContentRef = useComposedRefs(forwardedRef, contentRef)
  const offscreenSize = useSheetOffscreenSize(context)
  const stableFrameSize = useRef(frameSize)

  useEffect(() => {
    if (open && frameSize) {
      stableFrameSize.current = frameSize
    }
  }, [open, frameSize])

  const sheetContents = useMemo(() => {
    const shouldUseFixedHeight = hasFit && !open && stableFrameSize.current

    return (
      <SheetContainerFrame
        ref={composedContentRef}
        flex={hasFit && open ? 0 : 1}
        flexBasis={hasFit ? 'auto' : undefined}
        height={
          shouldUseFixedHeight ? stableFrameSize.current : hasFit ? undefined : frameSize
        }
        pointerEvents={open ? 'auto' : 'none'}
        data-state={open ? 'open' : 'closed'}
        {...props}
      >
        <StackZIndexContext zIndex={resolveViewZIndex(props.zIndex)}>
          {children}
        </StackZIndexContext>

        {adjustPaddingForOffscreenContent && (
          <View data-sheet-offscreen-pad height={offscreenSize} width="100%" />
        )}
      </SheetContainerFrame>
    )
  }, [open, props, frameSize, offscreenSize, adjustPaddingForOffscreenContent, hasFit])

  return (
    <RemoveScroll enabled={!disableRemoveScroll && context.open}>
      {sheetContents}
    </RemoveScroll>
  )
})

type ExtraBackgroundProps = {
  /**
   * Disables the default background extension below the sheet. Leave this off
   * when a spring can overshoot on open so page content never shows through.
   */
  disableHideBottomOverflow?: boolean
}

export const SheetBackground = createStyledHOC(SheetBackgroundFrame)<
  SheetViewProps<ExtraBackgroundProps>
>(({ scope, disableHideBottomOverflow, ...props }, forwardedRef) => {
  const context = useSheetContext(scope)
  const bottomOverflow = isWeb
    ? Math.max(context.frameSize, getMaxViewportHeight())
    : context.frameSize

  return (
    <SheetBackgroundFrame
      ref={forwardedRef}
      data-sheet-background=""
      bottom={disableHideBottomOverflow ? 0 : -bottomOverflow}
      {...props}
    />
  )
})

export const SheetRoot = createRefComponent<RNView, SheetProps>(
  function SheetRoot(props, ref) {
    const hydrated = useDidFinishSSR()
    const isAdapted = useAdaptIsActive()
    const adaptContext = useAdaptContext()
    const { isShowingNonSheet } = useSheetController(props.scope)
    const shouldUseAdapt = Boolean(
      adaptContext.open !== undefined || adaptContext.onOpenChange
    )
    const isShowingAdaptNonSheet =
      shouldUseAdapt && !adaptContext.active && adaptContext.open

    let SheetImplementation = SheetImplementationCustom

    if (props.native && Platform.OS === 'ios') {
      if (process.env.TAMAGUI_TARGET === 'native') {
        const impl = getNativeSheet('ios')
        if (impl) {
          // @ts-expect-error accepting external sheet implementation
          SheetImplementation = impl
        }
      }
    }

    if (isShowingAdaptNonSheet || isShowingNonSheet || !hydrated) {
      return null
    }

    const implementation = <SheetImplementation ref={ref} {...props} />

    return isAdapted ? (
      <AdaptCapabilities scroll overlay dismiss>
        {implementation}
      </AdaptCapabilities>
    ) : (
      implementation
    )
  }
)

const sheetParts = {
  Container: SheetContainer,
  Background: SheetBackground,
  Overlay: SheetOverlay,
  Handle: SheetHandle,
  ScrollView: SheetScrollView,
}

export const SheetControlled = withStaticProperties(
  SheetRoot as unknown as FunctionComponent<
    Omit<SheetProps, 'open' | 'onOpenChange'> & { ref?: Ref<RNView> }
  >,
  sheetParts
)

export const Sheet = withStaticProperties(SheetRoot, {
  Root: SheetRoot,
  Controlled: SheetControlled,
  useAnimatedPosition,
  ...sheetParts,
})
