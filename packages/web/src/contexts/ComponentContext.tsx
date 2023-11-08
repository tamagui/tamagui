import { createStyledContext } from '../helpers/createStyledContext'
import { ComponentContextI, GroupStateListener } from '../types'

const listeners = new Set<GroupStateListener>()

export const ComponentContext = createStyledContext<ComponentContextI>({
  disableSSR: undefined,
  inText: false,
  language: null,
  animationDriver: null,
  groups: {
    emit: (name, state) => {
      listeners.forEach((l) => l(name, state))
    },
    subscribe(cb) {
      listeners.add(cb)
      return () => {
        listeners.delete(cb)
      }
    },
    state: {},
  },
})
