import { createStyledContext } from '../helpers/createStyledContext'
import type { ComponentContextI, GroupStateListener } from '../types'

export const ComponentContext = createStyledContext<ComponentContextI>({
  disableSSR: undefined,
  inText: false,
  language: null,
  animationDriver: null,
  setParentFocusState: null,
  groups: {
    emit: null as unknown as GroupStateListener,
    subscribe: null as unknown as (cb: GroupStateListener) => () => void,
    state: {},
  },
})
