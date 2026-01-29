/* -------------------------------------------------------------------------------------------------
 * SliderImpl
 * -----------------------------------------------------------------------------------------------*/

import { isWeb } from '@tamagui/constants'
import type { TamaguiElement } from '@tamagui/core'
import { getVariableValue, styled } from '@tamagui/core'
import { getSize } from '@tamagui/get-token'
import { YStack } from '@tamagui/stacks'
import * as React from 'react'
import { View } from 'react-native'

import { ARROW_KEYS, PAGE_KEYS, SLIDER_NAME, useSliderContext } from './constants'
import type { ScopedProps, SliderImplProps } from './types'

export const SliderFrame = styled(YStack, {
  position: 'relative',

  variants: {
    orientation: {
      horizontal: {},
      vertical: {},
    },

    size: (val, extras) => {
      if (!val) {
        return
      }
      const orientation = extras.props['orientation']
      const size = Math.round(getVariableValue(getSize(val)) / 6)
      if (orientation === 'horizontal') {
        return {
          height: size,
          borderRadius: size,
          justifyContent: 'center',
        }
      }
      return {
        width: size,
        borderRadius: size,
        alignItems: 'center',
      }
    },
  } as const,
})

export const SliderImpl = React.forwardRef<View, SliderImplProps>(
  (props: ScopedProps<SliderImplProps>, forwardedRef) => {
    const {
      __scopeSlider,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onHomeKeyDown,
      onEndKeyDown,
      onStepKeyDown,
      children,
      ...sliderProps
    } = props
    const context = useSliderContext(__scopeSlider)

    const handleResponderGrant = React.useCallback(
      (event: any) => {
        props.onResponderGrant?.(event)
        const target = event.target as unknown as TamaguiElement | number
        const thumbIndex = context.thumbs.get(target as TamaguiElement)
        const isStartingOnThumb = thumbIndex !== undefined

        // Prevent browser focus behaviour because we focus a thumb manually when values change.
        // Touch devices have a delay before focusing so won't focus if touch immediately moves
        // away from target (sliding). We want thumb to focus regardless.
        if (isWeb && target instanceof HTMLElement) {
          if (context.thumbs.has(target)) {
            target.focus()
          }
        }

        // Thumbs won't receive focus events on native, so we have to manually
        // set the value index to change when sliding starts on a thumb.
        if (!isWeb && isStartingOnThumb) {
          context.valueIndexToChangeRef.current = thumbIndex
        }

        onSlideStart(event, isStartingOnThumb ? 'thumb' : 'track')
      },
      [context, onSlideStart, props.onResponderGrant]
    )

    const handleResponderMove = React.useCallback(
      (event: any) => {
        props.onResponderMove?.(event)
        event.stopPropagation()
        onSlideMove(event)
      },
      [onSlideMove, props.onResponderMove]
    )

    const handleResponderRelease = React.useCallback(
      (event: any) => {
        props.onResponderRelease?.(event)
        onSlideEnd(event)
      },
      [onSlideEnd, props.onResponderRelease]
    )

    return (
      // wrap with plain RN View for responder events - tamagui views no longer handle responder events on web

      <SliderFrame
        size="$4"
        ref={forwardedRef as any}
        {...sliderProps}
        data-orientation={sliderProps.orientation}
        {...(isWeb && {
          onKeyDown: (event) => {
            if (event.key === 'Home') {
              onHomeKeyDown(event)
              // Prevent scrolling to page start
              event.preventDefault()
            } else if (event.key === 'End') {
              onEndKeyDown(event)
              // Prevent scrolling to page end
              event.preventDefault()
            } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
              onStepKeyDown(event)
              // Prevent scrolling for directional key presses
              event.preventDefault()
            }
          },
        })}
      >
        <View
          onMoveShouldSetResponderCapture={() => true}
          onMoveShouldSetResponder={() => true}
          onStartShouldSetResponder={() => true}
          onResponderTerminationRequest={() => false}
          onResponderGrant={handleResponderGrant}
          onResponderMove={handleResponderMove}
          onResponderRelease={handleResponderRelease}
          style={{ inset: 0, position: 'absolute' }}
        >
          {children}
        </View>
      </SliderFrame>
    )
  }
)
