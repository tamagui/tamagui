import { useComposedRefs } from '@tamagui/compose-refs'
import {
  GetProps,
  StackProps,
  TamaguiComponentExpectingVariants,
  mergeEvent,
  useDidFinishSSR,
  withStaticProperties,
} from '@tamagui/core'
import { RemoveScroll } from '@tamagui/remove-scroll'
import {
  FunctionComponent,
  RefAttributes,
  forwardRef,
  useLayoutEffect,
  useMemo,
} from 'react'
import { Platform, View } from 'react-native'

import { SHEET_HANDLE_NAME, SHEET_NAME, SHEET_OVERLAY_NAME } from './constants'
import { getNativeSheet } from './nativeSheet'
import { useSheetContext } from './SheetContext'
import { SheetImplementationCustom } from './SheetImplementationCustom'
import { SheetScrollView } from './SheetScrollView'
import { SheetProps, SheetScopedProps } from './types'
import { useSheetController } from './useSheetController'

type SharedSheetProps = {
  open?: boolean
}

type BaseProps = StackProps & SharedSheetProps

export type CreateSheetProps = {
  Frame: TamaguiComponentExpectingVariants<BaseProps, SharedSheetProps>
  Handle: TamaguiComponentExpectingVariants<BaseProps, SharedSheetProps>
  Overlay: TamaguiComponentExpectingVariants<BaseProps, SharedSheetProps>
}

export function createSheet({ Handle, Frame, Overlay }: CreateSheetProps) {
  const SheetHandle = Handle.extractable(
    ({ __scopeSheet, ...props }: SheetScopedProps<GetProps<typeof Handle>>) => {
      const context = useSheetContext(SHEET_HANDLE_NAME, __scopeSheet)

      if (context.onlyShowFrame) {
        return null
      }

      return (
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
    (propsIn: SheetScopedProps<GetProps<typeof Overlay>>) => {
      const { __scopeSheet, ...props } = propsIn
      const context = useSheetContext(SHEET_OVERLAY_NAME, __scopeSheet)

      // this ones a bit weird for legacy reasons, we need to hoist it above <Sheet /> AnimatedView
      // so we just pass it up to context

      const element = useMemo(
        () => (
          <Overlay
            open={context.open && !context.hidden}
            {...props}
            onPress={mergeEvent(
              props.onPress as any,
              context.dismissOnOverlayPress
                ? () => {
                    context.setOpen(false)
                  }
                : undefined
            )}
          />
        ),
        [
          context.open,
          props,
          context.hidden,
          props.onPress,
          context.dismissOnOverlayPress,
        ]
      )

      useLayoutEffect(() => {
        context.onOverlayComponent?.(element)
      }, [element])

      if (context.onlyShowFrame) {
        return null
      }

      return null
    }
  )

  /* -------------------------------------------------------------------------------------------------
   * Sheet
   * -----------------------------------------------------------------------------------------------*/

  const SHEET_COVER_NAME = `${SHEET_NAME}Cover`

  const SheetFrame = Frame.extractable(
    forwardRef(
      (
        {
          __scopeSheet,
          children,
          ...props
        }: SheetScopedProps<
          GetProps<typeof Frame> & {
            disableHideBottomOverflow?: boolean
          }
        >,
        forwardedRef
      ) => {
        const context = useSheetContext(SHEET_NAME, __scopeSheet)
        const composedContentRef = useComposedRefs(forwardedRef, context.contentRef)

        return (
          <>
            <RemoveScroll
              forwardProps
              enabled={context.removeScrollEnabled}
              allowPinchZoom
              shards={[context.contentRef]}
              // causes lots of bugs on touch web on site
              removeScrollBar={false}
            >
              <Frame ref={composedContentRef} {...props}>
                {children}
              </Frame>
            </RemoveScroll>

            {/* below frame hide when bouncing past 100% */}  
            {!props.disableHideBottomOverflow && (
              <Frame
                componentName={SHEET_COVER_NAME}
                {...props}
                children={null}
                position="absolute"
                bottom={-20}
                maxHeight={300}
                left={0}
                right={0}
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
