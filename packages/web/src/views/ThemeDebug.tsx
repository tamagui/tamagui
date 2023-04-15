import { useForceUpdate } from '@tamagui/use-force-update'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { ChangedThemeResponse } from '../hooks/useTheme.js'
import { ThemeProps } from '../types.js'

let node

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
    const id = useId()

    if (process.env.NODE_ENV === 'development' && typeof document !== 'undefined') {
      if (!node) {
        node = document.createElement('div')
        node.style.width = '100%'
        node.style.height = '200px'
        node.style.overflowY = 'scroll'
        node.style.position = 'fixed'
        node.style.top = '0px'
        node.style.left = '0px'
        node.style.display = 'flex'
        node.style.flexDirection = 'row'
        node.style.background = 'var(--background)'
        document.body.appendChild(node)
      }
    }

    useEffect(() => {
      themeState.themeManager?.parentManager?.onChangeTheme((name, manager) => {
        setOnChangeCount((p) => ++p)
        console.warn(`theme changed`, name)
      })
    }, [themeState.themeManager])

    useEffect(() => {
      // to refresh _listeningIds every so often
      const tm = setInterval(rerender, 100)
      return () => clearTimeout(tm)
    }, [])

    return (
      <>
        {createPortal(
          <code
            style={{
              whiteSpace: 'pre',
            }}
          >
            &lt;Theme {id} /&gt;&nbsp;
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

        <div>{id}</div>

        {children}
      </>
    )
  }
  return children
}
