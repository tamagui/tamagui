import { validStyles } from '@tamagui/helpers'

import { createComponent } from '../createComponent'
import type {
  StackNonStyleProps,
  StackStyle,
  StackStyleBase,
  TamaguiElement,
} from '../types'

export type View = TamaguiElement
export type ViewNonStyleProps = StackNonStyleProps
export type ViewStylePropsBase = StackStyleBase
export type ViewStyle = StackStyle
export type ViewProps = ViewNonStyleProps & ViewStyle

export const View = createComponent<
  ViewProps,
  View,
  ViewNonStyleProps,
  ViewStylePropsBase
>({
  acceptsClassName: true,
  validStyles,
})
