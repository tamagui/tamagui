/* -------------------------------------------------------------------------------------------------
 * SliderImpl
 * -----------------------------------------------------------------------------------------------*/

import { composeEventHandlers, isWeb, styled } from '@tamagui/core'
import { YStack, getCircleSize } from '@tamagui/stacks'
import * as React from 'react'

import { ARROW_KEYS, PAGE_KEYS, SLIDER_NAME, useSliderContext } from './constants'
import { ScopedProps, SliderImplElement, SliderImplProps } from './types'

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
      const circleSize = getCircleSize(val, extras)
      const size = circleSize / 10
      if (orientation === 'horizontal') {
        return {
          height: size,
          borderRadius: size,
        }
      }
      return {
        width: size,
        borderRadius: size,
      }
    },
  },
})

export const SliderImpl = React.forwardRef<SliderImplElement, SliderImplProps>(
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
        onStartShouldSetResponder={() => true}
        onResponderGrant={composeEventHandlers(props.onResponderGrant, (event) => {
          const target = event.target as HTMLElement | number
          const isStartingOnThumb = context.thumbs.has(event.target)
          // // Prevent browser focus behaviour because we focus a thumb manually when values change.
          event.preventDefault()
          // Touch devices have a delay before focusing so won't focus if touch immediately moves
          // away from target (sliding). We want thumb to focus regardless.
          if (target instanceof HTMLElement) {
            if (context.thumbs.has(target)) {
              target.focus()
            }
          }
          onSlideStart(event, isStartingOnThumb ? 'thumb' : 'track')
        })}
        onResponderMove={composeEventHandlers(props.onResponderMove, (event) => {
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
