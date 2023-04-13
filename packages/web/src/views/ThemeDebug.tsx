import { useForceUpdate } from '@tamagui/use-force-update'
import { useEffect, useState } from 'react'

import { ChangedThemeResponse } from '../hooks/useTheme.js'
import { ThemeProps } from '../types.js'

export function ThemeDebug({
  themeState,
  themeProps,
  children,
}: {
  themeState: ChangedThemeResponse
  themeProps: ThemeProps
  children: any
}) {
  if (process.env.NODE_ENV === 'development') {
    const [onChangeCount, setOnChangeCount] = useState(0)
    const rerender = useForceUpdate()

    useEffect(() => {
      themeState.themeManager?.onChangeTheme((name, manager) => {
        setOnChangeCount((p) => ++p)
        console.warn(`theme changed`, name)
      })
    }, [themeState.themeManager])

    useEffect(() => {
      // to refresh _listeningIds every so often
      const tm = setInterval(() => {
        rerender()
      }, 100)
      return () => {
        clearTimeout(tm)
      }
    }, [])

    return (
      <div
        style={{
          whiteSpace: 'pre',
          background: 'var(--background)',
          display: 'inline-block',
          border: '1px solid #ccc',
          margin: 20,
          color: 'red',
        }}
      >
        <code>
          &lt;Theme /&gt;&nbsp;
          {JSON.stringify(
            {
              name: themeState.name,
              className: themeState.className,
              inverse: themeProps.inverse,
              forceClassName: themeProps.forceClassName,
              parent: themeState.themeManager?.state.parentName,
              id: themeState.themeManager?.id,
              parentId: themeState.themeManager?.parentManager?.id,
              isNew: themeState.isNewTheme,
              onChangeCount,
              listening: [...(themeState.themeManager?._listeningIds || [])].join(','),
            },
            null,
            2
          )}
        </code>
        {children}
      </div>
    )
  }
  return children
}
