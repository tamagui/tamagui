import * as React from 'react'

let didHydrateOnce = false

export function useDidHydrateOnceRoot() {
  if (process.env.TAMAGUI_TARGET !== 'web') {
    return true
  }

  if (!process.env.TAMAGUI_DISABLE_HYDRATION_OPTIMIZATION) {
    React.useEffect(() => {
      const tm = setInterval(() => {
        if (Date.now() - last > 150) {
          didHydrateOnce = true
          clearInterval(tm)
        }
      }, 16)
      return () => {
        clearInterval(tm)
      }
    }, [])
  }
}

let last = Date.now()

export function useDidHydrateOnce() {
  if (process.env.TAMAGUI_TARGET !== 'web') {
    return true
  }
  if (!process.env.TAMAGUI_DISABLE_HYDRATION_OPTIMIZATION) {
    if (!didHydrateOnce) {
      last = Date.now()
    }
    return didHydrateOnce
  }
  return false
}
