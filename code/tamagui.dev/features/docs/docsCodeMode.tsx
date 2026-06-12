import { startTransition, useEffect, useState } from 'react'
import { isClient } from 'tamagui'
import { isTailwindLocation, isTailwindPath } from './isTailwindMode'

export type CodeMode = 'tamagui' | 'tailwind'

const STORAGE_KEY = 'tamagui-code-mode'

function getBrowserCodeMode(): CodeMode {
  if (!isClient) return 'tamagui'

  if (isTailwindLocation(window.location) || isTailwindPath(window.location.pathname)) {
    return 'tailwind'
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'tailwind') return 'tailwind'
  } catch {}

  return 'tamagui'
}

let codeMode: CodeMode = getBrowserCodeMode()

const listeners = new Set<(next: CodeMode) => void>()

export const setCodeMode = (next: CodeMode) => {
  codeMode = next
  listeners.forEach((cb) => cb(next))
  if (isClient) {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }
}

export const getCodeMode = () => codeMode

export const useCodeMode = (): CodeMode => {
  const [mode, setMode] = useState(codeMode)

  useEffect(() => {
    setMode(getBrowserCodeMode())

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
