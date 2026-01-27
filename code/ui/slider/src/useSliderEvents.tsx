/**
 * Web-specific slider event handling using pointer events with capture
 */

import type { GestureReponderEvent, TamaguiElement } from '@tamagui/core'
import * as React from 'react'

import type { SliderContextValue } from './types'

export interface SliderEventHandlers {
  onSlideStart: (event: GestureReponderEvent, target: 'thumb' | 'track') => void
  onSlideMove: (event: GestureReponderEvent) => void
  onSlideEnd: (event: GestureReponderEvent) => void
}

export interface UseSliderEventsResult {
  /** props to spread on the slider frame element */
  frameProps: Record<string, any>
  /** wrapper component for native (null on web) */
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

      // prevent browser focus behaviour because we focus a thumb manually when values change.
      // touch devices have a delay before focusing so won't focus if touch immediately moves
      // away from target (sliding). We want thumb to focus regardless.
      if (target instanceof HTMLElement) {
        if (context.thumbs.has(target)) {
          target.focus()
        }
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

  const frameProps = React.useMemo(
    () => ({
      onPointerDown: (event: React.PointerEvent) => {
        const nativeEvent = {
          locationX: event.nativeEvent.offsetX,
          locationY: event.nativeEvent.offsetY,
          pageX: event.pageX,
          pageY: event.pageY,
        }
        const syntheticEvent = {
          nativeEvent,
          target: event.target,
          currentTarget: event.currentTarget,
          stopPropagation: () => event.stopPropagation(),
          preventDefault: () => event.preventDefault(),
        } as unknown as GestureReponderEvent
        handleResponderGrant(syntheticEvent)
        ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
      },
      onPointerMove: (event: React.PointerEvent) => {
        // only handle if we have pointer capture
        if (!(event.target as HTMLElement).hasPointerCapture(event.pointerId)) {
          return
        }
        const nativeEvent = {
          locationX: event.nativeEvent.offsetX,
          locationY: event.nativeEvent.offsetY,
          pageX: event.pageX,
          pageY: event.pageY,
        }
        const syntheticEvent = {
          nativeEvent,
          target: event.target,
          currentTarget: event.currentTarget,
          stopPropagation: () => event.stopPropagation(),
          preventDefault: () => event.preventDefault(),
        } as unknown as GestureReponderEvent
        handleResponderMove(syntheticEvent)
      },
      onPointerUp: (event: React.PointerEvent) => {
        if (!(event.target as HTMLElement).hasPointerCapture(event.pointerId)) {
          return
        }
        const nativeEvent = {
          locationX: event.nativeEvent.offsetX,
          locationY: event.nativeEvent.offsetY,
          pageX: event.pageX,
          pageY: event.pageY,
        }
        const syntheticEvent = {
          nativeEvent,
          target: event.target,
          currentTarget: event.currentTarget,
          stopPropagation: () => event.stopPropagation(),
          preventDefault: () => event.preventDefault(),
        } as unknown as GestureReponderEvent
        handleResponderRelease(syntheticEvent)
        ;(event.target as HTMLElement).releasePointerCapture(event.pointerId)
      },
      onPointerCancel: (event: React.PointerEvent) => {
        if ((event.target as HTMLElement).hasPointerCapture(event.pointerId)) {
          ;(event.target as HTMLElement).releasePointerCapture(event.pointerId)
        }
      },
    }),
    [handleResponderGrant, handleResponderMove, handleResponderRelease]
  )

  return {
    frameProps,
    Wrapper: null,
  }
}
