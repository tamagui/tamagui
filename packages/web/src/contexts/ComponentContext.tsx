import { createStyledContext } from '../helpers/createStyledContext'
import { ComponentContextI, DisposeFn } from '../types'

export const ComponentContext = createStyledContext<ComponentContextI>({
  disableSSR: undefined,
  inText: false,
  language: null,
  animationDriver: null,
  groups: {
    emit: () => {},
    subscribe: (cb) => {
      return {} as DisposeFn
    },
    state: {},
  },
})
