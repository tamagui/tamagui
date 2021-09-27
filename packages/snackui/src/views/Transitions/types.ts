// forked from NativeBase
// The MIT License (MIT)

// Copyright (c) 2021 GeekyAnts India Pvt Ltd

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import type { ReactNode } from 'react'
import type { ViewProps } from 'react-native'

import { StackProps } from '../../StackProps'

export type IFadeProps = StackProps & {
  in?: boolean
  entryDuration?: number
  exitDuration?: number
  delay?: number
}

export type IScaleFadeProps = StackProps & {
  in?: boolean
  duration?: number
  delay?: number
  initialScale?: number
}

export type ISlideProps = StackProps & {
  in?: boolean
  duration?: number
  delay?: number
  placement?: 'top' | 'bottom' | 'right' | 'left'
}

export type ISlideFadeProps = StackProps & {
  in?: boolean
  delay?: number
  duration?: number
  offsetX?: number
  offsetY?: number
}

export interface ISupportedTransitions {
  opacity?: number
  translateY?: number
  translateX?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  rotate?: string
}

export interface ITransitionConfig {
  type?: 'timing' | 'spring'
  easing?: (value: number) => number
  overshootClamping?: boolean
  restDisplacementThreshold?: number
  restSpeedThreshold?: number
  velocity?: number | { x: number; y: number }
  bounciness?: number
  speed?: number
  tension?: number
  friction?: number
  stiffness?: number
  mass?: number
  damping?: number
  delay?: number
  duration?: number
  useNativeDriver?: boolean
}

export interface ITransitionStyleProps extends ISupportedTransitions {
  transition?: ITransitionConfig
}
export interface ITransitionProps extends ViewProps {
  /**
   * Callback invoked when transition is completed
   */
  onTransitionComplete?: (s: 'entered' | 'exited') => any
  /**
   * Styles before the transition starts
   */
  initial?: ISupportedTransitions
  /**
   * Entry animation styles
   */
  animate?: ITransitionStyleProps
  /**
   * Exit animation styles
   */
  exit?: ITransitionStyleProps
  /**
   * Determines whether to start the animation
   */
  visible?: boolean
  children?: any
  as?: any
}

export interface IPresenceTransitionProps extends ViewProps {
  /**
   * Callback invoked when transition is completed
   */
  onTransitionComplete?: (s: 'entered' | 'exited') => any
  /**
   * Styles before the transition starts
   */
  initial?: ISupportedTransitions
  /**
   * Entry animation styles
   */
  animate?: ITransitionStyleProps
  /**
   * Exit animation styles
   */
  exit?: ITransitionStyleProps
  /**
   * Determines whether to start the animation
   */
  visible?: boolean
  children?: ReactNode
  /**
   * Accepts a Component to be rendered as Wrapper. Defaults to `View`
   */
  as?: ReactNode
}
