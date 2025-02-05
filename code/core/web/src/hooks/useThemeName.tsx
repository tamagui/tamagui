import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import React from 'react'
import type { ThemeName } from '../types'
import { getThemeState, ThemeStateContext } from './useThemeState'

export function useThemeName(opts?: { parent?: true }): ThemeName {
  const themeState = React.useContext(ThemeStateContext)!

  // const [name, setName] = React.useState(manager?.state.name || '')

  // useIsomorphicLayoutEffect(() => {
  //   if (!manager) return
  //   setName(manager.state.name)
  //   return manager.onChangeTheme((next, manager) => {
  //     const name = opts?.parent ? manager.state.parentName || next : next
  //     if (!name) return

  //     setName(name)
  //   })
  // }, [manager?.state.name])

  // TODO

  return getThemeState(themeState)?.name || ''
}
