import { isRSC, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useContext, useState } from 'react'

import { getConfig } from '../config.js'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext.js'
import { ThemeName } from '../types.js'

export function useThemeName(opts?: { parent?: true }): ThemeName {
  if (isRSC) {
    const config = getConfig()
    return config.themes[Object.keys(config.themes)[0]] as any
  }
  const manager = useContext(ThemeManagerContext)
  const [name, setName] = useState(manager?.state.name || '')

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
