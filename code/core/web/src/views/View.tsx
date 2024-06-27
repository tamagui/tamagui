import { validStyles } from '@tamagui/helpers'

import { stackDefaultStyles } from '../constants/constants'
import { createComponent } from '../createComponent'
import type {
  StackNonStyleProps,
  StackProps,
  StackStyle,
  StackStyleBase,
  TamaguiElement,
} from '../types'

export type View = TamaguiElement
export type ViewProps = StackProps
export type ViewNonStyleProps = StackNonStyleProps
export type ViewStylePropsBase = StackStyleBase
export type ViewStyle = StackStyle

export const View = createComponent<
  StackProps,
  View,
  ViewNonStyleProps,
  ViewStylePropsBase
>({
  acceptsClassName: true,
  defaultProps: stackDefaultStyles,
  validStyles,
})
