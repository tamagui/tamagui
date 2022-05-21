import type { GestureReponderEvent, SizeTokens } from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import type { SizableStackProps, YStackProps } from '@tamagui/stacks'
import type { View } from 'react-native'

export type ScopedProps<P> = P & { __scopeSlider?: Scope }

export type Direction = 'ltr' | 'rtl'

export type SliderImplElement = HTMLElement | View

type SliderImplPrivateProps = {
  onSlideStart(event: GestureReponderEvent): void
  onSlideMove(event: GestureReponderEvent): void
  onSlideEnd(event: GestureReponderEvent): void
  onHomeKeyDown(event: React.KeyboardEvent): void
  onEndKeyDown(event: React.KeyboardEvent): void
  onStepKeyDown(event: React.KeyboardEvent): void
}

export interface SliderTrackProps extends SizableStackProps {}

export interface SliderImplProps extends SliderTrackProps, SliderImplPrivateProps {
  dir?: Direction
  orientation: 'horizontal' | 'vertical'
}

type SliderOrientationPrivateProps = {
  min: number
  max: number
  onSlideStart?(value: number): void
  onSlideMove?(value: number): void
  onHomeKeyDown(event: React.KeyboardEvent): void
  onEndKeyDown(event: React.KeyboardEvent): void
  onStepKeyDown(step: { event: React.KeyboardEvent; direction: number }): void
}

interface SliderOrientationProps
  extends Omit<SliderImplProps, keyof SliderImplPrivateProps | 'orientation'>,
    SliderOrientationPrivateProps {}

export interface SliderHorizontalProps extends SliderOrientationProps {
  dir?: Direction
}

export interface SliderVerticalProps extends SliderOrientationProps {
  dir?: Direction
}

export interface SliderProps
  extends Omit<
    SliderHorizontalProps | SliderVerticalProps,
    keyof SliderOrientationPrivateProps | 'defaultValue'
  > {
  size?: SizeTokens
  name?: string
  disabled?: boolean
  orientation?: React.AriaAttributes['aria-orientation']
  dir?: Direction
  min?: number
  max?: number
  step?: number
  minStepsBetweenThumbs?: number
  value?: number[]
  defaultValue?: number[]
  onValueChange?(value: number[]): void
}

export type SliderContextValue = {
  size?: SizeTokens | number | null
  disabled?: boolean
  min: number
  max: number
  values: number[]
  valueIndexToChangeRef: React.MutableRefObject<number>
  thumbs: Set<any>
  orientation: SliderProps['orientation']
}
