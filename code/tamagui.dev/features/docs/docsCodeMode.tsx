import { startTransition, useEffect, useState } from 'react'
import { isClient } from 'tamagui'
import { clientCodeMode, type CodeMode } from './syntaxCookie'

export type { CodeMode }

// in-memory reflection of the active docs code mode for client components.
// the sticky source of truth is the `tamaguiSyntax` cookie written by the
// header toggle (see syntaxCookie.ts); this store is initialized from it and
// from any explicit ?syntax= param.
let codeMode: CodeMode = 'styled'

if (isClient) {
  codeMode = clientCodeMode(typeof location !== 'undefined' ? location.search : '')
}

const listeners = new Set<Function>()

export const setCodeMode = (next: CodeMode) => {
  codeMode = next
  listeners.forEach((cb) => cb(next))
}

export const getCodeMode = () => codeMode

export const useCodeMode = (): CodeMode => {
  const [mode, setMode] = useState(codeMode)

  useEffect(() => {
    const fn = (next: CodeMode) => {
      startTransition(() => {
        setMode(next)
      })
    }
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  }, [])

  return mode
}
