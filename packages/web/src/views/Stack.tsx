import { validStyles } from '@tamagui/helpers'

import { stackDefaultStyles } from '../constants/constants'
import { createComponent } from '../createComponent'
import type {
  StackNonStyleProps,
  StackProps,
  StackStyleBase,
  TamaguiElement,
} from '../types'

export type Stack = TamaguiElement

export const Stack = createComponent<
  StackProps,
  Stack,
  StackNonStyleProps,
  StackStyleBase
>({
  acceptsClassName: true,
  defaultProps: stackDefaultStyles,
  validStyles,
})

Stack['displayName'] = 'Stack'

// test types
// export const YStack = styled(Stack, {
//   flexDirection: 'column',
// })
// // test types
// const x00 = <Stack missing={0} /> // should err
// const x0 = <YStack missing={0} /> // should err
// const x1 = (props: StackProps) => <YStack {...props} />
// type ys = typeof YStack
// type ysv = ys extends StaticComponent<any, infer V> ? V : unknown
