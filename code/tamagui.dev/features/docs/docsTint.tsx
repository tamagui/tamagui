import { startTransition, useEffect, useState } from 'react'

let isTinted = true

export const setDocsShouldTint = (next: boolean) => {
  isTinted = next
  listeners.forEach((cb) => cb(next))
}

export const toggleDocsTinted = () => {
  startTransition(() => {
    setDocsShouldTint(!isTinted)
  })
}

const listeners = new Set<Function>()

export const useIsDocsTinted = () => {
  const [isTinted, setIsTinted] = useState(true)

  useEffect(() => {
    const fn = () => {
      setIsTinted((x) => !x)
    }
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  }, [])

  return isTinted
}
