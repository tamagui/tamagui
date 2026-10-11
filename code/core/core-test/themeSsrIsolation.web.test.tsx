import React, { act, useEffect, useRef } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { describe, expect, test, vi } from 'vitest'

vi.mock('../web/src/config', () => ({
  getConfig: () => ({
    themes: {
      light: { color: 'black' },
      light_blue: { color: 'blue' },
      light_yellow: { color: 'yellow' },
    },
  }),
}))

import { ThemeStateContext, useThemeState } from '../web/src/hooks/useThemeState'

function Scope({
  name,
  root = false,
  children,
}: {
  name: string
  root?: boolean
  children: React.ReactNode
}) {
  const keys = useRef(null)
  const state = useThemeState({ name }, root, keys, undefined, true)
  return (
    <ThemeStateContext.Provider value={state.id}>{children}</ThemeStateContext.Provider>
  )
}

function ReadTheme({ name, onMount }: { name?: string; onMount?: () => void }) {
  const keys = useRef(null)
  const state = useThemeState(name ? { name } : {}, false, keys)
  useEffect(() => onMount?.(), [])
  return <output>{JSON.stringify({ name: state.name, isNew: state.isNew })}</output>
}

function Page({ prime = false, onMount }: { prime?: boolean; onMount?: () => void }) {
  return (
    <Scope root name="light">
      <Scope name={prime ? 'blue' : 'yellow'}>
        <ReadTheme name={prime ? 'yellow' : undefined} onMount={onMount} />
      </Scope>
    </Scope>
  )
}

describe('theme snapshots across server renders', () => {
  test('a new tree inherits its current provider after another tree introduced a theme at the same position', () => {
    const fresh = renderToString(<Page />)
    expect(fresh).toContain('&quot;isNew&quot;:false')
    const prime = renderToString(<Page prime />)
    expect(prime).toContain('&quot;isNew&quot;:true')
    expect(prime).not.toBe(fresh)

    for (let i = 0; i < 3; i++) {
      expect(renderToString(<Page />)).toBe(fresh)
      renderToString(<Page prime />)
    }
    expect(renderToString(<Page />, { identifierPrefix: 'independent-' })).toBe(fresh)
  })

  test('the warmed server output hydrates as a fresh client tree without replacing its host', async () => {
    renderToString(<Page prime />)
    const container = document.createElement('div')
    container.innerHTML = renderToString(<Page />)
    document.body.append(container)
    const host = container.querySelector('output')
    const errors: unknown[] = []
    const onMount = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined

    try {
      await act(async () => {
        // a separate prefix models the browser's fresh registry in this process.
        root = hydrateRoot(container, <Page onMount={onMount} />, {
          identifierPrefix: 'browser-',
          onRecoverableError: (error) => errors.push(error),
        })
      })
      expect(onMount).toHaveBeenCalledOnce()
      expect(errors).toEqual([])
      expect(container.querySelector('output')).toBe(host)
      expect(container.textContent).toBe('{"name":"light_yellow","isNew":false}')
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
  })
})
