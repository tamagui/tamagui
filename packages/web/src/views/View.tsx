import { validStyles } from '@tamagui/helpers'

import { createComponent } from '../createComponent'
import type { StackProps, StackPropsBase, TamaguiElement } from '../types'

export const View = createComponent<StackProps, TamaguiElement, StackPropsBase>({
  acceptsClassName: true,
  validStyles,
})
