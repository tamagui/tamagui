import { useContext } from 'react'
import { createStyledContext } from '../helpers/createStyledContext'
import type { ComponentContextI } from '../types'

const componentContextKeys = [
  'disableSSR',
  'inText',
  ...(process.env.TAMAGUI_TARGET === 'native'
    ? (['parentFontSize', 'parentLineHeight', 'animatedText'] as const)
    : []),
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
    ...(process.env.TAMAGUI_TARGET === 'native' && {
      parentFontSize: undefined,
      parentLineHeight: undefined,
      animatedText: null,
    }),
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
