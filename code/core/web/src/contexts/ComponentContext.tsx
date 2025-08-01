import { createStyledContext } from '../helpers/createStyledContext'
import type { ComponentContextI } from '../types'

export const ComponentContext = createStyledContext<ComponentContextI>({
  disableSSR: undefined,
  inText: false,
  language: null,
  animationDriver: null,
  setParentFocusState: null,
})
