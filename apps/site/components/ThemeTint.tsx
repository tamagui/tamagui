import React from 'react'
import { memo, useMemo } from 'react'
import { Theme } from 'tamagui'

import { useTint } from '../components/useTint'

export const ThemeTint = memo((props: { children?: React.ReactNode }) => {
  const { tint } = useTint()

  const children = useMemo(() => props.children, [props.children])

  return <Theme name={tint}>{children}</Theme>
})
