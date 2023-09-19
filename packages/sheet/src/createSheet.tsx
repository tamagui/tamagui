import { useComposedRefs } from '@tamagui/compose-refs'
import {
  GetProps,
  Stack,
  StackProps,
  TamaguiComponent,
  TamaguiComponentExpectingVariants,
  composeEventHandlers,
  useDidFinishSSR,
  useIsomorphicLayoutEffect,
  withStaticProperties,
} from '@tamagui/core'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { FunctionComponent, RefAttributes, forwardRef, memo, useMemo } from 'react'
import { Platform, View } from 'react-native'

import { SHEET_HANDLE_NAME, SHEET_NAME, SHEET_OVERLAY_NAME } from './constants'
import { getNativeSheet } from './nativeSheet'
import { useSheetContext } from './SheetContext'
import { SheetImplementationCustom } from './SheetImplementationCustom'
import { SheetScrollView } from './SheetScrollView'
import { SheetProps, SheetScopedProps } from './types'
import { useSheetController } from './useSheetController'
import { useSheetOffscreenSize } from './useSheetOffscreenSize'

type SharedSheetProps = {
  open?: boolean
}

type BaseProps = StackProps & SharedSheetProps

type SheetStyledComponent = TamaguiComponentExpectingVariants<BaseProps, SharedSheetProps>

export function createSheet<
  H extends SheetStyledComponent | TamaguiComponent,
  F extends SheetStyledComponent | TamaguiComponent,
  O extends SheetStyledComponent | TamaguiComponent
>({ Handle, Frame, Overlay }: { Handle: H; Frame: F; Overlay: O }) {
  const SheetHandle = Handle.extractable(
    ({ __scopeSheet, ...props }: SheetScopedProps<GetProps<typeof Handle>>) => {
      const context = useSheetContext(SHEET_HANDLE_NAME, __scopeSheet)

      if (context.onlyShowFrame) {
        return null
      }

      return (
        // @ts-ignore
        <Handle
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

      const element = useMemo(
        () => (
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
        ),
        [props.onPress, context.dismissOnOverlayPress]
      )

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

  const SheetFrame = Frame.extractable(
    forwardRef(
      (
        {
          __scopeSheet,
          adjustPaddingForOffscreenContent,
          disableHideBottomOverflow,
          children,
          ...props
        }: SheetScopedProps<
          GetProps<typeof Frame> & {
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
        >,
        forwardedRef
      ) => {
        const context = useSheetContext(SHEET_NAME, __scopeSheet)
        const { hasFit, removeScrollEnabled, frameSize, contentRef } = context
        const composedContentRef = useComposedRefs(forwardedRef, contentRef)
        const offscreenSize = useSheetOffscreenSize(context)

        const sheetContents = useMemo(() => {
          return (
            // @ts-ignore
            <Frame
              ref={composedContentRef}
              flex={hasFit ? 0 : 1}
              height={hasFit ? undefined : frameSize}
              {...props}
            >
              {children}

              {adjustPaddingForOffscreenContent && (
                <Stack data-sheet-offscreen-pad height={offscreenSize} width="100%" />
              )}
            </Frame>
          )
        }, [props, frameSize, offscreenSize, adjustPaddingForOffscreenContent, hasFit])

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
                children={null}
                position="absolute"
                bottom="-50%"
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
  )

  const Sheet = forwardRef<View, SheetProps>(function Sheet(props, ref) {
    const hydrated = useDidFinishSSR()
    const { isShowingNonSheet } = useSheetController()

    let SheetImplementation = SheetImplementationCustom

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
