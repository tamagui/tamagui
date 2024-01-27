/* -------------------------------------------------------------------------------------------------
 * SliderImpl
 * -----------------------------------------------------------------------------------------------*/

import { isWeb } from '@tamagui/constants'
import type { TamaguiElement } from '@tamagui/core'
import { getVariableValue, styled } from '@tamagui/core'
import { getSize } from '@tamagui/get-token'
import { composeEventHandlers } from '@tamagui/helpers'
import { YStack } from '@tamagui/stacks'
import * as React from 'react'
import type { View } from 'react-native'

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

// export const SliderTrackFrame = styled(SliderFrame, {
//   // name: 'SliderTrack',

//   variants: {
//     unstyled: {
//       false: {
//         height: '100%',
//         width: '100%',
//         backgroundColor: '$background',
//         position: 'relative',
//         borderRadius: 100_000,
//         overflow: 'hidden',
//       },
//     },
//   } as const,

//   // defaultVariants: {
//   //   unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
//   // },
// })

// const XXXX = <SliderFrame margin={10} />
// const XX = <SliderTrackFrame  />

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
        })}
        onResponderMove={composeEventHandlers(props.onResponderMove, (event) => {
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
