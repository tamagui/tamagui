import React, { useContext, useState } from 'react'

import { isWeb, useIsomorphicLayoutEffect } from '../constants/platform'
import { getThemeParentClassName } from '../createTamagui'
import { useConstant } from '../hooks/useConstant'
import { ThemeName } from '../types'
import { ThemeContext } from './ThemeContext'
import { ThemeManager, ThemeManagerContext } from './ThemeManagerContext'

export type ThemeProps = {
  disableThemeClass?: boolean
  name: Exclude<ThemeName, number> | null
  children?: any
}

export const Theme = (props: ThemeProps) => {
  const parent = useContext(ThemeManagerContext)
  const themes = useContext(ThemeContext)
  const [parentName, setParentName] = useState(parent.name || 'light')
  if (!themes) {
    console.warn('Error, no themes in context', props)
    return props.children
  }

  const nextNameParent = `${props.name}-${parentName}`
  const nextNameParentParent = `${props.name}-${parent.parentName}`
  const name = !props.name
    ? null
    : props.name in themes
    ? props.name
    : nextNameParent in themes
    ? nextNameParent
    : nextNameParentParent in themes
    ? nextNameParentParent
    : null
  const theme = name ? themes[name] : null
  const themeManager = useConstant<ThemeManager | null>(() => {
    if (!theme) {
      return null
    }
    const manager = new ThemeManager()
    if (name) {
      manager.setActiveTheme({ name, theme: themes[name], parentName })
    }
    return manager
  })

  useIsomorphicLayoutEffect(() => {
    if (!themeManager) {
      return
    }
    if (name) {
      themeManager.setActiveTheme({ name, theme, parentName })
    }
    return parent.onChangeTheme((next) => {
      if (next) {
        themeManager.setActiveTheme({ name: next, theme: themes[next], parentName })
        setParentName(next)
      }
    })
  }, [themes, name, parentName])

  if (!name || !theme) {
    return props.children
  }

  const contents = themeManager ? (
    <ThemeManagerContext.Provider value={themeManager}>
      {props.children}
    </ThemeManagerContext.Provider>
  ) : (
    props.children
  )

  if (isWeb) {
    if (props.disableThemeClass) {
      return contents
    }
    if (name) {
      const color = themes[name]?.['color']?.['variable']
      return (
        <div
          className={getThemeParentClassName(name)}
          // in order to provide currentColor, set color by default
          style={{ display: 'contents', color }}
        >
          {contents}
        </div>
      )
    }
  }

  return contents
}
