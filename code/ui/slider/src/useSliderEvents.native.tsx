/**
 * Native-specific slider event handling using responder system
 */

import type { GestureReponderEvent, TamaguiElement } from '@tamagui/core'
import * as React from 'react'
import { View } from 'react-native'

import type { SliderContextValue } from './types'

export interface SliderEventHandlers {
  onSlideStart: (event: GestureReponderEvent, target: 'thumb' | 'track') => void
  onSlideMove: (event: GestureReponderEvent) => void
  onSlideEnd: (event: GestureReponderEvent) => void
}

export interface UseSliderEventsResult {
  /** props to spread on the slider frame element */
  frameProps: Record<string, any>
  /** wrapper component for native */
  Wrapper: React.ComponentType<{ children: React.ReactNode; style?: any }> | null
}

export function useSliderEvents(
  context: SliderContextValue,
  handlers: SliderEventHandlers
): UseSliderEventsResult {
  const { onSlideStart, onSlideMove, onSlideEnd } = handlers

  const handleResponderGrant = React.useCallback(
    (event: GestureReponderEvent) => {
      const target = event.target as unknown as TamaguiElement | number
      const thumbIndex = context.thumbs.get(target as TamaguiElement)
      const isStartingOnThumb = thumbIndex !== undefined

      // thumbs won't receive focus events on native, so we have to manually
      // set the value index to change when sliding starts on a thumb.
      if (isStartingOnThumb) {
        context.valueIndexToChangeRef.current = thumbIndex
      }

      onSlideStart(event, isStartingOnThumb ? 'thumb' : 'track')
    },
    [context, onSlideStart]
  )

  const handleResponderMove = React.useCallback(
    (event: GestureReponderEvent) => {
      event.stopPropagation()
      onSlideMove(event)
    },
    [onSlideMove]
  )

  const handleResponderRelease = React.useCallback(
    (event: GestureReponderEvent) => {
      onSlideEnd(event)
    },
    [onSlideEnd]
  )

  const responderProps = React.useMemo(
    () => ({
      onMoveShouldSetResponderCapture: () => true,
      onScrollShouldSetResponder: () => true,
      onScrollShouldSetResponderCapture: () => true,
      onMoveShouldSetResponder: () => true,
      onStartShouldSetResponder: () => true,
      onResponderTerminationRequest: () => false,
      onResponderGrant: handleResponderGrant,
      onResponderMove: handleResponderMove,
      onResponderRelease: handleResponderRelease,
    }),
    [handleResponderGrant, handleResponderMove, handleResponderRelease]
  )

  // wrapper component that handles responder events
  const Wrapper = React.useMemo(() => {
    const WrapperComponent = ({
      children,
      style,
    }: {
      children: React.ReactNode
      style?: any
    }) => (
      <View style={style} {...responderProps}>
        {children}
      </View>
    )
    return WrapperComponent
  }, [responderProps])

  return {
    frameProps: {},
    Wrapper,
  }
}
