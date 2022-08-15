/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */

'use strict'

export type SyntheticEvent<T> = {
  readonly bubbles: boolean | null
  readonly cancelable: boolean | null
  readonly currentTarget: HTMLElement
  readonly defaultPrevented: boolean | null
  readonly dispatchConfig: {
    readonly registrationName: string
  }
  readonly eventPhase: number | null
  readonly preventDefault: () => void
  readonly isDefaultPrevented: () => boolean
  readonly stopPropagation: () => void
  readonly isPropagationStopped: () => boolean
  readonly isTrusted: boolean | null
  readonly nativeEvent: T
  readonly persist: () => void
  readonly target: HTMLElement | null
  readonly timeStamp: number
  readonly type: string | null
}

export type ResponderSyntheticEvent<T> = {
  touchHistory: {
    readonly indexOfSingleActiveTouch: number
    readonly mostRecentTimeStamp: number
    readonly numberActiveTouches: number
    readonly touchBank: ReadonlyArray<{
      readonly touchActive: boolean
      readonly startPageX: number
      readonly startPageY: number
      readonly startTimeStamp: number
      readonly currentPageX: number
      readonly currentPageY: number
      readonly currentTimeStamp: number
      readonly previousPageX: number
      readonly previousPageY: number
      readonly previousTimeStamp: number
    }>
  }
} & React.SyntheticEvent

export type Layout = {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export type TextLayout = {
  ascender: number
  capHeight: number
  descender: number
  text: string
  xHeight: number
} & Layout

export type LayoutEvent = React.SyntheticEvent

export type TextLayoutEvent = React.SyntheticEvent

export type PressEvent = ResponderSyntheticEvent<{
  readonly changedTouches: ReadonlyArray<PressEvent['nativeEvent']>
  readonly force: number
  readonly identifier: number
  readonly locationX: number
  readonly locationY: number
  readonly pageX: number
  readonly pageY: number
  readonly target: HTMLElement | null
  readonly timestamp: number
  readonly touches: ReadonlyArray<PressEvent['nativeEvent']>
}>

export type ScrollEvent = React.SyntheticEvent

export type SwitchChangeEvent = React.SyntheticEvent
