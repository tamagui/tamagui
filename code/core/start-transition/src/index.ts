import { startTransition as reactStartTransition } from 'react'

export const startTransition = (callback: React.TransitionFunction) => {
  if (process.env.TAMAGUI_TARGET !== 'web') {
    // Pass-through function
    callback()
  } else {
    // Proxy to react.startTransition
    reactStartTransition(callback)
  }
}
