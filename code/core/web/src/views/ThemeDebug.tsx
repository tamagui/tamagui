import React from 'react'
import { useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import { useForceUpdate } from '@tamagui/use-force-update'
import { createPortal } from 'react-dom'

import type { ChangedThemeResponse } from '../hooks/useTheme'
import type { ThemeProps } from '../types'

let node

export function ThemeDebug({
  themeState,
  themeProps,
  children,
}: { themeState: ChangedThemeResponse; themeProps: ThemeProps; children: any }) {
  if (process.env.NODE_ENV === 'development') {
    const isHydrated = useDidFinishSSR()
    const [onChangeCount, setOnChangeCount] = React.useState(0)
    const rerender = useForceUpdate()
    const id = React.useId()

    if (process.env.NODE_ENV === 'development' && typeof document !== 'undefined') {
      if (!node) {
        node = document.createElement('div')
        node.style.height = '200px'
        node.style.overflowY = 'scroll'
        node.style.position = 'fixed'
        node.style.zIndex = 10000000
        node.style.bottom = '30px'
        node.style.left = '30px'
        node.style.right = '30px'
        node.style.display = 'flex'
        node.style.border = '1px solid #888'
        node.style.flexDirection = 'row'
        node.style.background = 'var(--background)'
        document.body.appendChild(node)
      }
    }

    React.useEffect(() => {
      themeState.themeManager?.parentManager?.onChangeTheme((name, manager) => {
        setOnChangeCount((p) => ++p)
        console.warn(
          `theme changed for ${themeState.themeManager?.id} from parent ${themeState.themeManager?.parentManager?.id} to new name`,
          name
        )
      })
    }, [themeState.themeManager])

    React.useEffect(() => {
      // to refresh _listeningIds every so often
      const tm = setInterval(rerender, 1000)
      return () => clearTimeout(tm as any)
    }, [])

    if (themeProps['disable-child-theme'] || !isHydrated) {
      return children
    }

    return (
      <>
        {createPortal(
          <code
            style={{
              whiteSpace: 'pre',
              maxWidth: 250,
              overflow: 'auto',
              padding: 5,
            }}
          >
            &lt;Theme {id} /&gt;&nbsp;
            {JSON.stringify(
              {
                propsName: themeProps.name,
                name: themeState?.state?.name,
                className: themeState?.state?.className,
                inverse: themeProps.inverse,
                forceClassName: themeProps.forceClassName,
                parent: themeState.themeManager?.state.parentName,
                id: themeState.themeManager?.id,
                parentId: themeState.themeManager?.parentManager?.id,
                isNew: themeState.isNewTheme,
                onChangeCount,
                listening: [...(themeState.themeManager?.['_listeningIds'] || [])].join(
                  ','
                ),
                _numChangeEventsSent: themeState.themeManager?.['_numChangeEventsSent'],
              },
              null,
              2
            )}
          </code>,
          node
        )}

        <div style={{ color: 'red' }}>{id}</div>

        {children}
      </>
    )
  }
  return children
}

ThemeDebug['displayName'] = 'ThemeDebug'
