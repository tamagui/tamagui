import { stackDefaultStyles } from '../constants/constants.js'
import { createComponent } from '../createComponent.js'
import type { StackProps, StackPropsBase } from '../types.js'

export const Stack = createComponent<
  StackProps,
  React.Component<StackProps>,
  StackPropsBase
>({
  acceptsClassName: true,
  defaultProps: {
    ...stackDefaultStyles,
    flexDirection: 'column',
  },
})

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
