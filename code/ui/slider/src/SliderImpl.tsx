/* -------------------------------------------------------------------------------------------------
 * SliderImpl
 * -----------------------------------------------------------------------------------------------*/

import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import type { GestureReponderEvent } from '@tamagui/core'
import { getVariableValue, styled } from '@tamagui/core'
import { getSize } from '@tamagui/get-token'
import { YStack } from '@tamagui/stacks'
import * as React from 'react'
import type { View } from 'react-native'

import { ARROW_KEYS, PAGE_KEYS, useSliderContext } from './constants'
import type { ScopedProps, SliderImplProps } from './types'
import { useSliderEvents } from './useSliderEvents'

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
      ...sliderProps
    } = props
    const context = useSliderContext(__scopeSlider)
    const frameRef = React.useRef<View>(null)
    const composedRef = useComposedRefs(forwardedRef, frameRef)

    const { frameProps, Wrapper } = useSliderEvents(context, {
      onSlideStart: (event: GestureReponderEvent, target: 'thumb' | 'track') => {
        onSlideStart(event, target)
      },
      onSlideMove: (event: GestureReponderEvent) => {
        onSlideMove(event)
      },
      onSlideEnd: (event: GestureReponderEvent) => {
        onSlideEnd(event)
      },
    })

    const sliderFrame = (
      <SliderFrame
        size="$4"
        {...sliderProps}
        data-orientation={sliderProps.orientation}
        ref={composedRef}
        {...frameProps}
        {...(isWeb && {
          onKeyDown: (event) => {
            if (event.key === 'Home') {
              onHomeKeyDown(event)
              event.preventDefault()
            } else if (event.key === 'End') {
              onEndKeyDown(event)
              event.preventDefault()
            } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
              onStepKeyDown(event)
              event.preventDefault()
            }
          },
        })}
      />
    )

    // on native, wrap with a View that handles responder events
    if (Wrapper) {
      const {
        flex,
        flexGrow,
        flexShrink,
        flexBasis,
        alignSelf,
        width,
        height,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
      } = sliderProps
      // filter out 'unset' values which are tamagui-specific
      const wrapperStyle: Record<string, any> = {}
      if (flex !== undefined && flex !== 'unset') wrapperStyle.flex = flex
      if (flexGrow !== undefined && flexGrow !== 'unset') wrapperStyle.flexGrow = flexGrow
      if (flexShrink !== undefined && flexShrink !== 'unset')
        wrapperStyle.flexShrink = flexShrink
      if (flexBasis !== undefined && flexBasis !== 'unset')
        wrapperStyle.flexBasis = flexBasis
      if (alignSelf !== undefined && alignSelf !== 'unset')
        wrapperStyle.alignSelf = alignSelf
      if (width !== undefined && width !== 'unset') wrapperStyle.width = width
      if (height !== undefined && height !== 'unset') wrapperStyle.height = height
      if (minWidth !== undefined && minWidth !== 'unset') wrapperStyle.minWidth = minWidth
      if (minHeight !== undefined && minHeight !== 'unset')
        wrapperStyle.minHeight = minHeight
      if (maxWidth !== undefined && maxWidth !== 'unset') wrapperStyle.maxWidth = maxWidth
      if (maxHeight !== undefined && maxHeight !== 'unset')
        wrapperStyle.maxHeight = maxHeight
      return <Wrapper style={wrapperStyle}>{sliderFrame}</Wrapper>
    }

    return sliderFrame
  }
)
