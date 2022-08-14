import React from 'react'
import { Theme } from 'tamagui'

import { useTint } from './header/ColorToggleButton.client'

export const TintTheme = (props: { children: React.ReactNode }) => {
  const { tint } = useTint()
  return <Theme name={tint}>{props.children}</Theme>
}
