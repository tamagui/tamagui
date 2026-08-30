import { useContext } from 'react'
import { createStyledContext } from '../helpers/createStyledContext'
import type { ComponentContextI } from '../types'

const componentContextKeys = [
  'disableSSR',
  'inText',
  'language',
  'animationDriver',
  'setParentFocusState',
  'insets',
] as const

export const ComponentContext = createStyledContext<
  ComponentContextI,
  (typeof componentContextKeys)[number]
>(
  {
    disableSSR: undefined,
    inText: false,
    language: null,
    animationDriver: null,
    setParentFocusState: null,
    insets: null,
  },
  {
    keys: componentContextKeys,
  }
)

export const useConfiguration = () => {
  return useContext(ComponentContext)
}
