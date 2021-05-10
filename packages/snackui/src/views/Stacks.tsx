import { createComponent } from '../createComponent'
import { isWeb } from '../platform'

const defaults = {
  ...(isWeb && {
    alignItems: 'stretch',
    flexShrink: 0,
    display: 'flex',
    flexBasis: 'auto',
    boxSizing: 'border-box',
  }),
}

export const HStack = createComponent({
  defaultProps: {
    ...defaults,
    flexDirection: 'row',
  },
})

export const VStack = createComponent({
  defaultProps: {
    ...defaults,
    flexDirection: 'column',
  },
})

export const AbsoluteVStack = createComponent({
  defaultProps: {
    ...defaults,
    flexDirection: 'column',
    position: 'absolute',
  },
})

export const AbsoluteHStack = createComponent({
  defaultProps: {
    ...defaults,
    flexDirection: 'row',
    position: 'absolute',
  },
})
