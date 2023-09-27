import { useForceUpdate } from '@tamagui/use-force-update'
import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'

import { ChangedThemeResponse } from '../hooks/useTheme'
import { ThemeProps } from '../types'

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
  // disabled
  if (themeProps['disable-child-theme']) {
    return children
  }

  if (process.env.NODE_ENV === 'development') {
    const [onChangeCount, setOnChangeCount] = useState(0)
    const rerender = useForceUpdate()
    const id = useId()

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

    useEffect(() => {
      themeState.themeManager?.parentManager?.onChangeTheme((name, manager) => {
        setOnChangeCount((p) => ++p)
        console.warn(
          `theme changed for ${themeState.themeManager?.id} from parent ${themeState.themeManager?.parentManager?.id} to new name`,
          name
        )
      })
    }, [themeState.themeManager])

    useEffect(() => {
      // to refresh _listeningIds every so often
      const tm = setInterval(rerender, 1000)
      return () => clearTimeout(tm as any)
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
