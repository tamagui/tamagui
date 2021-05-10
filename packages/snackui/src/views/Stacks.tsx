import { createComponent } from '../createComponent'

export const HStack = createComponent({
  defaultProps: {
    boxSizing: 'border-box',
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'row',
  },
})

export const VStack = createComponent({
  defaultProps: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    flexBasis: 'auto',
  },
})

export const AbsoluteVStack = createComponent({
  defaultProps: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    flexBasis: 'auto',
    position: 'absolute',
  },
})

export const AbsoluteHStack = createComponent({
  defaultProps: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    flexBasis: 'auto',
    position: 'absolute',
  },
})
