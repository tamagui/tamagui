import { useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ThemeState } from '../hooks/useThemeState'
import type { ThemeProps } from '../types'

let node

export function ThemeDebug({
  themeState,
  themeProps,
  children,
}: { themeState: ThemeState; themeProps: ThemeProps; children: any }) {
  if (process.env.NODE_ENV === 'development') {
    const isHydrated = useDidFinishSSR()

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
      }
    }

    useEffect(() => {
      document.body.appendChild(node)
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
            &lt;Theme {themeState.id} /&gt;&nbsp;
            {JSON.stringify(
              {
                name: themeState.name,
                parentId: themeState.parentId,
                inverses: themeState.inverses,
                isNew: themeState.isNew,
                themeProps: {
                  name: themeProps.name,
                  componentName: themeProps.componentName,
                  reset: themeProps.reset,
                  inverse: themeProps.inverse,
                },
              },
              null,
              2
            )}
          </code>,
          node
        )}

        <div style={{ color: 'red' }}>{themeState.id}</div>

        {children}
      </>
    )
  }
  return children
}

ThemeDebug['displayName'] = 'ThemeDebug'
