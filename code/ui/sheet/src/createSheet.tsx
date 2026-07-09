import { AdaptCapabilities, useAdaptContext, useAdaptIsActive } from '@tamagui/adapt'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import type {
  GetProps,
  ViewProps,
  TamaguiComponent,
  TamaguiComponentExpectingVariants,
  TamaguiElement,
} from '@tamagui/core'
import { createStyledHOC, View, createRefComponent } from '@tamagui/core'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { resolveViewZIndex } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import { StackZIndexContext } from '@tamagui/z-index-stack'
import type { FunctionComponent, ReactNode, Ref } from 'react'
import { useContext, useMemo, useEffect, useRef } from 'react'
import type { View as RNView } from 'react-native'
import { Platform } from 'react-native'
import { getNativeSheet } from './nativeSheet'
import { SheetOverlayLayerContext, useSheetContext } from './SheetContext'
import { SheetImplementationCustom } from './SheetImplementationCustom'
import { SheetScrollView } from './SheetScrollView'
import type { SheetProps, SheetScopedProps } from './types'
import { useSheetController } from './useSheetController'
import { useSheetOffscreenSize } from './useSheetOffscreenSize'
import { getMaxViewportHeight } from './webViewport'

type SharedSheetProps = {
  open?: boolean
}

type BaseProps = ViewProps & SharedSheetProps

type SheetStyledComponent = TamaguiComponentExpectingVariants<BaseProps, SharedSheetProps>

export function createSheet<
  H extends TamaguiComponent | SheetStyledComponent,
  C extends TamaguiComponent | SheetStyledComponent,
  B extends TamaguiComponent | SheetStyledComponent,
  O extends TamaguiComponent | SheetStyledComponent,
>({
  Handle,
  Container,
  Background,
  Overlay,
}: {
  Handle: H
  Container: C
  Background: B
  Overlay: O
}) {
  const SheetHandle = createStyledHOC(Handle)<any>(
    ({ scope, ...props }: SheetScopedProps<SheetStyledComponent>, forwardedRef) => {
      const context = useSheetContext(scope)
      const composedRef = useComposedRefs<TamaguiElement>(context.handleRef, forwardedRef)

      // track if sheet was being dragged to prevent onPress toggle after drag
      const wasDraggingRef = useRef(false)

      // subscribe to parent dragging changes to track if we dragged during this press
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
        // @ts-ignore
        <Handle
          ref={composedRef}
          onPressIn={() => {
            // reset at start of new press
            wasDraggingRef.current = false
          }}
          onPress={() => {
            // skip toggle if this was a drag gesture
            if (wasDraggingRef.current) {
              wasDraggingRef.current = false
              return
            }
            // don't toggle to the bottom snap position when dismissOnSnapToBottom set
            const max =
              context.snapPoints.length + (context.dismissOnSnapToBottom ? -1 : 0)
            const nextPos = (context.position + 1) % max
            context.setPosition(nextPos)
          }}
          open={context.open}
          {...props}
        />
      )
    }
  )

  /* -------------------------------------------------------------------------------------------------
   * SheetOverlay
   * -----------------------------------------------------------------------------------------------*/

  const SheetOverlay = createStyledHOC(Overlay)<SheetScopedProps<{}>>((propsIn, ref) => {
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
      // @ts-ignore
      <Overlay
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
  })

  /* -------------------------------------------------------------------------------------------------
   * Sheet
   * -----------------------------------------------------------------------------------------------*/

  type ExtraContainerProps = {
    /**
     * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
     * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
     * turned on, the inner content is always set to the max height of the sheet.
     */
    adjustPaddingForOffscreenContent?: boolean
  }

  const SheetContainer = createStyledHOC(Container)<SheetProps & ExtraContainerProps>(
    ({ scope, adjustPaddingForOffscreenContent, children, ...props }, forwardedRef) => {
      const context = useSheetContext(scope)
      const { hasFit, disableRemoveScroll, frameSize, contentRef, open } = context
      const composedContentRef = useComposedRefs(forwardedRef, contentRef)
      const offscreenSize = useSheetOffscreenSize(context)

      // FIX: Store the frameSize when open for use during close animation
      const stableFrameSize = useRef(frameSize)
      useEffect(() => {
        if (open && frameSize) {
          stableFrameSize.current = frameSize
        }
      }, [open, frameSize])

      const sheetContents = useMemo(() => {
        // FIX: Use fixed height during close animation to prevent content-driven resizing
        const shouldUseFixedHeight = hasFit && !open && stableFrameSize.current

        return (
          // @ts-expect-error
          <Container
            ref={composedContentRef}
            flex={hasFit && open ? 0 : 1}
            flexBasis={hasFit ? 'auto' : undefined}
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
          </Container>
        )
      }, [
        open,
        props,
        frameSize,
        offscreenSize,
        adjustPaddingForOffscreenContent,
        hasFit,
      ])

      return (
        <RemoveScroll enabled={!disableRemoveScroll && context.open}>
          {sheetContents}
        </RemoveScroll>
      )
    }
  ) as any as (
    props: SheetScopedProps<
      Omit<GetProps<typeof Container>, keyof ExtraContainerProps> &
        ExtraContainerProps & { ref?: Ref<RNView> }
    >
  ) => ReactNode

  type ExtraBackgroundProps = {
    /**
     * Disables the default background extension below the sheet. Leave this off
     * when a spring can overshoot on open so page content never shows through.
     */
    disableHideBottomOverflow?: boolean
  }

  const SheetBackground = createStyledHOC(Background)<
    SheetScopedProps<GetProps<typeof Background> & ExtraBackgroundProps>
  >(({ scope, disableHideBottomOverflow, ...props }, forwardedRef) => {
    const context = useSheetContext(scope)
    const bottomOverflow = isWeb
      ? Math.max(context.frameSize, getMaxViewportHeight())
      : context.frameSize

    return (
      // @ts-ignore
      <Background
        ref={forwardedRef}
        data-sheet-background=""
        bottom={disableHideBottomOverflow ? 0 : -bottomOverflow}
        {...props}
      />
    )
  })

  const Sheet = createRefComponent<RNView, SheetProps>(function Sheet(props, ref) {
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

    /**
     * Performance is sensitive here so avoid all the hooks below with this
     */
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
  })

  const components = {
    Container: SheetContainer,
    Background: SheetBackground,
    Overlay: SheetOverlay,
    Handle: SheetHandle,
    ScrollView: SheetScrollView,
  }

  const Controlled = withStaticProperties(Sheet, components) as any as FunctionComponent<
    Omit<SheetProps, 'open' | 'onOpenChange'> & { ref?: Ref<RNView> }
  > &
    typeof components

  return withStaticProperties(Sheet, {
    ...components,
    Controlled,
  })
}

/* -------------------------------------------------------------------------------------------------*/
