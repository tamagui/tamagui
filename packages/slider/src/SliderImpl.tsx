/* -------------------------------------------------------------------------------------------------
 * SliderImpl
 * -----------------------------------------------------------------------------------------------*/

import { composeEventHandlers, getSize, getVariableValue, isWeb, styled } from '@tamagui/core'
import { YStack } from '@tamagui/stacks'
import * as React from 'react'
import { View } from 'react-native'

import { ARROW_KEYS, PAGE_KEYS, SLIDER_NAME, useSliderContext } from './constants'
import { ScopedProps, SliderImplProps } from './types'

export const DirectionalYStack = styled(YStack, {
  variants: {
    orientation: {
      horizontal: {},
      vertical: {},
    },
  },
})

export const SliderFrame = styled(DirectionalYStack, {
  position: 'relative',

  variants: {
    size: (val, extras) => {
      const orientation = extras.props.orientation
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
  },
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
      ...sliderProps
    } = props
    const context = useSliderContext(SLIDER_NAME, __scopeSlider)
    return (
      <SliderFrame
        size="$4"
        {...sliderProps}
        data-orientation={sliderProps.orientation}
        ref={forwardedRef}
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
        onMoveShouldSetResponderCapture={() => true}
        onScrollShouldSetResponder={() => true}
        onScrollShouldSetResponderCapture={() => true}
        onMoveShouldSetResponder={() => true}
        onStartShouldSetResponder={() => true}
        // onStartShouldSetResponderCapture={() => true}
        onResponderTerminationRequest={() => {
          return false
        }}
        onResponderGrant={composeEventHandlers(props.onResponderGrant, (event) => {
          const target = event.target as HTMLElement | number
          console.log('target', target, context.thumbs.has(target), context.thumbs)
          const isStartingOnThumb = context.thumbs.has(target)
          // // Prevent browser focus behaviour because we focus a thumb manually when values change.
          // Touch devices have a delay before focusing so won't focus if touch immediately moves
          // away from target (sliding). We want thumb to focus regardless.
          if (isWeb && target instanceof HTMLElement) {
            if (context.thumbs.has(target)) {
              target.focus()
            }
          }
          onSlideStart(event, isStartingOnThumb ? 'thumb' : 'track')
        })}
        onResponderMove={composeEventHandlers(props.onResponderMove, (event) => {
          event.preventDefault()
          event.stopPropagation()

          // const target = event.target as HTMLElement
          onSlideMove(event)
        })}
        onResponderRelease={composeEventHandlers(props.onResponderRelease, (event) => {
          // const target = event.target as HTMLElement
          onSlideEnd(event)
        })}
      />
    )
  }
)
