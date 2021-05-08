import { createComponent } from '../createComponent'

export { StackProps } from '../StackProps'

export const HStack = createComponent({
  defaultProps: {
    display: 'flex',
    flexDirection: 'row',
    flexBasis: 'auto',
  },
})

export const VStack = createComponent({
  defaultProps: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: 'auto',
  },
})

export const AbsoluteVStack = createComponent({
  defaultProps: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: 'auto',
    position: 'absolute',
  },
})

export const AbsoluteHStack = createComponent({
  defaultProps: {
    display: 'flex',
    flexDirection: 'row',
    flexBasis: 'auto',
    position: 'absolute',
  },
})
