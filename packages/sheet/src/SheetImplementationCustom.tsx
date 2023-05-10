import { AdaptParentContext } from '@tamagui/adapt'
import { useComposedRefs } from '@tamagui/compose-refs'
import {
  Theme,
  isTouchable,
  isWeb,
  themeable,
  useAnimationDriver,
  useEvent,
  useIsomorphicLayoutEffect,
  useThemeName,
} from '@tamagui/core'
import { Portal } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { useKeyboardVisible } from '@tamagui/use-keyboard-visible'
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  GestureResponderEvent,
  Keyboard,
  PanResponder,
  PanResponderGestureState,
  View,
} from 'react-native'

import { HIDDEN_SIZE } from './constants'
import { SHEET_HIDDEN_STYLESHEET } from './constants'
import { ParentSheetContext, SheetInsideSheetContext } from './contexts'
import { resisted } from './helpers'
import { SheetProvider } from './SheetContext'
import { SheetProps } from './types'
import { useSheetChildren } from './useSheetChildren'
import { useSheetOpenState } from './useSheetOpenState'
import { useSheetProviderProps } from './useSheetProviderProps'
import { useSheetSnapPoints } from './useSheetSnapPoints'

export const SheetImplementationCustom = themeable(
  forwardRef<View, SheetProps>(function SheetImplementationCustom(props, forwardedRef) {
    const parentSheet = useContext(ParentSheetContext)

    const {
      animationConfig,
      forceRemoveScrollEnabled = null,
      disableDrag: disableDragProp,
      modal = false,
      zIndex = parentSheet.zIndex + 1,
      moveOnKeyboardChange = false,
      portalProps,
    } = props

    const state = useSheetOpenState(props)
    const providerProps = useSheetProviderProps(props, state)
    const { positions, maxSnapPoint, screenSize } = useSheetSnapPoints(providerProps)

    const { position, contentRef, setPosition, scrollBridge, frameSize, setFrameSize } =
      providerProps

    const { open, isHidden, controller } = state

    const {
      frameComponent,
      handleComponent,
      bottomCoverComponent,
      overlayComponent,
      rest,
    } = useSheetChildren(props.children)

    const sheetRef = useRef<View>(null)
    const ref = useComposedRefs(forwardedRef, sheetRef)

    const animateTo = useEvent((position: number) => {
      const current = animatedNumber.getValue()
      if (isHidden && open) return
      if (!current) return
      if (frameSize === 0) return
      const hiddenValue = frameSize === 0 ? HIDDEN_SIZE : screenSize
      const toValue = isHidden || position === -1 ? hiddenValue : positions[position]
      if (at.current === toValue) return
      stopSpring()
      if (isHidden) {
        animatedNumber.setValue(toValue, {
          type: 'timing',
          duration: 0,
        })
        at.current = toValue
        return
      }
      // dont bounce on initial measure to bottom
      const overshootClamping = at.current === HIDDEN_SIZE
      animatedNumber.setValue(toValue, {
        ...animationConfig,
        type: 'spring',
        overshootClamping,
      })
    })

    useIsomorphicLayoutEffect(() => {
      animateTo(position)
    }, [isHidden, frameSize, position, animateTo])

    /**
     * This is a hacky workaround for native:
     */
    const [isShowingInnerSheet, setIsShowingInnerSheet] = useState(false)
    const shouldHideParentSheet = !isWeb && modal && isShowingInnerSheet
    const parentSheetContext = useContext(SheetInsideSheetContext)
    const onInnerSheet = useCallback((hasChild: boolean) => {
      setIsShowingInnerSheet(hasChild)
    }, [])

    const animatedStyle = useAnimatedNumberStyle(animatedNumber, (val) => {
      'worklet'
      const translateY = frameSize === 0 ? HIDDEN_SIZE : val
      return {
        transform: [{ translateY }],
      }
    })

    const sizeBeforeKeyboard = useRef<number | null>(null)
    useEffect(() => {
      if (isWeb || !moveOnKeyboardChange) return
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
        if (sizeBeforeKeyboard.current !== null) return
        sizeBeforeKeyboard.current = animatedNumber.getValue()
        animatedNumber.setValue(
          Math.max(animatedNumber.getValue() - e.endCoordinates.height, 0)
        )
      })
      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        if (sizeBeforeKeyboard.current === null) return
        animatedNumber.setValue(sizeBeforeKeyboard.current)
        sizeBeforeKeyboard.current = null
      })

      return () => {
        keyboardDidHideListener.remove()
        keyboardDidShowListener.remove()
      }
    }, [])

    // temp until reanimated useAnimatedNumber fix
    const AnimatedView = (driver['NumberView'] ?? driver.View) as typeof Animated.View

    useIsomorphicLayoutEffect(() => {
      if (!(parentSheetContext && open)) return
      parentSheetContext(true)
      return () => {
        parentSheetContext(false)
      }
    }, [parentSheetContext, open])

    const nextParentContext = useMemo(
      () => ({
        zIndex,
      }),
      [zIndex]
    )

    const removeScrollEnabled = forceRemoveScrollEnabled ?? (open && modal)

    const contents = (
      <ParentSheetContext.Provider value={nextParentContext}>
        <SheetProvider {...providerProps}>
          {shouldHideParentSheet ? null : overlayComponent}

          <AnimatedView
            ref={ref}
            {...panResponder?.panHandlers}
            onLayout={handleAnimationViewLayout}
            pointerEvents={open && !shouldHideParentSheet ? 'auto' : 'none'}
            //  @ts-ignore
            animation={props.animation}
            style={[
              {
                position: 'absolute',
                zIndex,
                width: '100%',
                height: `${maxSnapPoint}%`,
                opacity,
              },
              animatedStyle,
            ]}
          >
            {handleComponent}
            {bottomCoverComponent}

            {/* somewhat temporary we need to move to properly support children */}
            {rest}

            {/* @ts-ignore */}
            <RemoveScroll
              forwardProps
              enabled={removeScrollEnabled}
              allowPinchZoom
              shards={[contentRef]}
              // causes lots of bugs on touch web on site
              removeScrollBar={false}
            >
              {frameComponent}
            </RemoveScroll>
          </AnimatedView>
        </SheetProvider>
      </ParentSheetContext.Provider>
    )

    const adaptContext = useContext(AdaptParentContext)

    if (modal) {
      const modalContents = (
        <Portal zIndex={zIndex} {...portalProps}>
          <Theme forceClassName name={themeName}>
            <AdaptParentContext.Provider value={adaptContext}>
              {contents}
            </AdaptParentContext.Provider>
          </Theme>
        </Portal>
      )

      if (isWeb) {
        return modalContents
      }

      // on native we don't support multiple modals yet... fix for now is to hide outer one
      return (
        <SheetInsideSheetContext.Provider value={onInnerSheet}>
          {modalContents}
        </SheetInsideSheetContext.Provider>
      )
    }

    return contents
  })
)
