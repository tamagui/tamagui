import { startTransition as reactStartTransition } from 'react'

const startTransition = (callback) => {
  if (process.env.TAMAGUI_TARGET !== 'web') {
    // Pass-through function
    callback()
  } else {
    // Proxy to react.startTransition
    reactStartTransition(callback)
  }
}

export { startTransition }
