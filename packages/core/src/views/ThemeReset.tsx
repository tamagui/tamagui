import { isClient } from '@tamagui/constants'
import { useContext, useLayoutEffect, useState } from 'react'

import { ThemeManagerContext } from '../helpers/ThemeManager'
import { Theme } from './Theme'

// resets the theme to the parent theme
export const ThemeReset = (props: { children?: any }) => {
  const manager = useContext(ThemeManagerContext)
  const [name, setName] = useState<string | null>(null)

  // this component doesn't work with SSR, so must run only client side
  // we could at least prevent more flickering by having the ssr head script
  // that changes to dark initially also go through and change all of these
  if (isClient) {
    useLayoutEffect(() => {
      if (!manager) return
      if (name !== manager.parentName) {
        setName(manager.parentName)
      }
    }, [name, manager, manager?.parentName])

    useLayoutEffect(() => {
      if (!manager) return
      return manager.onChangeTheme(() => {
        setName(manager.parentName)
      })
    }, [manager])
  }

  if (!manager || !props.children) {
    return props.children || null
  }

  return (
    <Theme className="t_themereset" reset name={name}>
      {props.children}
    </Theme>
  )
}
