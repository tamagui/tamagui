import { validStyles } from '@tamagui/helpers'

import { createComponent } from '../createComponent'
import type { StackProps, StackPropsBase, TamaguiElement } from '../types'

export type View = TamaguiElement

export const View = createComponent<StackProps, View, StackPropsBase>({
  acceptsClassName: true,
  defaultProps: {
    display: 'flex',
  },
  validStyles,
})
