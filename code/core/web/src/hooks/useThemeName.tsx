import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import React from 'react'
import { ThemeContext } from '../helpers/ThemeContext'
import type { ThemeName } from '../types'

export function useThemeName(opts?: { parent?: true }): ThemeName {
  const manager = React.useContext(ThemeContext)!
  const [name, setName] = React.useState(manager?.state.name || '')

  useIsomorphicLayoutEffect(() => {
    if (!manager) return
    setName(manager.state.name)
    return manager.onChangeTheme((next, manager) => {
      const name = opts?.parent ? manager.state.parentName || next : next
      if (!name) return

      setName(name)
    })
  }, [manager?.state.name])

  return name
}
