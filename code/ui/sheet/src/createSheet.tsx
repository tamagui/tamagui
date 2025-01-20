import { useComposedRefs } from '@tamagui/compose-refs'
import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import type {
  GetProps,
  StackProps,
  TamaguiComponent,
  TamaguiComponentExpectingVariants,
  TamaguiElement,
} from '@tamagui/core'
import { Stack } from '@tamagui/core'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import type { ForwardRefExoticComponent, FunctionComponent, RefAttributes } from 'react'
import { forwardRef, memo, useMemo } from 'react'
import type { View } from 'react-native'
import { Platform } from 'react-native'

import { SHEET_HANDLE_NAME, SHEET_NAME, SHEET_OVERLAY_NAME } from './constants'
import { getNativeSheet } from './nativeSheet'
import { useSheetContext } from './SheetContext'
import { SheetImplementationCustom } from './SheetImplementationCustom'
import { SheetScrollView } from './SheetScrollView'
import type { SheetProps, SheetScopedProps } from './types'
import { useSheetController } from './useSheetController'
import { useSheetOffscreenSize } from './useSheetOffscreenSize'

type SharedSheetProps = {
  open?: boolean
}

type BaseProps = StackProps & SharedSheetProps

type SheetStyledComponent = TamaguiComponentExpectingVariants<BaseProps, SharedSheetProps>

export function createSheet<
  H extends TamaguiComponent | SheetStyledComponent,
  F extends TamaguiComponent | SheetStyledComponent,
  O extends TamaguiComponent | SheetStyledComponent,
>({ Handle, Frame, Overlay }: { Handle: H; Frame: F; Overlay: O }) {
  const SheetHandle = Handle.styleable<any>(
    (
      { __scopeSheet, ...props }: SheetScopedProps<SheetStyledComponent>,
      forwardedRef
    ) => {
      const context = useSheetContext(SHEET_HANDLE_NAME, __scopeSheet)
      const composedRef = useComposedRefs<TamaguiElement>(context.handleRef, forwardedRef)

      if (context.onlyShowFrame) {
        return null
      }

      return (
        // @ts-ignore
        <Handle
          ref={composedRef}
          onPress={() => {
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

  const SheetOverlay = Overlay.extractable(
    memo((propsIn: SheetScopedProps<GetProps<typeof Overlay>>) => {
      const { __scopeSheet, ...props } = propsIn
      const context = useSheetContext(SHEET_OVERLAY_NAME, __scopeSheet)

      // this ones a bit weird for legacy reasons, we need to hoist it above <Sheet /> AnimatedView
      // so we just pass it up to context

      const element = useMemo(() => {
        return (
          // @ts-ignore
          <Overlay
            {...props}
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
      }, [props.onPress, props.opacity, context.dismissOnOverlayPress])

      useIsomorphicLayoutEffect(() => {
        context.onOverlayComponent?.(element)
      }, [element])

      if (context.onlyShowFrame) {
        return null
      }

      return null
    })
  )

  /* -------------------------------------------------------------------------------------------------
   * Sheet
   * -----------------------------------------------------------------------------------------------*/

  type ExtraFrameProps = {
    /**
     * By default the sheet adds a view below its bottom that extends down another 50%,
     * this is useful if your Sheet has a spring animation that bounces "past" the top when
     * opening, preventing it from showing the content underneath.
     */
    disableHideBottomOverflow?: boolean

    /**
     * Adds padding accounting for the currently offscreen content, so if you put a flex element inside
     * the sheet, it will always flex to the height of the visible amount of the sheet. If this is not
     * turned on, the inner content is always set to the max height of the sheet.
     */
    adjustPaddingForOffscreenContent?: boolean
  }

  const SheetFrame = Frame.extractable(
    forwardRef(
      (
        {
          __scopeSheet,
          adjustPaddingForOffscreenContent,
          disableHideBottomOverflow,
          children,
          ...props
        }: SheetProps & ExtraFrameProps,
        forwardedRef
      ) => {
        const context = useSheetContext(SHEET_NAME, __scopeSheet)
        const { hasFit, removeScrollEnabled, frameSize, contentRef, open } = context
        const composedContentRef = useComposedRefs(forwardedRef, contentRef)
        const offscreenSize = useSheetOffscreenSize(context)

        const sheetContents = useMemo(() => {
          return (
            // @ts-ignore
            <Frame
              ref={composedContentRef}
              flex={hasFit ? 0 : 1}
              height={hasFit ? undefined : frameSize}
              pointerEvents={open ? 'auto' : 'none'}
              {...props}
            >
              {children}

              {adjustPaddingForOffscreenContent && (
                <Stack data-sheet-offscreen-pad height={offscreenSize} width="100%" />
              )}
            </Frame>
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
          <>
            <RemoveScroll
              forwardProps
              enabled={removeScrollEnabled}
              allowPinchZoom
              shards={[contentRef]}
              // causes lots of bugs on touch web on site
              removeScrollBar={false}
            >
              {sheetContents}
            </RemoveScroll>

            {/* below frame hide when bouncing past 100% */}
            {!disableHideBottomOverflow && (
              // @ts-ignore
              <Frame
                {...props}
                componentName="SheetCover"
                // biome-ignore lint/correctness/noChildrenProp: <explanation>
                children={null}
                position="absolute"
                bottom="-100%"
                zIndex={-1}
                height={context.frameSize}
                left={0}
                right={0}
                borderWidth={0}
                borderRadius={0}
                shadowOpacity={0}
              />
            )}
          </>
        )
      }
    )
  ) as any as ForwardRefExoticComponent<
    SheetScopedProps<
      Omit<GetProps<typeof Frame>, keyof ExtraFrameProps> & ExtraFrameProps
    >
  >

  const Sheet = forwardRef<View, SheetProps>(function Sheet(props, ref) {
    const hydrated = useDidFinishSSR()
    const { isShowingNonSheet } = useSheetController()

    let SheetImplementation = SheetImplementationCustom as any

    if (props.native && Platform.OS === 'ios') {
      if (process.env.TAMAGUI_TARGET === 'native') {
        const impl = getNativeSheet('ios')
        if (impl) {
          SheetImplementation = impl
        }
      }
    }

    /**
     * Performance is sensitive here so avoid all the hooks below with this
     */
    if (isShowingNonSheet || !hydrated) {
      return null
    }

    return <SheetImplementation ref={ref} {...props} />
  })

  const components = {
    Frame: SheetFrame,
    Overlay: SheetOverlay,
    Handle: SheetHandle,
    ScrollView: SheetScrollView,
  }

  const Controlled = withStaticProperties(Sheet, components) as any as FunctionComponent<
    Omit<SheetProps, 'open' | 'onOpenChange'> & RefAttributes<View>
  > &
    typeof components

  return withStaticProperties(Sheet, {
    ...components,
    Controlled,
  })
}

/* -------------------------------------------------------------------------------------------------*/
