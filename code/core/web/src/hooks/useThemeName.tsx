import * as React from 'react'
import { useIsomorphicLayoutEffect } from '@tamagui/constants'

import { ThemeManagerIDContext } from '../helpers/ThemeManagerContext'
import type { ThemeName } from '../types'
import { getThemeManager } from './useTheme'

export function useThemeName(opts?: { parent?: true }): ThemeName {
  const manager = getThemeManager(React.useContext(ThemeManagerIDContext)!)
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
