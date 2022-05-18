/* -------------------------------------------------------------------------------------------------
 * SliderImpl
 * -----------------------------------------------------------------------------------------------*/

import { composeEventHandlers } from '@tamagui/core'
import { YStack } from '@tamagui/stacks'
import * as React from 'react'

import { SLIDER_NAME, useSliderContext } from './context'
import { ScopedProps, SliderImplElement, SliderImplProps } from './types'

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
      <YStack
        {...sliderProps}
        ref={forwardedRef}
        // onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
        //   if (event.key === 'Home') {
        //     onHomeKeyDown(event)
        //     // Prevent scrolling to page start
        //     event.preventDefault()
        //   } else if (event.key === 'End') {
        //     onEndKeyDown(event)
        //     // Prevent scrolling to page end
        //     event.preventDefault()
        //   } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
        //     onStepKeyDown(event)
        //     // Prevent scrolling for directional key presses
        //     event.preventDefault()
        //   }
        // })}
        onStartShouldSetResponder={() => true}
        onResponderGrant={composeEventHandlers(props.onResponderGrant, (event) => {
          const target = event.target as HTMLElement
          console.log('wut', target)
          // target.setPointerCapture(event.pointerId)
          // // Prevent browser focus behaviour because we focus a thumb manually when values change.
          event.preventDefault()
          // Touch devices have a delay before focusing so won't focus if touch immediately moves
          // away from target (sliding). We want thumb to focus regardless.
          if (context.thumbs.has(target)) {
            target.focus()
          } else {
            onSlideStart(event)
          }
        })}
        onResponderMove={composeEventHandlers(props.onResponderMove, (event) => {
          const target = event.target as HTMLElement
          onSlideMove(event)
        })}
        onResponderRelease={composeEventHandlers(props.onResponderRelease, (event) => {
          const target = event.target as HTMLElement
          onSlideEnd(event)
        })}
      />
    )
  }
)
