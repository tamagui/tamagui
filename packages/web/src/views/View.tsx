import { createComponent } from '../createComponent'
import type { StackProps, StackPropsBase } from '../types'

export const View = createComponent<
  StackProps,
  React.Component<StackProps>,
  StackPropsBase
>({
  acceptsClassName: true,
})
