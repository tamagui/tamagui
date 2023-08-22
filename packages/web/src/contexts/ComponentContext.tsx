import { createStyledContext } from '../helpers/createStyledContext'
import { ComponentContextI } from '../types'

export const ComponentContext = createStyledContext<ComponentContextI>({
  inText: false,
  language: null,
  animationDriver: null,
})
