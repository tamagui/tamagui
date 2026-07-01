import { startTransition, useEffect, useState } from 'react'
import { isClient } from 'tamagui'

export type CodeMode = 'tamagui' | 'tailwind'

const STORAGE_KEY = 'tamagui-code-mode'

let codeMode: CodeMode = 'tamagui'

// restore from localStorage
if (isClient) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'tailwind') codeMode = 'tailwind'
  } catch {}
}

const listeners = new Set<Function>()

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
