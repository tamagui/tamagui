import { isWeb } from '@tamagui/constants'
import { memo, useMemo } from 'react'

import { variableToString } from '../createVariable'
import { ThemeManager, ThemeManagerContext } from '../helpers/ThemeManager'
import { useChangeThemeEffect } from '../hooks/useTheme'
import { ThemeProps } from '../types'

export function wrapThemeManagerContext(
  children: any,
  themeManager?: ThemeManager | null,
  shouldReset?: boolean
) {
  // be sure to memoize themeManager to avoid reparenting
  if (!themeManager) {
    return children
  }
  // be sure to memoize shouldReset to avoid reparenting
  let next = children
  // reset to parent theme
  if (shouldReset && themeManager) {
    next = <Theme name={themeManager.parentName}>{next}</Theme>
  }
  return <ThemeManagerContext.Provider value={themeManager}>{next}</ThemeManagerContext.Provider>
}

export const Theme = memo(function Theme(props: ThemeProps) {
  const { name, theme, themeManager, themes, className, didChange } = useChangeThemeEffect(props)
  const missingTheme = !themes || !name || !theme

  // memo here, changing theme without re-rendering all children is a critical optimization
  // may require some effort of end user to memoize but without this memo they'd have no option
  let contents = useMemo(() => {
    return missingTheme ? null : wrapThemeManagerContext(props.children, themeManager)
  }, [missingTheme, props.children, themeManager])

  if (missingTheme) {
    if (process.env.NODE_ENV === 'development') {
      if (name && !theme) {
        // eslint-disable-next-line no-console
        console.warn(`No theme found by name ${name}`)
      }
    }
    return props.children
  }

  if (isWeb) {
    const classNameFinal =
      props.disableThemeClass || !didChange
        ? '_dsp_contents'
        : [props.className, className, '_dsp_contents'].filter(Boolean).join(' ')

    contents = (
      <span
        className={classNameFinal}
        style={{
          // in order to provide currentColor, set color by default
          color: variableToString(theme?.color),
        }}
      >
        {contents}
      </span>
    )
  }

  return contents
})
