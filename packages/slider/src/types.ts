import type { Scope } from '@tamagui/create-context'
import type { YStackProps } from '@tamagui/stacks'
import type { View } from 'react-native'

export type ScopedProps<P> = P & { __scopeSlider?: Scope }

export type Direction = 'ltr' | 'rtl'

export type SliderImplElement = HTMLElement | View

type SliderImplPrivateProps = {
  onSlideStart(event: React.PointerEvent): void
  onSlideMove(event: React.PointerEvent): void
  onSlideEnd(event: React.PointerEvent): void
  onHomeKeyDown(event: React.KeyboardEvent): void
  onEndKeyDown(event: React.KeyboardEvent): void
  onStepKeyDown(event: React.KeyboardEvent): void
}

export interface SliderImplProps extends YStackProps, SliderImplPrivateProps {
  dir?: Direction
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
  extends Omit<SliderImplProps, keyof SliderImplPrivateProps>,
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
  disabled?: boolean
  min: number
  max: number
  values: number[]
  valueIndexToChangeRef: React.MutableRefObject<number>
  thumbs: Set<any>
  orientation: SliderProps['orientation']
}
