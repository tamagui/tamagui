import { AdaptCapabilities, useAdaptContext, useAdaptIsActive } from '@tamagui/adapt'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import {
  createRefComponent,
  createStyledHOC,
  styled,
  View,
  type GetProps,
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
import type { View as RNView } from '@tamagui/react-native-types'
import {
  SHEET_BACKGROUND_NAME,
  SHEET_CONTAINER_NAME,
  SHEET_HANDLE_NAME,
  SHEET_OVERLAY_MARKER,
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
  GetProps<typeof View> & SheetStyleShorthandProps & ExtraProps
>

const SheetHandleFrame = styled(XStack, {
  displayName: SHEET_HANDLE_NAME,

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
  displayName: SHEET_OVERLAY_NAME,
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

Object.assign(SheetOverlayFrame.staticConfig, { [SHEET_OVERLAY_MARKER]: true })

const SheetContainerFrame = styled(YStack, {
  displayName: SHEET_CONTAINER_NAME,
  flex: 1,
  position: 'relative',
  zIndex: 0,
  width: '100%',
})

const SheetBackgroundFrame = styled(YStack, {
  displayName: SHEET_BACKGROUND_NAME,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: -1,
  pointerEvents: 'none',
})

export const SheetHandle = createStyledHOC(
  SheetHandleFrame,
  ({ scope, ...props }: SheetViewProps, forwardedRef) => {
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

export const SheetOverlay = createStyledHOC(
  SheetOverlayFrame,
  (propsIn: SheetViewProps, ref) => {
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

export const SheetContainer = createStyledHOC(
  SheetContainerFrame,
  (
    {
      scope,
      adjustPaddingForOffscreenContent,
      children,
      ...props
    }: SheetViewProps<ExtraContainerProps>,
    forwardedRef
  ) => {
    const context = useSheetContext(scope)
    const { hasFit, frameSize, contentRef, open } = context
    const composedContentRef = useComposedRefs(forwardedRef, contentRef)
    const offscreenSize = useSheetOffscreenSize(context)
    const stableFrameSize = useRef(frameSize)

    useEffect(() => {
      if (open && frameSize) {
        stableFrameSize.current = frameSize
      }
    }, [open, frameSize])

    const sheetContents = useMemo(() => {
      if (context.onlyShowContainer) {
        return (
          <SheetContainerFrame
            ref={composedContentRef}
            flex={hasFit ? 0 : 1}
            flexBasis={hasFit ? 'auto' : undefined}
            maxHeight={hasFit ? undefined : '100%'}
            pointerEvents={open ? 'auto' : 'none'}
            data-state={open ? 'open' : 'closed'}
            {...props}
            onLayout={composeEventHandlers(props.onLayout, (event) => {
              context.setFrameSize(event.nativeEvent.layout.height)
            })}
          >
            <StackZIndexContext zIndex={resolveViewZIndex(props.zIndex)}>
              {children}
            </StackZIndexContext>
          </SheetContainerFrame>
        )
      }
      const shouldUseFixedHeight = hasFit && !open && stableFrameSize.current

      return (
        <SheetContainerFrame
          ref={composedContentRef}
          flex={hasFit && open ? 0 : 1}
          flexBasis={hasFit ? 'auto' : undefined}
          maxHeight="100%"
          height={
            shouldUseFixedHeight
              ? stableFrameSize.current
              : hasFit
                ? undefined
                : frameSize
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
    }, [
      open,
      props,
      frameSize,
      offscreenSize,
      adjustPaddingForOffscreenContent,
      hasFit,
      context.onlyShowContainer,
      context.setFrameSize,
    ])

    if (context.onlyShowContainer) return sheetContents

    return (
      <RemoveScroll enabled={!context.disableRemoveScroll && context.open}>
        {sheetContents}
      </RemoveScroll>
    )
  }
)

type ExtraBackgroundProps = {
  /**
   * Disables the default background extension below the sheet. Leave this off
   * when a spring can overshoot on open so page content never shows through.
   */
  disableHideBottomOverflow?: boolean
}

export const SheetBackground = createStyledHOC(
  SheetBackgroundFrame,
  (
    { scope, disableHideBottomOverflow, ...props }: SheetViewProps<ExtraBackgroundProps>,
    forwardedRef
  ) => {
    const context = useSheetContext(scope)
    if (context.onlyShowContainer) return null
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
  }
)

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

    const nativeImplementation =
      props.native === true ||
      (Array.isArray(props.native) && props.native.includes('ios'))
        ? getNativeSheet('ios')
        : null
    const SheetImplementation = nativeImplementation ?? SheetImplementationCustom

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
